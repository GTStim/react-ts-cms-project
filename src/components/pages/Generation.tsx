import productsData from '../../data/test-prod-json.json';
import { useDispatch } from 'react-redux';
import InputResult from '../../model/InputResult';
import Input from '../common/Input';
import { productService} from '../../config/service-config';
import CodeType from '../../model/CodeType';
import { codeActions } from '../../redux/slices/codeSlice';
import Product from '../../model/Product';
const MAX_AMOUNT = 10;

function getRandomProduct(): Product {
    return productsData[Math.floor(Math.random() * productsData.length)];
}

const Generation: React.FC = () => {
    const dispatch = useDispatch();
    
    function onSubmit(value: string): InputResult {
        const amount = +value;
        const res: InputResult = { status: 'success', message: '' };
        if (amount < 1 || amount > MAX_AMOUNT) {
            res.status = 'error';
            res.message = `amount must be in the range [1 - ${MAX_AMOUNT}]`;
        }
        generateProducts(amount);

        return res;
    }
    async function generateProducts(amount: number): Promise<void> {
        let message: string = '';
        let code: CodeType = CodeType.OK;
        let count: number = 0;
        for (let i = 0; i < amount; i++) {
            try {
                await productService.addProduct(getRandomProduct());
                count++;
            } catch (error: any) {
                if (error.includes('Authentication')) {
                    code = CodeType.AUTH_ERROR;
                }
                message = error;
            }
        }
        message = `added ${count} products ` + message;
        dispatch(codeActions.set({ code, message }));
    }
    return (
        <Input
            submitFn={onSubmit}
            placeholder={`amount of random Products [1 - ${MAX_AMOUNT}]`}
            type="number"
            buttonTitle="Generate"
        />
    );
};
export default Generation;
