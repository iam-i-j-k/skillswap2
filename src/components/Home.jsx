import React, { useState, useEffect } from 'react';
import SkillCard from './SkillCard';
import ChatModal from './ChatModal';
import { Header } from './Header';
import Footer from './Footer';
import axios from 'axios';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [users, setUsers] = useState([]); // ✅ Initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/users`);
        setUsers(response.data || []); // ✅ Ensure it always sets an array
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users?.filter(user => {
    const userName = user.username?.toLowerCase() || '';
    const skills = Array.isArray(user.skills) ? user.skills : [];
    return userName.includes(searchTerm.toLowerCase()) || skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleConnectClick = (user) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  };

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Find Your Perfect Skill Match</h2>
          <input
            type="text"
            placeholder="Search skills..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p className="text-center text-gray-600">Loading users...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!loading && !error && (filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <SkillCard key={user._id} user={user} onConnect={handleConnectClick} />
            ))
          ) : (
            <p>No users found</p>
          ))}
        </div>
      </div>

      {isChatOpen && selectedUser && <ChatModal user={selectedUser} onClose={() => setIsChatOpen(false)} />}
      <Footer />
    </div>
  );
};

export default Home;
