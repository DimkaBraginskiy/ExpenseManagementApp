// Expense.tsx or create a separate types file
export interface Expense {
    totalAmount: number;
    date: string;  // C# DateTime serializes to string
    description: string;
    category?: CategoryResponseDto | null;
    issuer?: IssuerResponseDto | null;
    currency?: CurrencyResponseDto | null;
    products?: ProductResponseDto[] | null;
}

export interface CategoryResponseDto {
    id: string;
    name: string;
    // Add other properties if they exist
}

export interface IssuerResponseDto {
    id: string;
    name: string;
    // Add other properties if they exist
}

export interface CurrencyResponseDto {
    id: string;
    code: string;
    name: string;
    // Add other properties if they exist
}

export interface ProductResponseDto{
    name: string;
    price: number;
    quantity: number;
}