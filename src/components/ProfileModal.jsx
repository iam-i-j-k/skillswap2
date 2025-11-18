// src/components/ProfileModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Camera } from "lucide-react";
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUploadCoverMutation,
} from "../services/usersApi";
import { setCredentials } from "../features/auth/authSlice";

const skillOptions = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express.js",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "Kotlin",
  "Swift",
  "C",
  "C++",
  "C#",
  ".NET",
  "PHP",
  "Laravel",
  "Ruby",
  "Ruby on Rails",
  "Go (Golang)",
  "Rust",
  "GraphQL",
  "REST APIs",
  "WebSockets",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Sass",
  "Material UI",
  "Docker",
  "Kubernetes",
  "CI/CD Pipelines",
  "GitHub Actions",
  "GitLab CI/CD",
  "Jenkins",
  "AWS",
  "AWS Lambda",
  "Azure",
  "Google Cloud Platform (GCP)",
  "Firebase",
  "Terraform",
  "Ansible",
  "Linux Administration",
  "Bash Scripting",
  "Nginx",
  "Apache",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Scikit-Learn",
  "NumPy",
  "Pandas",
  "Matplotlib",
  "Seaborn",
  "OpenCV",
  "Natural Language Processing (NLP)",
  "Computer Vision",
  "Big Data",
  "Apache Spark",
  "Hadoop",
  "SQL",
  "NoSQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Photoshop",
  "Illustrator",
  "UI/UX Principles",
  "Wireframing",
  "Prototyping",
  "Responsive Design",
  "Accessibility (WCAG)",
  "Android Development",
  "iOS Development",
  "Flutter",
  "React Native",
  "SwiftUI",
  "Jetpack Compose",
  "Ethical Hacking",
  "Penetration Testing",
  "Network Security",
  "Cryptography",
  "OWASP Top 10",
  "Security Best Practices",
  "ISO 27001",
  "Data Structures & Algorithms",
  "Competitive Programming",
  "Discrete Mathematics",
  "Linear Algebra",
  "Probability & Statistics",
  "Agile Methodology",
  "Scrum",
  "Kanban",
  "Project Management",
  "Communication Skills",
  "Leadership",
  "Team Collaboration",
  "Time Management",
  "Problem-Solving",
  "Critical Thinking",
  "Creativity",
  "Adaptability",
]


