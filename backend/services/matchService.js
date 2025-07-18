import User from "../models/User.js";
import logger from "../utils/logger.js";

export const getDailyRecommendations = async (userId, limit = 7) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // 1. Build base query
  const query = buildBaseQuery(user);

  // 2. Find candidates
  let candidates = await findCandidates(query, user);

  // 3. Score and sort candidates
  candidates = scoreAndSortCandidates(candidates, user);

  return candidates.slice(0, limit);
};

// Query Builder
const buildBaseQuery = (user) => {
  const query = {
    _id: { $ne: user._id },
    accountStatus: "active",
    isVerified: true,
  };

  // Gender preference
  if (user.partnerGender && user.partnerGender !== "Any Gender") {
    query.gender = user.partnerGender;
  } else {
    // Default to opposite gender if no specific preference or 'Any Gender'
    query.gender = user.gender === "Male" ? "Female" : "Male";
  }

  // Age range filter
  if (user.partnerAgeMin && user.partnerAgeMax) {
    const minAge = parseInt(user.partnerAgeMin);
    const maxAge = parseInt(user.partnerAgeMax);

    query.dateOfBirth = {
      $gte: new Date(new Date().setFullYear(new Date().getFullYear() - maxAge)),
      $lte: new Date(new Date().setFullYear(new Date().getFullYear() - minAge)),
    };
  }

  // Location filters
  if (user.partnerCountry && user.partnerCountry !== "Any Country") {
    query.country = user.partnerCountry;
  }
  if (user.partnerLocation && user.partnerLocation !== "Any State") {
    query.state = user.partnerLocation;
  }

  // Religion and Caste filters (only apply if not "Any")
  if (user.partnerReligion && user.partnerReligion !== "Any Religion") {
    query.religion = user.partnerReligion;
  }
  if (user.partnerCaste && user.partnerCaste.toLowerCase() !== "any") {
    query.caste = user.partnerCaste;
  }

  if (user.skippedUsers && user.skippedUsers.length > 0) {
    query._id = { $nin: [...user.skippedUsers, user._id] }; // Exclude skipped and self
  } else {
    query._id = { $ne: user._id }; // Exclude self
  }

  return query;
};

// Candidate Finder with Fallback
const findCandidates = async (query, user) => {
  let candidates = await User.find(query);

  // Helper to create a base query for fallbacks, always excluding self and skipped users
  const getBaseFallbackQuery = () => {
    const baseQuery = {
      accountStatus: "active",
      isVerified: true,
    };
    if (user.skippedUsers && user.skippedUsers.length > 0) {
      baseQuery._id = { $nin: [...user.skippedUsers, user._id] };
    } else {
      baseQuery._id = { $ne: user._id };
    }
    return baseQuery;
  };

  // First fallback: Relax religion/caste filters if no matches
  if (candidates.length === 0) {
    logger.info("No strict matches found, relaxing religion/caste filters");
    const relaxedQuery = { ...query };
    if (relaxedQuery.religion) delete relaxedQuery.religion;
    if (relaxedQuery.caste) delete relaxedQuery.caste;
    candidates = await User.find(relaxedQuery);
  }

  // Second fallback: Relax location filters if no matches
  if (candidates.length === 0) {
    logger.info(
      "No relaxed religion/caste matches found, relaxing location filters"
    );
    const relaxedQuery = { ...query };
    if (relaxedQuery.country) delete relaxedQuery.country;
    if (relaxedQuery.state) delete relaxedQuery.state;
    // Ensure religion/caste are still relaxed if they were before
    if (relaxedQuery.religion) delete relaxedQuery.religion;
    if (relaxedQuery.caste) delete relaxedQuery.caste;
    candidates = await User.find(relaxedQuery);
  }

  // Third fallback: Only essential filters, but still exclude skipped users and maintain gender
  if (candidates.length === 0) {
    logger.info("No relaxed matches found, using minimal filters");
    const minimalQuery = getBaseFallbackQuery();
    minimalQuery.gender = query.gender; // Explicitly re-add gender filter
    candidates = await User.find(minimalQuery);
  }

  // Fourth fallback: If still no candidates, consider all active, verified users (excluding self)
  // This will re-introduce previously skipped users if no new ones are available.
  if (candidates.length === 0) {
    logger.info("Still no matches, re-introducing previously skipped users as a last resort.");
    candidates = await User.find({
      _id: { $ne: user._id },
      accountStatus: "active",
      isVerified: true,
      gender: query.gender, // Maintain gender filter
    });
  }

  return candidates;

  return candidates;
};

