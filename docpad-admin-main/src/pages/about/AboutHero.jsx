import React, { useState, useEffect } from "react";
import { apiGet } from "../../utils/api";

const AboutHero = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiGet("/api/user/")
      .then((data) => {
        // console.log("User data:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setUser(null);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">About Page</h1>
      <p className="text-gray-600 mb-4">This page is about me.</p>

      <span className="text-sm text-gray-500">
        {user ? `👋 Hello, ${user.username}${user.username}` : "Not logged in"}
      </span>
    </div>
  );
};

export default AboutHero;
