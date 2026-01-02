import styles from "./Me.module.css";
import {useEffect, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";
import type {Profile} from "./Profile.tsx";

export function Me(){
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const token = authService.getAccessToken();
            if(token == null){
                setError("Token not found");
                setLoading(false);
                setToken('');
                return;
            }

            try{
                const response = await fetch('/api/Users/me', {
                    method: 'GET',
                    headers : {
                        'Authorization' : `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    }
                });

                if(!response.ok){
                    throw new Error("User profile not found");
                }

                const data = await response.json();
                
                console.log("Parsed json: " + data);
                console.log("userName:", data.userName);  // Should be "test@gmail.com"
                console.log("email:", data.email);
                console.log("phoneNumber:", data.phoneNumber);
                
                const profileData : Profile = {
                    UserName : data.userName,
                    Email : data.email,
                    PhoneNumber : data.phoneNumber,
                    AccountCreationDate : data.accountCreationDate
                };
                
                setProfile(profileData);
            }catch(err : any){
                setError('Error: ' + err.message);
            }finally {
                setLoading(false);
            }    
        };
        
        loadProfile();
    }, []);

    const formatDate = (dateString: Date | string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.profileContainer}>
                    <h2 className={styles.title}>My Profile</h2>

                    {loading && (
                        <div className={styles.loading}>Loading profile...</div>
                    )}

                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}

                    {!loading && !error && profile && (
                        <div className={styles.profileCard}>
                            <div className={styles.profileHeader}>
                                <div className={styles.avatar}>
                                    {profile.UserName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <h3>{profile.UserName || 'No username'}</h3>
                            </div>

                            <div className={styles.profileDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>Email:</span>
                                    <span className={styles.value}>{profile.Email || 'No email'}</span>
                                </div>

                                <div className={styles.detailRow}>
                                    <span className={styles.label}>Phone:</span>
                                    <span className={styles.value}>{profile.PhoneNumber || 'No phone number'}</span>
                                </div>

                                <div className={styles.detailRow}>
                                    <span className={styles.label}>Member Since:</span>
                                    <span className={styles.value}>
                                        {profile.AccountCreationDate
                                            ? formatDate(profile.AccountCreationDate)
                                            : 'Unknown date'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.editButton}>Edit Profile</button>
                                <button className={styles.logoutButton}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading && !error && !profile && (
                        <div className={styles.empty}>
                            No profile data found.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}