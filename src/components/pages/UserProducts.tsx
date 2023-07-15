// src\components\pages\UserProducts.tsx
import React from 'react';
import { useSelectorProducts } from '../../hooks/hooks';
import {useCart} from '../../hooks/cartHooks';
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Grid,
    Button,
    Box,
    IconButton,
    CardActions,
} from '@mui/material';
import { useSelectorAuth } from '../../redux/store';
import { useState } from 'react';
import Product from '../../model/Product';
import SnackbarAlert from '../common/SnackbarAlert';
import { Add, Remove } from '@mui/icons-material';

const ProductsPage: React.FC = () => {
    const products = useSelectorProducts();
    const auth = useSelectorAuth();
    const { addToCart, removeFromCart, isInCart } = useCart();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

    const handleAddToCart = (product: Product) => {
        const quantity = quantities[product.id] || 1;
        addToCart(product.id, quantity);
        setAlertMessage(
            `Added ${quantity} of "${product.title}" with total price $${
                product.price * quantity
            } to your cart!`,
        );
        
    };

    const handleRemoveFromCart = (product: Product) => {
        removeFromCart(product.id);
        setAlertMessage(`Product "${product.title}" was removed from your cart!`);
    };

    return (
        <Grid container spacing={3}>
            {products.map((product) => {
                const productQuantity = quantities[product.id] || 1; // Получаем количество товара
                return (
                    <Grid item xs={6} sm={3} lg={2} key={product.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                alt={product.title}
                                height="100"
                                image={product.image}
                                sx={{ objectFit: 'contain' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {product.description}
                                </Typography>
                                <Typography variant="body1">Category: {product.category}</Typography>
                                <Typography variant="subtitle1">Price: ${product.price}</Typography>
                            </CardContent>
                            {auth && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CardActions>
                                        <IconButton
                                            disabled={productQuantity <= 1 || isInCart(product)}
                                            onClick={() =>
                                                setQuantities({
                                                    ...quantities,
                                                    [product.id]: Math.max(productQuantity - 1, 1),
                                                })
                                            }
                                        >
                                            <Remove />
                                        </IconButton>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: isInCart(product) ? 'yellow' : '',
                                                color: isInCart(product) ? 'black' : '',
                                                fontSize: isInCart(product) ? '0.8rem' : '',
                                                '&:hover': {
                                                    backgroundColor: isInCart(product) ? 'yellow' : '',
                                                    color: isInCart(product) ? 'black' : '',
                                                },
                                            }}
                                            onClick={
                                                isInCart(product)
                                                    ? () => handleRemoveFromCart(product)
                                                    : () => handleAddToCart(product)
                                            }
                                        >
                                            {isInCart(product)
                                                ? 'Remove from Cart'
                                                : `Add to Cart (${productQuantity})`}
                                        </Button>
                                        <IconButton
                                            disabled={isInCart(product)}
                                            onClick={() =>
                                                setQuantities({
                                                    ...quantities,
                                                    [product.id]: productQuantity + 1,
                                                })
                                            }
                                        >
                                            <Add />
                                        </IconButton>
                                    </CardActions>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                );
            })}
            {alertMessage && <SnackbarAlert message={alertMessage} severity="success" />}
        </Grid>
    );
};

export default ProductsPage;
