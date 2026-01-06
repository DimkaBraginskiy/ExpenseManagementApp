import {useEffect, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";

import styles from "./Dashboard.module.css";
import {ExpenseCard} from "./ExpenseCard.tsx";
import type {Expense} from "./Expense.tsx";
import {Link, useNavigate} from "react-router-dom";
import type {User} from "./User.tsx";
import { getUserRole } from "../../utils/jwt/jwtUtils.tsx";
import {UserCard} from "./UserCard.tsx";

export function Dashboard() {
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    //guest variables
    const expenseCount = expenses.length;
    const isLimitReached = expenseCount >= 10;

    const role = getUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const token = authService.getAccessToken();

            if (!token) {
                setLoading(false);
                return;
            }

            setToken(token);

            try {
                if (role === "Admin") {
                    const response = await fetch('api/Users', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error("No users found!");
                    }

                    const data: any = await response.json();
                    setUsers(data);

                    console.log(`Admin role: ${role}`);

                } else {
                    const response = await fetch('api/Expenses', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        if (response.status === 400 && role === "Guest") {
                            setExpenses([]);
                        } else {
                            throw new Error('No expenses found');
                        }
                    } else {
                        const data = await response.json();
                        setExpenses(data);
                    }

                    console.log(`User role: ${role}`);
                }

                // console.log("API Response:", data);
                // console.log("First expense:", data[0]);

            } catch (err: any) {
                setError('Error: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [role])

    if (loading) {
        return
        <div className={styles.container}>
            <main className={styles.main}>
                <p>Loading...</p>
            </main>
        </div>;
    }

    if (error) {
        return
        <div className={styles.container}>
            <main className={styles.main}>
                <p className={styles.error}>{error}</p>
            </main>
        </div>;
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {/* Not logged in - Welcome page */}
                {!authService.getAccessToken() && (
                    <div className={styles.container}>
                        <main className={styles.main}>
                            <h2>Welcome to Expense Management App!</h2>
                            <p>Track your expenses easily and for free.</p>

                            <div className={styles.actions} style={{margin: '30px 0'}}>
                                <button
                                    onClick={() => navigate('/login')}
                                    style={{marginRight: '10px'}}
                                >
                                    Log In
                                </button>
                                <button onClick={() => navigate('/register')}>
                                    Register
                                </button>
                            </div>

                            <p>Or try it instantly without registration:</p>
                            <Link to="/expenses/create">
                                <button style={{fontSize: '1.2em', padding: '15px 30px'}}>
                                    Start Free Trial (10 expenses, 3 days)
                                </button>
                            </Link>

                            <p style={{marginTop: '20px', color: '#666', fontSize: '0.9em'}}>
                                No sign-up needed. We'll create a temporary session when you add your first expense.
                            </p>
                        </main>
                    </div>
                )}

                {/* Guest user */}
                {role === "Guest" && (
                    <div className={styles.container}>
                        <main className={styles.main}>
                            <h2>Hi Guest!</h2>
                            <p>You're using a <strong>free trial</strong>:</p>

                            <ul style={{textAlign: 'left', maxWidth: '400px', margin: '20px auto'}}>
                                <li>Add up to <strong>10 expenses</strong></li>
                                <li>Valid for <strong>3 days</strong></li>
                                <li>No registration needed but highly encouraged</li>
                            </ul>

                            <div className={styles.actions} style={{margin: '30px 0'}}>
                                <button
                                    onClick={() => navigate('/login')}
                                    style={{marginRight: '10px'}}
                                >
                                    Log In
                                </button>
                                <button onClick={() => navigate('/register')}>
                                    Register for Full Access
                                </button>
                            </div>

                            <div style={{margin: '20px 0'}}>
                                <Link to="/expenses/create">
                                    <button disabled={isLimitReached}>
                                        + Add Expense ({expenseCount}/10)
                                    </button>
                                </Link>

                                {isLimitReached && (
                                    <p style={{color: 'red', marginTop: '10px'}}>
                                        Limit reached! Register to add more.
                                    </p>
                                )}
                            </div>

                            {expenseCount > 0 ? (
                                <>
                                    <h3>Your Trial Expenses</h3>
                                    <div className={styles.expensesGrid}>
                                        {expenses.map((expense) => (
                                            <Link
                                                to={`/expenses/${expense.id}`}
                                                className={styles.expenseLink}
                                                key={expense.id}
                                            >
                                                <ExpenseCard expense={expense}/>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p>No expenses yet. Click above to add your first one!</p>
                            )}
                        </main>
                    </div>
                )}

                {/* Admin user */}
                {role === "Admin" && (
                    <div className={styles.container}>
                        <main className={styles.main}>
                            <h3>All Users</h3>

                            {users.length === 0 ? (
                                <p>No users found.</p>
                            ) : (
                                <div className={styles.expensesGrid}>
                                    {users.map((user) => (
                                        <UserCard key={user.email} user={user}/>
                                    ))}
                                </div>
                            )}
                        </main>
                    </div>
                )}

                {/* Regular user */}
                {role === "User" && (
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
                                        <ExpenseCard expense={expense}/>
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