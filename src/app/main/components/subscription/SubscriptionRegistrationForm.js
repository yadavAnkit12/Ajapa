import { Box, MenuItem, Container, Button, Typography, TextField, Stack, IconButton, InputAdornment, Link, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from "axios";
import { useFormik } from 'formik';
import { useDispatch } from "react-redux";
import { showMessage } from 'app/store/fuse/messageSlice';
import { membershipAPIConfig, paymentModeAPIConfig, subscriptionAPIConfig, patientAPIConfig } from '../../API/apiConfig';
import { _ } from 'core-js';
import PatientRegisterForm from '../patient/patientRegisterForm';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
    maxWidth: '1200px',
    maxHeight: '500px',
    overflow: 'auto'
};
const SubscriptionRegisterForm = (props) => {
    const dispatch = useDispatch();
    const [planList, setPlanList] = useState([]);
    const [paymentList, setPaymentList] = useState([]);
    const [errMsg, setErrMsg] = useState(false);
    const [searchedData, setSearchedData] = useState({});
    const [open, setOpen] = useState(false);
    const [numerr, setNumERR] = useState(false);

    useEffect(() => {
        setSearchedData(props.patientData || {});
        axios.get(membershipAPIConfig.activePlan, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setPlanList(response.data.data);
                //payment mode list
                axios.get(paymentModeAPIConfig.list, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        setPaymentList(response.data.data);
                    } else {
                        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                    }
                })
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }, []);

    useEffect(() => {
        if (searchedData) {
            formik.setValues({
                ...formik.values,
                patientMobile: searchedData.mobile || '',
                name: searchedData.name || '',
                membershipPlan: searchedData?.membershipPlanId?._id || '',
                expiryMonth: searchedData?.membershipPlanId?.expiryMonth || '',
                transactionGatewayId: searchedData?.subscriptionId?.transactionGatewayId || '',
                paymentMode: searchedData?.subscriptionId?.paymentMode || '',
                userRemark: searchedData?.subscriptionId?.userRemark || '',
                price: searchedData?.membershipPlanId?.priceWithGst || '',
            })
        }
    }, [searchedData])

    const validationSchema = Yup.object().shape({
        patientMobile: Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required('Mobile number is required'),
        name: Yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name').min(2).max(40).required(),
        membershipPlan: Yup.string().required('Membership plan is required'),
        transactionGatewayId: Yup.string().min(10, "Not negative number").max(60, "Not Positive number").required('Transaction id is required'),
        paymentMode: Yup.string().required('Payment mode is required'),
        userRemark:Yup.string().required('Remark is required')
    });

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('patientId', searchedData?._id);
        formData.append('patientMobile', values.mobile);
        formData.append('referenceId', values.membershipPlan);
        formData.append('transactionGatewayId', values.transactionGatewayId);
        formData.append('paymentMode', values.paymentMode || '');
        formData.append('userRemark', values.userRemark);
        formData.append('price', values.price)

        if (searchedData?._id) {
            axios.post(subscriptionAPIConfig.subscribe, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 201) {
                    dispatch(showMessage({ message: "Subscribed successfully", variant: 'success' }));
                    formik.resetForm()
                    props.setOpen(!props.open);
                    props.setChange(!props.change);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
        } else {
            dispatch(showMessage({ message: "Patient not selected" }));
        }
    };

    const formik = useFormik({
        initialValues: {
            patientId: searchedData?._id,
            patientMobile: '',
            membershipPlan: '',
            expiryMonth: '',
            transactionGatewayId: '',
            paymentMode: '',
            userRemark: '',
            price: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    //price function  
    const findPrice = (selectedPlan) => {
        formik.setValues({
            ...formik.values,
            expiryMonth: selectedPlan.expiryMonth,
            price: selectedPlan.priceWithGst || 0
        });
    };

    const getPatientDetail = () => {

        let item = formik.values.patientMobile;
        if (item.length !== 10) {
            setNumERR(true);
            return;
        } else {
            setNumERR(false);
        }
        axios.get(`${patientAPIConfig.getPatientByMobile}/${item}`, {
            headers: {
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (!response.data.data) {
                setErrMsg(true);
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                formik.setValues({ patientMobile: formik.values.patientMobile });
                setSearchedData(null);
            } else {
                setErrMsg(false);
                setSearchedData(response.data.data);
            }
        })
    }

    const keyDownHandler = (e) => {
        if ((e.code === "Enter" || e.code === "NumpadEnter") && e.target.value.length === 10) {
            e.preventDefault();
            getPatientDetail(e.target.value);
        }
    }

    return (
        <Container maxWidth="md">
            <React.Fragment>
                <IconButton onClick={() => { props.setOpen(!props.open) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
                    Subscription form
                </Typography>

                <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
                    <Stack spacing={2} sx={{ mt: 2, marginBottom: 4 }}>
                        <TextField
                            required
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="patientMobile"
                            label="Mobile"
                            onKeyDown={keyDownHandler}
                            {...formik.getFieldProps('patientMobile')}
                            error={(formik.touched.patientMobile && !!formik.errors.patientMobile)}
                            helperText={formik.touched.patientMobile && formik.errors.patientMobile}
                            disabled={!!_.get(searchedData, 'mobile')}
                            InputProps={{
                                endAdornment: (
                                    !_.get(searchedData, 'mobile') && <InputAdornment style={{ cursor: 'pointer' }} position="end" size="small" onClick={() => getPatientDetail()}>
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            required
                            type="text"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="name"
                            label="Patient Name"
                            {...formik.getFieldProps('name')}
                            error={(formik.touched.name && !!formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            disabled
                            InputLabelProps={{
                                shrink: formik.values.name ? true : false,
                            }}
                        />

                        {
                            (!searchedData && errMsg && !numerr) &&
                            <Box
                                sx={{
                                    maxWidth: '100%',
                                    height: 100,
                                }}
                            >
                                <Button
                                    className=""
                                    component={Link}
                                    onClick={() => setOpen(true)}
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    disabled={!formik.values.patientMobile}
                                >
                                    Register Patient
                                </Button>
                            </Box>
                        }

                        <TextField
                            select
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="membershipPlan"
                            label="Membership plan"
                            name="membershipPlan"
                            required
                            {...formik.getFieldProps('membershipPlan')}
                            error={(formik.touched.membershipPlan && !!formik.errors.membershipPlan)}
                            helperText={formik.touched.membershipPlan && formik.errors.membershipPlan}
                        >
                            {planList.map((plan) => (
                                <MenuItem
                                    key={plan._id}
                                    value={plan._id}
                                    onClick={() => findPrice(plan)}
                                >
                                    {`${plan.planName}`}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="expiryMonth"
                            label="Plan Expiry Month"
                            required
                            {...formik.getFieldProps('expiryMonth')}
                            error={(formik.touched.expiryMonth && !!formik.errors.expiryMonth)}
                            helperText={(formik.touched.expiryMonth && formik.errors.expiryMonth)}
                            disabled
                            InputLabelProps={{
                                shrink: formik.values.expiryMonth ? true : false,
                            }}
                        />

                        <TextField
                            select
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="paymentMode"
                            label="Payment Mode"
                            name="paymentMode"
                            required
                            {...formik.getFieldProps('paymentMode')}
                            error={(formik.touched.paymentMode && !!formik.errors.paymentMode)}
                            helperText={formik.touched.paymentMode && formik.errors.paymentMode}
                            sx={{ mb: 4 }}
                        >
                            {paymentList.map((type) => (
                                <MenuItem key={type._id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            type="text"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="transactionGatewayId"
                            label="Transaction Id"
                            name="transactionGatewayId"
                            required
                            {...formik.getFieldProps('transactionGatewayId')}
                            error={(formik.touched.transactionGatewayId && !!formik.errors.transactionGatewayId)} // Convert the error value to boolean
                            helperText={(formik.touched.transactionGatewayId && formik.errors.transactionGatewayId)}
                            sx={{ mb: 4 }}
                        />

                        <TextField
                            type="text"
                            variant="outlined"
                            color="secondary"
                            required
                            fullWidth
                            id="userRemark"
                            label="Remark"
                            name="userRemark"
                            {...formik.getFieldProps('userRemark')}
                            error={(formik.touched.userRemark && !!formik.errors.userRemark)} // Convert the error value to boolean
                            helperText={(formik.touched.userRemark && formik.errors.userRemark)}
                            sx={{ mb: 4 }}
                        />
                        <Box sx={{ width: 700, maxWidth: '150%', marginBottom: 2 }}>

                            <TextField
                                type="number"
                                id="price"
                                label="Amount"
                                required
                                {...formik.getFieldProps('price')}
                                error={(formik.touched.price && !!formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                                variant="standard"
                                disabled
                                InputLabelProps={{
                                    shrink: formik.values.price ? true : false,
                                }}
                                name="price"
                            />
                        </Box>
                        <br />
                        {((!_.get(searchedData, 'status') || _.get(searchedData, 'status') !== 'subscribed') || (_.get(searchedData, 'status') === 'subscribed' && _.get(searchedData, 'freeAppointment') === 0)) && <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Subscribe
                        </Button>}
                    </Stack>
                </form>
            </React.Fragment>
            {
                open &&
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <PatientRegisterForm mobile={formik.values.patientMobile} setOpen={setOpen} setSearchedData={setSearchedData} />
                    </Box>
                </Modal>
            }
        </Container >
    );
};

export default SubscriptionRegisterForm;