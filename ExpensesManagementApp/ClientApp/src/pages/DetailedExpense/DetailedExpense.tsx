import styles from './DetailedExpense.module.css'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Expense} from "../Dashboard/Expense.tsx";
import {authService} from "../../../services/AuthService.tsx";
import {ProductCard} from "./ProductCard.tsx";

export function DetailedExpense(){
    const navigate = useNavigate();
    const { id } = useParams<{ id : string }>();
    const [expense, setExpense] = useState<Expense | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const loadExpense = async () => {
            if(!id){
                setError("Expense could not be loaded");
                setLoading(false);
                return;
            }
            // console.log("id: " + id);

            const token = authService.getAccessToken();
            if(token == null){
                setError('Token not found!');
                setLoading(false);
                setToken('')
                return;
            }
            setToken(token);
            // console.log("token: " + token);

            try{
                
                const response = await fetch(`/api/Expenses/id/${id}`, {
                    method: 'GET',
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    }
                });

                // console.log("Response status:", response.status);
                // console.log("Response status text:", response.statusText);

                if(!response.ok){
                    // console.log(`Failed to load expense: ${response.status}`);
                    throw new Error(`Failed to load expense: ${response.status}`);
                }

                // console.log("Parsing json...");
                const data = await response.json();
                
                // console.log("date: " + data.date);
                // console.log("description: " + data.description);
                
                setExpense(data);
            }catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        
        loadExpense();
    }, [id]);

    const handleDelete = async () => {
        if(!window.confirm("Are you sure you want to delete that Expense? \nThis action can not be reverted!"))
            return
        
        if(!id || !token)
            return;
        
        try{
            const response = await fetch(`/api/Expenses/id/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                throw new Error("Could not delete expense: " + errorData.error);
            }

            navigate('/');
        }catch(error : any) {
            setError("Could not delete expense: " + error.message);
        }
        
        
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    
    const calculateProductsTotal = () => {
        if(!expense?.products) return 0;
        
        return expense.products.reduce((total, product) => 
            total + (product.quantity * product.price), 0); 
    }
    
    if(loading){
        return(
            <div className={styles.container}>
                <div className={styles.main}>
                    <div className={styles.loading}>
                        Loading expense details...
                    </div>
                </div>
            </div>
        );
    }
    
    if(error){
        return(
            <div className={styles.container}>
                <div className={styles.main}>
                    <div className={styles.error}>
                        Error: {error}
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!expense) {
        return (
            <div className={styles.container}>
                <div className={styles.main}>
                    <div className={styles.error}>
                        Expense not found
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }
    
    console.log("Expense: " + expense);

    const productsTotal = calculateProductsTotal();

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.headerActions}>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        Go Back
                    </button>
                    <button onClick={handleDelete} className={styles.deleteButton}>
                        Delete Expense
                    </button>
                    <button
                        onClick={() => navigate(`/expenses/${id}/edit`)}
                        className={styles.editButton}
                    >
                        Edit Expense
                    </button>
                </div>


                <div className={styles.expenseDetails}>
                    <h2>Expense Details</h2>

                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Description:</span>
                        <span className={styles.detailValue}>{expense.description}</span>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Date:</span>
                        <span className={styles.detailValue}>{expense.date}</span>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Total Amount:</span>
                        <span className={styles.detailValue}>
                            ${expense.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Category:</span>
                        <span className={styles.detailValue}>
                            {expense.category?.name || 'N/A'}
                        </span>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Issuer:</span>
                        <span className={styles.detailValue}>
                            {expense.issuer?.name || 'N/A'}
                        </span>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Currency:</span>
                        <span className={styles.detailValue}>
                            {expense.currency?.name || 'N/A'}
                        </span>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Products Total:</span>
                        <span className={styles.detailValue}>
                            {productsTotal}
                        </span>
                    </div>
                </div>

                {expense.products && expense.products.length > 0 && (
                    <div className={styles.productsSection}>
                        <h3>Products ({expense.products.length})</h3>
                        {expense.products.map((product, index) => (
                            <ProductCard key={index} product={product}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

