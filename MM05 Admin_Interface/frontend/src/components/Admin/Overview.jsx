import React from "react";

export default function Overview() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">1234</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold">Premium Users</h2>
          <p className="text-2xl">245</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold">Active This Month</h2>
          <p className="text-2xl">987</p>
        </div>
      </div>
    </div>
  );
}
