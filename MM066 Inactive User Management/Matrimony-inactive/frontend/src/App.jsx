import React from "react";
import InactiveUser from "./components/InactiveUser";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <div className="min-h-screen bg-sky-50 p-4">
      <InactiveUser />
       <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
