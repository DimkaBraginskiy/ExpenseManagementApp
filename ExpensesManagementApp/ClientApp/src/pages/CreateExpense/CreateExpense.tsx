import styles from "./CreateExpense.module.css";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";

export function CreateExpense() {
    const navigate = useNavigate();
    const [expense, setExpense] = useState({
        date: "",
        description: "",
        categoryId: "",
        issuerId: "",
        currencyId: "",
        products: [
            {
                name: "",
                price: 0,
                quantity: 1
            }
        ]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [issuers, setIssuers] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try{
                setLoadingOptions(true);
                
                const [categoryRes, currencyRes, issuerRes] = await Promise.all([
                    fetch("/api/category"),
                    fetch("/api/Currency"),
                    fetch("/api/Issuer")
                ]);

                const cats = await categoryRes.json();
                const iss = await issuerRes.json();
                const curs = await currencyRes.json();
                
                setCategories(cats);
                setIssuers(iss);
                setCurrencies(curs);
            }catch(error : any){
                console.log("Failed to load options: " + error.message)
            }finally {
                setLoadingOptions(false);
            }
        };
        
        fetchOptions();
    }, []);
    
    
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
        if (!expense.categoryId)
            newErrors.category = "Category is required";

        // Issuer
        if (!expense.issuerId)
            newErrors.issuer = "Issuer is required";

        // Currency
        if (!expense.currencyId)
            newErrors.currency = "Currency is required";

        // Products
        expense.products.forEach((product, index) => {
            const trimmedName = product.name.trim();

            if (!trimmedName) {
                newErrors[`products.${index}.name`] = "Product name is required";
            } else if (trimmedName.length < 2) {
                newErrors[`products.${index}.name`] = "Minimum 2 characters required";
            }

            if (!product.price || product.price <= 0) {
                newErrors[`products.${index}.price`] = "Price must be greater than 0";
            }

            if (!product.quantity || product.quantity <= 0) {
                newErrors[`products.${index}.quantity`] = "Quantity must be at least 1";
            }
        });

        return newErrors;
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === Number(id) || c.id === id);
        return cat ? cat.name : "";
    };

    const getIssuerName = (id) => {
        const iss = issuers.find(i => i.id === Number(id) || i.id === id);
        return iss ? iss.name : "";
    };

    const getCurrencyName = (id) => {
        const cur = currencies.find(c => c.id === Number(id) || c.id === id);
        return cur ? cur.name : "";
    };


    const handleSubmit = async () => {
        const validationErrors = validateExpense();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0)
            return;

        const token = await authService.getAccessToken();
        
        try {
            const response = await fetch("/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: new Date(expense.date).toISOString(),
                    description: expense.description,
                    category: { name: getCategoryName(expense.categoryId) },
                    issuer: { name: getIssuerName(expense.issuerId) },
                    currency: { name: getCurrencyName(expense.currencyId) },
                    products: expense.products.map(p => ({
                        name: p.name.trim(),
                        price: Number(p.price),
                        quantity: Number(p.quantity)
                    }))
                })
            });

            if (!response.ok) throw new Error("Failed");

            navigate(-1); // go back on success
        } catch (err) {
            setErrors(prev => ({ ...prev, submit: "Failed to create expense" }));
        }
    };
    
    const handleAddProduct = async () => {
        setExpense(prev => ({
            ...prev,
            products: [
                ...prev.products,
                {
                    name: "",
                    price: 0,
                    quantity: 1
                }
            ]
        }));
    };
    
    const handleRemoveProduct = async (indexToRemove : number) => {
        if(expense.products.length <= 1)
            return;
        
        setExpense(prev => ({
            ...prev,
            products: prev.products.filter((_, index) => index !== indexToRemove)
        }));
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
                            {errors.date && (
                                <div className={styles.errorText}>{errors.date}</div>
                            )}

                            <span className={styles.detailLabel}>Date</span>
                            <input
                                type="datetime-local"
                                max={new Date().toISOString().slice(0, 16)}
                                className={styles.detailValue}

                                value={expense.date}
                                onChange={e =>
                                    setExpense({...expense, date: e.target.value})
                                }
                            />
                        </div>

                        <div className={styles.detailItem}>
                            {errors.description && (
                                <div className={styles.errorText}>{errors.description}</div>
                            )}

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
                                    setExpense({...expense, description: e.target.value})
                                }
                            />
                        </div>

                        <div className={styles.detailItem}>
                            <select
                                className={styles.detailValue}
                                value={expense.categoryId}
                                onChange={e => setExpense({...expense, categoryId: e.target.value})}
                                disabled={loadingOptions}
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.detailItem}>
                            <select
                                className={styles.detailValue}
                                value={expense.issuerId}
                                onChange={e => setExpense({...expense, issuerId: e.target.value})}
                                disabled={loadingOptions}
                            >
                                <option value="">Select issuer</option>
                                {issuers.map(iss => (
                                    <option key={iss.id} value={iss.id}>
                                        {iss.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.detailItem}>
                            <select
                                className={styles.detailValue}
                                value={expense.currencyId}
                                onChange={e => setExpense({...expense, currencyId: e.target.value})}
                                disabled={loadingOptions}
                            >
                                <option value="">Select currency</option>
                                {currencies.map(curr => (
                                    <option key={curr.id} value={curr.id}>
                                        {curr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    
                    
                    <div className={styles.productsSection}>
                        <h3>Products ({expense.products.length})</h3>

                        {expense.products.map((product, index) => (
                            
                            <div key={index} className={styles.productCard}>
                                <div className={styles.productHeader}>
                                    
                                    <h4 className={styles.productName}>
                                        Product {index + 1}
                                    </h4>
                                    <span className={styles.productSubtotal}>
                                        ${(product.price * product.quantity).toFixed(2)}
                                    </span>
                                    
                                </div>

                                <div className={styles.productDetails}>
                                    
                                    <div className={styles.detailItem}>
                                        {errors[`products.${index}.name`] && (
                                            <div className={styles.errorText}>
                                                {errors[`products.${index}.name`]}
                                            </div>
                                        )}
                                        <span className={styles.detailLabel}>Name</span>
                                        <input
                                            type="text"
                                            className={styles.detailValue}
                                            placeholder="Product Name"
                                            value={product.name}
                                            onChange={e => {
                                                const products = [...expense.products];
                                                products[index].name = e.target.value;
                                                
                                                setExpense({...expense, products});
                                            }}
                                        />
                                        
                                    </div>

                                    <div className={styles.detailItem}>
                                        {errors[`products.${index}.price`] && (
                                            <div className={styles.errorText}>
                                                {errors[`products.${index}.price`]}
                                            </div>
                                        )}
                                        <span className={styles.detailLabel}>Price Per Item</span>
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            className={styles.detailValue}
                                            placeholder="Price"
                                            
                                            value={product.price || ""}
                                            onChange={e => {
                                                const products = [...expense.products];
                                                products[index].price = Number(e.target.value) || 0;
                                                setExpense({...expense, products});
                                            }}
                                        />
                                    </div>

                                    <div className={styles.detailItem}>
                                        {errors[`products.${index}.quantity`] && (
                                            <div className={styles.errorText}>
                                                {errors[`products.${index}.quantity`]}
                                            </div>
                                        )}
                                        <span className={styles.detailLabel}>Quantity</span>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            className={styles.detailValue}
                                            placeholder="Quantity"
                                            
                                            value={product.quantity || ""}
                                            onChange={e => {
                                                const products = [...expense.products];
                                                products[index].quantity = Number(e.target.value) || 1;
                                                setExpense({...expense, products});
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Remove button only if more than one product */}
                                {expense.products.length > 1 && (
                                    <button
                                        type="button"
                                        className={styles.removeProductButton}
                                        onClick={() => handleRemoveProduct(index)}
                                    >
                                        Remove Product
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className={styles.addProductButton}
                            onClick={handleAddProduct}
                        >
                            + Add product
                        </button>

                        <button
                            type="button"
                            className={styles.submitButton}
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
