import React, { useState, useEffect } from 'react';
import SkillCard from './SkillCard';
import ChatModal from './ChatModal';
import { Header } from './Header';
import Footer from './Footer';
import axios from 'axios';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/users`); // Adjust the API endpoint as needed
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skillsToTeach.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.skillsToLearn.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedFilter === '' || user.skillsToTeach.some(skill => skill.category === selectedFilter) || user.skillsToLearn.some(skill => skill.category === selectedFilter))
  );

  const handleConnectClick = (user) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  };

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Find Your Perfect Skill Match
          </h2>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search skills..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(user => (
            <SkillCard key={user.id} user={user} onConnect={handleConnectClick} />
          ))}
        </div>
      </div>
      {isChatOpen && selectedUser && (
        <ChatModal user={selectedUser} onClose={() => setIsChatOpen(false)} />
      )}
      <Footer />
    </div>
  );
};

export default Home;
