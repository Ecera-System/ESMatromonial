import React, { useState } from "react";
import FormInput from "../../components/Admin/FormInput";
import axios from "axios";
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
const AdminSignIn = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/admin/login`,
        credentials,
        { withCredentials: true }
      );

      alert("Admin signed in successfully!");
      console.log("Login response:", response.data);

      // You can redirect the admin here or store token/state as needed
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(
        "Login failed: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Sign In</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        <button type="submit" style={styles.button}>
          Sign In
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "1rem",
  },
};

export default AdminSignIn;
