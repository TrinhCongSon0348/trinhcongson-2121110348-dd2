import React, { createContext, useContext, useState } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: string;
    image: { uri: string };
    quantity: number;
}

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prevItems, item];
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const increaseQuantity = (id: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]); // Xóa tất cả các mặt hàng trong giỏ hàng
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, totalAmount, totalQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
