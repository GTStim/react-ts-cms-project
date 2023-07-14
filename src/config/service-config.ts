import AuthService from '../service/auth/AuthService';
import ProductsService from '../service/crud/ProductsService';
import ProductsServiceFire from '../service/crud/ProductsServiceFire';
import AuthServiceFire from '../service/auth/AuthServiceFire';
import CartServiceFire from '../service/crud/CartServiceFire';
import CartService from '../service/crud/CartService';

export const authService: AuthService = new AuthServiceFire();

export const productsService: ProductsService = new ProductsServiceFire();

export const cartService: CartService = new CartServiceFire();
