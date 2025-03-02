import React, { useState } from 'react';
import { ArrowRight, Users, BookOpen, Award, Github } from 'lucide-react';

const achievements = [
  {
    id: '1',
    title: 'Active Users',
    value: '10,000+',
    description: 'Learners and teachers worldwide',
    icon: 'Users'
  },
  {
    id: '2',
    title: 'Skills Exchanged',
    value: '25,000+',
    description: 'Successful skill swaps',
    icon: 'BookOpen'
  },
  {
    id: '3',
    title: 'Success Rate',
    value: '95%',
    description: 'Positive learning experiences',
    icon: 'Award'
  }
];

const teamMembers = [
  {
    id: '1',
    name: 'Emily Zhang',
    role: 'Founder & CEO',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Former tech lead at Google with a passion for peer-to-peer learning.',
    linkedin: '#'
  },
  {
    id: '2',
    name: 'David Kumar',
    role: 'CTO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Full-stack developer with 10 years of experience in educational technology.',
    linkedin: '#'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    role: 'Head of Community',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Community building expert focused on creating meaningful connections.',
    linkedin: '#'
  }
];

function LandingPage() {    
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="min-h-screen">
      <div 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}             
      >
        <div className="absolute inset-0 bg-[#00000080]" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Learn. Teach. Grow Together.</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Exchange skills with passionate people worldwide. Teach what you know, learn what you love.
          </p>
          <button
            onClick={() => (window.location.href = '/home')}
            className="cursor-pointer bg-purple-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-purple-700 transition flex items-center space-x-2 mx-auto"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {achievement.icon === 'Users' && <Users className="h-8 w-8 text-purple-600" />}
                  {achievement.icon === 'BookOpen' && <BookOpen className="h-8 w-8 text-purple-600" />}
                  {achievement.icon === 'Award' && <Award className="h-8 w-8 text-purple-600" />}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{achievement.value}</h3>
                <p className="text-xl font-medium text-gray-600 mb-2">{achievement.title}</p>
                <p className="text-gray-500">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.id} className="relative group cursor-pointer" onClick={() => setSelectedMember(member)}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition group-hover:scale-105">
                  <img src={member.avatar} alt={member.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-purple-600">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedMember && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img src={selectedMember.avatar} alt={selectedMember.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                <p className="text-purple-600">{selectedMember.role}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{selectedMember.bio}</p>
            <div className="flex justify-end space-x-4">
              <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                <Github className="h-6 w-6" />
              </a>
              <button onClick={() => setSelectedMember(null)} className="bg-gray-100 cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
