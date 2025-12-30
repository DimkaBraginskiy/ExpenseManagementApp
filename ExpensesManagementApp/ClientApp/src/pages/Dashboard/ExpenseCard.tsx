import styles from "./Dashboard.module.css"
import type {Expense} from "./Expense.tsx";


interface ExpenseCardProps {
    expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
    return (
        <div className={styles.expenseCard}>
            <div className={styles.expenseHeader}>
                <h3 className={styles.expenseDescription}>{expense.description}</h3>
                <span className={styles.expenseAmount}>
                    {expense.totalAmount.toFixed(2)}
                    {/* Add currency display if needed */}
                    {` ${expense.currency?.name}`}
                </span>
            </div>

            <div className={styles.expenseFooter}>
                <span className={styles.expenseDate}>
                    {new Date(expense.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
                {expense.category && (
                    <span className={styles.expenseCategory}>
                        {expense.category.name}  {/* Access the name property */}
                    </span>
                )}
            </div>

            {/* Optional: Show issuer if needed */}
            {expense.issuer && (
                <div className={styles.expenseIssuer}>
                    Issuer: {expense.issuer.name}
                </div>
            )}
        </div>
    );
}