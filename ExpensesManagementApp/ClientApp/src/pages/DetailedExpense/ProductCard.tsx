import styles from './DetailedExpense.module.css'
import type {ProductResponseDto} from "../Dashboard/Expense.tsx";

interface ProductCardProps{
    product: ProductResponseDto;
}

export function ProductCard({ product } : ProductCardProps){
    const subtotal = product.price * product.quantity;
    
    return(
        <div className={styles.productCard}>
            <div className={styles.productHeader}>
                <h4 className={styles.productName}>{product.name}</h4>
                <span className={styles.productSubtotal}>${subtotal.toFixed(2)}</span>
            </div>

            <div className={styles.productDetails}>
                <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
                <span className={styles.productSeparator}>×</span>
                <span className={styles.productQuantity}>{product.quantity}</span>
                <span className={styles.productEquals}>=</span>
                <span className={styles.productSubtotalDetail}>${subtotal.toFixed(2)}</span>
            </div>
        </div>
    );
}