import {useEffect, useState} from "react";
import {Card} from "../Card.tsx";

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
            
            {expenses.map((exp: any) => (
                <Card
                    description={exp.description}
                    amount={exp.amount}
                />
            ))}
            
        </div>
    );
}