import React from "react";

export default function EmailCampaigns() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Email Campaigns</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Compose Newsletter</h2>
        <input type="text" placeholder="Subject" className="border p-2 rounded mb-4 w-full" />
        <textarea placeholder="Email Body" className="border p-2 rounded mb-4 w-full h-40" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Send Campaign</button>
      </div>
    </div>
  );
}
