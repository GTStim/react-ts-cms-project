import Product from '../../model/Product';
import { ProductForm } from '../forms/ProductForm';
import InputResult from '../../model/InputResult';
import { productService } from '../../config/service-config';

import { useDispatchCode } from '../../hooks/hooks';
import CodeType from '../../model/CodeType';

const AddProduct: React.FC = () => {
    const dispatch = useDispatchCode();
    
    async function submitFn(empl: Product): Promise<InputResult> {
        let errorMessage: string = '';
        let successMessage: string = '';
        const res: InputResult = { status: 'success', message: '' };
        try {
            const product: Product = await productService.addProduct(empl);
            successMessage = `product with id: ${product.id} has been added`;
        } catch (error: any) {
            errorMessage = error.message;
        }
        dispatch(errorMessage, successMessage);
        return res;
    }
    return <ProductForm submitFn={submitFn} />;
};
export default AddProduct;
