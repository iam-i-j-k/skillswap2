import React from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Notification = ({ notification, onAccept, onReject }) => {
  const handleAccept = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/connections/${notification.connection._id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Connection accepted');
      onAccept(notification.connection._id);
    } catch (error) {
      toast.error('Error accepting connection');
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/connections/${notification.connection._id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Connection rejected');
      onReject(notification.connection._id);
    } catch (error) {
      toast.error('Error rejecting connection');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
      <p className="text-gray-900">
        New connection request from {notification.requester}
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default Notification;