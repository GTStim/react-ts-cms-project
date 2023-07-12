import { useDispatch } from 'react-redux';
import CodeType from '../model/CodeType';
import { codeActions } from '../redux/slices/codeSlice';
import { useEffect, useState } from 'react';
import Employee from '../model/Product';
import { Subscription } from 'rxjs';
import { productService } from '../config/service-config';
import Product from '../model/Product';

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';

        if (error.includes('Authentication')) {
            code = CodeType.AUTH_ERROR;
            message = 'Authentication error, mooving to Sign In';
        } else {
            code = error.includes('unavailable') ? CodeType.SERVER_ERROR : CodeType.UNKNOWN;
            message = error;
        }
        dispatch(codeActions.set({ code, message: message || successMessage }));
    };
}
export function useSelectorProducts() {
    const dispatch = useDispatchCode();
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const subscription: Subscription = productService.getProducts().subscribe({
            next(response: Product[] | string) {
                let errorMessage: string = '';
                if (typeof response === 'string') {
                    errorMessage = response;
                    dispatch(errorMessage, '');
                } else {
                    setProducts(response);  // Обновляем состояние продуктов
                }
            },
        });
        return () => subscription.unsubscribe();
    }, []);
    return products;
}