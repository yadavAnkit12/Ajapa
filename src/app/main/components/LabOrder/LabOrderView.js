import _ from '@lodash';
import { Typography, Card, CardContent, IconButton, TableContainer, TableCell, TableRow, TableHead, Paper, Table, TableBody } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LabOrderAPIConfig } from '../../API/apiConfig';
import axios from 'axios';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import './order.css';
import { lighten } from '@mui/material/styles';

function LabOrderView(props) {

    const [orderData, setOrderData] = useState([])

    useEffect(() => {

        if (props?.viewid) {
            axios.get(`${LabOrderAPIConfig.view}/${props?.viewid}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setOrderData(response.data.data)
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

            <div className="w-full flex flex-col max-h-full">

                <motion.div variants={container} initial="hidden" animate="show" className="w-full">
                    <div className="flex flex-col justify-between">
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
                                        <Typography className="font-semibold mb-4 text-15">User Name</Typography>
                                        {orderData.patientName}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">User Mobile</Typography>
                                        {orderData.patientMobile}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Order Date</Typography>
                                        {orderData.createdAt && orderData.createdAt.split('T')[0]}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">User Address</Typography>
                                        {_.get(orderData, 'address.first_name') && <>{`${_.get(orderData, 'address.first_name')} ${_.get(orderData, 'address.last_name')},`}<br /></>}
                                        {_.get(orderData, 'address.address_1') && <>{`${_.get(orderData, 'address.address_1')},`}<br /></>}
                                        {_.get(orderData, 'address.address_2') && <>{`${_.get(orderData, 'address.address_2')},`}<br /></>}
                                        {_.get(orderData, 'address.city') ? `${_.get(orderData, 'address.city')}, ` : ''}
                                        {_.get(orderData, 'address.state') ? `${_.get(orderData, 'address.state')}, ` : ''}
                                        {_.get(orderData, 'address.landmark') ? `${_.get(orderData, 'address.landmark')}, ` : ''}
                                        {_.get(orderData, 'address.pincode') ? `${_.get(orderData, 'address.pincode')}, ` : ''}
                                        {_.get(orderData, 'address.country') && <>{`${_.get(orderData, 'address.country')},`}<br /></>}
                                        {/* {_.get(orderData, 'address.postcode') && <>{`Postal Code-${_.get(orderData, 'address.postcode')},`}<br /></>} */}
                                        {_.get(orderData, 'address.phone') && <>{`Phone-${_.get(orderData, 'address.phone')}`}<br /></>}

                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Total Lab Test</Typography>
                                        {orderData.totalLabTest}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Order Status</Typography>
                                        {orderData.status}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Organisation Name</Typography>
                                        {orderData.organizationName}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Brand Name</Typography>
                                        {orderData.brandName}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Order Number</Typography>
                                        {orderData.orderNumber}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Total Amount</Typography>
                                        {orderData.totalAmount}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Total Pathology Amount</Typography>
                                        {orderData.totalPathologyAmount}
                                    </div>
                                </CardContent>

                                {_.size(orderData.services) > 0 && <>

                                    <div className="flex justify-start pt-24 mx-32">
                                        <Typography className="font-semibold mb-4 text-15">
                                            Lab Order Details
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
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Mobile</TableCell>
                                                    <TableCell>Relation</TableCell>
                                                    <TableCell>Service Name</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Items Price</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                    <TableCell>Published Price</TableCell>
                                                    <TableCell>Organizations Name</TableCell>
                                                    <TableCell>Email</TableCell>
                                                    <TableCell>Sample Type</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Partner Id</TableCell>
                                                    <TableCell>Sample Collected</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderData.services.map((row, idx) => (
                                                    _.size(row.members) > 0 && row.members.map((member, index) => (
                                                        <TableRow
                                                            key={idx + index}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {member.memberId.name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {member.memberId.mobile}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {member.memberId.relation}
                                                            </TableCell>
                                                            <TableCell>{row.serviceId.serviceName}</TableCell>
                                                            <TableCell>{row.serviceId.price}</TableCell>
                                                            <TableCell>{row.itemsPrice}</TableCell>
                                                            <TableCell>{row.quantity}</TableCell>
                                                            <TableCell>{row.serviceId.publishedPrice}</TableCell>
                                                            <TableCell>{row.serviceId.organizationsName}</TableCell>
                                                            <TableCell>{row.serviceId.email}</TableCell>
                                                            <TableCell>{row.serviceId.sampleType}</TableCell>
                                                            <TableCell>{row.serviceId.status}</TableCell>
                                                            <TableCell>{row.serviceId.partnerId}</TableCell>
                                                            <TableCell>{member.isCollect ? 'Yes' : 'No'}</TableCell>
                                                        </TableRow>
                                                    )
                                                    ))
                                                )}
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

export default LabOrderView;