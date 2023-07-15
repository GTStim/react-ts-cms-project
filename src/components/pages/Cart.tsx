import { Box, Button, Checkbox, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useCart } from '../../hooks/cartHooks';
import { productsService } from '../../config/service-config';
import { Delete, Add, Remove } from '@mui/icons-material';
import Product from '../../model/Product';
import SnackbarAlert from '../common/SnackbarAlert';
import { Confirmation } from '../common/Confirmation';

const Cart: React.FC = () => {
    const { cart, addToCart, removeFromCart } = useCart();
    const [rows, setRows] = useState<any[]>([]);
    const [productCount, setProductCount] = useState(0);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [productToRemove, setProductToRemove] = useState<Product | null>(null);
    const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
    const [cartQuantities, setCartQuantities] = useState<{ [productId: string]: number }>({});

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

    const increaseQuantity = async (productId: string) => {
        //TODO
    }
    
    const decreaseQuantity = (productId: string) => {
        //TODO
    };

    

    useEffect(() => {
        const loadCartData = async () => {
            const newRows = [];

            for (let productId in cart) {
                const quantity = cart[productId];
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
            <Box sx={{ height: '80vh', width: '90vw' }}>
                <DataGrid columns={columns} rows={rows} />
            </Box>
            <Confirmation
                open={openConfirm}
                title="Delete a product?"
                content={`Are you sure you want to remove item "${productToRemove?.title}" from cart?`}
                confirmFn={(isOk: boolean) => {
                    if (isOk && productToRemove) {
                        removeFromCart(productToRemove.id);
                        setAlertMessage(
                            `Product "${productToRemove.title}" was removed from your cart!`,
                        );
                    }
                    setOpenConfirm(false);
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'left', marginTop: '1rem' }}>
                <p style={{ margin: '1rem' }}>Total items: {totalItems}</p>
                <p style={{ margin: '1rem' }}>Total products: {productCount}</p>
                <p style={{ margin: '1rem' }}>Total sum: ${totalSum}</p>

                <Button variant="contained" color="primary" onClick={handleOrder}>
                    Order Now
                </Button>
                <Button variant="contained" color="primary" onClick={handleOrder}>
                    Delete all
                </Button>
            </Box>
            {alertMessage && <SnackbarAlert message={alertMessage} severity="success" />}
        </Box>
    );
};

export default Cart;
