import LoginData from '../../model/LoginData';
import UserData from '../../model/UserData';
import AuthService from './AuthService';
import { getFirestore, collection, getDoc, doc } from 'firebase/firestore';
import {
    AuthProvider,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import appFirebase from '../../config/firebase-config';

const mapProviders: Map<string, AuthProvider> = new Map([['GOOGLE', new GoogleAuthProvider()]]);

function getErrorMessage(error: any): string {
    let errorMessage = '';

    switch (error.code) {
        case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use!';
            break;
        case 'auth/invalid-email':
            errorMessage = 'The email address is badly formatted!';
            break;
        case 'auth/wrong-password' && 'auth/user-not-found':
            errorMessage = 'Incorrect login or password.';
            break;
        default:
            errorMessage = error.message;
    }
    return errorMessage;
}

export default class AuthServiceFire implements AuthService {
    getAvailableProvider(): { providerName: string; providerIconUrl: string }[] {
        return [
            {
                providerName: 'GOOGLE',
                providerIconUrl: 'https://img.icons8.com/color/2x/google-logo.png',
            },
        ];
    }
    private auth = getAuth(appFirebase);
    private administrators = collection(getFirestore(appFirebase), 'administrators');
    private async isAdmin(uid: any): Promise<boolean> {
        const docRef = doc(this.administrators, uid);
        return (await getDoc(docRef)).exists();
    }

    async login(loginData: LoginData): Promise<UserData> {
        let userData: UserData = null;
        try {
            const userAuth = !loginData.password
                ? await signInWithPopup(this.auth, mapProviders.get(loginData.email)!)
                : await signInWithEmailAndPassword(this.auth, loginData.email, loginData.password);
            userData = {
                email: userAuth.user.email as string,
                role: (await this.isAdmin(userAuth.user.uid)) ? 'admin' : 'user',
            };
        } catch (error: any) {
            throw new Error(getErrorMessage(error));
        }
        return userData;
    }

    async register(loginData: LoginData): Promise<UserData> {
        let userData: UserData = null;
        try {
            const userAuth = await createUserWithEmailAndPassword(
                this.auth,
                loginData.email,
                loginData.password,
            );
            userData = {
                email: userAuth.user.email as string,
                role: (await this.isAdmin(userAuth.user.uid)) ? 'admin' : 'user',
            };
        } catch (error: any) {
            throw new Error(getErrorMessage(error));
        }
        return userData;
    }

    logout(): Promise<void> {
        return signOut(this.auth);
    }
}
