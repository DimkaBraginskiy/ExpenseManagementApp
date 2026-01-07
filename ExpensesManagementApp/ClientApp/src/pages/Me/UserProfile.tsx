import styles from "./Me.module.css";
import {useEffect, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";
import type {Profile} from "./Profile.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

export function UserProfile(){
    //internationalization
    const { t } = useTranslation();
    
    const { email: paramEmail } = useParams<{ email?: string }>();
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const isOwnProfile = !paramEmail;

    useEffect(() => {
        const loadProfile = async () => {
            const token = authService.getAccessToken();
            if(token == null){
                setError("Token not found");
                setLoading(false);
                setToken('');
                return;
            }
            
            const url = isOwnProfile ? '/api/Users/me' : `/api/Users/${encodeURIComponent(paramEmail!)}`;

            try{
                const response = await fetch(url, {
                    method: 'GET',
                    headers : {
                        'Authorization' : `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    }
                });

                if(!response.ok){
                    if (response.status === 403) throw new Error("Access denied!");
                    if (response.status === 404) throw new Error("User Not found!");
                    throw new Error("Failed to load profile!");
                }

                const data = await response.json();

                console.log("Parsed json: " + data);
                console.log("userName:", data.userName);
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
    }, [paramEmail, isOwnProfile]);

    const formatDate = (dateString: Date | string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleLogout = async () => {
        if (!confirm("Are you sure you want to log out?")) {
            return;
        }

        authService.clearTokens();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        const userDisplay = profile?.UserName || profile?.Email || "this user";
        
        const confirm1 = window.confirm("Are you sure you want to delete your account?");
        if (!confirm1) return;

        const confirm2 = window.confirm(
            "This action CANNOT be undone.\nAll your data will be permanently deleted. Continue?"
        );
        if (!confirm2) return;

        setDeleting(true);
        setDeleteError('');

        const token = authService.getAccessToken();
        if (!token) {
            setDeleteError("You are not authenticated.");
            setDeleting(false);
            return;
        }

        if (!profile?.Email) {
            setDeleteError("Could not determine your email address.");
            setDeleting(false);
            return;
        }

        try {
            const response = await fetch(`/api/Users/${encodeURIComponent(profile.Email)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to delete account");
            }

            
            if(isOwnProfile){
                authService.clearTokens();
                alert("Your account has been successfully deleted.");
                navigate('/login');
            }else{
                alert(`User ${userDisplay} has been successfully deleted`);
                navigate('/');
            }
        } catch (err: any) {
            setDeleteError(err.message || "An error occurred while deleting your account");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.profileContainer}>
                    <h2 className={styles.title}>{isOwnProfile ? t('profileButtons.myProfile') : t('me.userProfile')}</h2>

                    {loading && (
                        <div className={styles.loading}>{t('me.loadingProfile')}</div>
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
                                <h3>{profile.UserName || t('me.noUsername')}</h3>
                            </div>

                            <div className={styles.profileDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>{t('me.username')}</span>
                                    <span className={styles.value}>{profile.UserName || t('me.noUsername')}</span>
                                </div>

                                <div className={styles.detailRow}>
                                    <span className={styles.label}>{t('me.email')}</span>
                                    <span className={styles.value}>{profile.Email || t('me.noEmail')}</span>
                                </div>

                                <div className={styles.detailRow}>
                                    <span className={styles.label}>{t('me.phoneNumber')}</span>
                                    <span className={styles.value}>{profile.PhoneNumber || t('me.noPhoneNumber')}</span>
                                </div>

                                <div className={styles.detailRow}>
                                    <span className={styles.label}>{t('me.memberSince')}</span>
                                    <span className={styles.value}>
                                    {profile.AccountCreationDate
                                        ? formatDate(profile.AccountCreationDate)
                                        : t('me.unknownDate')}
                                </span>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => navigate(isOwnProfile ? '/me/edit' : `/users/${profile.Email}/edit`)}
                                >
                                    {t('profileButtons.editProfile')}
                                </button>
                                <button
                                    className={styles.logoutButton}
                                    onClick={handleLogout}
                                >
                                    {t('profileButtons.logout')}
                                </button>
                                <button
                                    className={styles.logoutButton}
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                    style={{backgroundColor: deleting ? '#ccc' : '#dc3545'}}
                                >
                                    {deleting ? t('profileButtons.deleting') : t('profileButtons.deleteProfile')}
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading && !error && !profile && (
                        <div className={styles.empty}>
                            {t('me.noProfileData')}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}