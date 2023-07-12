import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import Product from '../../model/Product';
import { useSelectorAuth } from '../../redux/store';

type Props = {
    product: Product;
    actionFn: (id: number, isDelete: boolean) => void;
};

const ProductCard: React.FC<Props> = ({ product, actionFn }) => {
    const userData = useSelectorAuth();

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" ml={7}>
                    id: {product.id}
                </Typography>
                <Typography variant="h5" ml={7}>
                    title: {product.title}
                </Typography>
                <Typography variant="h5" ml={7}>
                    price: {product.price}
                </Typography>
                <Typography variant="h5" ml={7}>
                    description: {product.description}
                </Typography>
                <Typography variant="h5" ml={7}>
                    category: {product.category}
                </Typography>
                <Typography variant="h5" ml={7}>
                    image: {product.image}
                </Typography>
            </CardContent>
            {userData && userData.role === 'admin' && (
            <CardActions>
                <Button size="small" onClick={() => actionFn(product.id, false)}>
                    Update
                </Button>
                <Button size="small" onClick={() => actionFn(product.id, true)}>
                    Delete
                </Button>
            </CardActions>
        )}
        </Card>
    );
};

export default ProductCard;
