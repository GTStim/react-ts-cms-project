import AuthService from '../service/auth/AuthService';
import ProductsService from '../service/crud/ProductsService';
import ProductsServiceFire from '../service/crud/ProductsServiceFire';
import AuthServiceFire from '../service/auth/AuthServiceFire';

export const authService: AuthService = new AuthServiceFire();

export const productsService: ProductsService = new ProductsServiceFire();
