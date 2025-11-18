import React, { useEffect, useState, useRef } from "react";

const CheckConnection = () => {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    const handlePing = async () => {
      try {
        await fetch("https://1.1.1.1/cdn-cgi/trace", {
      method: "GET",
      cache: "no-cache"
    });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };
    handlePing();
    const interval = setInterval(handlePing, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
        <div>
            {!isOnline && (
                <div className="flex justify-center items-center font-medium bg-gray-300 text-blue-500 p-1">
                    <p>You are Offline. Please Check Your Connection.</p>
                </div>
            )}
        </div>
    );
};

export default CheckConnection;