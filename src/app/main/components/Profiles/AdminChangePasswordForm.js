import { Container, Button, TextField, IconButton, InputAdornment, Typography } from "@mui/material"
import { useFormik } from "formik";
import axios from 'axios';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { adminAPIConfig } from "../../API/apiConfig";


const AdminChangePasswordForm = (props) => {
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
        const formData = new FormData()
        formData.append('email', props.userEmail)
        formData.append('password', values.newPassword)

        axios.post(adminAPIConfig.changePassowrdForAdmin, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                dispatch(showMessage({ message: 'Password changed successfully', variant: 'success' }))
                props.handleClose
            }
            else {
                dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))

            }
        }).catch(() => dispatch(showMessage({ message: 'Something went wrong', variant: 'error' })))
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });
    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    return <Container>
        <Typography textAlign='center'
            style={{ fontStyle: 'normal', fontSize: '24px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}
        >
            Change Password
        </Typography>
        <form
            onSubmit={formik.handleSubmit}
            style={{ marginTop: '1rem' }}
        >
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
                sx={{ mb: 1, mt: 2, }}
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
                sx={{ mb: 4 }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}  >
                <>
                    <Button
                        variant="contained"
                        color="secondary"
                        aria-label="cancel"
                        onClick={props.handleClose}
                        size="large"
                        style={{ marginRight: '1rem' }}
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        aria-label="save"
                        type="submit"
                        size="large"
                    >
                        Save
                    </Button>
                </>
            </div>

        </form>
    </Container>
}

export default AdminChangePasswordForm