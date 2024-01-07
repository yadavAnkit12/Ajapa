import { TextField, Button, Container, Stack, Typography, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import { labPartnerAPIConfig } from '../../API/apiConfig';
import CloseIcon from '@mui/icons-material/Close';

const ServicePublishedForm = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            formik.resetForm();
        }
    }, []);

    useEffect(() => {
        if (props.labPartnerData) {
            formik.setValues({
                publishedPrice: props?.labPartnerData?.publishedPrice || 0
            });
        } else {
            formik.resetForm();
        }
    }, [props.labPartnerData]);

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('status', 'Published');
        formData.append('publishedPrice', values.publishedPrice);
        formData.append('serviceId', props.labPartnerData.id);
        axios.put(`${labPartnerAPIConfig.changeStatus}`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                formik.resetForm();
                props.setChange(!props.change);
                dispatch(showMessage({ message: "Service published successfully", variant: 'success' }));
                props.setPublishOpen(false);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    };

    const validationSchema = Yup.object().shape({
        publishedPrice: Yup.number().required('Published price is required'),
    });

    const formik = useFormik({
        initialValues: {
            publishedPrice: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleClose = () => {
        props.setPublishOpen(false);
    };

    return (
        <Container maxWidth="md">
            <React.Fragment>
                <IconButton onClick={() => { props.setPublishOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="600" fontSize="2rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
                    {'Do you want to published with these fees?'}
                </Typography>

                <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
                    <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
                        <TextField
                            type="number"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            required
                            id="publishedPrice"
                            label="Published Price"
                            {...formik.getFieldProps('publishedPrice')}
                            error={(formik.touched.publishedPrice && !!formik.errors.publishedPrice)}
                            helperText={formik.touched.publishedPrice && formik.errors.publishedPrice}
                            inputProps={{ min: 0 }}
                            onChange={(e) => {
                                if (e.target.value < 0)
                                    return;
                                formik.getFieldProps('publishedPrice').onChange(e);
                            }}
                        />
                    </Stack>


                    <Button onClick={handleClose}>No</Button>
                    <Button type="submit"
                        variant="contained"
                        color="secondary" autoFocus>
                        Yes
                    </Button>
                </form>
            </React.Fragment>
        </Container>
    );
};

export default ServicePublishedForm;