import {useEffect, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";

import styles from "./Dashboard.module.css";
import {ExpenseCard} from "./ExpenseCard.tsx";
import type {Expense} from "./Expense.tsx";
import {Link, useNavigate} from "react-router-dom";
import type {User} from "./User.tsx";
import { getUserRole } from "../../utils/jwt/jwtUtils.tsx";
import {UserCard} from "./UserCard.tsx";

export function Dashboard(){
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    
    const role = getUserRole();
    const navigate = useNavigate();
    
    useEffect(() => {
        const loadData = async () => {
            const token = authService.getAccessToken();
            if(token == null){
                setError('Token not found!');
                setLoading(false);
                setToken('')
                return;
            }
            setToken(token);
            
            try{
                if(role === "Admin"){
                    const response = await fetch('api/Users', {
                      method: 'GET',
                      headers:{
                          'Authorization': `Bearer ${token}`, 
                          'Content-type': 'application/json'
                        }    
                    });
                    
                    if(!response.ok){
                        throw new Error("No users found!");
                    }
                    
                    const data : any = await response.json();
                    setUsers(data);
                    
                    console.log(`Admin role: ${role}`);
                    
                }else{
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
                    setExpenses(data);

                    console.log(`User role: ${role}`);
                }
                
                
                // console.log("API Response:", data);
                // console.log("First expense:", data[0]);
                
            }catch(err: any){
                setError('Error: ' + err.message);
            }finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [role])

    return (
        <div className={styles.container}>


            <main className={styles.main}>
                {role === "Admin" ? (
                    <>
                        <h3>All Users</h3>

                        {users.length === 0 ? (
                            <p>No users found.</p>
                        ) : (
                            <div className={styles.expensesGrid}>
                                {users.map((user) => (
                                    <UserCard key={user.email} user={user} />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <button>
                            <Link to="/expenses/create">+ New Expense</Link>
                        </button>

                        <h3>My Expenses</h3>

                        {expenses.length === 0 ? (
                            <p>No expenses yet.</p>
                        ) : (
                            <div className={styles.expensesGrid}>
                                {expenses.map((expense) => (
                                    <Link
                                        to={`/expenses/${expense.id}`}
                                        className={styles.expenseLink}
                                        key={expense.id}
                                    >
                                        <ExpenseCard expense={expense} />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}