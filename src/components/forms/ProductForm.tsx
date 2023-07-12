
import { Button, Grid, TextField, Box } from '@mui/material';
import Product from '../../model/Product';
import InputResult from '../../model/InputResult';
import { useState } from 'react';

type Props = {
    submitFn: (product: Product) => Promise<InputResult>;
    productUpdated?: Product;
};

const initialProduct: Product = {
    id: '',
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
};

export const ProductForm: React.FC<Props> = ({ submitFn, productUpdated }) => {
    const [product, setProduct] = useState<Product>(productUpdated || initialProduct);
  
    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res = await submitFn(product);
        res.status === 'success' && event.target.reset();
        setProduct(initialProduct);
    }

    function onReset() {
        setProduct(initialProduct);
    }
  
    return (
        <Box sx={{ marginTop: { sm: '25vh' } }}>
            <form onSubmit={onSubmitFn}>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={8} sm={5}>
                        <TextField
                            required
                            fullWidth
                            label="Title"
                            value={product.title}
                            onChange={(e) => setProduct({ ...product, title: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={8} sm={5}>
                        <TextField
                            required
                            fullWidth
                            label="Price"
                            type="number"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                        />
                    </Grid>
                    <Grid item xs={8} sm={5}>
                        <TextField
                            required
                            fullWidth
                            label="Description"
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={8} sm={5}>
                        <TextField
                            required
                            fullWidth
                            label="Category"
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={8} sm={5}>
                        <TextField
                            required
                            fullWidth
                            label="Image URL"
                            value={product.image}
                            onChange={(e) => setProduct({ ...product, image: e.target.value })}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ marginTop: { xs: '10vh', sm: '5vh' }, textAlign: 'center' }}>
                    <Button type="submit">Submit</Button>
                     <Button type="reset" onClick={onReset}>Reset</Button>
                </Box>
            </form>
        </Box>
    );
};
