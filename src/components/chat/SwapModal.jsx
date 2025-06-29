import React from "react";

const SwapModal = ({ activeModal, setActiveModal, recipient }) => {
  if (activeModal !== "swap") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-2">
          Propose Skill Exchange with {recipient?.username}
        </h3>
        <label className="block mb-2 text-sm">Your Skill:</label>
        <input className="border px-2 py-1 w-full mb-3" placeholder="e.g. React" />
        <label className="block mb-2 text-sm">Their Skill You Want:</label>
        <input className="border px-2 py-1 w-full mb-3" placeholder="e.g. UI Design" />
        <div className="flex justify-end gap-2">
          <button onClick={() => setActiveModal(null)} className="text-sm text-gray-600">
            Cancel
          </button>
          <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm">
            Send Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;