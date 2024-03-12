// import React, { useState, useEffect, useRef } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Stack, FormControlLabel, TextField, Typography, Avatar, AvatarGroup, Box, Paper, IconButton, InputAdornment, Autocomplete } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import _ from '@lodash';
import store from '../../store/index'
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import React, { useState } from 'react';
import jwtService from '../../auth/services/jwtService';
import { showMessage } from "app/store/fuse/messageSlice";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Modal } from '@mui/material';
import ForgotPassword from './ForgotPassword';
import { useFormik } from 'formik';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { values } from 'lodash';
import axios from 'axios';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import ReCAPTCHA from 'react-google-recaptcha';


const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').matches(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, 'Invalid email'),
  countryCode: yup.string(),
  mobileNumber: yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
  password: yup.string()
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxWidth: '1500px',
  maxHeight: '700px',
  overflow: 'auto'
};

const initialValues = {
  email: '',
  countryCode: '',
  mobileNumber: '',
  password: '',
};
const phoneNumberCountryCodes = [
  '+91',
  '+1',
  '+44',
  '+33',
  '+49',
  '+81',
  // Add more country codes as needed
];


function SignInPage() {

  const dispatch = useDispatch()
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [showEmail, setShowEmail] = useState(true);
  const [password, setPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [OTPVerify, setOTPVerify] = useState(false)
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(true);
  const recaptchaRef = React.createRef();


  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCheckboxChange = () => {
    setShowEmail((prevShowEmail) => !prevShowEmail);
  };

  const handleCheckboxOtp = () => {
    setPassword((prevShowPassword) => !prevShowPassword);
    setShowOtpInput(false)
    setOTPVerify(false)
  };

  // For Sending the Otp 
  const handleSendOtp = async (e) => {
    e.preventDefault();

    const isRequired = Boolean(formik.values.email || (formik.values.countryCode && formik.values.mobileNumber))
    if (isRequired) {
      setShowRecaptcha(false)
      const formData = new FormData()
      formData.append('email', formik.values.email)
      formData.append('countryCode', formik.values.countryCode.split(' ')[0])
      formData.append('mobileNumber', formik.values.mobileNumber)

      axios.post(`${jwtServiceConfig.sentOTPForLogin}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      }).then((response) => {
        // console.log(response)
        if (response.status === 200) {
          dispatch(showMessage({ message: 'OTP has been sent to your mobile number and email.', variant: 'success' }));
          setShowOtpInput(true);
          setOTPVerify(true)
        }
        else {
          dispatch(showMessage({ message: response.data.message, variant: 'error' }));
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    else {
      recaptchaRef.current.reset();
      dispatch(showMessage({ message: "Fill the required details", variant: 'error' }));
    }
  };

  //  signin using password
  const handleSubmit = (values) => {
    
    // check that any field that is required is empty
    const isRequired = Boolean((values.email || (values.countryCode && values.mobileNumber)) && values.password && recaptcha)

    if (isRequired) {
      setShowRecaptcha(false)
      jwtService
        .signInWithEmailAndPassword(values.email, values.countryCode.split(' ')[0], values.mobileNumber, values.password)
        .then((user) => {
          if (user) {
            dispatch(showMessage({ message: 'Login successfully', variant: 'success' }));
          }
        })
        .catch((_errors) => {
          dispatch(showMessage({ message: _errors, variant: 'error' }));
        });
    }
    else {
      recaptchaRef?.current?.reset();
      dispatch(showMessage({ message: "Fill all the details", variant: 'error' }));
    }
  }

  const handleOTPverification = () => {
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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });



  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-32 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1" style={{ backgroundImage: 'linear-gradient(to bottom right, #FDFCFB, #E2D1C3)' }}>
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <div className='d-flex justify-content-center w-100 mb-30'>
            <img src="assets/images/logo/logo1.png" alt="logo" style={{ width: '140px' }} />
          </div>

          <form
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={formik.handleSubmit}
          >
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
            {password ? (

              null

            ) : (

              <TextField
                name='password'
                className="mb-24"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'darkslategray',
                    },
                  },
                }}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {showOtpInput &&
              <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
                <MuiOtpInput style={{ maxWidth: '400px' }} value={otp} onChange={(newValue) => setOtp(newValue)} />
              </Stack>
            }

            <FormControlLabel
              control={
                <Checkbox
                  checked={password}
                  onChange={handleCheckboxOtp}
                  color="primary"
                  style={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 18, // Adjust the font size as needed
                      border: '1px solid #000', // Set the border style
                      borderRadius: 1, // Adjust the border radius as needed
                    },
                  }}
                />
              }
              label="Login Through OTP"
              style={{
                fontWeight: 600,
                letterSpacing: '0px',
              }}
            />


            {showRecaptcha && <div className='d-flex justify-content-center'> <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Le1OQApAAAAAMAswCIrtcLACa_6l9y1opvbZjUp"
              onChange={(value) => setRecaptcha(value)}
              style={{ width: '100%' }}

            /></div>}

            {password ? (
              OTPVerify ? (
                <Button
                  variant="contained"
                  color="success"
                  className="w-full mt-16"
                  aria-label="Sign in"
                  size="large"
                  onClick={handleOTPverification}
                  style={{ backgroundColor: '#792b00' }}
                >
                  Verify
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  className="w-full mt-16"
                  size="large"
                  onClick={handleSendOtp} // Click to receive OTP
                  style={{ backgroundColor: '#792b00' }}
                >
                  Send OTP
                </Button>
              )
            ) : (
              <Button
                variant="contained"
                color="secondary"
                className="w-full mt-16"
                aria-label="Sign in"
                size="large"
                onClick={formik.handleSubmit}
                style={{ backgroundColor: '#792b00' }}
              >
                Log in
              </Button>
            )}
          </form>
          <div className="d-flex justify-content-center">

            <Button
              // className="text-md font-medium"
              onClick={handleOpenModal}
              style={{
                // fontFamily: "BentonSans bold",
                fontStyle: 'normal', fontSize: '16px',
                lineHeight: '28px', letterSpacing: '0px',
                textAlign: 'center', fontWeight: 600,
                marginTop: '5px'
              }}
            >
              <u>Forgot password?</u>

            </Button>
          </div>
          <div className="flex items-center justify-center mt-2 font-medium text-center">
            <Typography className="text-lg" style={{
              fontSize: '14px',
              fontWeight: 600, lineHeight: '24px', letterSpacing: '0px'
            }}>
              Don't have an account?
            </Typography>
            <Link className="ml-4" to="/sign-up" style={{
              fontSize: '14px',
              fontWeight: 600, lineHeight: '24px', letterSpacing: '0px'
            }}>
              Sign up
            </Link>
          </div>
        </div>
      </Paper >

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundImage: 'url("assets/images/logo/bg.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat',backgroundPosition:'center' }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: 'primary.light' }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: 'primary.light' }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Welcome to</div>
            <div>our community</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            Fuse helps developers to build organized and well coded dashboards full of beautiful and
            rich modules. Join us and start building your application today.
          </div>
          <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                '& .MuiAvatar-root': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Avatar src="assets/images/avatars/female-18.jpg" />
              <Avatar src="assets/images/avatars/female-11.jpg" />
              <Avatar src="assets/images/avatars/male-09.jpg" />
              <Avatar src="assets/images/avatars/male-16.jpg" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-gray-400">
              More than 17k people joined us, it's your turn
            </div>
          </div>
        </div>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
      >
         <Box  sx={{
          ...style,
          '@media (max-width: 700px) and (min-width: 500px)': { 
            width: '65%', 
          },
          '@media (max-width: 500px)': { 
          width: '100%', 
      },
    }}>
          <ForgotPassword setOpenModal={setOpenModal} />
        </Box>
      </Modal>
    </div >
  );
}

export default SignInPage;