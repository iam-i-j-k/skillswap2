import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Mail, Calendar, Edit2, Camera, X, Check, MapPin, Link2, Clock, BadgeCheck, Shield, Plus, Trash2 } from 'lucide-react';

import {
  useGetUserQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUploadCoverMutation,
} from "../services/usersApi";
import { useRequestVerificationMutation } from "../services/platformApi";

export default function Profile() {
  const currentUser = useSelector((state) => state.auth.user);
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetUserQuery(currentUser?._id, { skip: !currentUser?._id });

  const [updateProfile] = useUpdateProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [uploadCover] = useUploadCoverMutation();
  const [requestVerification] = useRequestVerificationMutation();

  const avatarRef = useRef();
  const coverRef = useRef();

  const userProfile = data?.user;
  const [edited, setEdited] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");
  const [verifNote, setVerifNote] = useState("");
  const [verifSubmitted, setVerifSubmitted] = useState(false);

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


  const skillOptions = [
  "JavaScript", "TypeScript", "React.js", "Next.js", "Vue.js", "Angular",
  "Node.js", "Express.js", "Python", "Django", "Flask", "Java",
  "Spring Boot", "Kotlin", "Swift", "C", "C++", "C#", ".NET", "PHP",
  "Laravel", "Ruby", "Ruby on Rails", "Go (Golang)", "Rust", "GraphQL",
  "REST APIs", "WebSockets", "HTML", "CSS", "Tailwind CSS", "Bootstrap",
  "Sass", "Material UI", "Docker", "Kubernetes", "CI/CD Pipelines",
  "GitHub Actions", "GitLab CI/CD", "Jenkins", "AWS", "AWS Lambda",
  "Azure", "Google Cloud Platform (GCP)", "Firebase", "Terraform",
  "Ansible", "Linux Administration", "Bash Scripting", "Nginx",
  "Apache", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Scikit-Learn", "NumPy", "Pandas", "Matplotlib", "Seaborn", "OpenCV",
  "Natural Language Processing (NLP)", "Computer Vision", "Big Data",
  "Apache Spark", "Hadoop", "SQL", "NoSQL", "MongoDB", "PostgreSQL",
  "MySQL", "Redis", "Figma", "Adobe XD", "Sketch", "Photoshop",
  "Illustrator", "UI/UX Principles", "Wireframing", "Prototyping",
  "Responsive Design", "Accessibility (WCAG)", "Android Development",
  "iOS Development", "Flutter", "React Native", "SwiftUI",
  "Jetpack Compose", "Ethical Hacking", "Penetration Testing",
  "Network Security", "Cryptography", "OWASP Top 10",
  "Security Best Practices", "ISO 27001",
  "Data Structures & Algorithms", "Competitive Programming",
  "Discrete Mathematics", "Linear Algebra", "Probability & Statistics",
  "Agile Methodology", "Scrum", "Kanban", "Project Management",
  "Communication Skills", "Leadership", "Team Collaboration",
  "Time Management", "Problem-Solving", "Critical Thinking",
  "Creativity", "Adaptability",
];


  useEffect(() => {
    if (userProfile) setEdited(userProfile);
  }, [userProfile]);

  if (isLoading || !edited)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-700 dark:text-white">
        Loading Profile...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-red-600 dark:text-red-400">
        {error?.data?.error || "Failed to load profile"}
      </div>
    );

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    await uploadAvatar({ file, userId: currentUser._id });
  };

  const handleCoverUpload = async (file) => {
    if (!file) return;
    await uploadCover({ file, userId: currentUser._id });
  };

  const handleSave = async () => {
    await updateProfile({ id: currentUser._id, ...edited });
    setIsEditing(false);
  };

  const toggleAvailability = (day) => {
    const current = edited.availability || [];
    setEdited({
      ...edited,
      availability: current.includes(day) ? current.filter((d) => d !== day) : [...current, day],
    });
  };

  const addPortfolioLink = () => {
    if (!newPortfolioLink.trim()) return;
    setEdited({ ...edited, portfolioLinks: [...(edited.portfolioLinks || []), newPortfolioLink.trim()] });
    setNewPortfolioLink("");
  };

  const removePortfolioLink = (url) => {
    setEdited({ ...edited, portfolioLinks: (edited.portfolioLinks || []).filter((l) => l !== url) });
  };

  const handleRequestVerification = async () => {
    try {
      await requestVerification({ note: verifNote }).unwrap();
      setVerifSubmitted(true);
    } catch { /* handled silently; toast shown by RTK */ }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12 overflow-auto">
      {/* COVER PHOTO */}
      <div className="relative w-full h-40 sm:h-52 md:h-64 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600">
        {edited.coverPhoto && (
          <img src={edited.coverPhoto || "/placeholder.svg"} className="w-full h-full object-cover" alt="cover" onError={(e) => (e.target.src = "/placeholder.svg")} />
        )}
        <button onClick={() => coverRef.current.click()} className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-lg shadow hover:shadow-md transition">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <input ref={coverRef} type="file" hidden accept="image/*" onChange={(e) => handleCoverUpload(e.target.files?.[0])} />
      </div>

      {/* MAIN PROFILE CARD */}
      <div className="max-w-5xl mx-auto -mt-14 sm:-mt-16 md:-mt-10 px-3 sm:px-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow border-2 border-white dark:border-slate-800 bg-white">
                {edited.avatar ? (
                  <img src={edited.avatar} alt="avatar" className="w-full h-full object-cover" onError={(e) => (e.target.src = "/placeholder.svg")} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">{edited.username.charAt(0)}</div>
                )}
              </div>
              <button onClick={() => avatarRef.current.click()} className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2 rounded-full shadow">
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <input type="file" hidden ref={avatarRef} accept="image/*" onChange={(e) => handleAvatarUpload(e.target.files?.[0])} />
            </div>
            <div className="text-center sm:text-left">
              {isEditing ? (
                <input className="text-xl sm:text-2xl font-bold bg-gray-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 w-full text-gray-900 dark:text-white mb-1" value={edited.username} onChange={(e) => setEdited({ ...edited, username: e.target.value })} />
              ) : (
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{edited.username}</h1>
                  {edited.verificationBadge === 'verified' && <BadgeCheck className="w-5 h-5 text-blue-500" title="Verified" />}
                </div>
              )}
              <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2"><Mail className="w-3 h-3 sm:w-4 sm:h-4" /> {edited.email}</div>
                <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2"><Calendar className="w-3 h-3 sm:w-4 sm:h-4" /> Joined {new Date(edited.createdAt).toLocaleDateString()}</div>
                {edited.city && <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2"><MapPin className="w-3 h-3 sm:w-4 sm:h-4" /> {[edited.city, edited.location].filter(Boolean).join(', ')}</div>}
                {edited.reputationScore > 0 && <div className="flex items-center justify-center sm:justify-start gap-1">⭐ {edited.reputationScore.toFixed(1)} reputation</div>}
              </div>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-xs sm:text-sm font-medium"><Check className="w-4 h-4" /> Save</button>
                <button onClick={() => { setEdited(userProfile); setIsEditing(false); }} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 text-xs sm:text-sm font-medium"><X className="w-4 h-4" /> Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 text-xs sm:text-sm font-medium"><Edit2 className="w-4 h-4" /> Edit</button>
            )}
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-6">

        {/* Badges */}
        {(edited.badges || []).length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">Badges</h2>
            <div className="flex flex-wrap gap-2">
              {edited.badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium">🏅 {b}</span>
              ))}
            </div>
          </div>
        )}

        {/* Bio + Location */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">About</h2>
          {isEditing ? (
            <div className="space-y-3">
              <textarea className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm" rows={3} value={edited.bio} onChange={(e) => setEdited({ ...edited, bio: e.target.value })} placeholder="Tell people about yourself" />
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">City</label>
                  <input value={edited.city || ''} onChange={(e) => setEdited({ ...edited, city: e.target.value })} placeholder="e.g. Lagos" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Location / Region</label>
                  <input value={edited.location || ''} onChange={(e) => setEdited({ ...edited, location: e.target.value })} placeholder="e.g. West Africa" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{edited.bio || 'No bio yet.'}</p>
              {(edited.city || edited.location) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin className="w-4 h-4" />{[edited.city, edited.location].filter(Boolean).join(', ')}</p>
              )}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Skills</h2>
          {isEditing ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap gap-2">
                {edited.skills.map((s, i) => (
                  <div key={i} className="px-3 py-1 rounded-full flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-medium">
                    {s}
                    <button onClick={() => setEdited({ ...edited, skills: edited.skills.filter((x) => x !== s) })}><X className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                  </div>
                ))}
              </div>
              <div className="relative">
                <input type="text" value={skillSearch} onChange={(e) => { setSkillSearch(e.target.value); setShowSkillDropdown(true); }} placeholder="Search or add a skill..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm text-gray-700 dark:text-white" />
                {showSkillDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg max-h-56 overflow-y-auto shadow-lg">
                    {skillOptions.filter((s) => s.toLowerCase().includes(skillSearch.toLowerCase()) && !edited.skills.includes(s)).slice(0, 30).map((s) => (
                      <button key={s} onClick={() => { setEdited({ ...edited, skills: [...edited.skills, s] }); setSkillSearch(""); setShowSkillDropdown(false); }} className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition">{s}</button>
                    ))}
                    {skillOptions.filter((s) => s.toLowerCase().includes(skillSearch.toLowerCase()) && !edited.skills.includes(s)).length === 0 && (
                      <p className="px-4 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">No skills found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {edited.skills.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-medium">{s}</span>
              ))}
              {edited.skills.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">No skills added yet.</p>}
            </div>
          )}
        </div>

        {/* Availability Calendar */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-purple-500" /> Availability</h2>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const active = (edited.availability || []).includes(day);
              return isEditing ? (
                <button key={day} type="button" onClick={() => toggleAvailability(day)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${active ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300'}`}>{day}</button>
              ) : active ? (
                <span key={day} className="px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm font-medium">{day}</span>
              ) : null;
            })}
            {!isEditing && (edited.availability || []).length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">No availability set yet.</p>}
          </div>
        </div>

        {/* Portfolio Links */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Link2 className="w-5 h-5 text-purple-500" /> Portfolio</h2>
          <div className="space-y-2">
            {(edited.portfolioLinks || []).map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <a href={url} target="_blank" rel="noreferrer" className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex-1 truncate">{url}</a>
                {isEditing && <button onClick={() => removePortfolioLink(url)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>}
              </div>
            ))}
            {(edited.portfolioLinks || []).length === 0 && !isEditing && <p className="text-sm text-gray-400 dark:text-gray-500">No portfolio links yet.</p>}
            {isEditing && (
              <div className="flex gap-2 mt-2">
                <input value={newPortfolioLink} onChange={(e) => setNewPortfolioLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioLink())} placeholder="https://github.com/you" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm" />
                <button onClick={addPortfolioLink} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm"><Plus className="w-4 h-4" /> Add</button>
              </div>
            )}
          </div>
        </div>

        {/* Identity Verification */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-500" /> Identity Verification</h2>
          {edited.verificationBadge === 'verified' ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm"><BadgeCheck className="w-5 h-5" /> Your identity is verified.</div>
          ) : edited.verificationBadge === 'pending' || verifSubmitted ? (
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Verification request is pending review.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">A verified badge helps you build trust with swap partners.</p>
              <textarea value={verifNote} onChange={(e) => setVerifNote(e.target.value)} placeholder="Share a LinkedIn, GitHub, or portfolio URL so we can verify you" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm" />
              <button onClick={handleRequestVerification} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">Request Verification</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
