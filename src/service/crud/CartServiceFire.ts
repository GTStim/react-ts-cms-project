import Product from '../../model/Product';

import appFirebase from '../../config/firebase-config';
import { getFirestore, collection, deleteDoc, addDoc, getDocs, query, where } from 'firebase/firestore';

import CartService from './CartService';

export default class CartServiceFire implements CartService {
    private userCarts = collection(getFirestore(appFirebase), 'userCarts');

    async addToUserCart(userId: string, product: Product): Promise<void> {
        const cartRef = collection(this.userCarts, userId);
        await addDoc(cartRef, product);
    }

    async getUserCart(userId: string): Promise<Product[]> {
        const cartRef = collection(this.userCarts, userId);
        const cartSnap = await getDocs(cartRef);
        return cartSnap.docs.map((doc) => doc.data() as Product);
    }

    async removeFromUserCart(userId: string, product: Product): Promise<void> {
        const cartRef = collection(this.userCarts, userId);
        const productRef = query(cartRef, where('id', '==', product));
        const productSnap = await getDocs(productRef);
        if (!productSnap.empty) {
            const productDoc = productSnap.docs[0];
            await deleteDoc(productDoc.ref);
        }
    }
}
