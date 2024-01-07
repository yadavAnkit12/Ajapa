import _ from '@lodash';
import { Typography, Card, CardContent, IconButton, Box, Avatar, TableContainer, TableCell, TableRow, TableHead, Paper, Table, TableBody } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { OrderAPIConfig } from '../../API/apiConfig';
import axios from 'axios';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import './order.css';


function OrderView(props) {

    const [orderData, setOrderData] = useState([])

    useEffect(() => {

        if (props?.viewid) {
            axios.get(`${OrderAPIConfig.view}/${props?.viewid}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setOrderData(response.data.data);
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

    const printHandler = () => {
        let elem = document.getElementById("printThis");
        let domClone = elem.cloneNode(true);
        domClone.id = "clonedElement";

        let $printSection = document.getElementById("printSection");

        if (!$printSection) {
            $printSection = document.createElement("div");
            $printSection.id = "printSection";
            document.body.appendChild($printSection);
        }

        $printSection.innerHTML = "";
        $printSection.appendChild(domClone);
        window.print();
    }

    return (
        <div>
            <div className="w-full flex flex-col min-h-full">
                <IconButton onClick={() => { props.setOpen(!props.open) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                    <CloseIcon />
                </IconButton>
            </div>

            <div className="w-full flex flex-col min-h-full">

                <motion.div variants={container} initial="hidden" animate="show" className="w-full">
                    <div className="md:flex  flex-col justify-between">
                        <div className="flex flex-col flex-1 mx-10" id="printThis">
                            <Card component={motion.div} variants={item} className="w-full">
                                <div className="flex sm:flex-row flex-col justify-center items-center pt-24 printContent">
                                    <Typography className="text-3xl mx-auto font-semibold leading-tight" sx={{ textDecoration: 'underline' }}>
                                        Order Details
                                    </Typography>
                                    <FuseSvgIcon className="text-48 float-left mx-10" size={24} color="action" onClick={() => printHandler()}>material-outline:local_printshop</FuseSvgIcon>
                                </div>
                                <CardContent className="flex sm:flex-row flex-col flex-wrap px-32 py-24 justify-between printContent">
                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Order Id</Typography>
                                        {orderData.orderId}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Order Date</Typography>
                                        {orderData.date_created}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Order Status</Typography>
                                        {orderData.status}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Last Updated On</Typography>
                                        {orderData.date_modified}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Order Amount</Typography>
                                        {orderData.totalAmount}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Patient Mobile</Typography>
                                        {orderData.patientMobile}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Billing Address</Typography>
                                        {_.get(orderData, 'billing.first_name') && <>{`${_.get(orderData, 'billing.first_name')} ${_.get(orderData, 'billing.last_name')},`}<br /></>}
                                        {_.get(orderData, 'billing.address_1') && <>{`${_.get(orderData, 'billing.address_1')},`}<br /></>}
                                        {_.get(orderData, 'billing.address_2') && <>{`${_.get(orderData, 'billing.address_2')},`}<br /></>}
                                        {_.get(orderData, 'billing.city') ? `${_.get(orderData, 'billing.city')}, ` : ''}
                                        {_.get(orderData, 'billing.state') ? `${_.get(orderData, 'billing.state')}, ` : ''}
                                        {_.get(orderData, 'billing.country') && <>{`${_.get(orderData, 'billing.country')},`}<br /></>}
                                        {_.get(orderData, 'billing.postcode') && <>{`Postal Code-${_.get(orderData, 'billing.postcode')},`}<br /></>}
                                        {_.get(orderData, 'billing.phone') && <>{`Phone-${_.get(orderData, 'billing.phone')}`}<br /></>}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Shipping Address</Typography>
                                        {_.get(orderData, 'shipping.first_name') && <>{`${_.get(orderData, 'shipping.first_name')} ${_.get(orderData, 'shipping.last_name')},`}<br /></>}
                                        {_.get(orderData, 'shipping.address_1') && <>{`${_.get(orderData, 'shipping.address_1')},`}<br /></>}
                                        {_.get(orderData, 'shipping.address_2') && <>{`${_.get(orderData, 'shipping.address_2')},`}<br /></>}
                                        {_.get(orderData, 'shipping.city') ? `${_.get(orderData, 'shipping.city')}, ` : ''}
                                        {_.get(orderData, 'shipping.state') ? `${_.get(orderData, 'shipping.state')}, ` : ''}
                                        {_.get(orderData, 'shipping.country') && <>{`${_.get(orderData, 'shipping.country')},`}<br /></>}
                                        {_.get(orderData, 'shipping.postcode') && <>{`Postal Code-${_.get(orderData, 'shipping.postcode')},`}<br /></>}
                                        {_.get(orderData, 'shipping.phone') && <>{`Phone-${_.get(orderData, 'shipping.phone')}`}<br /></>}
                                    </div>
                                </CardContent>
                                {_.size(orderData.line_items) > 0 && <>
                                    <div className="flex justify-start pt-24 mx-32">
                                        <Typography className="font-semibold mb-4 text-15">
                                            Items Ordered
                                        </Typography>
                                    </div>
                                    <TableContainer component={Paper} className="mx-32 mb-24 w-auto">
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow sx={{
                                                    backgroundColor: (theme) =>
                                                        theme.palette.mode === 'light'
                                                            ? lighten(theme.palette.background.default, 0.4)
                                                            : lighten(theme.palette.background.default, 0.02),
                                                }}>
                                                    <TableCell>Product Id</TableCell>
                                                    <TableCell>Product Name</TableCell>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell>Sku</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                    <TableCell>Sub Total</TableCell>
                                                    <TableCell>Tax</TableCell>
                                                    <TableCell>Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderData.line_items.map((row, idx) => (
                                                    <TableRow
                                                        key={idx}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.product_id}
                                                        </TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                                <Avatar alt="Avatar Preview" src={row?.image?.src} sx={{
                                                                    width: 60,
                                                                    height: 60,
                                                                    marginLeft: 1,
                                                                }}
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{row.sku}</TableCell>
                                                        <TableCell>{row.price}</TableCell>
                                                        <TableCell>{row.quantity}</TableCell>
                                                        <TableCell>{row.subtotal}</TableCell>
                                                        <TableCell>{row.total_tax}</TableCell>
                                                        <TableCell>{row.total}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>}
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

    );
}

export default OrderView;