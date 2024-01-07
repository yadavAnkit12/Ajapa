import _ from '@lodash';

import { Typography, Card, CardContent, IconButton } from '@mui/material';

import { useParams } from 'react-router-dom';

import { motion } from 'framer-motion';

import { transactionAPIConfig } from 'src/app/main/API/apiConfig';

import { useState, useEffect } from 'react';

import axios from 'axios';

import CloseIcon from '@mui/icons-material/Close';

function TransationView(props) {

    const routeParams = useParams();
    const [transitionID, setTransitionID] = useState(null);
    const [transitionData, setTransitionData] = useState([])


    useEffect(() => {
        const { transitionId } = routeParams;

        setTransitionID(transitionId);

    }, [])


    useEffect(() => {

        if (props?.viewid) {
            axios.get(`${transactionAPIConfig.transactionView}/${props?.viewid}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            })
                .then((response) => {
                    setTransitionData(response.data.data);
                }).catch((error) => {
                    console.error("error", error);
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
            <div className="w-full flex flex-col min-h-full" id="printThis">


                <motion.div variants={container} initial="hidden" animate="show" className="w-full">
                    <div className="md:flex  flex-col justify-between">
                        <div className="flex flex-col flex-1 mx-10">

                            <Card component={motion.div} variants={item} className="w-full mb-32">
                                <div className="flex sm:flex-row flex-col justify-center items-center pt-24 printContent">
                                    <Typography className="text-2xl font-semibold leading-tight">
                                        Patient Details
                                    </Typography>
                                </div>
                                <CardContent className="flex sm:flex-row flex-col flex-wrap px-32 py-24 justify-between printContent">


                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Name</Typography>
                                        {transitionData?.patientId?.name}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Mobile No.</Typography>
                                        {transitionData?.patientId?.mobile}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Plan Name</Typography>
                                        {transitionData?.patientId?.membershipPlanName}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Status</Typography>
                                        {transitionData?.patientId?.status}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Free Appointment</Typography>
                                        {transitionData?.patientId?.freeAppointment}
                                    </div>

                                </CardContent>
                            </Card>


                            <Card component={motion.div} variants={item} className="w-full mb-32">
                                <div className="flex sm:flex-row flex-col justify-center items-center pt-24 printContent">
                                    <Typography className="text-2xl font-semibold leading-tight">
                                        Transaction Details
                                    </Typography>
                                </div>
                                <CardContent className="flex sm:flex-row flex-col flex-wrap px-32 py-24 justify-between printContent">


                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Order Type</Typography>
                                        {transitionData?.orderType}
                                    </div>



                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Payment Mode</Typography>
                                        {transitionData?.paymentMode}
                                    </div>


                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Transaction Date</Typography>
                                        {transitionData?.createdAt}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Platform</Typography>
                                        {transitionData?.patientId?.platform}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Transaction Id</Typography>
                                        {transitionData?.transactionId}
                                    </div>


                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Price</Typography>
                                        {transitionData?.price}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Transaction Type</Typography>
                                        {transitionData?.transactionType}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Transaction Remark</Typography>
                                        {transitionData?.transactionRemark || 'NA'}
                                    </div>

                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

    );
}

export default TransationView;