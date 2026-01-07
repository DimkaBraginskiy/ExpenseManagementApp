import styles from "./Layout.module.css";
import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {authService} from "../../../services/AuthService.tsx";
import {Me} from "../../pages/Me/Me.tsx";
import logoImage from "../EMA_Logo.png";
import {useTranslation} from "react-i18next";


export function Header(){
    //internationalization
    const { t } = useTranslation();
    
    const[userInitial, setUserInitial] = useState('U');
    const navigate = useNavigate();

    

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
                    // console.log("Name: " + name);
                    
                    
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

    const handleLogout = () => {
        if (!confirm("Are you sure you want to log out?")) {
            return;
        }

        authService.clearTokens();
        navigate('/login');  
    };
    
    
    
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo}>
                    <img
                        src={logoImage}
                        alt="Expense Manager Logo"
                        className={styles.logoImage}
                    />
                </Link>

                <div className={styles.headerRight}>
                    <div className={styles.avatarDropdown}>
                        <div className={styles.avatar}>
                            {userInitial}
                        </div>

                        <div className={styles.dropdownMenu}>
                            <Link to="/me" className={styles.dropdownItem}>
                                {t('profileButtons.myProfile')}
                            </Link>
                            <Link to="/me/edit" className={styles.dropdownItem}>
                                {t('profileButtons.editProfile')}
                            </Link>
                            <button onClick={handleLogout} className={styles.dropdownItem}>
                                {t('profileButtons.logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}