import { Container, IconButton, TextField, Button, Stack, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import jwtServiceConfig from "src/app/auth/services/jwtService/jwtServiceConfig";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { useNavigate } from "react-router-dom";
import { MuiOtpInput } from "mui-one-time-password-input";



const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address'),
    countryCode: Yup.string(),
    mobileNumber: Yup.string()
});

const phoneNumberCountryCodes = [
    '+91 (IN)',
    '+1 (US)',
    '+44 (UK)',
    '+33 (FR)',
    '+49 (DE)',
    '+81 (JP)',
    // Add more country codes as needed
];


const ForgotPassword = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showEmail, setShowEmail] = useState(true)
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [verifyOtp, setVerifyOtp]= useState(false)
    const [otp, setOtp] = useState('')     //OTP states

    const handleCheckboxChange = () => {
        setShowEmail((prevShowEmail) => !prevShowEmail);
    };

    const handleVerifyOtp = ()=>{   //function for verify otp
        console.log('hi')
        if (otp !== '' && otp.length === 4) {
            const formData = new FormData()
            formData.append('email', formik.values.email)
            formData.append('countryCode', formik.values.countryCode.split(' ')[0])
            formData.append('mobileNumber', formik.values.mobileNumber)
            formData.append('otp', otp)
            jwtService.signInWithOTP(formik.values.email, formik.values.countryCode.split(' ')[0], formik.values.mobileNumber, otp)
              .then((user) => {
                if (user) {
                  dispatch(showMessage({ message: 'Login successfully', variant: 'success' }));
                }
              })
              .catch((_errors) => {
                dispatch(showMessage({ message: _errors, variant: 'error' }));
              });
          } else {
            dispatch(showMessage({ message: "Fill all the OTP" }));
      
          }
    }

    const handleSubmit = (values) => {



        const formData = new FormData()
        formData.append('email', formik.values.email)
        formData.append('countryCode', formik.values.countryCode.split(' ')[0])
        formData.append('mobileNumber', formik.values.mobileNumber)

        axios.post(`${jwtServiceConfig.sentOTPForLogin}`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                setShowOtpInput(true)  //Function for making otp field visible
                setVerifyOtp(true)
                dispatch(showMessage({ message: response.data.message, variant: 'success' }));

            }
            else {
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    const formik = useFormik({
        initialValues: {
            email: '',
            countryCode: '',
            mobileNumber: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    return <Container>
        <React.Fragment>
            <form onSubmit={formik.handleSubmit}>

                <h4>Reset Password</h4>

                {showEmail ? (

                    <TextField
                        name='email'
                        className="mb-24"
                        label="Email"
                        autoFocus
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        variant="outlined"
                        required
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'darkslategray',
                                },
                            },
                        }} />

                ) : (
                    <div className='d-flex'>
                        <Autocomplete
                            options={phoneNumberCountryCodes}
                            value={formik.values.countryCode}
                            className="mb-24"
                            onChange={(event, newValue) => {
                                formik.setFieldValue('countryCode', newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Code"
                                    variant="outlined"
                                    required
                                    error={formik.touched.countryCode && Boolean(formik.errors.countryCode)}
                                    helperText={formik.touched.countryCode && formik.errors.countryCode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'darkslategray',
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                        <TextField
                            name="mobileNumber"
                            label="Mobile Number"
                            type="number"
                            className="mb-24"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                            helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                            variant="outlined"
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'darkslategray',
                                    },
                                },
                            }}
                        />




                    </div>
                )}

                {/* //Otp Fields */}
                {showOtpInput &&       <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
                            <MuiOtpInput style={{ maxWidth: '400px' }} value={otp} onChange={(newValue) => setOtp(newValue)} />
                        </Stack>

                }
 


                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!showEmail}
                            onChange={handleCheckboxChange}
                            color="primary"
                            style={{
                                '& .MuiSvgIcon-root': {
                                    fontSize: 18, // Adjust the font size as needed
                                    border: '2px solid #000', // Set the border style
                                    borderRadius: 1, // Adjust the border radius as needed
                                },
                            }}
                        />
                    }
                    label="Login Through Mobile"
                    style={{
                        fontWeight: 600,
                        letterSpacing: '0px',
                    }}
                />


                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" style={{ marginRight: '20px' }} onClick={() => props.setOpenModal(false)}>Close</Button>
                      {!verifyOtp ? <Button variant="contained" type="submit" > Send OTP</Button> : <Button variant="contained" onClick={handleVerifyOtp} > Verify OTP</Button>}
                   
                </div>

            </form>

        </React.Fragment>

    </Container>
}

export default ForgotPassword