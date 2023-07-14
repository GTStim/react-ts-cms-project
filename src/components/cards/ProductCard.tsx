import { Button, Card, CardActions, Typography, CardMedia, Grid, CardContent, Box } from '@mui/material';
import Product from '../../model/Product';
import { useSelectorAuth } from '../../redux/store';

type Props = {
    product: Product;
    actionFn: (id: number, isDelete: boolean) => void;
};

const ProductCard: React.FC<Props> = ({ product, actionFn }) => {
    const userData = useSelectorAuth();

    return (
        <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={10} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
           
                <CardMedia
                    component="img"
                    alt={product.title}
                    height="100"
                    image={product.image}
                    sx={{ objectFit: 'contain'}}
                />
              
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {product.description}
                    </Typography>
                    <Typography variant="body1">Category: {product.category}</Typography>
                    <Typography variant="subtitle1">Price: {product.price}$</Typography>
                </CardContent>
                {userData && userData.role === 'admin' && (
                    <CardActions sx={{ marginTop: 'auto', justifyContent: 'center' }}>
                        <Button size="small" onClick={() => actionFn(product.id, false)}>
                            Update
                        </Button>
                        <Button size="small" onClick={() => actionFn(product.id, true)}>
                            Delete
                        </Button>
                    </CardActions>
                )}
            </Card>
        </Grid>
    </Grid>
    
    );
};

export default ProductCard;
