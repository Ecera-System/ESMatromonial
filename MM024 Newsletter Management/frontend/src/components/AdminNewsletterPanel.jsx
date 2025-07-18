import React, { useState, useEffect } from "react";

export default function AdminNewsletterPanel() {
  const [subscribers, setSubscribers] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setSubscribers([
      { email: "user1@example.com", subscribedAt: "2025-07-10T12:34:56Z" },
      { email: "user2@example.com", subscribedAt: "2025-07-12T15:21:43Z" }
    ]);
  }, []);

  const handleSend = async () => {
    if (!subject || !content) {
      setStatus({ type: "error", message: "Please fill in both fields." });
      return;
    }

    // Normally send via API
    setStatus({ type: "success", message: "Newsletter sent successfully!" });
    setSubject("");
    setContent("");
    setAttachments([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10 font-sans transition-all duration-300">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-bold text-blue-700 text-center mb-10">📬 Admin Newsletter Panel</h1>

        <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-blue-100">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Compose Newsletter</h2>

          <input
            type="text"
            placeholder="Subject"
            className="w-full mb-4 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <textarea
            placeholder="Newsletter content..."
            className="w-full mb-4 h-40 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <label className="block text-sm font-medium text-blue-800 mb-2">Attachments (images/documents)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setAttachments([...e.target.files])}
            className="mb-4 w-full px-4 py-2 border border-blue-200 rounded-lg"
          />

          {attachments.length > 0 && (
            <div className="mb-4 text-sm text-blue-600">
              <strong>Attached Files:</strong>
              <ul className="list-disc ml-5 mt-2">
                {attachments.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Send
          </button>

          {status && (
            <div
              className={`mt-4 px-4 py-2 rounded-md shadow-sm font-medium ${
                status.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Subscribers</h2>
          <ul className="divide-y divide-blue-100 text-sm text-blue-700">
            {subscribers.map((sub, i) => (
              <li key={i} className="py-3 flex justify-between">
                <span>{sub.email}</span>
                <span className="text-blue-400">
                  {new Date(sub.subscribedAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
