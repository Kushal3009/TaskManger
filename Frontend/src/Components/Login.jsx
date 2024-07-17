import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const json = await response.json();
      console.log(json);

      if (json.authToken) {
        localStorage.setItem("authToken", json.authToken);
        setError(null);
        navigate("/");
      } else {
        throw new Error("Auth token not found");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      setError("Login failed. Please try again.");
    }
  };

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center p-48 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            name="email"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={data.email}
            onChange={onChange}
          />
          <input
            type="password"
            name="password"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={data.password}
            onChange={onChange}
          />
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
