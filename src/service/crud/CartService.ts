import { Observable } from 'rxjs';
import Product from '../../model/Product';

export default interface CartService {    
    addToUserCart(userId: string, product: Product): Promise<void>;
    getUserCart(userId: string): Promise<Product[]>;
    removeFromUserCart(userId: string, product: Product): Promise<void>;
}