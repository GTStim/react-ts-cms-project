import React from 'react';
import { useSelectorProducts } from '../../hooks/hooks';
import { Card, CardContent, Typography, CardMedia, Grid } from '@mui/material';

const ProductsPage: React.FC = () => {
    const products = useSelectorProducts();

    return (
        <Grid container spacing={3}>
            {products.map(product => (
                <Grid item xs={6} sm={3} lg={2} key={product.id}>
                    <Card sx={{ height: '100%' }}>
                        <CardMedia
                            component="img"
                            alt={product.title}
                            height="100" // уменьшили высоту картинки до 100
                            image={product.image}
                            sx={{ objectFit: 'contain' }} // изменили 'cover' на 'contain'
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {product.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {product.description}
                            </Typography>
                            <Typography variant="body1">
                                {product.category}
                            </Typography>
                            <Typography variant="subtitle1">
                                Price: {product.price}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductsPage;
