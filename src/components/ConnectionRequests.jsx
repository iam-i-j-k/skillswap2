import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/connections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/connections/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Connection accepted!');
      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/connections/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Connection rejected!');
      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Connection Requests</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {requests.length === 0 ? (
        <p>No connection requests</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request._id} className="mb-4 p-4 border rounded-lg">
              <p>
                <strong>{request.requester.username}</strong> ({request.requester.email})
              </p>
              <p>{request.requester.bio}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleAccept(request._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConnectionRequests;
