import {
  Container,
  IconButton,
  TextField,
  Button,
  Stack,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import jwtServiceConfig from "src/app/auth/services/jwtService/jwtServiceConfig";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { useNavigate } from "react-router-dom";
import { MuiOtpInput } from "mui-one-time-password-input";
import JwtService from "src/app/auth/services/jwtService";


const validationSchema = Yup.object().shape({
  email: Yup.string().matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,"Invalid email address"),
  // countryCode: Yup.string(),
  mobileNumber: Yup.string().matches(/^[1-9]\d{9}$/, "Invalid mobile number"),
});

// const phoneNumberCountryCodes = [
//   "+91",
//   "+1",
//   "+44",
//   "+33",
//   "+49",
//   "+81",
//   // Add more country codes as needed
// ];

const INITIAL_COUNT = 120;

const twoDigit = (num) => String(num).padStart(2, "0");

const ForgotPassword = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [otp, setOtp] = useState(""); //OTP states
  const [text, setText] = useState("Reset Password");
  const [hideCheckBox, setHideCheckBox] = useState(true);
  const [getcountryCode,setGetCountryCode] = useState([])

  //Timer to resend the Otp
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT);
  const [status, setStatus] = useState(null);
  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;

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
      }).catch((error) => {
        dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
    });
  }, []);

  const handleCheckboxChange = () => {
    setShowEmail((prevShowEmail) => !prevShowEmail);
    formik.setFieldValue("countryCode", "+91");
    formik.setFieldValue("email", "");
    formik.setFieldValue("mobileNumber", "");
  };

  const handleStart = () => {
    const formData = new FormData();
    formData.append("email", formik.values.email);
    formData.append("countryCode", formik.values.countryCode);
    formData.append("mobileNumber", formik.values.mobileNumber);
    axios
      .post(`${jwtServiceConfig.sentOTPForLogin}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setStatus(STATUS.STARTED);
          setSecondsRemaining(INITIAL_COUNT);
        } else {
          dispatch(
            showMessage({
              message: response.data.erroMessage,
              variant: "error",
            })
          );
        }
      }).catch((error) => {
        dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
    });
  };

  const STATUS = {
    STOPPED: (
      <b>
        <a
          type="button"
          onClick={handleStart}
          className="text-danger"
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "1.3rem",
          }}
        >
          {" "}
          Resend OTP
        </a>
      </b>
    ),
  };

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        setStatus(STATUS.STOPPED);
      }
    },
    status === STATUS.STARTED ? 1000 : null
    // passing null stops the interval
  );

  function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const handleVerifyOtp = async () => {
    if (otp !== "" && otp.length === 4) {
      const formData = new FormData();
      formData.append("email", formik.values.email);
      formData.append("countryCode", formik.values.countryCode);
      formData.append("mobileNumber", formik.values.mobileNumber);
      formData.append("otp", otp);

      axios
        .post(`${jwtServiceConfig.otpVerifyForForgetPassword}`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);

            dispatch(
              showMessage({
                message: "OTP Verified Successfully",
                variant: "success",
              })
            );
            navigate("/resetPassword");
          } else {
            dispatch(
              showMessage({
                message: response.data.errorMessage,
                variant: "error",
              })
            );
          }
        })
        .catch((error) => {
          dispatch(
            showMessage({ message: "Something went wrong", variant: "error" })
          );
        });
    } else {
      dispatch(showMessage({ message: "Please verify OTP" }));
    }
  };

  const handleSubmit = (values) => {

    if (showEmail && !values.email) {
      dispatch(showMessage({ message: "Fill the email field", variant: "error" }));
      return;
    }
    if (!showEmail && (!values.countryCode || !values.mobileNumber)) {
      dispatch(showMessage({ message: "Fill the required details", variant: "error" }));
      return;
    }
    
   

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("countryCode", values.countryCode);
    formData.append("mobileNumber", values.mobileNumber);

    axios
      .post(`${jwtServiceConfig.sentOTPForLogin}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        // console.log(response)
        if (response.status === 200) {
          setText("Fill the OTP");
          setHideCheckBox(false);
          setShowOtpInput(true); //Function for making otp field visible
          setVerifyOtp(true);
          // Start the timer
          setStatus(STATUS.STARTED);
          setSecondsRemaining(INITIAL_COUNT);
          dispatch(
            showMessage({ message: response.data.message, variant: "success" })
          );
        } else {
          dispatch(
            showMessage({
              message: response.data.errorMessage,
              variant: "error",
            })
          );
        }
      })
