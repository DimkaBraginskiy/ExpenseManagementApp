import type {User} from "./User";
import styles from "./Dashboard.module.css"

interface UserCardProps{
    user: User;
}

export function UserCard({ user } : UserCardProps ){
    const previewName = user?.userName?.length > 10 ? user?.userName?.substring(0,15) + "..." : user?.userName;
    const previewEmail = user?.email?.length > 10 ? user?.email?.substring(0,15) + "..." : user?.email;
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className={styles.userCard}>
            <div className={styles.userHeader}>
                <div className={styles.userNameWrapper}>
                    <h3 className={styles.userName}>
                        {previewName}
                    </h3>
                    <p className={styles.userEmail}>
                        {previewEmail}
                    </p>
                </div>
            </div>

            <div className={styles.userFooter}>
                <span className={styles.userDate}>
                    Joined: {formatDate(user.accountCreationDate)}
                </span>

                {user.phoneNumber && (
                    <span className={styles.userPhone}>
                        📱 {user.phoneNumber}
                    </span>
                )}
            </div>
        </div>
    );
}