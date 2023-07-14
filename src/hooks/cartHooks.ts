import { useEffect, useState } from "react";
import Product from "../model/Product";

const CART_ITEM = 'cart-item';

function getCart(): Product[] {
    const cartJson = localStorage.getItem(CART_ITEM) || '';
    let res: Product[] = [];
    if (cartJson) {
        res = JSON.parse(cartJson);
    }
    return res;
}

export function useCart() {
    
    const [cart, setCart] = useState<Product[]>(getCart());
    
    const isInCart = (product: Product) => {
        return cart.some(item => item.id === product.id);
    }

    const addToCart = (product: Product, quantity: number = 1) => {  
        const newCart = [...cart];
        for(let i = 0; i < quantity; i++) {
            newCart.push(product);
        }
        localStorage.setItem(CART_ITEM, JSON.stringify(newCart));
        setCart(newCart);
    }

    const removeFromCart = (product: Product) => {  
        const newCart = cart.filter(item => item.id !== product.id);
        localStorage.setItem(CART_ITEM, JSON.stringify(newCart));
        setCart(newCart);
    }

    useEffect(() => {
        setCart(getCart());
    }, []);

    return {
        cart,
        addToCart,
        removeFromCart,
        isInCart
    }
}