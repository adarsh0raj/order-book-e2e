export interface Order {
    id?: number;
    user?: string;
    user_id?: number;
    price: number;
    quantity: number;
    order_type: 'bid' | 'ask';
    timestamp?: string;
    is_active?: boolean;
}

export interface Trade {
    id?: number;
    price: number;
    quantity: number;
    timestamp: string;
    bid_user?: string;
    ask_user?: string;
    bid_user_id?: number;
    ask_user_id?: number;
}

export interface User {
    id?: number;
    username: string;
    token?: string;
}

export interface OrderBook {
    bids: Order[];
    asks: Order[];
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        username: string;
    };
}
