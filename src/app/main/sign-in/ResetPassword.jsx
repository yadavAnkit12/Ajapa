import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { useFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import axios from 'axios';
import { useDispatch } from "react-redux";


import { showMessage } from "app/store/fuse/messageSlice";

const style = {
    width: '50%',
    margin: 'auto',
    marginTop: '100px',
    padding: '5px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
};

const ResetPassword = () => {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [show, setShow] = useState(false)
    const initialValues = {
        newPassword: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        newPassword: Yup.string().required('New Password is required'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    });

    const handleSubmit = (values) => {
        // const urlParams = new URLSearchParams(window.location.search);
        const token = localStorage.getItem('token')
        const userDetails = localStorage.getItem('userData')
        const formData = new FormData()
        formData.append('password', values.newPassword)
        formData.append('token', token)
        formData.append('userDatils',userDetails)

        axios.post(jwtServiceConfig.resetPassword, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        }).then((response) => {
            if (response.status === 200) {
            console.log(response)
                localStorage.removeItem('token')
                localStorage.removeItem('userData')
                localStorage.removeItem('_grecaptcha')
                dispatch(showMessage({ message: response.data.message, variant: 'success' }))
                dispatch(showMessage({ message: 'Go to the login Page' }))
                setShow(true)
            }
            else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }))

            }
        });
    };

    const handleLogin = () => {
        navigate('/sign-in')
    }


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <Card sx={style}>
            <CardContent>
                {!show && <form onSubmit={formik.handleSubmit}>
                    <img className="w-95" src="assets/images/logo/logo1.png" alt="logo" style={{ margin: '0 auto', }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="newPassword"
                            label="New Password"
                            value={formik.values.newPassword}
                            required
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                            helperText={formik.touched.newPassword && formik.errors.newPassword}
                            sx={{ mb: 4, mt: 4, width: '60%' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            value={formik.values.confirmPassword}
                            required
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            sx={{ mb: 4, width: '60%' }}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px',width:'60%' }}>
                            Change Password
                        </Button>
                    </div>
                </form>}

                {show && <div>
                    <img className="w-95" src="assets/images/logo/logo1.png" alt="logo" style={{ margin: '0 auto', }} />
                    <hr style={{ border: '2px solid #72A0C1', margin: '10px 0' }}></hr>
                    <div style={{ textAlign: 'center', lineHeight: '20px' }}>
                        <h4>Dear User,</h4>
                        <h2>Your password are updated successfully !</h2>
                        <h3>Now you can explore all our services by clicking on Log In button.</h3>
                        <Button variant="contained" color="primary" fullWidth style={{ margin: '20px 0',width:'30%' }} 
                        onClick={handleLogin}
                        >Log In</Button>
                        <h2>Thank you for choosing our platform!</h2>
                    </div>
                </div>}

            </CardContent>
        </Card>
    );
};

export default ResetPassword;