const ProfileModal = ({ isOpen, onClose, profile }) => {
  const dispatch = useDispatch();
  const authToken = useSelector((s) => s.auth?.token);

  const [editedProfile, setEditedProfile] = useState({
    username: profile?.username || "",
    bio: profile?.bio || "",
    skills: profile?.skills || [],
    avatar: profile?.avatar || "",
    coverPhoto: profile?.coverPhoto || "",
  });

  // tag input state
  const [inputValue, setInputValue] = useState("");
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const [avatarPreview, setAvatarPreview] = useState(editedProfile.avatar || "");
  const [coverPreview, setCoverPreview] = useState(editedProfile.coverPhoto || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [uploadCover] = useUploadCoverMutation();

  const modalRef = useRef();
  const avatarInputRef = useRef();
  const coverInputRef = useRef();
  const inputRef = useRef();

  // sync prop -> local state
useEffect(() => {
  if (!isOpen) return;

  setEditedProfile({
    username: profile.username,
    bio: profile.bio,
    skills: profile.skills,
    avatar: profile.avatar,
    coverPhoto: profile.coverPhoto,
  });

  if (!avatarPreview) setAvatarPreview(profile.avatar || "");
  if (!coverPreview) setCoverPreview(profile.coverPhoto || "");
}, [profile, isOpen]);



  // suggestions: only show when typing (inputValue non-empty)
  const suggestions = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return [];
    return skillOptions
      .filter((s) => !editedProfile.skills.includes(s) && s.toLowerCase().includes(q))
      .slice(0, 8);
  }, [inputValue, editedProfile.skills]);

  // add skill
  const addSkill = (skill) => {
    if (!skill) return;
    if (editedProfile.skills.includes(skill)) return;
    setEditedProfile((p) => ({ ...p, skills: [...p.skills, skill] }));
    setInputValue("");
    setIsOpenSuggestions(false);
    setHighlightIndex(-1);
  };

  // remove skill
  const removeSkill = (skill) => {
    setEditedProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };

  // keyboard handlers for tag input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim() && suggestions.length > 0) {
        addSkill(suggestions[highlightIndex >= 0 ? highlightIndex : 0]);
      } else if (inputValue.trim()) {
        // allow adding free text skill if desired:
        addSkill(inputValue.trim());
      }
    } else if (e.key === "Backspace") {
      if (!inputValue) {
        // remove last tag
        const last = editedProfile.skills[editedProfile.skills.length - 1];
        if (last) removeSkill(last);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!suggestions.length) return;
      setIsOpenSuggestions(true);
      setHighlightIndex((hi) => Math.min(suggestions.length - 1, hi + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!suggestions.length) return;
      setHighlightIndex((hi) => Math.max(0, hi - 1));
    } else if (e.key === "Escape") {
      setIsOpenSuggestions(false);
      setHighlightIndex(-1);
    }
  };

  // avatar handling
  const handleAvatarFile = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

    try {
      setUploadingAvatar(true);
      // uploadAvatar expects { file, userId } in our usersApi pattern
      const res = await uploadAvatar({ file, userId: profile?._id }).unwrap();
      if (res?.user) {
        setEditedProfile((p) => ({ ...p, avatar: res.user.avatar || "" }));
        dispatch(setCredentials({ user: res.user, token: authToken }));
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // cover handling
  const handleCoverFile = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);

    try {
      setUploadingCover(true);
      const res = await uploadCover({ file, userId: profile?._id }).unwrap();
      if (res?.user) {
        setEditedProfile((p) => ({ ...p, coverPhoto: res.user.coverPhoto || "" }));
        dispatch(setCredentials({ user: res.user, token: authToken }));
      }
    } catch (err) {
      console.error("Cover upload failed:", err);
    } finally {
      setUploadingCover(false);
    }
  };

  // wire file inputs
  const onAvatarChange = (e) => handleAvatarFile(e.target.files?.[0]);
  const onCoverChange = (e) => handleCoverFile(e.target.files?.[0]);

  // save profile
  const onSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: profile?._id,
        username: editedProfile.username,
        bio: editedProfile.bio,
        skills: editedProfile.skills,
      };
      const updated = await updateProfile(payload).unwrap();
      if (updated?.user) {
        dispatch(setCredentials({ user: updated.user, token: authToken }));
      }
      onClose();
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  // click outside: keep but do not auto-close (optional)
  useEffect(() => {
    const onDocClick = (ev) => {
      if (!modalRef.current) return;
      if (!isOpen) return;
      if (!modalRef.current.contains(ev.target)) {
        // do nothing by default, uncomment to close on outside click:
        // onClose();
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          ref={modalRef}
          initial={{ y: 20, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 8, scale: 0.98, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="relative h-40 bg-gray-100 dark:bg-slate-700">
            {coverPreview ? (
              <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700" />
            )}

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => coverInputRef.current?.click()}
                className="p-2 bg-white/80 dark:bg-slate-900/70 rounded-xl shadow"
                title="Upload cover photo"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/80 dark:bg-slate-900/70 rounded-xl shadow"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onCoverChange}
            />
          </div>

          <form onSubmit={onSave} className="p-6 space-y-6">
            <div className="flex items-start gap-6">
              <div className="relative -mt-16">
                <div className="w-32 h-32 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-lg overflow-hidden">
                    <>
                        {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="avatar"
                            className="w-full h-full object-cover rounded-xl"
                        />
                        ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                            {editedProfile.username?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        )}
                    </>
                </div>

                <div className="absolute -right-2 bottom-0">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-2 py-2 bg-white dark:bg-slate-900 rounded-full shadow border border-gray-200 dark:border-white/10"
                    title="Upload avatar"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                />
              </div>

              <div className="flex-1 min-w-0">
                <label className="text-sm text-gray-500 dark:text-gray-300">Full name</label>
                <input
                  type="text"
                  value={editedProfile.username}
                  onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                  className="w-full mt-1 px-4 py-2 rounded-xl border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                />

                <label className="text-sm text-gray-500 dark:text-gray-300 mt-3 block">Bio</label>
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  rows={3}
                  className="w-full mt-1 px-4 py-2 rounded-xl border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 resize-none"
                />
              </div>
            </div>

            {/* INLINE TAG INPUT (search-only opens suggestions) */}
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-300 block mb-2">Skills</label>

              <div
                onClick={() => inputRef.current?.focus()}
                className="min-h-[46px] w-full border rounded-xl px-3 py-2 bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 flex items-center gap-2 flex-wrap"
              >
                {editedProfile.skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-500/20 text-sm px-3 py-1 rounded-full"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="ml-1 text-xs text-gray-600 dark:text-gray-300"
                      aria-label={`Remove ${s}`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsOpenSuggestions(Boolean(e.target.value.trim()));
                    setHighlightIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type to search and press Enter to add..."
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-sm px-2 py-1"
                />
              </div>

              {/* dropdown: only when typing (inputValue non-empty) */}
              <AnimatePresence>
                {isOpenSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg max-h-44 overflow-auto"
                  >
                    {suggestions.map((s, idx) => (
                      <div
                        key={s}
                        onMouseDown={(e) => {
                          // use onMouseDown to avoid losing focus before click
                          e.preventDefault();
                          addSkill(s);
                        }}
                        className={`px-4 py-2 cursor-pointer ${
                          idx === highlightIndex ? "bg-gray-50 dark:bg-white/5" : "hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        {s}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border rounded-2xl bg-white dark:bg-slate-700 border-gray-200 dark:border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;
