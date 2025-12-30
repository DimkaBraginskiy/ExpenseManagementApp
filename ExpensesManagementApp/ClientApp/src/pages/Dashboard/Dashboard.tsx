import {useEffect, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";

import styles from "./Dashboard.module.css";
import {ExpenseCard} from "./ExpenseCard.tsx";
import type {Expense} from "./Expense.tsx";

export function Dashboard(){
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    
    useEffect(() => {
        const loadExpenses = async () => {
            const token = authService.getAccessToken();
            if(token == null){
                setError('Token not found!');
                setLoading(false);
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
                    throw new Error('No expenses found');
                }

                const data : any = await response.json();
                console.log("API Response:", data);
                console.log("First expense:", data[0]);
                
                setExpenses(data);
            }catch(err: any){
                setError('Error: ' + err.message);
            }finally {
                setLoading(false);
            }
        };
        
        loadExpenses();
    }, [])

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                My Dashboard
            </header>


            <main className={styles.main}>
                <h3> My Expenses</h3>

                {/*<div>{authService.getAccessToken()*/}
                {/*    ? 'Logged in successfully! \naccess token: ' + authService.getAccessToken() + '\nrefresh token: ' + authService.getRefreshToken()*/}
                {/*    : 'No token'}*/}
                {/*</div>*/}


                {!loading && !error && expenses.length > 0 && (
                    <div className={styles.expensesGrid}>
                        {expenses.map((expense) => (
                            <ExpenseCard key={expense.description} expense={expense} />
                        ))}
                    </div>
                )}

                    
            </main>
            
            <footer className={styles.footer}>
                • 2025 Expense Management App •
            </footer>
        </div>
    );
}