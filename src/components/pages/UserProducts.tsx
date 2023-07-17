import React, { useState } from 'react';
import Product from '../../model/Product';
import SnackbarAlert from '../common/SnackbarAlert';
import { useSelectorProducts } from '../../hooks/hooks';
import { useCart } from '../../hooks/cartHooks';
import { useSelectorAuth } from '../../redux/store';
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Grid,
    Button,
    IconButton,
    CardActions,
    Dialog,
    DialogContent,
    DialogTitle,
    useTheme,
    useMediaQuery,
    Badge,
} from '@mui/material';
import { ShoppingCartOutlined, DeleteOutline, Add, Remove } from '@mui/icons-material';

const ProductsPage: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const products = useSelectorProducts();
    const auth = useSelectorAuth();
    const { addToCart, removeFromCart, isInCart } = useCart();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        setQuantities({ ...quantities, [product.id]: 1 });
        setAlertMessage(`Product "${product.title}" was removed from your cart!`);
    };

    const getButtonStyle = (product: Product) =>
        isInCart(product) ? { backgroundColor: 'yellow', color: 'black', fontSize: '0.8rem' } : {};

    return (
        <Grid container spacing={3}>
            {products.map((product) => {
                const productQuantity = quantities[product.id] || 1;
                const buttonStyle = getButtonStyle(product);
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                            }}
                        >
                            <div onClick={() => setSelectedProduct(product)}>
                                <CardMedia
                                    component="img"
                                    alt={product.title}
                                    height="100"
                                    image={product.image}
                                    sx={{ objectFit: 'contain' }}
                                />

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        gutterBottom
                                        variant={isSmallScreen ? 'h6' : 'h5'}
                                        component="div"
                                    >
                                        {product.title}
                                    </Typography>
                                    <Typography variant="body1">Category: {product.category}</Typography>
                                    <Typography variant="subtitle1">Price: ${product.price}</Typography>
                                </CardContent>
                            </div>

                            {auth && (
                                <CardActions
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mt: 'auto',
                                    }}
                                >
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
                                            ...buttonStyle,
                                            '&:hover': buttonStyle,
                                        }}
                                        onClick={
                                            isInCart(product)
                                                ? () => handleRemoveFromCart(product)
                                                : () => handleAddToCart(product)
                                        }
                                    >
                                        {isSmallScreen ? (
                                            isInCart(product) ? (
                                                <DeleteOutline />
                                            ) : (
                                                <Badge badgeContent={productQuantity} color="primary">
                                                    <ShoppingCartOutlined />
                                                </Badge>
                                            )
                                        ) : isInCart(product) ? (
                                            'Remove from Cart'
                                        ) : (
                                            `Add to Cart (${productQuantity})`
                                        )}
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
                            )}
                        </Card>
                    </Grid>
                );
            })}

            <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
                <DialogTitle>{selectedProduct?.title}</DialogTitle>
                <CardMedia
                    component="img"
                    alt={selectedProduct?.title}
                    height="100"
                    image={selectedProduct?.image}
                    sx={{ objectFit: 'contain' }}
                />

                <DialogContent>
                    <Typography variant="body2" color="textSecondary">
                        {selectedProduct?.description}
                    </Typography>
                    <Typography variant="body1">Category: {selectedProduct?.category}</Typography>
                    <Typography variant="subtitle1">Price: ${selectedProduct?.price}</Typography>
                </DialogContent>
            </Dialog>
            {alertMessage && <SnackbarAlert message={alertMessage} severity="success" />}
        </Grid>
    );
};

export default ProductsPage;
