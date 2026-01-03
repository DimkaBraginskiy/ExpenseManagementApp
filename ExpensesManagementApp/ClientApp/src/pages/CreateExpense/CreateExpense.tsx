import styles from "./CreateExpense.module.css";
import {useNavigate} from "react-router-dom";

export function CreateExpense() {
    const navigate = useNavigate();
    
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    Go Back
                </button>
                <h3>Create Expense</h3>

                <div className={styles.expenseCard}>

                    {/* Expense details */}
                    <div className={styles.expenseDetails}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Date</span>
                            <input
                                type="datetime-local"
                                className={styles.detailValue}
                            />
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Description</span>
                            <input
                                type="text"
                                className={styles.detailValue}
                                placeholder="Expense description"
                            />
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Category</span>
                            <input
                                type="text"
                                className={styles.detailValue}
                                placeholder="Category name"
                            />
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Issuer</span>
                            <input
                                type="text"
                                className={styles.detailValue}
                                placeholder="Issuer name"
                            />
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Currency</span>
                            <input
                                type="text"
                                className={styles.detailValue}
                                placeholder="Currency code"
                            />
                        </div>
                    </div>

                    <div className={styles.productsSection}>
                        <h3>Products</h3>

                        <div className={styles.productCard}>
                            <div className={styles.productHeader}>
                                <h4 className={styles.productName}>
                                    Product
                                </h4>
                                <span className={styles.productSubtotal}>
                                    0.00
                                </span>
                            </div>

                            <div className={styles.productDetails}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Name</span>
                                    <input
                                        type="text"
                                        className={styles.detailValue}
                                        placeholder="Product Name"
                                    />
                                </div>

                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Price Per Item</span>
                                    <input
                                        type="number"
                                        className={styles.detailValue}
                                        placeholder="Price"
                                    />
                                </div>

                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Quantity</span>
                                    <input
                                        type="number"
                                        className={styles.detailValue}
                                        placeholder="Quantity"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className={styles.productCard}>
                            <button className={styles.addProductButton}>
                                + Add product
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
