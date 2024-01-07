import { Grid, TextField, Button, Container, Stack, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';

import * as Yup from 'yup';

import axios from "axios";

import 'react-quill/dist/quill.snow.css';

import { useDispatch } from "react-redux";

import { showMessage } from "app/store/fuse/messageSlice";

import ReactQuill from 'react-quill';

import { labPartnerAPIConfig } from '../../API/apiConfig';

const ProductRegisterForm = (props) => {
    const dispatch = useDispatch();
    // const [profileImg, setProfileImg] = useState('');
    const [planData, setPlanData] = useState({

        serviceName: '',
        partnerId: '',
        sampleType: '',
        price: '',
        description: '',




    });

    useEffect(() => {
        return () => {
            setPlanData(null);
            formik.resetForm();
        }
    }, [])

    useEffect(() => {
        if (props?.labPartnerPlanId) {
            axios.get(`${labPartnerAPIConfig.fetch}/${props.labPartnerPlanId}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    console.log(response.data.data.serviceName);
                    setPlanData(response.data.data);
                    // setProfileImg(response?.data?.data?.image);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                    // setProfileImg('');
                }
            })
        }
    }, [props.labPartnerPlanId]);

    useEffect(() => {
        if (planData) {
            formik.setValues({
                serviceName: planData.serviceName || '',
                partnerId: planData.partnerId || '',
                sampleType: planData.sampleType || '',
                price: planData.price || '',
                description: planData.description || '',

            });
        }
    }, [planData]);


    const validationSchema = Yup.object().shape({
        serviceName: Yup.string().required('service name is required'),
        partnerId: Yup.string().required('partner Id is required'),
        sampleType: Yup.string().required('sample type is required'),
        price: Yup.number().positive("Price must be more than 0").integer("Price must be more than 0").required("Price is required"),
        description: Yup.string()
    });

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('serviceName', values.serviceName);
        formData.append('partnerId', values.partnerId);
        formData.append('sampleType', values.sampleType);
        formData.append('price', values.price);
        formData.append('description', values.description);

        // formData.append('image', values.image)

        if (props.labPartnerPlanId) {
            axios.put(`${labPartnerAPIConfig.edit}/${props.labPartnerPlanId}`, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    dispatch(showMessage({ message: 'Plan updated successfully', variant: 'success' }));
                    props.setOpen(!props.open);
                    props.setChange(!props.change);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })

        } else {
            axios.post(labPartnerAPIConfig.create, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 201) {
                    dispatch(showMessage({ message: 'Plan added successfully', variant: 'success' }));
                    formik.resetForm();
                    // setProfileImg(null);
                    props.setOpen(!props.open);
                    props.setChange(!props.change);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
        }
    };

    const formik = useFormik({
        initialValues: {
            serviceName: '',
            partnerId: '',
            sampleType: '',
            price: '',
            description: '',

        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <Container maxWidth="md">
            <IconButton onClick={() => { props.setOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                <CloseIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="600" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
                {props.labPartnerPlanId ? 'Service Plan Update Form' : 'Service Plan Add Form'}
            </Typography>


            <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">

                <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
                    <TextField
                        type="text"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        id="serviceName"
                        label="Service Name"
                        {...formik.getFieldProps('serviceName')}
                        error={formik.touched.serviceName && formik.errors.serviceName}
                        helperText={formik.touched.serviceName && formik.errors.serviceName}
                    />

                    <TextField
                        type="text"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        id="partnerId"
                        label="Partner Id"
                        {...formik.getFieldProps('partnerId')}
                        error={formik.touched.partnerId && formik.errors.partnerId}
                        helperText={formik.touched.partnerId && formik.errors.partnerId}
                    />

                    <TextField
                        type="text"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        id="sampleType"
                        label="Sample Type"
                        {...formik.getFieldProps('sampleType')}
                        error={formik.touched.sampleType && formik.errors.sampleType}
                        helperText={formik.touched.sampleType && formik.errors.sampleType}
                    />

                    <TextField
                        type="number"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        id="price"
                        label="Price with GST"
                        {...formik.getFieldProps('price')}
                        error={formik.touched.price && formik.errors.price}
                        helperText={formik.touched.price && formik.errors.price}
                        sx={{ mb: 2 }}
                        onChange={(e) => {
                            if (e.target.value < 0) {
                                return;
                            }
                            formik.getFieldProps('price').onChange(e);
                        }}
                    />

                </Stack>


                <Grid item xs={6}>
                    <ReactQuill
                        id="description"
                        theme="snow"
                        value={formik.values.description}
                        onChange={(value) => formik.setFieldValue('description', value)}
                        placeholder="Any description type here...."

                    />


                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {props.labPartnerPlanId ? 'Update' : 'Save'}
                    </Button>
                </Grid>

            </form>

        </Container>
    );
};

export default ProductRegisterForm;



