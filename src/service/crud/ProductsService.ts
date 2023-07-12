import { Observable } from 'rxjs';
import Employee from '../../model/Product';

export default interface ProductsService {
    addProduct(empl: Employee): Promise<Employee>;
    getProducts(): Observable<Employee[] | string>;
    deleteProduct(id: any): Promise<void>;
    updateProduct(empl: Employee): Promise<Employee>;
}
