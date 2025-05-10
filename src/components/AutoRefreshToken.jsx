import React, { useEffect } from 'react';

const AutoRefreshToken = () => {
    useEffect(() => {
        const refreshToken = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/token/refresh/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
                });

                const data = await res.json();
                if (data.access) {
                    localStorage.setItem("access", data.access);
                    console.log("Access token refreshed");
                } else {
                    console.warn("Refresh token expired or invalid");
                }
            } catch (err) {
                console.error("Failed to refresh token", err);
            }
        };

        // Call every 4.5 minutes (270000 ms)
        const interval = setInterval(refreshToken, 270000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return null; // This component just runs in the background
};

export default AutoRefreshToken;
