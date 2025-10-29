import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';


function App() {
    useEffect(() => {
        const fetchGetExpenses = async () => {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwianRpIjoiZTAxZmYxY2ItZTM3ZC00ZDFiLWIxZjktODkwYTU5MDkzZDIxIiwiZXhwIjoxNzU4MjgwODYyLCJpc3MiOiJFeHBlbnNlTWFuYWdlbWVudEFwcCIsImF1ZCI6IkV4cGVuc2VNYW5hZ2VtZW50QXBwVXNlcnMifQ.cl08jNEHdOi-dyhisvwjyI-NfUUi-AYSy52Hn6rxjzs';

            try {
                const response = await fetch('/api/Expenses/users/3', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    const errorText = await response.text(); // Get the HTML error page
                    throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
                }
                const data = await response.json();
                console.log('Expenses data:', data);
            } catch (error: any) {
                console.error('Error fetching expenses:', {
                    message: error.message,
                    name: error.name, // e.g., "SyntaxError"
                    stack: error.stack, // Full stack trace
                    responseStatus: error.response?.status, // If available
                });
            }
        };

        fetchGetExpenses();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;