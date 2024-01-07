import { Container, IconButton, TextField, Button } from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import jwtServiceConfig from "src/app/auth/services/jwtService/jwtServiceConfig";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";



const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required')
});

const ForgotPassword = (props) => {
const dispatch=useDispatch()
    const handleSubmit = (values) => {
        const formData = new FormData()
        formData.append('email', values.email)
        axios.post(jwtServiceConfig.forgotPassword, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }).then((response) => {
            if(response.status===200){
                dispatch(showMessage({ message: response.data.message+' Please check your email', variant: 'success' }))
                props.setOpenModal(false)

            }
            else{
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }))

            }
        });
    }
    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    return <Container>
        <React.Fragment>
            <form onSubmit={formik.handleSubmit}>

                <h4>Reset Password</h4>
                <TextField
                    type="text"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    id="email"
                    label="Email"
                    value={formik.values.email}
                    required
                    style={{ width: '300px' }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{ mb: 4, mt: 4, width: '100%' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" style={{ marginRight: '20px' }} onClick={() => props.setOpenModal(false)}>Close</Button>
                    <Button variant="contained" type="submit">Send reset link</Button>
                </div>

            </form>

        </React.Fragment>

    </Container>
}

export default ForgotPassword