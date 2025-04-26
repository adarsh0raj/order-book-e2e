export interface Order {
    id?: number;
    user?: string;
    price: number;
    quantity: number;
    orderType: 'bid' | 'ask';
    timestamp?: string;
}

export interface Trade {
    id?: number;
    price: number;
    quantity: number;
    timestamp: string;
    bidUser?: string;
    askUser?: string;
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
