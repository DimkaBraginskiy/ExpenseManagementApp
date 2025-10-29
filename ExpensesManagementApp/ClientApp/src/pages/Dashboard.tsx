// Dashboard.tsx
import { useState, useEffect } from 'react';
import {authService} from "../../services/AuthService.tsx";


export function Dashboard() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get token from storage
                const token = authService.getToken();

                // Make API call WITH the token
                const response = await fetch('/api/Dashboard/user-data', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // 👈 Send token to backend
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.error('Failed to fetch dashboard data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        // Clear tokens from storage
        authService.clearTokens();
        // Redirect to login
        window.location.href = '/login';
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            {userData && (
                <div>
                    {/* Display your dashboard data here */}
                    <p>Welcome to your dashboard!</p>
                </div>
            )}
        </div>
    );
}