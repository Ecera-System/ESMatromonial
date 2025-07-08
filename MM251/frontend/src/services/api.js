const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async createProfile(profileData, photos) {
    const formData = new FormData();
    
    // Add profile data
    Object.keys(profileData).forEach(key => {
      if (key !== 'photos' && profileData[key] !== '') {
        formData.append(key, profileData[key]);
      }
    });
    
    // Add photos
    if (photos && photos.length > 0) {
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
    }

    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create profile');
    }

    return response.json();
  }

  async getProfiles(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/profiles?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }

    return response.json();
  }

  async getProfile(id) {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async updateProfile(id, profileData, photos) {
    const formData = new FormData();
    
    // Add profile data
    Object.keys(profileData).forEach(key => {
      if (key !== 'photos' && profileData[key] !== '') {
        formData.append(key, profileData[key]);
      }
    });
    
    // Add new photos if any
    if (photos && photos.length > 0) {
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
    }

    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  }

  async deleteProfile(id) {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }

    return response.json();
  }

  async searchProfiles(searchCriteria) {
    const response = await fetch(`${API_BASE_URL}/profiles/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchCriteria),
    });

    if (!response.ok) {
      throw new Error('Failed to search profiles');
    }

    return response.json();
  }
}

export default new ApiService();