import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(res.data.user);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>User not found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{profile.username}</h2>
      <div className="text-gray-600 mb-2">{profile.email}</div>
      <div className="mb-2">{profile.bio}</div>
      <div>
        <strong>Skills:</strong>{" "}
        {profile.skills && profile.skills.length > 0
          ? profile.skills.join(", ")
          : "No skills listed"}
      </div>
    </div>
  );
};

export default UserProfile;