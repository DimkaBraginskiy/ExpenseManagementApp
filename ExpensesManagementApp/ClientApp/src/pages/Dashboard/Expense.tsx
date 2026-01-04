export interface Expense {
    id : number;
    totalAmount: number;
    date: string;
    description: string;
    category?: CategoryResponseDto | null;
    issuer?: IssuerResponseDto | null;
    currency?: CurrencyResponseDto | null;
    products?: ProductResponseDto[] | null;
}

export interface CategoryResponseDto {
    name: string;
}

export interface IssuerResponseDto {
    name: string;
}

export interface CurrencyResponseDto {
    code: string;
    name: string;
}

export interface ProductResponseDto{
    name: string;
    price: number;
    quantity: number;
}