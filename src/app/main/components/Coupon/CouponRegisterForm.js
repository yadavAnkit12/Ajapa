import { Grid, TextField, Button, Container, Stack, Avatar, Box, Typography, MenuItem, IconButton } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from '@mui/icons-material/Close';

import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';

import * as Yup from 'yup';

import axios from "axios";

import 'react-quill/dist/quill.snow.css';

import { useDispatch } from "react-redux";

import { showMessage } from "app/store/fuse/messageSlice";

import ReactQuill from 'react-quill';

import { couponAPIConfig } from '../../API/apiConfig';

const DiscountTypeArray = [
    { _id: 'Percentage', type: 'Percentage' },
    { _id: 'FlatRate', type: 'Flat Rate' },
];
const CouponRegisterForm = (props) => {

    const dispatch = useDispatch();
    const [profileImg, setProfileImg] = useState(null);
    const [planData, setPlanData] = useState({
        name: '',
        code: 0,
        couponType: 0,
        startDate: '',
        endDate: '',
        offType: '',
        minimumOffPrice: 0,
        description: '',
        image: '',
        maxOffPercent: 0,
        price: ''
    });

    useEffect(() => {
        return () => {
            setPlanData(null);
            formik.resetForm();
        }
    }, [])

    useEffect(() => {
        if (props.couponId) {
            axios.get(`${couponAPIConfig.fetch}/${props.couponId}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setPlanData(response.data.data);
                    setProfileImg(response?.data?.data?.image);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                    setProfileImg('');
                }
            })
        }
    }, [props.couponId]);

    useEffect(() => {
        if (planData) {
            formik.setValues({
                name: planData.name || '',
                code: planData.code || '',
                couponType: planData.couponType || "",
                startDate: planData.startDate || "",
                endDate: planData.endDate || "",
                offType: planData.offType || "",
                minimumOffPrice: planData.minimumOffPrice || 0,
                description: planData.description || '',
                image: planData.image || '',
                maxOffPercent: planData.maxOffPercent || 0,
                price: planData.price || ''
            });
        }
    }, [planData]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().matches(/^[a-zA-Z0-9? ,_-]+$/, "Only alphanumeric characters are allowed").required("Coupon Title is required"),
        code: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters are allowed").required("Coupon Code is required"),
        couponType: Yup.string().required('Coupon Type is required'),
        startDate: Yup.string().required("Start Date  is required"),
        endDate: Yup.string().required("End Date  is required"),
        offType: Yup.string().required("Discount type  is required"),
        // minimumOffPrice: Yup.number().required("Minimum Off Amount  is required")
        //     .test('greaterThanFieldB', 'Minimum off amount can not be greater than maximum off amount', function (value) {
        //         return formik.values.price > 0 && value < formik.values.price;
        //     }),
        // maxOffPercent: Yup.number().required("Maximum Off Percent  is required"),
        // price: Yup.number().positive("price must be more than 0")
        //     .integer("price must be an integer")
        //     .required("price is required")
        //     .test('greaterThanFieldA', 'Maximum off amount can not be less than minimum off amount', function (value) {
        //         return formik.values.minimumOffPrice > 0 && value > formik.values.minimumOffPrice;
        //     }),
        maxOffPercent: Yup.number().required('% is Required'),
        maximumnAmount: Yup.number(),
        price: Yup.number().required(' Amount is Required'),
        minimumOffPrice: Yup.number().required(' Amount is Required'),
        description: Yup.string()
    });
    

    const handleSubmit = (values) => {

        if (values.offType === 'FlatRate') {
            if (values.price >= values.minimumOffPrice) {
                dispatch(showMessage({ message: 'Purchasing price should be greater than off price' }));
            }
            else {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('code', values.code);
                formData.append('couponType', values.couponType);
                formData.append('startDate', values.startDate);
                formData.append('endDate', values.endDate);
                formData.append('offType', values.offType);
                formData.append('minimumOffPrice', values.minimumOffPrice);
                formData.append('description', values.description);
                formData.append('image', values.image || '');
                formData.append('maxOffPercent', values.maxOffPercent);
                formData.append('price', values.price);

                if (props.couponId) {
                    axios.put(`${couponAPIConfig.edit}/${props.couponId}`, formData, {
                        headers: {
                            'Content-type': 'multipart/form-data',
                            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                        },
                    }).then((response) => {
                        if (response.status === 200) {
                            dispatch(showMessage({ message: 'Coupon updated successfully', variant: 'success' }));
                            props.setOpen(!props.open);
                            props.setChange(!props.change);
                        } else {
                            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                        }
                    })

                } else {
                    axios.post(couponAPIConfig.create, formData, {
                        headers: {
                            'Content-type': 'multipart/form-data',
                            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                        },
                    }).then((response) => {
                        if (response.status === 201) {
                            dispatch(showMessage({ message: 'Coupon added successfully', variant: 'success' }));
                            formik.resetForm();
                            setProfileImg(null);
                            props.setOpen(!props.open);
                            props.setChange(!props.change);
                        } else {
                            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                        }
                    })
                }

            }
        }

        // else if (values.price <= values.maxOffPercent) {
        //     dispatch(showMessage({ message: 'Maximum Off Percent should not be greater than price' }));
        // }
        else {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('code', values.code);
            formData.append('couponType', values.couponType);
            formData.append('startDate', values.startDate);
            formData.append('endDate', values.endDate);
            formData.append('offType', values.offType);
            formData.append('minimumOffPrice', values.minimumOffPrice);
            formData.append('description', values.description);
            formData.append('image', values.image || '');
            formData.append('maxOffPercent', values.maxOffPercent);
            formData.append('price', values.price);

            if (props.couponId) {
                axios.put(`${couponAPIConfig.edit}/${props.couponId}`, formData, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        dispatch(showMessage({ message: 'Coupon updated successfully', variant: 'success' }));
                        props.setOpen(!props.open);
                        props.setChange(!props.change);
                    } else {
                        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                    }
                })

            } else {
                axios.post(couponAPIConfig.create, formData, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                }).then((response) => {
                    if (response.status === 201) {
                        dispatch(showMessage({ message: 'Coupon added successfully', variant: 'success' }));
                        formik.resetForm();
                        setProfileImg(null);
                        props.setOpen(!props.open);
                        props.setChange(!props.change);
                    } else {
                        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                    }
                })
            }
        };
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            code: '',
            couponType: "",
            startDate: "",
            endDate: "",
            offType: '',
            maximumnAmount: 0,
            description: '',
            image: null,
            maxOffPercent: '',
            price: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    }, []);


    const handleAvatarChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue('image', file);
            setProfileImg(URL.createObjectURL(file));
        } else {
            formik.setFieldValue('image', '');
            setProfileImg('');
        }
    };

    return (
        <Container maxWidth="md">

            <IconButton onClick={() => { props.setOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                <CloseIcon />
            </IconButton>

            <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
                {props.couponId ? 'Coupon Plan Update Form' : 'Coupon Plan Add Form'}
            </Typography>


            <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
                <Grid container>
                    <Grid item xs={6}>
                        <Stack spacing={2} sx={{ mt: 2, }}>
                            <TextField
                                type="string"
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                id="name"
                                label="Coupon Title"
                                required
                                {...formik.getFieldProps('name')}
                                error={(formik.touched.name && !!formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />

                            <TextField
                                type="string"
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                id="codecode"
                                label="Coupon Code"
                                required
                                {...formik.getFieldProps('code')}
                                error={(formik.touched.code && !!formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code}
                                onChange={(e) => {
                                    if (e.target.value < 0)
                                        return;
                                    formik.getFieldProps('code').onChange(e);
                                }}
                            />

                            <TextField
                                type='date' InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                id="startDate"
                                label="Start Date"
                                required
                                {...formik.getFieldProps('startDate')}
                                error={(formik.touched.startDate && !!formik.errors.startDate)}
                                helperText={formik.touched.startDate && formik.errors.startDate}
                            />

                            {
                                <TextField
                                    select
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    id="couponType"
                                    label="Coupon Type"
                                    required
                                    {...formik.getFieldProps('couponType')}
                                    error={(formik.touched.couponType && !!formik.errors.couponType)}
                                    helperText={formik.touched.couponType && formik.errors.couponType}
                                >
                                    <MenuItem value={"Medicine"}>Medicine</MenuItem>
                                    <MenuItem value={"LabTest"}>Lab Test</MenuItem>
                                    <MenuItem value={"Appointment"}>Appointment</MenuItem>
                                    <MenuItem value={"Subscription"}>Subscription</MenuItem>
                                </TextField>

                            }

                        </Stack>
                    </Grid>

                    <Grid item xs={6}>
                        <Stack spacing={2} sx={{ mt: 2, marginBottom: 2, marginLeft: 2 }}>

                            <TextField
                                type='date' InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                id="endDate"
                                label="End Date"
                                required
                                {...formik.getFieldProps('endDate')}
                                error={(formik.touched.endDate && !!formik.errors.endDate)}
                                helperText={formik.touched.endDate && formik.errors.endDate}
                            />



                            <TextField
                                select
                                variant="outlined"
                                color="secondary"
                                id="offType"
                                label="Discount Type"
                                required
                                {...formik.getFieldProps('offType')}
                                error={(formik.touched.offType && !!formik.errors.offType)}
                                helperText={formik.touched.offType && formik.errors.offType}
                                sx={{ mb: 2 }}

                            >
                                {DiscountTypeArray.map((name) => (
                                    <MenuItem key={name._id} value={name._id}>
                                        {name.type}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {formik.values.offType === "Percentage" && <TextField
                                type="number"
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                id="maxOffPercent"
                                label="Maximum Off Percent"
                                required

                                {...formik.getFieldProps('maxOffPercent')}
                                error={(formik.touched.maxOffPercent && !!formik.errors.maxOffPercent)}
                                helperText={formik.touched.maxOffPercent && formik.errors.maxOffPercent}
                                onChange={(e) => {
                                    if (e.target.value < 0 || e.target.value > 100)
                                        return;
                                    formik.getFieldProps('maxOffPercent').onChange(e);
                                }}
                            />}

                            {formik.values.offType === "Percentage" && <TextField
                                type="number"
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                id="price"
                                label="Maximum Off Amount"
                                
                                required
                                {...formik.getFieldProps('price')}
                                error={(formik.touched.price && !!formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                                onChange={(e) => {
                                    if (parseInt(e.target.value, 10) < 0)
                                        return;
                                    formik.getFieldProps('price').onChange(e);
                                }}
                            />}

                        

                            {formik.values.offType === "FlatRate" && <TextField
                                type="number"
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                id="minimumOffPrice"
                                label="Minimum Purchasing Amount"
                                required
                                {...formik.getFieldProps('minimumOffPrice')}
                                error={(formik.touched.minimumOffPrice && !!formik.errors.minimumOffPrice)}
                                helperText={formik.touched.minimumOffPrice && formik.errors.minimumOffPrice}
                                onChange={(e) => {
                                    if (parseInt(e.target.value, 10) < 0)
                                        return;
                                    formik.getFieldProps('minimumOffPrice').onChange(e);
                                }}
                            />}
                            {formik.values.offType === "FlatRate" && <TextField
                                type="number"
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                id="price"
                                label="Maximum off Amount"
                                required
                                {...formik.getFieldProps('price')}
                                error={(formik.touched.price && !!formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                                onChange={(e) => {
                                    if (parseInt(e.target.value, 10) < 0)
                                        return;
                                    formik.getFieldProps('price').onChange(e);
                                }}
                            />}

                        </Stack>
                    </Grid>

                    <Grid item xs={6}>
                        <Stack direction="row" alignItems="flex-end" sx={{ mb: 4 }} spacing={2}>
                            <label htmlFor="coupon-avatar-input">
                                <Button variant="outlined" component="span" sx={{ justifyContent: 'center' }} startIcon={<AddAPhotoIcon />}>
                                    Upload Photo
                                </Button>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    id="coupon-avatar-input"
                                    onChange={(e) => { e.preventDefault(); handleAvatarChange(e); }}
                                    hidden
                                />
                            </label>

                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar alt="Avatar Preview" src={profileImg} sx={{
                                    width: 60,
                                    height: 60,
                                    marginLeft: 1,
                                }}
                                />
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item sm={12}>
                        <ReactQuill
                            id="description"
                            required
                            theme="snow"
                            value={formik.values.description}
                            onChange={(value) => formik.setFieldValue('description', value)}
                            placeholder="Any description type here...."

                        />
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {props.couponId ? 'Update' : 'Save Coupon'}
                    </Button>
                </Grid>
            </form>

        </Container >
    );
};

export default CouponRegisterForm;  