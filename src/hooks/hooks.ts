import { useDispatch } from 'react-redux';
import CodeType from '../model/CodeType';
import { codeActions } from '../redux/slices/codeSlice';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { productsService } from '../config/service-config';
import Product from '../model/Product';

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';

        if (error) {
            if (error.includes('Authentication')) {
                code = CodeType.AUTH_ERROR;
                message = 'Authentication error, moving to Sign In';
            } else {
                code = error.includes('unavailable') ? CodeType.SERVER_ERROR : CodeType.UNKNOWN;
                message = error;
            }
        } else {
            message = successMessage;
        }

        dispatch(codeActions.set({ code, message }));
    };
}
export function useSelectorProducts() {
    const dispatch = useDispatchCode();
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const subscription: Subscription = productsService.getProducts().subscribe({
            next(response: Product[] | string) {
                let errorMessage: string = '';
                if (typeof response === 'string') {
                    errorMessage = response;
                    dispatch(errorMessage, '');
                } else {
                    setProducts(response); 
                }
            },
        });
        return () => subscription.unsubscribe();
    }, []);
    return products;
}

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

    const addToCart = (product: Product, quantity: number = 1) => {  // Добавляем второй аргумент quantity
        const newCart = [...cart];
        for(let i = 0; i < quantity; i++) {
            newCart.push(product);
        }
        localStorage.setItem(CART_ITEM, JSON.stringify(newCart));
        setCart(newCart);
    }

    const removeFromCart = (product: Product) => {  // Добавляем функцию removeFromCart
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