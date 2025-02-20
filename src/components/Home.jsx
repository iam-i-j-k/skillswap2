import React, { useState } from 'react';
import SkillCard from './SkillCard';
import ChatModal from './ChatModal';
import { Header } from './Header';
import Footer from './Footer';

const SAMPLE_USERS = [
  {
    id: '1',
    name: 'Laura White',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Content writer with a knack for storytelling',
    skillsToTeach: [
      { id: '17', name: 'Creative Writing', category: 'Writing', description: '', image: '' },
      { id: '18', name: 'SEO Writing', category: 'Marketing', description: '', image: '' }
    ],
    skillsToLearn: [
      { id: '19', name: 'Digital Marketing', category: 'Marketing', description: '', image: '' },
      { id: '20', name: 'Social Media Management', category: 'Marketing', description: '', image: '' }
    ]
  },
  {
    id: '2',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400',
    bio: 'Experienced web developer with a passion for coding',
    skillsToTeach: [
      { id: '21', name: 'Web Development', category: 'Programming', description: '', image: '' },
      { id: '22', name: 'JavaScript', category: 'Programming', description: '', image: '' }
    ],
    skillsToLearn: [
      { id: '23', name: 'UI/UX Design', category: 'Design', description: '', image: '' },
      { id: '24', name: 'Machine Learning', category: 'Data Science', description: '', image: '' }
    ]
  },
  {
    id: '3',
    name: 'Sophia Turner',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK6nhTPn2KsCEA5oCd19uqp5dHJnB159XXVw&s',
    bio: 'Graphic designer passionate about creating visually appealing websites',
    skillsToTeach: [
      { id: '25', name: 'Graphic Design', category: 'Design', description: '', image: '' },
      { id: '26', name: 'Branding', category: 'Design', description: '', image: '' }
    ],
    skillsToLearn: [
      { id: '27', name: 'Web Development', category: 'Programming', description: '', image: '' },
      { id: '28', name: 'Digital Illustration', category: 'Art', description: '', image: '' }
    ]
  },
  {
    id: '4',
    name: 'Mark Robinson',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKpoOr-PUnAljpxR2LCoihCZqdoGkXYrN5g&s',
    bio: 'Marketing expert with a focus on SEO and social media strategy',
    skillsToTeach: [
      { id: '29', name: 'SEO', category: 'Marketing', description: '', image: '' },
      { id: '30', name: 'Content Marketing', category: 'Marketing', description: '', image: '' }
    ],
    skillsToLearn: [
      { id: '31', name: 'Web Development', category: 'Programming', description: '', image: '' },
      { id: '32', name: 'Data Analytics', category: 'Data Science', description: '', image: '' }
    ]
  },
  {
    id: '5',
    name: 'James Harris',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT211pdIhj6EZ5BrcYKBielSwumHCNQr7ShYQ&s',
    bio: 'Software engineer with a strong background in Python and AI development',
    skillsToTeach: [
      { id: '33', name: 'Python', category: 'Programming', description: '', image: '' },
      { id: '34', name: 'Artificial Intelligence', category: 'Technology', description: '', image: '' }
    ],
    skillsToLearn: [
      { id: '35', name: 'Web Development', category: 'Programming', description: '', image: '' },
      { id: '36', name: 'Cloud Computing', category: 'Technology', description: '', image: '' }
    ]
  },
  {
    id: '6',
    name: 'Olivia Johnson',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_iN2TKAq-VJfntDolRaLEH2fTQWy1nj2PtQ&s',
    bio: 'Full-stack developer with expertise in React and Node.js',
    skillsToTeach: [
      { id: '37', name: 'React', category: 'Programming', description: '', image: '' },
      { id: '38', name: 'Node.js', category: 'Programming', description: '', image: '' }
    ],
    skillsToLearn: [
      { id: '39', name: 'Data Science', category: 'Data Science', description: '', image: '' },
      { id: '40', name: 'UI/UX Design', category: 'Design', description: '', image: '' }
    ]
  }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const filteredUsers = SAMPLE_USERS.filter(user =>
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
