import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/matches`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMatches(res.data.matches || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [token]);

  if (loading) return <div className="p-4">Loading matches...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Matched Collaborators</h2>
      {matches.length === 0 ? (
        <div>No matches yet.</div>
      ) : (
        <ul className="space-y-4">
          {matches.map(({ connectionId, user }) => (
            <li
              key={connectionId}
              className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between items-start sm:items-center"
            >
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  {user.skills && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate(`/chat/${user._id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                💬 Chat
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Matches;