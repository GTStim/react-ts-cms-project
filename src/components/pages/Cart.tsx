import { Box, Button, Checkbox, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useCart } from "../../hooks/cartHooks";
import { cartService, productsService } from "../../config/service-config";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'title', headerName: 'Title', flex: 0.7 },
    { field: 'price', headerName: 'Price', type: 'number', flex: 0.7, valueFormatter: (params) => `$${params.value}` },
    { field: 'quantity', headerName: 'Quantity', type: 'number', flex: 0.5 },
    { 
        field: 'totalPrice', 
        headerName: 'Total Price', 
        type: 'number', 
        flex: 0.7, 
        valueFormatter: (params) => `$${params.value}` 
    },
    { field: 'checkbox', headerName: 'Select', flex: 0.5, renderCell: () => <Checkbox /> },
];

const Cart: React.FC = () => {
    const { cart, addToCart, removeFromCart } = useCart();
    const [rows, setRows] = useState<any[]>([]);
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        const loadCartData = async () => {
            const newRows = [];
        
            for (let productId in cart) {
                const quantity = cart[productId];
                const product = await productsService.getProductById(productId); // здесь мы добавили ключевое слово await
                console.log(product); // добавляем логирование продукта
        
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
        setProductCount(Object.keys(cart).length);  // Устанавливаем общее количество товаров как количество ключей в объекте cart
    }, [cart]);

    const handleOrder = () => {
        // Handle order here
    };

    const totalItems = rows.reduce((sum, row) => sum + row.quantity, 0);
    const totalSum = parseFloat(rows.reduce((sum, row) => sum + row.totalPrice, 0).toFixed(2));


    return (
        <Box sx={{ height: '70vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={rows} />
            <p>Total items: {totalItems}</p>
            <p>Total products: {productCount}</p>
            <p>Total sum: ${totalSum}</p>
            <Button variant="contained" color="primary" onClick={handleOrder}>Order Now</Button>
        </Box>
    );
}

export default Cart;