// Scoring Engine
const scoreAndSortCandidates = (candidates, user) => {
  candidates.forEach((candidate) => {
    let score = 0;

    // Core matching (higher weights)
    if (
      user.partnerReligion &&
      user.partnerReligion !== "Any Religion" &&
      candidate.religion === user.partnerReligion
    )
      score += 3;
    if (
      user.partnerCaste &&
      user.partnerCaste.toLowerCase() !== "any" &&
      candidate.caste === user.partnerCaste
    )
      score += 3;

    // Location matching
    if (
      user.partnerCountry &&
      user.partnerCountry !== "Any Country" &&
      candidate.country === user.partnerCountry
    )
      score += 2;
    if (
      user.partnerLocation &&
      user.partnerLocation !== "Any State" &&
      candidate.state === user.partnerLocation
    )
      score += 2;

    // Education/occupation/income matching
    if (
      user.partnerEducation &&
      user.partnerEducation !== "Any Education" &&
      candidate.education === user.partnerEducation
    )
      score += 2;
    if (
      user.partnerOccupation &&
      user.partnerOccupation !== "Any Occupation" &&
      candidate.occupation === user.partnerOccupation
    )
      score += 2;
    if (
      user.partnerIncome &&
      user.partnerIncome !== "Any Income Range" &&
      candidate.annualIncome === user.partnerIncome
    )
      score += 2;

    // Sophisticated Age Scoring
    if (user.partnerAgeMin && user.partnerAgeMax && candidate.dateOfBirth) {
      const userMinAge = parseInt(user.partnerAgeMin);
      const userMaxAge = parseInt(user.partnerAgeMax);
      const candidateAge =
        new Date().getFullYear() -
        new Date(candidate.dateOfBirth).getFullYear();

      if (candidateAge >= userMinAge && candidateAge <= userMaxAge) {
        score += 2; // Full points for being within preferred range
      } else if (
        candidateAge >= userMinAge - 5 &&
        candidateAge <= userMaxAge + 5
      ) {
        score += 1; // Partial points for being slightly outside
      }
    }

    // Sophisticated Height Scoring (assuming height is in a comparable format like cm or inches)
    // This part needs adjustment based on how height is stored (e.g., "5'10"" vs. "178cm")
    // For now, a simple check, but can be expanded.
    if (user.partnerHeightMin && user.partnerHeightMax && candidate.height) {
      // Assuming height is stored as "X'Y"" and can be parsed
      const parseHeight = (heightStr) => {
        const parts = heightStr.match(/(\d+)\'(\d+)\"/);
        if (parts) {
          const feet = parseInt(parts[1]);
          const inches = parseInt(parts[2]);
          return feet * 12 + inches; // Convert to total inches
        }
        return 0;
      };

      const userMinHeightInches = parseHeight(user.partnerHeightMin);
      const userMaxHeightInches = parseHeight(user.partnerHeightMax);
      const candidateHeightInches = parseHeight(candidate.height);

      if (
        candidateHeightInches >= userMinHeightInches &&
        candidateHeightInches <= userMaxHeightInches
      ) {
        score += 2; // Full points
      } else if (
        candidateHeightInches >= userMinHeightInches - 3 &&
        candidateHeightInches <= userMaxHeightInches + 3
      ) {
        score += 1; // Partial points (within 3 inches)
      }
    }

    // Mutual Matching (candidate's preferences align with user's profile)
    // This is a simplified example; a more robust implementation would involve checking all relevant partner preferences
    if (
      candidate.partnerReligion &&
      candidate.partnerReligion !== "Any Religion" &&
      user.religion === candidate.partnerReligion
    )
      score += 1;
    if (
      candidate.partnerCaste &&
      candidate.partnerCaste.toLowerCase() !== "any" &&
      user.caste === candidate.partnerCaste
    )
      score += 1;
    if (
      candidate.partnerCountry &&
      candidate.partnerCountry !== "Any Country" &&
      user.country === candidate.partnerCountry
    )
      score += 1;
    if (
      candidate.partnerLocation &&
      candidate.partnerLocation !== "Any State" &&
      user.state === candidate.partnerLocation
    )
      score += 1;
    if (
      candidate.partnerEducation &&
      candidate.partnerEducation !== "Any Education" &&
      user.education === candidate.partnerEducation
    )
      score += 1;
    if (
      candidate.partnerOccupation &&
      candidate.partnerOccupation !== "Any Occupation" &&
      user.occupation === candidate.partnerOccupation
    )
      score += 1;
    if (
      candidate.partnerMaritalStatus &&
      candidate.partnerMaritalStatus !== "Any Status" &&
      user.maritalStatus === candidate.partnerMaritalStatus
    )
      score += 1;

    // Interests and Hobbies
    const userHobbies = user.hobbies
      ? user.hobbies.split(",").map((s) => s.trim().toLowerCase())
      : [];
    const userInterests = user.interests
      ? user.interests.split(",").map((s) => s.trim().toLowerCase())
      : [];
    const candidateHobbies = candidate.hobbies
      ? candidate.hobbies.split(",").map((s) => s.trim().toLowerCase())
      : [];
    const candidateInterests = candidate.interests
      ? candidate.interests.split(",").map((s) => s.trim().toLowerCase())
      : [];

    const sharedHobbies = userHobbies.filter((hobby) =>
      candidateHobbies.includes(hobby)
    );
    const sharedInterests = userInterests.filter((interest) =>
      candidateInterests.includes(interest)
    );

    score += sharedHobbies.length * 0.5; // Award points for each shared hobby
    score += sharedInterests.length * 0.5; // Award points for each shared interest

    // Profile completeness
    if (candidate.photos?.length > 0) score += 1;
    if (candidate.aboutMe) score += 1;

    // Recent activity bonus
    if (candidate.lastActive) {
      const daysSinceActive =
        (Date.now() - new Date(candidate.lastActive)) / (1000 * 60 * 60 * 24);
      if (daysSinceActive < 7) score += 2;
      else if (daysSinceActive < 30) score += 1;
    }

    candidate.matchScore = score;
  });

  return candidates.sort(
    (a, b) =>
      b.matchScore - a.matchScore ||
      new Date(b.lastActive || 0) - new Date(a.lastActive || 0)
  );
};