.catch((error) => {
          dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      countryCode: "+91",
      mobileNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });


  return (
    <Container>
      <React.Fragment>
        <form onSubmit={formik.handleSubmit}>
          <h4>{text}</h4>

          {showOtpInput ? (
            <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
              <MuiOtpInput
                style={{ maxWidth: "400px" }}
                value={otp}
                onChange={(newValue) => setOtp(newValue)}
              />
            </Stack>
          ) : (
            <React.Fragment>
              {showEmail && (
                <TextField
                  name="email"
                  className="mb-24"
                  label="Email"
                  autoFocus
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "darkslategray",
                      },
                    },
                    width: "300px",
                    mt: 1,
                  }}
                />
              )}

              {!showEmail && (
                <div className="d-flex">
                  <Autocomplete
                    // options={phoneNumberCountryCodes}
                    options={
                      getcountryCode.length > 0
                        ? getcountryCode.map((country) => country.phonecode)
                        : []
                    }
                    value={formik.values.countryCode}
                    className="mb-20"
                    onChange={(event, newValue) => {
                      formik.setFieldValue("countryCode", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Code"
                        variant="outlined"
                        error={
                          formik.touched.countryCode &&
                          Boolean(formik.errors.countryCode)
                        }
                        helperText={
                          formik.touched.countryCode &&
                          formik.errors.countryCode
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "darkslategray",
                            },
                          },
                          width: "100px",
                          mt: 1,
                        }}
                      />
                    )}
                  />
                  <TextField
                    name="mobileNumber"
                    label="Mobile Number"
                    // type="number"
                    className="mb-20"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} 
                    error={
                      formik.touched.mobileNumber &&
                      Boolean(formik.errors.mobileNumber)
                    }
                    helperText={
                      formik.touched.mobileNumber && formik.errors.mobileNumber
                      
                    }
                    variant="outlined"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "darkslategray",
                        },
                      },
                      width: "200px",
                      mt: 1,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          )}
          <br />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {hideCheckBox && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!showEmail}
                    onChange={handleCheckboxChange}
                    color="primary"
                    style={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 18,
                        border: "2px solid #000",
                        borderRadius: 1,
                      },
                    }}
                  />
                }
                label="Login Through Mobile"
                style={{
                  fontWeight: 600,
                  letterSpacing: "0px",
                }}
                className="mb-24"
              />
            )}

            {showOtpInput && status === STATUS.STARTED ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                {" "}
                <b className="text-success" style={{ fontSize: "1.3rem" }}>
                  Resend OTP{" "}
                </b>
                <b className="ml-2 text-danger" style={{ fontSize: "1.3rem" }}>
                  {" "}
                  {twoDigit(minutesToDisplay)}:{twoDigit(secondsToDisplay)}
                </b>
              </div>
            ) : (
              status
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              style={{
                marginRight: "1rem",
                backgroundColor: "#792b00",
                color: "white",
              }}
              onClick={() => props.setOpenModal(false)}
            >
              Close
            </Button>
            {!verifyOtp ? (
              <Button
                variant="outlined"
                type="submit"
                style={{ backgroundColor: "#792b00", color: "white" }}
              >
                Send OTP
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleVerifyOtp}
                style={{ backgroundColor: "#792b00", color: "white" }}
              >
                {" "}
                Verify OTP
              </Button>
            )}
          </div>
        </form>
      </React.Fragment>
    </Container>
  );
};

export default ForgotPassword;
