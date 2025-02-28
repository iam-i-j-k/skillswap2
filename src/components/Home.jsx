import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/users`); // Update with your backend URL
        if (!response.ok) throw new Error("Failed to fetch users");
        
        const data = await response.json();
        setUsers(data); // Update state with fetched users
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      <h2>Users List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name} - {user.email}</li> // Adjust based on your user schema
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default Home;
