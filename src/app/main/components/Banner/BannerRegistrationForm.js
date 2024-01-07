import { Box, MenuItem, Container, Button, Typography, TextField, Stack, IconButton, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import * as Yup from 'yup';

import axios from "axios";

import { useFormik } from 'formik';

import { useDispatch } from "react-redux";

import { showMessage } from 'app/store/fuse/messageSlice';

import { bannerAPIConfig, couponAPIConfig } from '../../API/apiConfig';

const BannerRegistrationForm = (props) => {
    const dispatch = useDispatch();
    const [profileImg, setProfileImg] = useState('');
    const [isImageTouched, setIsImageTouched] = useState(false);
    const [couponList, setCouponList] = useState([]);
    const [bannerData, setBannerData] = useState({
        name: '',
        image: null,
        code: ''
    });

    useEffect(() => {
        axios.get(bannerAPIConfig.activeCouponList, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setCouponList(response.data.data);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }, []);

    useEffect(() => {
        if (props.bannerId) {
            axios.get(`${bannerAPIConfig.fetch}/${props.bannerId}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setBannerData(response.data.data);
                    setProfileImg(response?.data?.data?.image);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                    setProfileImg('');
                }
            })
        }
    }, [props.bannerId]);

    useEffect(() => {
        if (bannerData) {
            formik.setValues({
                name: bannerData.name || '',
                image: bannerData.image || '',
                couponId: bannerData.couponId || ''
            });
        }
    }, [bannerData]);


    const validationSchema = Yup.object().shape({
        couponId: Yup.string().required('Coupon code is required'),
        name: Yup.string().required('Namee is required'),
        image: Yup.mixed().required('Please select an image').test('fileSize', 'File size is too large', (value) => {
            if (!value || typeof (value) === "string") return true; // Skip the test if no file is selected
            const maxSizeInBytes = 1 * 1024 * 1024; // 11MB
            return value.size <= maxSizeInBytes;
        }),
    });

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('couponId', values.couponId);
        formData.append('image', values.image);
        formData.append('name', values.name);

        if (props.bannerId) {
            axios.put(`${bannerAPIConfig.edit}/${props.bannerId}`, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    dispatch(showMessage({ message: "Banner updated successfully", variant: 'success' }));
                    formik.resetForm();
                    props.setOpen(!props.open);
                    props.setChange(!props.change);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
        } else {
            axios.post(bannerAPIConfig.create, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 201) {
                    dispatch(showMessage({ message: "Banner created successfully", variant: 'success' }));
                    formik.resetForm();
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
            couponId: '',
            image: '',
            name: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleAvatarChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue('image', file);
            setProfileImg(URL.createObjectURL(file));
            setIsImageTouched(true);
        } else {
            formik.setFieldValue('image', '');
            setProfileImg('');
            setIsImageTouched(false);
        }
    };

    return (
        <Container maxWidth="md">
            <React.Fragment>
                <IconButton onClick={() => { props.setOpen(!props.open) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
                    Banner form
                </Typography>

                <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
                    <Stack spacing={2} sx={{ mt: 2, marginBottom: 4 }}>
                        <TextField
                            type="text"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="name"
                            label="Banner name"
                            autoFocus
                            required
                            {...formik.getFieldProps('name')}
                            error={(formik.touched.name && !!formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            sx={{ mb: 2, mt: 1 }}
                        />

                        <TextField
                            select
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="couponId"
                            label="Coupon Code"
                            required
                            {...formik.getFieldProps('couponId')}
                            error={(formik.touched.couponId && !!formik.errors.couponId)}
                            helperText={formik.touched.couponId && formik.errors.couponId}
                            sx={{ mb: 4 }}
                        >
                            {couponList.map((coupon) => (
                                <MenuItem
                                    key={coupon._id}
                                    value={coupon._id}
                                >
                                    {coupon.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Stack direction="row" alignItems="flex-end" sx={{ mb: 4 }} spacing={2}>
                            <label htmlFor="avatar-input">
                                <Button variant="outlined" component="span" sx={{ justifyContent: 'center' }} startIcon={<AddAPhotoIcon />}>
                                    Upload Photo
                                </Button>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.avif,.gif"
                                    id="avatar-input"
                                    onChange={(e) => { e.preventDefault(); handleAvatarChange(e); }}
                                    hidden
                                />
                                {formik.touched.image && formik.errors.image && !isImageTouched && (
                                    <Typography color="error" sx={{ mx: '14px', mt: '3px', fontSize: '1.2rem' }}>{formik.errors.image}</Typography>
                                )}
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

                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            fullWidth
                        >
                            {props.bannerId ? 'Update' : 'Add'}
                        </Button>
                    </Stack>
                </form>
            </React.Fragment>
        </Container>
    );
};

export default BannerRegistrationForm;