import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FarmerRoutes from "../PublicRoutes/FarmerRoutes";
import DealerRoutes from "../PublicRoutes/DealerRoutes";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import DealerNavbar from "../Components/Navbar/DealerNavbar";
import LoginForm from "../Pages/Login";
import RegisterForm from "../Pages/Register";
import ForgotPassword from "../Pages/ForgotPassword";

const AppLayout = () => {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true"
  );
  const [user, setUser] = useState(
    () => localStorage.getItem("user") || "Farmer"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(localStorage.getItem("loggedIn") === "true");
      setUser(localStorage.getItem("user") || "Farmer");
    };

    window.addEventListener("userChanged", handleStorageChange);
    window.addEventListener("loggedInChanged", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userChanged", handleStorageChange);
      window.removeEventListener("loggedInChanged", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow-md">
        {user === "Farmer" && <Navbar />}
        {user === "Dealer" && <DealerNavbar />}
      </div>

      <div>
        {user === "Farmer" && <FarmerRoutes />}
        {user === "Dealer" && <DealerRoutes />}
      </div>

      <Footer />
    </>
  );
};

export default AppLayout;
