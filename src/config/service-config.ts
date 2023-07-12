import AuthService from '../service/auth/AuthService';
import EmployeesService from '../service/crud/EmployeesService';
import EmployeesServiceFire from '../service/crud/EmployeesServiceFire';
import AuthServiceFire from '../service/auth/AuthServiceFire';

// export const authService: AuthService = new AuthServiceJwt('http://localhost:3500/login'); для JSON servera

// export const authService: AuthService = new AuthServiceFake();

export const authService: AuthService = new AuthServiceFire();

// export const employeesService: EmployeesService = new EmployeesServiceRest(
//     'http://localhost:3500/employees',
// ); для JSON servera

export const employeesService: EmployeesService = new EmployeesServiceFire();
