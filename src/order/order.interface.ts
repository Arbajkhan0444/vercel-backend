export interface CreateOrderInterface {
    user: string;
    ebook: string;
    paymentId: string;
    discount: number;
    amount: number;
    status: string
}