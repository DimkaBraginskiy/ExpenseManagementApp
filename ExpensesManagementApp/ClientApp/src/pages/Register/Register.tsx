import {useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router-dom";

import styles from "./Register.module.css";

export function Register(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState('');


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try{

            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password})
            })

            if(response.ok){
                alert('Registration succeeded')

                setEmail('')
                setPassword('')
                navigate('/login');
            }else{
                alert('Registration failed')
            }

        }catch (error){
            alert('Error:' + error)
            console.error('Error: ' + error)
        }finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>

            <h1 className={styles.title}>Register</h1>

            <form onSubmit={handleRegister} className={styles.form}>
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

                <div>
                    <button
                        type="submit"
                        id="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    )
}