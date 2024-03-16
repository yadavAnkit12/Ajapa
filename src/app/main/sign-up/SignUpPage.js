import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  Stack,
  FormControl,
  FormLabel,
  FormGroup,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import OTPVerify from "./OTPVerify";
import { Modal, Box } from "@mui/material";
import axios from "axios";
import jwtServiceConfig from "src/app/auth/services/jwtService/jwtServiceConfig";
import ReCAPTCHA from "react-google-recaptcha";
import FuseLoading from "@fuse/core/FuseLoading";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
  maxWidth: "1200px",
  maxHeight: "650px",
  overflow: "auto",
  width: "auto",
};

const fontStyles = {
  fontFamily:
    "'Hoefler Text', 'Baskerville Old Face','Garamond', 'Times new Roman' ,serif",
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

function SignUpPage() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [countryID, setCountryID] = useState("");
  const [stateList, setStateList] = useState([]);
  const [stateID, setStateID] = useState("");
  const [cityList, setCityList] = useState([]);
  const [cityID, setCityID] = useState("");
  const [recaptcha, setRecaptcha] = useState(null);
  const [loading, setLoading] = useState(false)
  const [stateName, setStateName]= useState('')  //for handling a state whic have no state
  const initialValues = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    gender: "",
    dob: null,
    countryCode: '+91',
    mobileNumber: '',
    country: '',
    state: '',
    city: '',
    profilePicture: null,
    // isDisciple: 'false'
    isDisciple: "",
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Please enter your full name")
      .max(100, "Full name should be less than 100 chars"),
    email: yup
      .string()
      .email("Invalid email address")
      .matches(
        /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        "Invalid email"
      )
      .required("Please enter your email"),
    password: yup
      .string()
      .required("Please enter your password.")
      .min(4, "Password is too short - should be 4 chars minimum"),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    gender: yup.string().required("Please select your gender"),
    dob: yup
      .date()
      .typeError("Please enter a valid date")
      .required("Please enter your date of birth")
      .test("is-adult", "You must be at least 18 years old", function (value) {
        const currentDate = new Date();
        const minAgeDate = new Date(
          currentDate.getFullYear() - 18,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        return value <= minAgeDate;
      }),
    countryCode: yup.string().required("select country code"),
    mobileNumber: yup
      .string()
      .matches(/^[1-9]\d{9}$/, "Invalid mobile number")
      .required("Please enter your mobile number"),
    country: yup.string().required("Please enter your country"),
    state: yup.string().required("Please enter your state"),
    city: yup.string().required("Please enter your city"),
    profilePicture: yup
      .mixed()
      .test("fileType", "Unsupported file type", (value) => {
        if (!value) return true;
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(value.type);
      })
      .test("fileSize", "File size is too large (max 10MB)", (value) => {
        if (!value) return true;
        return value.size <= 10 * 1024 * 1024; // 10MB in bytes
      })

      .required("Image is required"),
    isDisciple: yup.string(),
  });

  //fetching the country list
  useEffect(() => {
    axios
      .get(jwtServiceConfig.country, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCountryList(response.data);
        }
      });
  }, []);

  //fetch the state on the behalf of country
  useEffect(() => {
    axios
      .get(`${jwtServiceConfig.state}/${countryID}`, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setStateList(response.data);
        }
      });
  }, [countryID]);

  //fetch the city on the behalf of state
  useEffect(() => {
    axios
      .get(`${jwtServiceConfig.city}/${stateID}`, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length === 0) {
            // If no cities are available, set the city list to an array containing the state name
            setCityList([{ id: stateID, name: stateName }]);
          } else {
            // If cities are available, set the city list to the response data
            setCityList(response.data);
          }
        }
      });
  }, [stateID]);

  const handleSubmit = (values) => {
    if (recaptcha === null) {
      return dispatch(
        showMessage({
          message: "Select you are not a robot",
          variant: "error",
        })
      );
    }
    if (formik.values.isDisciple === "") {
      return dispatch(
        showMessage({
          message: "Please indicate whether you are an Ajapa disciple or not",
          variant: "error",
        })
      );
    }

    if(formik.isValid)
    {
      setLoading(true)
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("countryCode", values.countryCode);
      formData.append("mobileNumber", values.mobileNumber);
      axios
        .post(`${jwtServiceConfig.otpSent}`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setLoading(false);
            setOpenEdit(true);
          } else {
            dispatch(
              showMessage({
                message: response.data.errorMessage,
                variant: "error",
              })
            );
          }
        })
        .catch((error) => console.log(error));
    }
    else{
      return dispatch(
        showMessage({
          message: "Please fill all details",
          variant: "error",
        })
      )
    }

  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  return (
    <div
      className="w-full p-24 flex-1"
      style={{
        margin: "0 auto",
        backgroundImage: "linear-gradient(to bottom right, #FDFCFB, #E2D1C3)",
      }}
    >
      <div className="p-8">
        <div className="d-flex justify-content-center">
          <img
            style={{ width: "150px" }}
            src="assets/images/logo/logo.png"
            alt="logo"
          />
        </div>

        <h3
          style={{
            fontStyle: "normal",
            fontSize: "24px",
            lineHeight: "28px",
            letterSpacing: "0px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Register: Head Of The Family
        </h3>
        <div className="flex items-baseline mt-2 font-medium justify-content-center">
          <Typography
            className="text-lg"
            style={{
              // fontFamily: "BentonSans bold",
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "28px",
              letterSpacing: "0px",
              textAlign: "center",
              fontWeight: 600,
              marginTop: "5px",
            }}
          >
            Already have an account?
          </Typography>
          <Link
            className="ml-4"
            to="/sign-in"
            style={{
              // fontFamily: "BentonSans bold",
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "28px",
              letterSpacing: "0px",
              textAlign: "center",
              fontWeight: 400,
              marginTop: "5px",
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
      <form
        className="flex flex-col justify-center items-center w-full mt-2"
        onSubmit={formik.handleSubmit}
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Grid container>
          <Grid item xs={12} md={6}>
            <Stack spacing={5} sx={{ padding: "16px" }}>
              <TextField
                label="Full Name"
                className="w-full lg:w-5/6 mx-auto"
                name="name"
                type="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "darkslategray",
                    },
                  },
                }}
              />

              <TextField
                className="mb-24 w-full lg:w-5/6 mx-auto"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
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
                }}
              />

              <div className="d-flex w-full lg:w-5/6 mx-auto">
                <Autocomplete
                  options={phoneNumberCountryCodes}
                  value={formik.values.countryCode}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("countryCode", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Code"
                      variant="outlined"
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "darkslategray",
                          },
                        },
                      }}
                      error={
                        formik.touched.countryCode &&
                        Boolean(formik.errors.countryCode)
                      }
                      helperText={
                        formik.touched.countryCode && formik.errors.countryCode
                      }
                    />
                  )}
                />
                <TextField
                  name="mobileNumber"
                  label="Mobile Number"
                  type="text"
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
                  }}
                />
              </div>

              <TextField
                name="dob"
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                className="w-full lg:w-5/6 mx-auto"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
                helperText={formik.touched.dob && formik.errors.dob}
                variant="outlined"
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "darkslategray",
                    },
                  },
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
              />

              <TextField
                name="password"
                label="Password"
                className="w-full lg:w-5/6 mx-auto"
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "darkslategray",
                    },
                  },
                }}
                required
                fullWidth
                inputProps={{
                  maxLength: 15,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                className="w-full lg:w-5/6 mx-auto"
                name="passwordConfirm"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.passwordConfirm &&
                  Boolean(formik.errors.passwordConfirm)
                }
                helperText={
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
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
                }}
                inputProps={{
                  maxLength: 15,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={5} sx={{ padding: "16px" }}>
              <Autocomplete
                options={["Male", "Female", "Others"]}
                fullWidth
                value={formik.values.gender}
                onChange={(event, newValue) => {
                  formik.setFieldValue("gender", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gender"
                    className="w-full lg:w-5/6 mx-auto"
                    variant="outlined"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "darkslategray",
                        },
                      },
                    }}
                    error={
                      formik.touched.gender && Boolean(formik.errors.gender)
                    }
                    helperText={formik.touched.gender && formik.errors.gender}
                    disabled={formik.values.isActive}
                  />
                )}
              />

              <Autocomplete
                options={
                  countryList.length > 0
                    ? countryList.map((country) => country.name)
                    : []
                }
                fullWidth
                value={formik.values.country}
                onChange={(event, newValue) => {
                  const selectedCountry = countryList.find(
                    (country) => country.name === newValue
                  )?.id;
                  setCountryID(selectedCountry);
                  formik.setFieldValue("country", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    name="country"
                    className="w-full lg:w-5/6 mx-auto"
                    variant="outlined"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "darkslategray",
                        },
                      },
                    }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.country && Boolean(formik.errors.country)
                    }
                    helperText={formik.touched.country && formik.errors.country}
                  />
                )}
              />
              <Autocomplete
                options={
                  stateList.length > 0
                    ? stateList.map((state) => state.name)
                    : []
                }
                fullWidth
                value={formik.values.state}
                onChange={(event, newValue) => {
                  const selectedSate = stateList.find(
                    (state) => state.name === newValue
                  )?.id;
                  const selectedStateName = stateList.find(
                    (state) => state.name === newValue
                  )?.name;
                  setStateName(selectedStateName)
                  setStateID(selectedSate);
                  formik.setFieldValue("state", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    name="state"
                    variant="outlined"
                    className="w-full lg:w-5/6 mx-auto"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "darkslategray",
                        },
                      },
                    }}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                )}
              />

              <Autocomplete
                options={
                  cityList.length > 0 ? cityList.map((city) => city.name) : []
                }
                fullWidth
                value={formik.values.city}
                onChange={(event, newValue) => {
                  const selectedCity = cityList.find(
                    (city) => city.name === newValue
                  )?.id;
                  setCityID(selectedCity);
                  formik.setFieldValue("city", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    name="city"
                    variant="outlined"
                    className="w-full lg:w-5/6 mx-auto"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "darkslategray",
                        },
                      },
                    }}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                )}
              />
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.isDisciple === 'true'}
                    onChange={(event) => {
                      formik.setFieldValue('isDisciple', event.target.checked ? 'true' : 'false');
                    }}
                    color="primary"
                  />
                }
                label="Are you an Ajapa Disciple ?"
              />     */}
              <div>
                <FormControl component="fieldset" required>
                  <FormLabel component="legend" className="text-black">
                    Are you an Ajapa Disciple ?
                  </FormLabel>
                  <FormGroup className="flex flex-row">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.isDisciple === true}
                          onChange={() =>
                            formik.setFieldValue("isDisciple", true)
                          }
                        />
                      }
                      label="Yes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.isDisciple === false}
                          onChange={() =>
                            formik.setFieldValue("isDisciple", false)
                          }
                        />
                      }
                      label="No"
                    />
                  </FormGroup>
                </FormControl>
              </div>

              <div>
                <div>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "profilePicture",
                        event.target.files[0]
                      );
                    }}
                    style={{
                      fontSize: "1.8rem",
                      color: "#1a202c",
                      padding: "0.75rem", // Adjust the padding to increase the size
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      background: "transparent",
                      outline: "none",
                      border: "none",
                    }}
                  />
                </div>

                {formik.touched.profilePicture &&
                  formik.errors.profilePicture && (
                    <p
                      style={{
                        fontSize: "13px",
                        padding: "0.75rem",
                        color: "red",
                      }}
                    >
                      {formik.errors.profilePicture}
                    </p>
                  )}
                <p style={{ fontSize: "15px", padding: "0.75rem" }}>
                  PNG, JPG, or JPEG (Must be a clear image).
                  <span style={{ color: "red", fontSize: "1.8rem" }}>*</span>
                </p>
              </div>
            </Stack>
          </Grid>

          <div className="flex flex-col items-center  justify-center w-full">
            <ReCAPTCHA
              className="py-4"
              sitekey="6Le1OQApAAAAAMAswCIrtcLACa_6l9y1opvbZjUp"
              onChange={(value) => setRecaptcha(value)}
            />

            <Button
              variant="contained"
              color="secondary"
              className="w-1/2 lg:w-1/4 mt-10"
              aria-label="Register"
              onClick={formik.handleSubmit}
              size="large"
              style={{ margin: "0 auto", backgroundColor: "#792b00" }}
            >
              Create account
            </Button>
          </div>
        </Grid>
      </form>
      <Modal
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            "@media (max-width: 700px) and (min-width: 500px)": {
              width: "65%",
            },
            "@media (max-width: 500px)": {
              width: "100%",
            },
          }}
        >
          <OTPVerify
            data={formik?.values}
            handleEditClose={handleEditClose}
            countryID={countryID}
            stateID={stateID}
            cityID={cityID}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default SignUpPage;
