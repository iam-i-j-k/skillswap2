import React from 'react';
import { MessageSquare, Share2, Phone } from 'lucide-react';

function Profile() {
  const userProfile = {
    name: "John Doe",
    email: "john@example.com",
    skills: ["JavaScript", "React", "Node.js"],
    teaching: ["Web Development", "UI/UX Design"],
    bio: "Full-stack developer with 5 years of experience"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">
                  {userProfile.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
                <p className="text-gray-500">{userProfile.email}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Bio</h3>
              <p className="mt-2 text-gray-600">{userProfile.bio}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {userProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Teaching</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {userProfile.teaching.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
