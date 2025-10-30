import {useEffect, useState} from "react";

export function Dashboard(){
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchExpenses = async () => {
            const token = localStorage.getItem('accessToken');
            if(token == null){
                setError('Token not found');
                return;
            }
            
            try{
                const response = await fetch('api/Expenses', {
                    method: 'GET',
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    }
                });
                
                if(!response.ok){
                    throw new Error('Failed to get response');
                }
                
                const data = await response.json();
                setExpenses(data);
            }catch(err: any){
                setError('Error: ' + err.message);
            }
        };
        fetchExpenses();
    }, [])
    
    return(
        <div>
            <h1>My Expenses Dashboard</h1>
            {error && <p>{error}</p>}
            <ul>
                {expenses.map((exp: any) => (
                    <li key={exp.id}>{exp.description} - {exp.amount} - {exp.date} - {exp.id}</li>
                    ))}
            </ul>
        </div>
    );
}