import { Observable } from 'rxjs';
import Product from '../../model/Product';

export default interface ProductsService {
    addProduct(prod: Product): Promise<Product>;
    getProducts(): Observable<Product[] | string>;
    deleteProduct(id: any): Promise<void>;
    updateProduct(prod: Product): Promise<Product>;
    addToUserCart(userId: string, product: Product): Promise<void>;
    getUserCart(userId: string): Promise<Product[]>;
    removeFromUserCart(userId: string, product: Product): Promise<void>;
}
