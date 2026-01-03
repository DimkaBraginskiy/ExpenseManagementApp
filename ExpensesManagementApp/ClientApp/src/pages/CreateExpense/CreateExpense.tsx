import styles from "./CreateExpense.module.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export function CreateExpense() {
    const navigate = useNavigate();
    const [expense, setExpense] = useState({
        date: "",
        description: "",
        category: "",
        issuer: "",
        currency: "",
        products: [
            {
                name: "",
                price: 0,
                quantity: 1
            }
        ]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateExpense = () => {
        const newErrors: Record<string, string> = {};

        // Date
        if (!expense.date)
            newErrors.date = "Date is required";
        else if (expense.date > new Date().toISOString())
            newErrors.date = "Date cannot be in the future";

        // Description
        if (expense.description.trim().length < 5)
            newErrors.description = "Minimum 5 characters required";
        else if (expense.description.trim().length > 100)
            newErrors.description = "Maximum 100 characters allowed";

        // Category
        if (!expense.category)
            newErrors.category = "Category is required";

        // Issuer
        if (!expense.issuer)
            newErrors.issuer = "Issuer is required";

        // Currency
        if (!/^[A-Z]{3}$/.test(expense.currency))
            newErrors.currency = "Currency must be a 3-letter ISO code";

        // Products
        expense.products.forEach((product, index) => {
            if (!product.name)
                newErrors[`products.${index}.name`] = "Product name is required";
            else if (product.name.length < 2)
                newErrors[`products.${index}.name`] = "Minimum 2 characters required";

            if (!product.price || product.price <= 0)
                newErrors[`products.${index}.price`] = "Price must be greater than 0";

            if (!product.quantity || product.quantity <= 0)
                newErrors[`products.${index}.quantity`] = "Quantity must be at least 1";
        });

        return newErrors;
    };


    const handleSubmit = () => {
        const validationErrors = validateExpense();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0)
            return;

        console.log("Expense is valid:", expense);
    };
    
    
    
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
                                max={new Date().toISOString().slice(0,16)}
                                className={styles.detailValue}
                                
                                value={expense.date}
                                onChange={e =>
                                    setExpense({ ...expense, date: e.target.value })
                                }
                            />
                            
                            {errors.date && (
                                <div className={styles.errorText}>{errors.date}</div>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Description</span>
                            <input
                                type="text"
                                maxLength={100}
                                minLength={5}
                                className={styles.detailValue}
                                placeholder="Expense description"
                                required
                                
                                value={expense.description}
                                onChange={e => 
                                    setExpense({ ...expense, description: e.target.value})
                                }
                            />

                            {errors.description && (
                                <div className={styles.errorText}>{errors.description}</div>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Category</span>
                            <input
                                type="text"
                                minLength={3}
                                maxLength={50}
                                className={styles.detailValue}
                                placeholder="Category name"
                                required
                                
                                value={expense.category}
                                onChange={e =>
                                    setExpense({ ...expense, category: e.target.value })
                                }
                            />

                            {errors.category && (
                                <div className={styles.errorText}>{errors.category}</div>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Issuer</span>
                            <input
                                type="text"
                                minLength={3}
                                maxLength={50}
                                className={styles.detailValue}
                                placeholder="Issuer name"
                                required
                                
                                value={expense.issuer}
                                onChange={e =>
                                    setExpense({ ...expense, issuer: e.target.value })
                                }
                            />

                            {errors.issuer && (
                                <div className={styles.errorText}>{errors.issuer}</div>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Currency</span>
                            <input
                                type="text"
                                required
                                pattern="[A-Z]{3}"
                                title="3-letter ISO currency code (e.g. USD)"
                                className={styles.detailValue}
                                placeholder="USD"

                                value={expense.currency}
                                onChange={e =>
                                    setExpense({
                                        ...expense,
                                        currency: e.target.value.toUpperCase()
                                    })
                                }
                            />

                            {errors.currency && (
                                <div className={styles.errorText}>{errors.currency}</div>
                            )}
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
                                        minLength={2}
                                        maxLength={50}
                                        className={styles.detailValue}
                                        placeholder="Product Name"

                                        value={expense.products[0].name}
                                        onChange={e => {
                                            const products = [...expense.products];
                                            products[0].name = e.target.value;
                                            setExpense({...expense, products});
                                        }}
                                    />

                                    {errors["products.0.name"] && (
                                        <div className={styles.errorText}>
                                            {errors["products.0.name"]}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Price Per Item</span>
                                    <input
                                        type="number"
                                        required
                                        min={0.01}
                                        step={0.01}
                                        className={styles.detailValue}
                                        placeholder="Price"

                                        value={expense.products[0].price}
                                        onChange={e => {
                                            const products = [...expense.products];
                                            products[0].price = Number(e.target.value);
                                            setExpense({...expense, products});
                                        }}
                                    />

                                    {errors["products.0.price"] && (
                                        <div className={styles.errorText}>
                                            {errors["products.0.price"]}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Quantity</span>
                                    <input
                                        type="number"
                                        required
                                        min={1}
                                        step={1}
                                        className={styles.detailValue}
                                        placeholder="Quantity"

                                        value={expense.products[0].quantity}
                                        onChange={e => {
                                            const products = [...expense.products];
                                            products[0].quantity = Number(e.target.value);
                                            setExpense({...expense, products});
                                        }}
                                    />

                                    {errors["products.0.quantity"] && (
                                        <div className={styles.errorText}>
                                            {errors["products.0.quantity"]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className={styles.productCard}>
                            <button className={styles.addProductButton}>
                                + Add product
                            </button>
                        </div>
                        
                        <button
                            className={styles.addProductButton}
                            onClick={handleSubmit}
                        >
                            Create Expense
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
