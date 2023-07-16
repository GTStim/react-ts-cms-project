import { Box, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useCart } from '../../hooks/cartHooks';
import { productsService } from '../../config/service-config';
import { Delete, Add, Remove } from '@mui/icons-material';
import Product from '../../model/Product';
import SnackbarAlert from '../common/SnackbarAlert';
import { Confirmation } from '../common/Confirmation';

const Cart: React.FC = () => {
    const { cart, addToCart, removeFromCart, clearCart } = useCart();
    const [rows, setRows] = useState<any[]>([]);
    const [productCount, setProductCount] = useState(0);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [productToRemove, setProductToRemove] = useState<Product | null>(null);
    const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // проверка на мобильное устройство

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 0.7 },
        {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            flex: 0.7,
            valueFormatter: (params) => `$${params.value}`,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            flex: 0.5,
            renderCell: (params) => (
                <div>
                    <IconButton size="small" onClick={() => decreaseQuantity(params.row.id)}>
                        <Remove />
                    </IconButton>
                    {params.value}
                    <IconButton size="small" onClick={() => increaseQuantity(params.row.id)}>
                        <Add />
                    </IconButton>
                </div>
            ),
        },
        {
            field: 'totalPrice',
            headerName: 'Total Price',
            type: 'number',
            flex: 0.7,
            valueFormatter: (params) => `$${params.value}`,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Tools',
            getActions: (params) => {
                return [
                    <GridActionsCellItem
                        label="remove"
                        icon={<Delete />}
                        onClick={() => handleRemoveFromCart(params.row)}
                    />,
                ];
            },
        },
    ];

    const handleRemoveFromCart = (product: Product) => {
        setProductToRemove(product);
        setOpenConfirm(true);
    };

    const increaseQuantity = (productId: string) => {
        const currentQuantity = quantities[productId];
        addToCart(productId, 1);
        setQuantities({
            ...quantities,
            [productId]: currentQuantity + 1,
        });
    };

    const decreaseQuantity = (productId: string) => {
        const currentQuantity = quantities[productId];
        if (currentQuantity > 1) {
            removeFromCart(productId, 1);
            setQuantities({
                ...quantities,
                [productId]: currentQuantity - 1,
            });
        }
    };

    const handleRemoveAllFromCart = () => {
        setProductToRemove(null);
        setOpenConfirm(true);
    };

    useEffect(() => {
        const loadCartData = async () => {
            const newRows = [];
            const newQuantities: { [key: string]: number } = {};

            for (let productId in cart) {
                const quantity = cart[productId];
                newQuantities[productId] = quantity;
                const product = await productsService.getProductById(productId);

                const totalPrice = product.price * quantity;

                newRows.push({
                    id: productId,
                    title: product.title,
                    price: product.price,
                    quantity: quantity,
                    totalPrice: totalPrice,
                    checkbox: true,
                });
            }

            setRows(newRows);
            setQuantities(newQuantities); // Устанавливаем начальные значения для quantities
        };

        loadCartData();
    }, [cart]);
    useEffect(() => {
        setProductCount(Object.keys(cart).length);
    }, [cart]);

    const handleOrder = () => {
        // Handle order here
    };

    const totalItems = rows.reduce((sum, row) => sum + row.quantity, 0);
    const totalSum = parseFloat(rows.reduce((sum, row) => sum + row.totalPrice, 0).toFixed(2));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
           <Box sx={{ height: isMobile ? '60vh' : '80vh', width: '90vw' }}>
            <DataGrid columns={columns} rows={rows} />
        </Box>
            <Confirmation
                open={openConfirm}
                title={productToRemove ? 'Delete a product?' : 'Delete all products?'}
                content={
                    productToRemove
                        ? `Are you sure you want to remove item "${productToRemove?.title}" from cart?`
                        : 'Are you sure you want to remove all items from your cart?'
                }
                confirmFn={(isOk: boolean) => {
                    if (isOk) {
                        if (productToRemove) {
                            const currentQuantity = quantities[productToRemove.id];
                            removeFromCart(productToRemove.id, currentQuantity);
                            setQuantities({
                                ...quantities,
                                [productToRemove.id]: 0,
                            });
                            setAlertMessage(
                                `Product "${productToRemove.title}" was removed from your cart!`,
                            );
                        } else {
                            clearCart();
                            setQuantities({});
                            setAlertMessage('All products were removed from your cart!');
                        }
                    }
                    setOpenConfirm(false);
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    width: '90vw',
                    flexDirection: isMobile ? 'column' : 'row',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <p style={{ margin: '1rem' }}>Total items: {totalItems}</p>
                    <p style={{ margin: '1rem' }}>Total products: {productCount}</p>
                    <p style={{ margin: '1rem' }}>Total sum: ${totalSum}</p>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: isMobile ? '1rem' : 'initial', // Если мобильное устройство, добавляем отступ сверху
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOrder}
                        style={{ marginRight: '1rem' }}
                    >
                        Order Now
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleRemoveAllFromCart}>
                        Delete all
                    </Button>
                </Box>
            </Box>

            {alertMessage && <SnackbarAlert message={alertMessage} severity="success" />}
        </Box>
    );
};

export default Cart;
