import Product from '../../model/Product';

import appFirebase from '../../config/firebase-config';
import {
    getFirestore,
    collection,
    CollectionReference,
    DocumentReference,
    doc,
    getDoc,
    setDoc,
} from 'firebase/firestore';

import CartService from './CartService';

export default class CartServiceFire implements CartService {
    private usersRef: CollectionReference = collection(getFirestore(appFirebase), 'users');

    async addToUserCart(userId: string, productId: string, quantity: number): Promise<void> {
        const cartRef: DocumentReference = doc(this.usersRef, userId);
        const existingDoc = await getDoc(cartRef);
        let currentCart: { [productId: string]: number } = {};
        if (existingDoc.exists()) {
            currentCart = existingDoc.data()?.cart || {};
        }
        currentCart[productId] = (currentCart[productId] || 0) + quantity;
        await setDoc(cartRef, { cart: currentCart });
    }

    async getUserCart(userId: string): Promise<{ [productId: string]: number }> {
        const cartRef: DocumentReference = doc(this.usersRef, userId);
        const existingDoc = await getDoc(cartRef);
        if (existingDoc.exists()) {
            return existingDoc.data()?.cart || {};
        }
        return {};
    }

    async removeFromUserCart(userId: string, productId: string, quantity?: number): Promise<void> {
        const cartRef: DocumentReference = doc(this.usersRef, userId);
        const existingDoc = await getDoc(cartRef);
        if (existingDoc.exists()) {
            const currentCart: { [productId: string]: number } = existingDoc.data()?.cart || {};
            if (quantity !== undefined) {
                if (currentCart[productId] > quantity) {
                    currentCart[productId] -= quantity;
                } else {
                    delete currentCart[productId];
                }
            } else {
                delete currentCart[productId];
            }
            await setDoc(cartRef, { cart: currentCart });
        }
    }

    async updateUserCart(userId: string, productId: string, newQuantity: number): Promise<void> {
        const cartRef: DocumentReference = doc(this.usersRef, userId);
        const existingDoc = await getDoc(cartRef);
        if (existingDoc.exists()) {
            const currentCart: { [productId: string]: number } = existingDoc.data()?.cart || {};
            if (currentCart.hasOwnProperty(productId)) {
                currentCart[productId] = newQuantity;
                await setDoc(cartRef, { cart: currentCart });
            } else {
                throw new Error('Product not found in the cart');
            }
        } else {
            throw new Error('User not found');
        }
    }

    async clearUserCart(userId: string): Promise<{ [productId: string]: number }> {
        const cartRef: DocumentReference = doc(this.usersRef, userId);
        const existingDoc = await getDoc(cartRef);
        if (existingDoc.exists()) {
            await setDoc(cartRef, { cart: {} });
        }
        return {};
    }
}
