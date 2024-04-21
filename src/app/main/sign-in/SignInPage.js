// import React, { useState, useEffect, useRef } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Stack, FormControlLabel, TextField, Typography, Avatar, AvatarGroup, Box, Paper, IconButton, InputAdornment, Autocomplete } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import _ from '@lodash';
import store from '../../store/index'
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import React, { useState, useRef, useEffect } from 'react';
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
import FuseLoading from '@fuse/core/FuseLoading';
import Swal from 'sweetalert2';

const INITIAL_COUNT = 120

const twoDigit = (num) => String(num).padStart(2, '0')


const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').matches(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, 'Invalid email'),
  // countryCode: yup.string(),
  mobileNumber: yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
  // password: yup.string()
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
  countryCode: '+91',
  mobileNumber: '',
  password: '',
};

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
  const [getcountryCode, setGetCountryCode] = useState([])
  const [loading, setLoading] = useState(false);
  const [showCheck, setShowCheck] = useState(true)
  const [disable, setDisable] = useState(false)

  //for timmer
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT);
  const [status, setStatus] = useState(null);
  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;

  const recaptchaRef = React.createRef();

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    Swal.fire({
      title: "<span style='font-weight: bold; font-size: 20px;'>Welcome to Ajapa</span>",
      html: `<span style="font-weight: bold; font-size: 16px;">If you are visiting first time then please login using OTP and then update your password</span>`,
      icon: "info",
      confirmButtonText: "<span style='font-weight: bold; font-size: 16px;'>OK</span>"
  }); 
  }, [])
  const handleCheckboxChange = () => {
    setShowEmail(!showEmail);
    formik.setFieldValue('mobileNumber', '')
    formik.setFieldValue('email', '')
    formik.setFieldValue('countryCode', '+91')

  };

  const handleCheckboxOtp = () => {
    setPassword(!password);
    setShowOtpInput(false)
    setOTPVerify(false)
  };

  //for timmer
  const handleStart = () => {
    const formData = new FormData()
    formData.append('email', formik.values.email)
    formData.append('countryCode', formik.values.countryCode)
    formData.append('mobileNumber', formik.values.mobileNumber)

    axios.post(`${jwtServiceConfig.sentOTPForLogin}`, formData, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    }).then((response) => {
      if (response.status === 200) {
        setStatus(STATUS.STARTED);
        setSecondsRemaining(INITIAL_COUNT);
      } else {
        dispatch(showMessage({ message: response.data.erroMessage, variant: 'error' }));
      }
    });
  };
  const STATUS = {
    STOPPED: <b>
      <a
        type="button"
        onClick={handleStart}
        className="text-danger"
        style={{ marginLeft: '160px', cursor: 'pointer', textDecoration: 'underline', fontSize: '1.3rem' }}
      > Resend OTP
      </a>
    </b>
  }

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1)
      }

      else {
        setStatus(STATUS.STOPPED)
      }
    },
    status === STATUS.STARTED ? 1000 : null,
    // passing null stops the interval
  )

  function useInterval(callback, delay) {
    const savedCallback = useRef()
    useEffect(() => {

      savedCallback.current = callback

    }, [callback])

    useEffect(() => {

      function tick() {

        savedCallback.current()

      }

      if (delay !== null) {

        let id = setInterval(tick, delay)
        return () => clearInterval(id)
      }

    }, [delay])

  }

  useEffect(() => {
    axios
      .get(jwtServiceConfig.country, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setGetCountryCode(response?.data)
        }
      });
  }, []);

  // For Sending the Otp 
  const handleSendOtp = async (e) => {

    const isRequired = Boolean((formik.values.email || (formik.values.countryCode && formik.values.mobileNumber)) && recaptcha)
    if (isRequired) {
      // setShowRecaptcha(false)
      setLoading(true)
      const formData = new FormData()
      formData.append('email', formik.values.email)
      formData.append('countryCode', formik.values.countryCode)
      formData.append('mobileNumber', formik.values.mobileNumber)

      axios.post(`${jwtServiceConfig.sentOTPForLogin}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      }).then((response) => {
        if (response.status === 200) {
          setLoading(false)
          setStatus(STATUS.STARTED)
          setSecondsRemaining(INITIAL_COUNT)
          dispatch(showMessage({ message: 'OTP has been sent to your mobile number and email.', variant: 'success' }));
          setShowOtpInput(true);
          setOTPVerify(true)
          setShowRecaptcha(false)
          setShowCheck(false)
          setDisable(true)
        }
        else {
          setLoading(false)
          dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
        }
      }).catch((error) => {
        setLoading(false)
        console.log(error)
      })
    }
    else {
      if (recaptcha === null && ((formik.values.email || (formik.values.countryCode && formik.values.mobileNumber)))) {
        return dispatch(showMessage({ message: "Select you are not a robot", variant: 'error' }));
      }
      // recaptchaRef.current.reset();
      dispatch(showMessage({ message: "Fill the required details", variant: 'error' }));
    }
  };

  //  signin using password
  const handleSubmit = (values) => {
    // check that any field that is required is empty
    const isRequired = Boolean((values.email || (values.countryCode && values.mobileNumber)) && values.password && recaptcha)

    if (isRequired) {
      setShowRecaptcha(false)
      setLoading(true)
      jwtService.signInWithEmailAndPassword(values.email, values.countryCode, values.mobileNumber, values.password)
        .then((user) => {
          setLoading(false)
          if (user) {
            dispatch(showMessage({ message: 'Login successfully', variant: 'success' }));
          }
        })
        .catch((_errors) => {
          setLoading(false)
          dispatch(showMessage({ message: _errors, variant: 'error' }));
        });
    }
    else {
      if (recaptcha === null && ((values.email || (values.countryCode && values.mobileNumber)) && values.password)) {
        return dispatch(showMessage({ message: "Select you are not a robot", variant: 'error' }));
      }
      // recaptchaRef?.current?.reset();
      dispatch(showMessage({ message: "Fill the required details", variant: 'error' }));

    }
  }
  const handleOTPverification = () => {
    if (otp !== '' && otp.length === 4) {
      setLoading(true)
      const formData = new FormData()
      formData.append('email', formik.values.email)
      formData.append('countryCode', formik.values.countryCode)
      formData.append('mobileNumber', formik.values.mobileNumber)
      formData.append('otp', otp)
      jwtService.signInWithOTP(formik.values.email, formik.values.countryCode, formik.values.mobileNumber, otp)
        .then((user) => {
          setLoading(false)
          if (user) {
            dispatch(showMessage({ message: 'Login successfully', variant: 'success' }));

          }
        })
        .catch((_errors) => {
          setLoading(false)
          dispatch(showMessage({ message: _errors, variant: 'error' }));
        });
    } else {
      dispatch(showMessage({ message: "Please verify OTP" }));
    }
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  if (loading) {
    return <FuseLoading />
  }



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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                disabled={disable}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'darkslategray',
                    },
                  },
                }}
              />


            ) : (
              <div className='d-flex'>
                <div>
                  <Autocomplete
                    // options={phoneNumberCountryCodes}
                    options={
                      getcountryCode.length > 0
                        ? getcountryCode.map((country) => country.phonecode)
                        : []
                    }
                    value={formik.values.countryCode}
                    className="mb-0"
                    onChange={(event, newValue) => {
                      if (newValue) {
                        formik.setFieldValue('countryCode', newValue);

                      } else {
                        formik.setFieldValue('countryCode', '');
                      }
                    }}
                    disabled={disable}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Code"
                        variant="outlined"
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

                </div>
                <TextField
                  name="mobileNumber"
                  label="Mobile Number"
                  type="number"
                  value={formik.values.mobileNumber}
                  className="mb-24"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={disable}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                  helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                  variant="outlined"
                  fullWidth
                  autoFocus
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
            {showCheck && <FormControlLabel
              control={
                <Checkbox
                  checked={!showEmail}
                  onChange={handleCheckboxChange}
                  color="primary"
                  style={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 18,
                      border: '2px solid #000',
                      borderRadius: 1,
                    },
                  }}
                />
              }
              label="Login Through Mobile"
              style={{
                fontWeight: 600,
                letterSpacing: '0px',
              }}
            />}
            {password ? (

              null

            ) : (

              <TextField
                name='password'
                className="mb-24"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
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
            {showOtpInput && status == STATUS.STARTED ? (
              <>
                <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
                  <MuiOtpInput style={{ maxWidth: '400px' }} value={otp} onChange={(newValue) => setOtp(newValue)} />
                </Stack>
                <div style={{ display: 'flex', justifyContent: 'center' }}> <b className="text-success" style={{ fontSize: '1.3rem' }}>Resend OTP </b>
                  <b className="ml-2 text-danger" style={{ fontSize: '1.3rem' }}> {twoDigit(minutesToDisplay)}:
                    {twoDigit(secondsToDisplay)}</b>
                </div>
              </>
            ) : (
              status
            )
            }
            <FormControlLabel
              control={
                <Checkbox
                  checked={password}
                  onChange={handleCheckboxOtp}
                  color="primary"
                  style={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 18,
                      border: '1px solid #000',
                      borderRadius: 1,
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
                  onClick={handleSendOtp}
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
              onClick={handleOpenModal}
              style={{
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
        sx={{ backgroundImage: 'url("assets/images/logo/bg.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
      >
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
      >
        <Box sx={{
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