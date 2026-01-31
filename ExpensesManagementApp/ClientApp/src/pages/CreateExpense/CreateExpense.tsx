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
        products: [{ name: "", price: 0, quantity: 1 }]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [issuers, setIssuers] = useState<any[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        const ensureGuestTokenAndLoadData = async () => {
            let token = authService.getAccessToken();

            console.log("[CreateExpense] Current token on mount:", token ? `${token.substring(0, 20)}...` : "null");

            if (!token) {
                console.log("[CreateExpense] No token found → creating guest session...");
                const newToken = await authService.createGuestSession();
                if (newToken) {
                    console.log("[CreateExpense] Guest session created successfully:", `${newToken.substring(0, 20)}...`);
                    token = newToken;
                } else {
                    console.error("[CreateExpense] Failed to create guest session");
                    setErrors(prev => ({ ...prev, submit: "Could not start guest session. Try again." }));
                    return;
                }
            } else {
                console.log("[CreateExpense] Token already exists → proceeding");
            }

            // Now fetch options WITH the token
            await fetchOptions(token);
        };

        const fetchOptions = async (token: string | null) => {
            try {
                setLoadingOptions(true);
                console.log("[CreateExpense] Fetching categories/currencies/issuers with token...");

                const authHeaders = {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                };

                const [categoryRes, currencyRes, issuerRes] = await Promise.all([
                    fetch("/api/category", { headers: authHeaders }),
                    fetch("/api/Currency", { headers: authHeaders }),
                    fetch("/api/Issuer", { headers: authHeaders })
                ]);

                // Log responses for debugging
                console.log("Category response:", categoryRes.status, categoryRes.ok);
                console.log("Currency response:", currencyRes.status);
                console.log("Issuer response:", issuerRes.status);

                if (!categoryRes.ok || !currencyRes.ok || !issuerRes.ok) {
                    const texts = await Promise.all([
                        categoryRes.text(),
                        currencyRes.text(),
                        issuerRes.text()
                    ]);
                    console.error("Failed responses:", texts);
                    throw new Error("Failed to load required data");
                }

                const cats = await categoryRes.json();
                const curs = await currencyRes.json();
                const iss = await issuerRes.json();

                console.log("Loaded options:", { cats: cats.length, curs: curs.length, iss: iss.length });

                setCategories(cats);
                setCurrencies(curs);
                setIssuers(iss);
            } catch (error: any) {
                console.error("Failed to load options:", error);
                setErrors(prev => ({ ...prev, submit: "Failed to load categories/currencies. Check console." }));
            } finally {
                setLoadingOptions(false);
            }
        };

        ensureGuestTokenAndLoadData();
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

    const getCategoryName = (id : string | number) => {
        const cat = categories.find(c => c.id === Number(id) || c.id === id);
        return cat ? cat.name : "";
    };

    const getIssuerName = (id : string | number) => {
        const iss = issuers.find(i => i.id === Number(id) || i.id === id);
        return iss ? iss.name : "";
    };

    const getCurrencyName = (id : string | number) => {
        const cur = currencies.find(c => c.id === Number(id) || c.id === id);
        return cur ? cur.name : "";
    };


    const handleSubmit = async () => {
        const validationErrors = validateExpense();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        const token = authService.getAccessToken();
        console.log("[CreateExpense] Submitting expense with token:", token ? `${token.substring(0, 20)}...` : "MISSING!");

        if (!token) {
            setErrors(prev => ({ ...prev, submit: "No authentication token. Try refreshing." }));
            return;
        }

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

            console.log("[CreateExpense] Submit response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Submit failed:", response.status, errorText);
                throw new Error(`Server error: ${response.status}`);
            }

            console.log("Expense created successfully!");
            navigate(-1);
        } catch (err: any) {
            console.error("Submit error:", err);
            setErrors(prev => ({ ...prev, submit: "Failed to create expense. Check console." }));
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
