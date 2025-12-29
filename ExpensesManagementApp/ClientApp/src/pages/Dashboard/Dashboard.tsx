import {useEffect, useState} from "react";

import styles from "./Dashboard.module.css"

export function Dashboard(){
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchExpenses = async () => {
            const token = localStorage.getItem('accessToken');
            if(token == null){
                setError('');
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
                
                
            }catch(err: any){
                setError('Error: ' + err.message);
            }
        };
        fetchExpenses();
    }, [])
    
    return(
       <div className={styles.container}>
           <header className={styles.header}>ok header</header>
           
           <footer className={styles.footer}>ok footer</footer>
       </div>
    );
}