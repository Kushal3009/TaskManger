import { Link, useNavigate } from "react-router-dom";
import React from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const buttonStyle = {
    border: "1px solid black",
    padding: "3px 10px",
    transition: "all 0.6s ease",
  };

  return (
    <div className="flex bg-indigo-300 py-3 px-10 justify-between ">
      <ul className="flex gap-5 justify-center items-center">
        <li className="list-none">
          <Link className="text-xl hover:text-white font-bold" to="/">
            TaskManager
          </Link>
        </li>
        <li className="list-none">
          <Link className="text-xl hover:text-white " to="/">
            Home
          </Link>
        </li>
      </ul>
      <ul className="flex gap-5">
        {authToken ? (
          <button
            style={buttonStyle}
            className="hover:bg-white font-semibold hover:font-bold"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">
              <button
                style={buttonStyle}
                className="hover:bg-white font-semibold hover:font-bold"
              >
                Login
              </button>
            </Link>
            <Link to="/signUp">
              <button
                style={buttonStyle}
                className="hover:bg-white font-semibold hover:font-bold"
              >
                Sign UP
              </button>
            </Link>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
