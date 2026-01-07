import {use, useCallback, useEffect, useRef, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";

import styles from "./Dashboard.module.css";
import {ExpenseCard} from "./ExpenseCard.tsx";
import type {Expense} from "./Expense.tsx";
import {Link, useNavigate} from "react-router-dom";
import type {User} from "./User.tsx";
import { getUserRole } from "../../utils/jwt/jwtUtils.tsx";
import {UserCard} from "./UserCard.tsx";
import {useTranslation} from "react-i18next";

export function Dashboard() {
    //internationalization
    const { t } = useTranslation();
    
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    // Admin/User/Guest containers
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    
    //sorting variables:
    const [sortBy, setSortBy] = useState<"date" | "description">("date"); 
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [groupBy, setGroupBy] = useState<"none" | "category" | "currency">("none");
    const [dateRange, setDateRange] = useState<"" | "week" | "month" | "year">("");
    
    //scrolling pagination variables
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;
    
    //guest variables
    const expenseCount = expenses.length;
    const isLimitReached = expenseCount >= 10;

    const role = getUserRole();
    const navigate = useNavigate();
    const observer = useRef<IntersectionObserver | null>(null);
    
    
    //Handling infinite scrolling (scrolling pagination)
    const lastExpenseRef = useCallback(
        (node: HTMLDivElement | null) => {
            if(loading || loadingMore || !hasMore) return;
            if(observer.current) observer.current.disconnect();
            
            observer.current = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting && hasMore){
                    setPage((prev) => prev + 1);
                }
            });
            
            if(node) observer.current.observe(node);
        }  ,
        [loading, loadingMore, hasMore]
    );
    
    const fetchExpenses = async (pageNum: number, append = false) => {
        const token = authService.getAccessToken();

        if (!token) {
            setLoading(false);
            return;
        }


        try{
            if(pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await fetch(
                `/api/Expenses?page=${pageNum}&pageSize=${pageSize}` +
                `&sortBy=${sortBy}&sortDir=${sortDir}&dateRange=${dateRange}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 404 || response.status === 400) {
                    if (pageNum === 1) {
                        setExpenses([]);
                        setTotalCount(0);
                    }
                    setHasMore(false);
                    return;
                }
                throw new Error("Failed to load expenses");
            }

            const data = await response.json();
            
            if(append){
                setExpenses((prev) => [...prev, ...data.items]);
            }else{
                setExpenses(data.items);
            }
            
            setTotalCount(data.totalCount);
            setHasMore(data.pageNumber < data.totalPages);
        }catch(error: any){
            setError("Error loading expenses: " + error.message);
        }finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    const groupedExpenses = (() => {
        if (groupBy === "none") {
            return { All: expenses };
        }

        return expenses.reduce((acc, expense) => {
            //grouping either by category or currency:
            const key =
                groupBy === "category"
                    ? expense.category.name
                    : expense.currency.code;

            acc[key] = acc[key] || [];
            acc[key].push(expense);
            return acc;
        }, {} as Record<string, Expense[]>);
    })();

    useEffect(() => {
        setExpenses([]);
        setPage(1);
        setHasMore(true);
        fetchExpenses(1, false);
    }, [sortBy, sortDir, dateRange]);

    useEffect(() => {
        const loadData = async () => {
            const token = authService.getAccessToken();

            if (!token) {
                setLoading(false);
                return;
            }

            
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
                    setExpenses([]);
                    setPage(1);
                    setHasMore(true);
                    setTotalCount(0);
                    await fetchExpenses(1, false);

                    console.log(`User role: ${role}`);
            }
            // console.log("API Response:", data);
            // console.log("First expense:", data[0]);
            
        };

        loadData();
    }, [role])

    //Pagination load:
    useEffect(() => {
        if(page > 1){
            fetchExpenses(page, true);
        }
    }, [page]);
    
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

                {role !== "Admin" && (
                    <div className={styles.filters}>
                        <h3>{t('filters.sortBy')}</h3>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                            <option value="date">{t('filters.date')}</option>
                            <option value="description">{t('filters.description')}</option>
                        </select>

                        <select value={sortDir} onChange={e => setSortDir(e.target.value as any)}>
                            <option value="desc">{t('filters.newest')}</option>
                            <option value="asc">{t('filters.oldest')}</option>
                        </select>

                        <h3>{t('filters.groupBy')}</h3>
                        <select value={groupBy} onChange={e => setGroupBy(e.target.value as any)}>
                            <option value="none">{t('filters.noGrouping')}</option>
                            <option value="category">{t('filters.groupByCategory')}</option>
                            <option value="currency">{t('filters.groupByCurrency')}</option>
                        </select>

                        <select value={dateRange} onChange={e => setDateRange(e.target.value as any)}>
                            <option value="">{t('filters.allTime')}</option>
                            <option value="week">{t('filters.lastWeek')}</option>
                            <option value="month">{t('filters.lastMonth')}</option>
                            <option value="year">{t('filters.lastYear')}</option>
                        </select>
                    </div>
                )}

                {/* Not logged in - Welcome page */}
                {!authService.getAccessToken() && (
                    <div className={styles.container}>
                        <main className={styles.main}>
                            <h2>{t('dashboard.welcomeMessage')}</h2>
                            <p>{t('dashboard.welcomeSubMessage')}</p>

                            <div className={styles.actions} style={{margin: '30px 0'}}>
                                <button
                                    onClick={() => navigate('/login')}
                                    style={{marginRight: '10px'}}
                                >
                                    {t('dashboard.logInButton')}
                                </button>
                                <button onClick={() => navigate('/register')}>
                                    {t('dashboard.registerButton')}
                                </button>
                            </div>

                            <p>{t('dashboard.welcomeOrMessage')}</p>
                            <Link to="/expenses/create">
                                <button style={{fontSize: '1.2em', padding: '15px 30px'}}>
                                    {t('dashboard.freeTrialButton')}
                                </button>
                            </Link>

                            <p style={{marginTop: '20px', color: '#666', fontSize: '0.9em'}}>
                                {t('dashboard.noSignUpText')}
                            </p>
                        </main>
                    </div>
                )}

                {/* Guest user */}
                {(role === "User" || role === "Guest") && (
                    <>
                        {/* Add Expense button & guest messages */}
                        {role === "Guest" && (
                            <>
                                <h2>{t('dashboard.guestWelcome')}</h2>
                                <p dangerouslySetInnerHTML={{__html: t('dashboard.guestTrialDescription')}}></p>
                                <ul style={{textAlign: 'left', maxWidth: '400px'}}>
                                    <li dangerouslySetInnerHTML={{__html: t('dashboard.guestTrialLimit1')}}></li>
                                    <li dangerouslySetInnerHTML={{__html: t('dashboard.guestTrialLimit2')}}></li>
                                </ul>
                                <div className={styles.actions}>
                                    <button onClick={() => navigate('/login')}>
                                        {t('dashboard.guestLoginButton')}
                                    </button>
                                    <button onClick={() => navigate('/register')}>
                                        {t('dashboard.guestRegisterButton')}
                                    </button>
                                </div>
                            </>
                        )}

                        <div style={{margin: '20px 0'}}>
                            <Link to="/expenses/create">
                                <button disabled={role === "Guest" && isLimitReached}>
                                    {t('dashboard.addExpenseButton')} {role === "Guest" && `(${totalCount}/10)`}
                                </button>
                            </Link>
                            {role === "Guest" && isLimitReached && (
                                <p style={{color: 'red', marginTop: '10px'}}>
                                    {t('dashboard.limitReachedMessage')}
                                </p>
                            )}
                        </div>

                        <h3>
                            {role === "Guest" ? t('dashboard.trialExpensesTitle') : t("dashboard.title")}
                        </h3>

                        {expenses.length === 0 ? (
                            <p>{t('dashboard.firstExpensePrompt')}</p>
                        ) : groupBy !== "none" ? (
                            // Grouped view
                            Object.entries(groupedExpenses).map(([group, items]) => (
                                <section key={group}>
                                    <h3>{group}</h3>
                                    <div className={styles.expensesGrid}>
                                        {items.map((expense, index) => (
                                            <div
                                                key={expense.id}
                                                ref={index === items.length - 1 ? lastExpenseRef : null}
                                            >
                                                <Link to={`/expenses/${expense.id}`} className={styles.expenseLink}>
                                                    <ExpenseCard expense={expense} />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            // Flat view
                            <div className={styles.expensesGrid}>
                                {expenses.map((expense, index) => (
                                    <div
                                        key={expense.id}
                                        ref={index === expenses.length - 1 ? lastExpenseRef : null}
                                    >
                                        <Link to={`/expenses/${expense.id}`} className={styles.expenseLink}>
                                            <ExpenseCard expense={expense}/>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Loading indicator at bottom */}
                        {loadingMore && (
                            <div style={{textAlign: 'center', padding: '20px'}}>
                                <p>{t('dashboard.loadingExpenses')}</p>
                            </div>
                        )}

                        {/* End of list message */}
                        {!hasMore && expenses.length > 0 && (
                            <div style={{textAlign: 'center', padding: '30px', color: '#666'}}>
                                <p>{t('dashboard.endOfList')}</p>
                            </div>
                        )}
                    </>
                )}

                {/* Admin user */}
                {role === "Admin" && (
                    <div className={styles.container}>
                        <main className={styles.main}>
                            <h3>{t('admin.allUsers')}</h3>

                            {users.length === 0 ? (
                                <p>{t('admin.noUsersFound')}</p>
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
            </main>
        </div>
    );
}