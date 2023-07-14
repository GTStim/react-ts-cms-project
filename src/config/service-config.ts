import AuthService from '../service/auth/AuthService';
import EmployeesService from '../service/crud/ProductsService';
import EmployeesServiceFire from '../service/crud/ProductsServiceFire';
import AuthServiceFire from '../service/auth/AuthServiceFire';

export const authService: AuthService = new AuthServiceFire();

export const productsService: EmployeesService = new EmployeesServiceFire();
