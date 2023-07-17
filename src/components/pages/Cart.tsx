import { Box, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useCart } from '../../hooks/cartHooks';
import { productsService } from '../../config/service-config';
import { Delete, Add, Remove } from '@mui/icons-material';
import Product from '../../model/Product';
import SnackbarAlert from '../common/SnackbarAlert';
import {Confirmation} from '../common/Confirmation';

const Cart: React.FC = () => {
    const { cart, addToCart, removeFromCart, clearCart } = useCart();
    const [rows, setRows] = useState<any[]>([]);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [productToRemove, setProductToRemove] = useState<Product | null>(null);
    const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

    const handleRemoveFromCart = (product: Product) => {
        setProductToRemove(product);
        setOpenConfirm(true);
    };

    const adjustQuantity = (productId: string, amount: number) => {
        const currentQuantity = quantities[productId] || 0;
        const newQuantity = currentQuantity + amount;

        if (newQuantity > 0) {
            addToCart(productId, amount);
        } else {
            removeFromCart(productId, -amount);
        }

        setQuantities({
            ...quantities,
            [productId]: newQuantity,
        });
    };

    const handleRemoveAllFromCart = () => {
        setProductToRemove(null);
        setOpenConfirm(true);
    };

    useEffect(() => {
        const loadCartData = async () => {
            const productIds = Object.keys(cart);
            const products = await Promise.all(productIds.map(productId => productsService.getProductById(productId)));
            const newRows = products.map(product => ({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: cart[product.id],
                totalPrice: product.price * cart[product.id],
                checkbox: true,
            }));
            
            setRows(newRows);
            setQuantities(cart);
        };

        loadCartData();
    }, [cart]);

    const handleOrder = () => {};

    const totalItems = rows.reduce((sum, row) => sum + row.quantity, 0);
    const totalSum = parseFloat(rows.reduce((sum, row) => sum + row.totalPrice, 0).toFixed(2));

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 0.7 },
        { field: 'price', headerName: 'Price', type: 'number', flex: 0.7, valueFormatter: params => `$${params.value}` },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            flex: 0.5,
            renderCell: params => (
                <div>
                    <IconButton size="small" onClick={() => adjustQuantity(params.row.id, -1)}><Remove /></IconButton>
                    {params.value}
                    <IconButton size="small" onClick={() => adjustQuantity(params.row.id, 1)}><Add /></IconButton>
                </div>
            ),
        },
        { field: 'totalPrice', headerName: 'Total Price', type: 'number', flex: 0.7, valueFormatter: params => `$${params.value}` },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Tools',
            getActions: params => [
                <GridActionsCellItem
                    label="remove"
                    icon={<Delete />}
                    onClick={() => handleRemoveFromCart(params.row)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ height: isMobile ? '60vh' : '75vh', width: '90vw', backgroundColor: 'white' }}>
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
                confirmFn={isOk => {
                    if (isOk) {
                        if (productToRemove) {
                            adjustQuantity(productToRemove.id, -quantities[productToRemove.id]);
                            setAlertMessage(`Product "${productToRemove.title}" was removed from your cart!`);
                        } else {
                            clearCart();
                            setQuantities({});
                            setAlertMessage('All products were removed from your cart!');
                        }
                    }
                    setOpenConfirm(false);
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', width: '90vw', flexDirection: isMobile ? 'column' : 'row' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: '1rem' }}>Total items: {totalItems}</p>
                    <p style={{ margin: '1rem' }}>Total products: {Object.keys(cart).length}</p>
                    <p style={{ margin: '1rem' }}>Total sum: ${totalSum}</p>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: isMobile ? '1rem' : 'initial' }}>
                    <Button variant="contained" color="primary" onClick={handleOrder} style={{ marginRight: '1rem' }}>Order Now</Button>
                    <Button variant="contained" color="primary" onClick={handleRemoveAllFromCart}>Delete all</Button>
                </Box>
            </Box>
            {alertMessage && <SnackbarAlert message={alertMessage} severity="success" />}
        </Box>
    );
};

export default Cart;
