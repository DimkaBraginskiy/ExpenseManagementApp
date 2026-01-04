import {useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router-dom";

import styles from "./Register.module.css";

export function Register(){
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        general: ''
    })

    const validateUsername = (username: string): boolean => {
        let isValid = true;
        const newErrors = {...errors};

        if (username.includes(' ')) {
            newErrors.username = 'Username cannot contain spaces';
            isValid = false;
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            isValid = false;
        } else if (username.length > 20) {
            newErrors.username = 'Username cannot exceed 20 characters';
            isValid = false;
        } else {
            newErrors.username = '';
        }

        setErrors(newErrors);
        return isValid; // FIXED: Return the actual validation result
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);

        if (value.trim() !== '') {
            validateUsername(value);
        } else {
            setErrors(prev => ({...prev, username: ''}));
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        // Clear email error when user starts typing
        if (errors.email) {
            setErrors(prev => ({...prev, email: ''}));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        // Clear password error when user starts typing
        if (errors.password) {
            setErrors(prev => ({...prev, password: ''}));
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({username: '', email: '', password: '', general: ''});

        if (!validateUsername(username)) {
            setIsLoading(false);
            return;
        }

        try{
            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password
                })
            })

            if(response.ok){
                alert('Registration succeeded')
                setUsername('')
                setEmail('')
                setPassword('')
                navigate('/login');
            } else {
                const errorData = await response.json();

                if (errorData.error && typeof errorData.error === 'string') {
                    if (errorData.error.toLowerCase().includes('email')) {
                        setErrors(prev => ({...prev, email: errorData.error}));
                    } else if (errorData.error.toLowerCase().includes('username')) {
                        setErrors(prev => ({...prev, username: errorData.error}));
                    } else if (errorData.error.toLowerCase().includes('password')) {
                        setErrors(prev => ({...prev, password: errorData.error}));
                    } else {
                        setErrors(prev => ({...prev, general: errorData.error}));
                    }
                } else {
                    setErrors(prev => ({...prev, general: 'Registration failed. Please try again.'}));
                }
            }

        } catch (error: any) {
            setErrors(prev => ({...prev, general: 'Network error: ' + error.message}));
            console.error('Error: ' + error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>

            <h1 className={styles.title}>Register</h1>

            {errors.general && (
                <div className={styles.serverError}>
                    <span className={styles.errorIcon}>⚠️</span>
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleRegister} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.label}>
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className={`${styles.input} ${errors.username ? styles.inputError : ''}`} // FIXED
                        value={username}
                        onChange={handleUsernameChange}
                        required
                        placeholder="ExpenseManager"
                        minLength={3}
                        maxLength={20}
                        pattern="^[a-zA-Z0-9._-]+$"
                        title="Username can only contain letters, numbers, dots, hyphens and underscores"
                    />
                    {errors.username && <div className={styles.error}>{errors.username}</div>} {/* FIXED */}
                    <small className={styles.helpText}>
                        Username must be 3-20 characters, no spaces allowed
                    </small>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`} // ADDED error class
                        value={email}
                        onChange={handleEmailChange}
                        required
                        placeholder="you@example.com"
                    />
                    {errors.email && <div className={styles.error}>{errors.email}</div>} {/* ADDED */}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`} // ADDED error class
                        value={password}
                        onChange={handlePasswordChange} // UPDATED
                        required
                        placeholder="Enter your password"
                        minLength={6}
                    />
                    {errors.password && <div className={styles.error}>{errors.password}</div>} {/* ADDED */}
                    <small className={styles.helpText}>
                        Password must be at least 6 characters
                    </small>
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
    );
}