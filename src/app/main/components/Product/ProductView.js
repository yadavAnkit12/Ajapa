import _ from '@lodash';
import { Typography, Card, CardContent, IconButton, Grid, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ProductAPIConfig } from 'src/app/main/API/apiConfig';
import axios from 'axios';

function ProductView(props) {

    const [productData, setProductData] = useState([])

    useEffect(() => {

        if (props?.viewid) {
            axios.get(`${ProductAPIConfig.productView}/${props?.viewid}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setProductData(response.data.data);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            });
        }
    }, [props?.viewid])

    const container = {
        show: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div height="100px">
            <div className="w-full flex flex-col min-h-full">
                <IconButton onClick={() => { props.setOpen(!props.open) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                    <CloseIcon />
                </IconButton>
            </div>

            <div className="w-full flex flex-col min-h-full">

                <motion.div variants={container} initial="hidden" animate="show" className="w-full">
                    <div className="md:flex  flex-col justify-between">
                        <Card component={motion.div} variants={item} className="w-full mb-16">
                            <div className="flex justify-center pt-24">
                                <Typography className="text-3xl mx-auto font-semibold leading-tight">
                                    Product Details
                                </Typography>
                            </div>

                            <CardContent className="px-32 py-24">
                                <Grid container>
                                    <Grid item xs={6}>
                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15"> Name</Typography>
                                            {productData.name}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Featured</Typography>
                                            {productData.featured ? 'Yes' : 'No'}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Type</Typography>
                                            {productData.type}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Status</Typography>
                                            {productData.status}
                                        </div>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Sku</Typography>
                                            {productData.sku}
                                        </div>


                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Price</Typography>
                                            {productData.price}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">ID</Typography>
                                            {productData._id}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15"> Regular Price</Typography>
                                            {productData.regular_price}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={6}>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Sales Price</Typography>
                                            {productData.sale_price}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Purchasable</Typography>
                                            {productData.purchasable ? 'Yes' : 'No'}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Rating_Count</Typography>
                                            {productData.rating_count}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">On Sale</Typography>
                                            {productData.on_sale ? 'Yes' : 'No'}
                                        </div>
                                    </Grid>

                                    <Grid item xs={6}>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Stock Status</Typography>
                                            {productData.stock_status}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Description</Typography>
                                            {productData?.description?.replace(/<\/?[^>]+>/gi, '')}
                                        </div>

                                        <div className="mb-24">
                                            <Typography className="font-semibold mb-4 text-15">Categories</Typography>
                                            {_.size(productData?.categories) > 0 && productData?.categories.map((category, idx) => (
                                                <div key={idx}>
                                                    {category.name}
                                                </div>
                                            )
                                            )}
                                        </div>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>

    );
}

export default ProductView;