
import Product from '../../model/Product';

export default interface CartService {    
    addToUserCart(userId: string, productId: string, quantity: number): Promise<void>;
    getUserCart(userId: string): Promise<{ [productId: string]: number }> ;
    removeFromUserCart(userId: string, productId: string): Promise<void>;
    updateUserCart(userId: string, productId: string, newQuantity: number): Promise<void>;
}