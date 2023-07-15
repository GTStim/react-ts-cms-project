import { useEffect, useState } from "react";
import Product from "../model/Product";
import { cartService } from "../config/service-config";
import { useSelectorAuth } from "../redux/store";


export function useCart() {
    const [cart, setCart] = useState<{ [productId: string]: number }>({});  
    const userData = useSelectorAuth();
    

    const isInCart = (product: Product) => {
        return cart.hasOwnProperty(product.id);
    }

    const addToCart = async (productId: string, quantity: number = 1) => {
        if (userData) {
            await cartService.addToUserCart(userData.email, productId, quantity);
            const newCart = await cartService.getUserCart(userData.email);
            setCart(newCart);
        }
    }
    
    const removeFromCart = async (productId: string, quantity?: number) => {
        if (userData) {
            await cartService.removeFromUserCart(userData.email, productId, quantity);
            const newCart = await cartService.getUserCart(userData.email);
            setCart(newCart);
        }
    } 

    const clearCart = async () => {
        if (userData) {
            const newCart = await cartService.clearUserCart(userData.email);
            setCart(newCart);
        }
    }

    useEffect(() => {
        const fetchCart = async () => {
            if (userData) {
                const fetchedCart = await cartService.getUserCart(userData.email);
                setCart(fetchedCart);
            }
        }
        fetchCart();
    }, [userData]);

    return {
        cart,
        addToCart,
        removeFromCart,
        isInCart,
        clearCart       
    }
}