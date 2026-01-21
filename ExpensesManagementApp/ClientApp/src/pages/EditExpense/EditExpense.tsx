import styles from "../CreateExpense/CreateExpense.module.css";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {authService} from "../../../services/AuthService.tsx";
import {useTranslation} from "react-i18next";


interface Product{
    name: string;
    price: number;
    quantity: number;
}

interface ExpenseForm{
    date: string;
    description: string;
    categoryId: number;
    currencyId: number;
    issuerId: number;
    products: Product[];
}

export function EditExpense(){
    const { t } = useTranslation(); 
    
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
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
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [issuers, setIssuers] = useState<{ id: number; name: string }[]>([]);
    const [currencies, setCurrencies] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if(!id){
                setErrors({ load: "Invalid expense ID" });
                setLoading(false);
                return;
            }
            
            const token = await authService.getAccessToken();
            if(!token){
                setErrors({ load: "Authentication required" });
                setLoading(false);
                return;
            }
            
            try{

                const expenseRes = await fetch(`/api/Expenses/id/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!expenseRes.ok) throw new Error("Failed to load expense");
                const data = await expenseRes.json();

                // Fetch dropdowns
                setLoadingOptions(true);
                const [catRes, issRes, curRes] = await Promise.all([
                    fetch("/api/category"),
                    fetch("/api/Issuer"),
                    fetch("/api/Currency")
                ]);

                const cats = await catRes.json();
                const iss = await issRes.json();
                const curs = await curRes.json();

                setCategories(cats);
                setIssuers(iss);
                setCurrencies(curs);
                setLoadingOptions(false);

                // Pre-filling the form:
                setExpense({
                    date: new Date(data.date).toISOString().slice(0, 16),
                    description: data.description || "",
                    categoryId: data.category?.id?.toString() || "",
                    issuerId: data.issuer?.id?.toString() || "",
                    currencyId: data.currency?.id?.toString() || "",
                    products: data.products?.length > 0
                        ? data.products.map((p: any) => ({
                            name: p.name || "",
                            price: Number(p.price) || 0,
                            quantity: Number(p.quantity) || 1
                        }))
                        : [{ name: "", price: 0, quantity: 1 }]
                });
                
            }catch(error : any){
                setErrors({ load: err.message || "Failed to load expense" });
            }finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [id]);

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

    const handleSubmit = async () => {
        const validationErrors = validateExpense();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        const token = await authService.getAccessToken();
        if (!token || !id) return;

        try {
            const response = await fetch(`/api/Expenses/id/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: new Date(expense.date).toISOString(),
                    description: expense.description.trim(),
                    category: { name: getCategoryName(expense.categoryId) },
                    issuer: expense.issuerId ? { name: getIssuerName(expense.issuerId) } : null,
                    currency: { name: getCurrencyName(expense.currencyId) },
                    products: expense.products.map(p => ({
                        name: p.name.trim(),
                        price: Number(p.price),
                        quantity: Number(p.quantity)
                    }))
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to update expense");
            }
            
            navigate(`/expenses/${id}`);
        } catch (err: any) {
            setErrors(prev => ({ ...prev, submit: err.message || "Failed to update expense" }));
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

    if (loading) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.loading}>Loading expense for editing...</div>
                </main>
            </div>
        );
    }

    if (errors.load) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.error}>{errors.load}</div>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        Go Back
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    {t('expenseEdit.goBack')}
                </button>
                <h3>{t('expenseEdit.editExpense')}</h3>

                <div className={styles.expenseCard}>
                    <div className={styles.expenseDetails}>
                        <div className={styles.detailItem}>
                            {errors.date && <div className={styles.errorText}>{errors.date}</div>}
                            <span className={styles.detailLabel}>{t('expenseEdit.date')}</span>
                            <input
                                type="datetime-local"
                                className={styles.detailValue}
                                value={expense.date}
                                onChange={e => setExpense({ ...expense, date: e.target.value })}
                            />
                        </div>

                        <div className={styles.detailItem}>
                            {errors.description && <div className={styles.errorText}>{errors.description}</div>}
                            <span className={styles.detailLabel}>{t('expenseEdit.description')}</span>
                            <input
                                type="text"
                                className={styles.detailValue}
                                placeholder="Expense description"
                                value={expense.description}
                                onChange={e => setExpense({ ...expense, description: e.target.value })}
                            />
                        </div>

                        <div className={styles.detailItem}>
                            {errors.category && <div className={styles.errorText}>{errors.category}</div>}
                            <span className={styles.detailLabel}>{t('expenseEdit.category')}</span>
                            <select
                                className={styles.detailValue}
                                value={expense.categoryId}
                                onChange={e => setExpense({ ...expense, categoryId: e.target.value })}
                                disabled={loadingOptions}
                            >
                                <option value="">{loadingOptions ? "Loading..." : t('expenseEdit.selectCategory')}</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('expenseEdit.issuer')}</span>
                            <select
                                className={styles.detailValue}
                                value={expense.issuerId}
                                onChange={e => setExpense({ ...expense, issuerId: e.target.value })}
                                disabled={loadingOptions}
                            >
                                <option value="">{t('expenseEdit.selectIssuer')}</option>
                                {issuers.map(iss => (
                                    <option key={iss.id} value={iss.id}>{iss.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.detailItem}>
                            {errors.currency && <div className={styles.errorText}>{errors.currency}</div>}
                            <span className={styles.detailLabel}>{t('expenseEdit.currency')}</span>
                            <select
                                className={styles.detailValue}
                                value={expense.currencyId}
                                onChange={e => setExpense({ ...expense, currencyId: e.target.value })}
                                disabled={loadingOptions}
                            >
                                <option value="">{loadingOptions ? "Loading..." : t('expenseEdit.selectCurrency')}</option>
                                {currencies.map(cur => (
                                    <option key={cur.id} value={cur.id}>{cur.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.productsSection}>
                        <h3>{t('expenseEdit.products')} ({expense.products.length})</h3>

                        {expense.products.map((product, index) => (
                            <div key={index} className={styles.productCard}>
                                <div className={styles.productHeader}>
                                    <h4 className={styles.productName}>{t('expenseEdit.product')} {index + 1}</h4>
                                    <span className={styles.productSubtotal}>
                                        ${(product.price * product.quantity).toFixed(2)}
                                    </span>
                                </div>

                                <div className={styles.productDetails}>
                                    <div className={styles.detailItem}>
                                        {errors[`products.${index}.name`] && (
                                            <div className={styles.errorText}>{errors[`products.${index}.name`]}</div>
                                        )}
                                        <span className={styles.detailLabel}>{t('expenseEdit.name')}</span>
                                        <input
                                            type="text"
                                            className={styles.detailValue}
                                            value={product.name}
                                            onChange={e => {
                                                const prods = [...expense.products];
                                                prods[index].name = e.target.value;
                                                setExpense({ ...expense, products: prods });
                                            }}
                                        />
                                    </div>

                                    <div className={styles.detailItem}>
                                        {errors[`products.${index}.price`] && (
                                            <div className={styles.errorText}>{errors[`products.${index}.price`]}</div>
                                        )}
                                        <span className={styles.detailLabel}>{t('expenseEdit.price')}</span>
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            className={styles.detailValue}
                                            value={product.price || ""}
                                            onChange={e => {
                                                const prods = [...expense.products];
                                                prods[index].price = Number(e.target.value) || 0;
                                                setExpense({ ...expense, products: prods });
                                            }}
                                        />
                                    </div>

                                    <div className={styles.detailItem}>
                                        {errors[`products.${index}.quantity`] && (
                                            <div className={styles.errorText}>{errors[`products.${index}.quantity`]}</div>
                                        )}
                                        <span className={styles.detailLabel}>{t('expenseEdit.quantity')}</span>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            className={styles.detailValue}
                                            value={product.quantity || ""}
                                            onChange={e => {
                                                const prods = [...expense.products];
                                                prods[index].quantity = Number(e.target.value) || 1;
                                                setExpense({ ...expense, products: prods });
                                            }}
                                        />
                                    </div>
                                </div>

                                {expense.products.length > 1 && (
                                    <button
                                        type="button"
                                        className={styles.removeProductButton}
                                        onClick={() => handleRemoveProduct(index)}
                                    >
                                        {t('expenseEdit.removeProduct')}
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className={styles.addProductButton}
                            onClick={handleAddProduct}
                        >
                            {t('expenseEdit.addProduct')}
                        </button>

                        {errors.submit && <div className={styles.errorText}>{errors.submit}</div>}

                        <button
                            type="button"
                            className={styles.submitButton}
                            onClick={handleSubmit}
                        >
                            {t('expenseEdit.updateExpense')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}