import {useState} from "react";

import * as React from "react";
import {useNavigate} from "react-router-dom";
import {authService} from "../../services/AuthService.tsx";

import styles from "../PagesStyles.module.css"

export function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [error, setError] = useState('');


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try{

            const response = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password})
            })
            

            if(response.ok){
                alert('Login succeeded')

                const loginData = await response.json();
                
                authService.saveToken(loginData.token, loginData.refreshToken);
                
                setEmail('')
                setPassword('')
                
                navigate('/dashboard');
            }else{
                alert('Login failed')
            }

        }catch (error){
            alert('Error:' + error)
            console.error('Error: ' + error)
        }finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}> {/* Use styles.className */}
            <h1 className={styles.title}>Welcome Back</h1>

            <form onSubmit={handleLogin} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    className={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div
                    className={styles.link}
                    onClick={() => navigate('/register')}
                >
                    Don't have an account? Sign up
                </div>
            </form>
        </div>
    )
}