import styles from "./Layout.module.css";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {authService} from "../../../services/AuthService.tsx";


export function Header(){
    const[userInitial, setUserInitial] = useState('U');

    useEffect(() => {
        const loadUserInfo = async () => {
            const token = authService.getAccessToken();
            
            if(!token) return;
            
            try{

                const response = await fetch('/api/Users/me', {
                    method: 'GET',
                    headers : {
                        'Authorization' : `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    }
                });
                
                if(response.ok){
                    const data = await response.json();
                    const name = data.userName;
                    console.log("Name: " + name);
                    
                    
                    if(name.length!=0){
                        setUserInitial(name.charAt(0).toUpperCase());
                    }
                }
                
            }catch(error){
                console.error(error);
            }
        };
        
        loadUserInfo();
    }, []);
    
    
    
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo}>
                    Expense Manager
                </Link>
                
                <div className={styles.headerRight}>
                    <Link to="/me" className={styles.avatarLink}>
                        <div className={styles.avatar}>
                            {userInitial}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}