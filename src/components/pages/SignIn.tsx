import { useDispatch } from 'react-redux';
import InputResult from '../../model/InputResult';
import { authActions } from '../../redux/slices/authSlice';
import LoginData from '../../model/LoginData';
import { authService } from '../../config/service-config';
import UserData from '../../model/UserData';
import SignInForm from '../forms/SignInForm';

const SignIn: React.FC = () => {
    const dispatch = useDispatch();

    async function submitFn(loginData: LoginData): Promise<InputResult> {
        let inputResult: InputResult = {
            status: 'error',
            message: 'Server unavailable, repeat later on',
        };
        try {
            const res: UserData = await authService.login(loginData);
            res && dispatch(authActions.set(res));
            inputResult = {
                status: res ? 'success' : 'error',
                message: res ? '' : 'Incorrect Credentials',
            };
        } catch (error: any) {
            inputResult = { status: 'error', message: error.message };
        }
        return inputResult;
    }

    async function registerFn(loginData: LoginData): Promise<InputResult> {
        let inputResult: InputResult = {
            status: 'error',
            message: 'Server unavailable, repeat later on',
        };
        try {
            const res: UserData = await authService.register(loginData);
            res && dispatch(authActions.set(res));
            inputResult = {
                status: res ? 'success' : 'error',
                message: res ? '' : 'Registration successful',
            };
        } catch (error: any) {
            inputResult = { status: 'error', message: error.message };
        }
        return inputResult;
    }

    return (
        <SignInForm
            submitFn={submitFn}
            registerFn={registerFn}
            networks={authService.getAvailableProvider()}
        />
    );
};

export default SignIn;
