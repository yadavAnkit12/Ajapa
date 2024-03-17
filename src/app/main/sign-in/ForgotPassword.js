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
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import jwtServiceConfig from "src/app/auth/services/jwtService/jwtServiceConfig";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { useNavigate } from "react-router-dom";
import { MuiOtpInput } from "mui-one-time-password-input";
import JwtService from "src/app/auth/services/jwtService";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address"),
  countryCode: Yup.string(),
  mobileNumber: Yup
  .string()
  .matches(/^[1-9]\d{9}$/, "Invalid mobile number")
});

const phoneNumberCountryCodes = [
  "+91",
  "+1",
  "+44",
  "+33",
  "+49",
  "+81",
  // Add more country codes as needed
];

const INITIAL_COUNT = 120;

const twoDigit = (num) => String(num).padStart(2, "0");

const ForgotPassword = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [otp, setOtp] = useState(""); //OTP states
  const [text,setText] = useState("Reset Password")
  const [hideCheckBox, setHideCheckBox] = useState(true)

  //Timer to resend the Otp
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT);
  const [status, setStatus] = useState(null);
  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;

  const handleCheckboxChange = () => {
    setShowEmail((prevShowEmail) => !prevShowEmail);
  };

  useEffect(() => {
    setStatus(STATUS.STARTED);
}, []);

  const handleStart = () => {
    const formData = new FormData();
    formData.append("email", formik.values.email);
    formData.append("countryCode", formik.values.countryCode.split(" ")[0]);
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
            // marginLeft: "160px",
            display:'flex',
            justifyContent:'center',
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
      formData.append("countryCode", formik.values.countryCode.split(" ")[0]);
      formData.append("mobileNumber", formik.values.mobileNumber);
      formData.append("otp", otp);

      axios
        .post(`${jwtServiceConfig.otpVerifyForForgetPassword}`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
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
          console.log("ghnj", error);
        });
    } else {
      dispatch(showMessage({ message: "Fill all the OTP" }));
    }
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("email", formik.values.email);
    formData.append("countryCode", formik.values.countryCode.split(" ")[0]);
    formData.append("mobileNumber", formik.values.mobileNumber);

    axios
      .post(`${jwtServiceConfig.sentOTPForLogin}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        // console.log(response)
        if (response.status === 200) {
          setText("Fill the OTP")
          setHideCheckBox(false)
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
        console.log(error);
      });
  };

 

  const formik = useFormik({
    initialValues: {
      email: "",
      countryCode: "",
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
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "darkslategray",
                      },
                    },
                    width: "300px",
                    marginTop:'1rem'
                  }}
                />
              )}

              {!showEmail && (
                <div className="d-flex">
                  <Autocomplete
                    options={phoneNumberCountryCodes}
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
                        required
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
                        }}
                      />
                    )}
                  />
                  <TextField
                    name="mobileNumber"
                    label="Mobile Number"
                    type="number"
                    className="mb-20"
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                    required
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "darkslategray",
                        },
                      },
                      width: "200px",
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          )}
          <br />
         
          <div style={{display:'flex', flexDirection:'column'}}>
          {hideCheckBox && (
          <FormControlLabel
            control={
              <Checkbox
                checked={!showEmail}
                onChange={handleCheckboxChange}
                color="primary"
                style={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 18, // Adjust the font size as needed
                    border: "2px solid #000", // Set the border style
                    borderRadius: 1, // Adjust the border radius as needed
                  },
                }}
              />
            }
            label="Login Through Mobile"
            style={{
              fontWeight: 600,
              letterSpacing: "0px",
            }}
          />
          )}
          {showOtpInput && status === STATUS.STARTED ? (
               <div style={{ display: 'flex', justifyContent: 'center' }}> <b className="text-success" style={{fontSize:'1.3rem'}}>Resend OTP </b>
               <b className="ml-2 text-danger" style={{fontSize:'1.3rem'}}> {twoDigit(minutesToDisplay)}:
                   {twoDigit(secondsToDisplay)}</b>
               </div>
            ) : (
               status
            )}
            </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              style={{
                marginRight: "20px",
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
