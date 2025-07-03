import React, { useState } from "react";

const SwapModal = ({
  activeModal,
  setActiveModal,
  recipient,
  currentUser,
  recipientSkills = [],
  userSkills = [],
}) => {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [desiredSkill, setDesiredSkill] = useState("");

  if (activeModal !== "swap") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-2">
          Propose Skill Exchange with {recipient?.username}
        </h3>
        <label className="block mb-2 text-sm">Your Skill:</label>
        <select
          className="border px-2 py-1 w-full mb-3"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">Select your skill</option>
          {userSkills.map((skill, idx) => (
            <option key={idx} value={skill}>
              {skill}
            </option>
          ))}
        </select>
        <label className="block mb-2 text-sm">Their Skill You Want:</label>
        <select
          className="border px-2 py-1 w-full mb-3"
          value={desiredSkill}
          onChange={(e) => setDesiredSkill(e.target.value)}
        >
          <option value="">Select their skill</option>
          {recipientSkills.map((skill, idx) => (
            <option key={idx} value={skill}>
              {skill}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setActiveModal(null)}
            className="text-sm text-gray-600"
          >
            Cancel
          </button>
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
            disabled={!selectedSkill || !desiredSkill}
          >
            Send Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;