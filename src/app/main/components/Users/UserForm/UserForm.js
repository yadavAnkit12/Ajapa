
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import _ from '@lodash';
import 'react-phone-input-2/lib/style.css'
import InputAdornment from '@mui/material/InputAdornment';
import { Autocomplete, Checkbox, FormControlLabel, FormControl, FormLabel, FormGroup, Dialog, DialogTitle, DialogActions, Button, Slide, } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import axios from 'axios';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import UserFormHead from './UserFormHead';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useNavigate } from 'react-router-dom';
import { userAPIConfig } from 'src/app/main/API/apiConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import { getLoggedInPartnerId } from 'src/app/auth/services/utils/common';
import { forwardRef } from 'react';


const fontStyles = {
  fontFamily:
    "'Hoefler Text', 'Baskerville Old Face','Garamond', 'Times new Roman' ,serif",
};

// const phoneNumberCountryCodes = [
//   "+91",
//   "+1",
//   "+44",
//   "+33",
//   "+49",
//   "+81",
//   // Add more country codes as needed
// ];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UserForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [showPassword, setShowPassword] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [countryID, setCountryID] = useState("");
  const [stateList, setStateList] = useState([]);
  const [stateID, setStateID] = useState("");
  const [cityList, setCityList] = useState([]);
  const [cityID, setCityID] = useState("");
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState("");
  const [showCredentials, setShowCredentials] = useState(true);
  const [isChild, setIsChild] = useState(false);
  const [open,setOpen] = useState(false)
  const [getcountryCode , setGetCountryCode] = useState([])
  const [stateName, setStateName] = useState('')  //for handling a state which have no state
  

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(100, "Full name should be less than 100 chars")
      .required("Please enter your full name"),
    email: yup
      .string()
      .email("Invalid email address")
      .matches(
        /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        "Invalid email"
      ),
    password: yup
      .string()
      .min(4, "Password is too short - should be 4 chars minimum"),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    gender: yup.string().required("Please select your gender"),
    dob: yup.date().required("Please enter your date of birth"),
    // countryCode: yup.string().required('select country code').required('required'),
    profilePicture: yup
      .mixed()
      .nullable()
      .test("fileType", "Unsupported file type", (value) => {
        if (!value) return true; // Allow null values
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(value.type);
      })
      .test("fileSize", "File size is too large (max 10MB)", (value) => {
        if (!value) return true;
        return value.size <= 10 * 1024 * 1024; // 10MB in bytes
      }),
    mobileNumber: yup.string().matches(/^[1-9]\d{9}$/, "Invalid mobile number"),
    // .required('Please enter your mobile number'),
    country: yup.string().required("Please enter your country"),
    state: yup.string().required("Please enter your state"),
    city: yup.string().required("Please enter your city"),
    isDisciple: yup.string(),
    pinCode: yup.string().matches(/^\d{6}$/, "Must be a 6-digit PIN code"),
    whatsAppNumber: yup
      .string()
      .matches(/^[1-9]\d{9}$/, "Invalid mobile number"),
  });

  useEffect(() => {
    formik.resetForm();
  }, [routeParams]);

  useEffect(() => {
    const { id } = routeParams;

    axios
      .get(`${userAPIConfig.getUserById}/${id}`, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          
          setUserID(response.data.user.id);
         
          const today = new Date();
          const userAge =
            today.getFullYear() -
            parseInt(response.data.user.dob?.split("-")[0]);

          if (userAge < 15) {
            if (
              response?.data?.user?.email !== "" ||
              response.data.user.mobileNumber !== "" ||
              response.data.user.password !== ""
            ) {
              setShowCredentials(true);
              setIsChild(true);
            } else {
              setIsChild(true);
              setShowCredentials(false);
            }
          }

          formik.setValues({
            id: response.data.user.id || "",
            familyId: response.data.user.familyId,
            name: response.data.user.name || "",
            email: response.data.user.email || "",
            password: response.data.user.password  || "",
            passwordConfirm: response.data.user.password  || "",
            gender: response.data.user.gender || "",
            dob: response.data.user.dob || "",
            role: response.data.user.role || "",
            status: response.data.user.status || "",
            pic: response.data.user.profileImage, // pic
            countryCode: response.data.user.countryCode || "",
            mobileNumber: response.data.user.mobileNumber || "",
            country: response.data.user.country?.split(":")[1] || "",
            state: response.data.user.state?.split(":")[1] || "",
            city: response.data.user.city?.split(":")[1] || "",
            profilePicture: null,
            isDisciple:
              response.data.user.isDisciple === true ? true : false,
            addressLine: response.data.user.addressLine || "",
            bloodGroup: response.data.user.bloodGroup || "",
            dikshaDate: response.data.user.dikshaDate || "",
            occupation: response.data.user.occupation || "",
            pinCode: response.data.user.pinCode || "",
            qualification: response.data.user.qualification || "",
            whatsAppNumber: response.data.user.whatsAppNumber || "",
          });
          setCountryID(response.data.user.country?.split(":")[0]);
          setStateID(response.data.user.state?.split(":")[0]);
          setCityID(response.data.user.city?.split(":")[0]);
          setLoading(false);
        }
      });
  }, []);

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
          setGetCountryCode(response?.data)
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

    if (showCredentials && !isChild) {
      if (
        !values.email ||
        !values.password ||
        !values.passwordConfirm ||
        !values.mobileNumber ||
        !values.countryCode
      ) {
        dispatch(
          showMessage({
            message: "Please enter all the mandatory fields",
            variant: "error",
          })
        );
        return;
      }
    }

    
    if (formik.values.isDisciple === "") {
      return dispatch(
        showMessage({
          message: "Please indicate whether you are an Ajapa disciple or not",
          variant: "error",
        })
      );
    }
   
    if (formik.isValid) {
     setLoading(true)
      const formattedData = new FormData();
      formattedData.append("id", values.id);
      formattedData.append("familyId", values.familyId);
      formattedData.append("name", values.name);
      formattedData.append("email", values.email);
      formattedData.append("password",  values.password);
      formattedData.append("gender", values.gender);
      formattedData.append("countryCode", values.countryCode?.split(" ")[0]);
      formattedData.append("dob", values.dob);
      formattedData.append("mobileNumber", values.mobileNumber);
      formattedData.append("country", `${countryID}:${values.country}`);
      formattedData.append("state", `${stateID}:${values.state}`);
      formattedData.append("city", `${cityID}:${values.city}`);
      formattedData.append("addressLine", values.addressLine);
      formattedData.append("bloodGroup", values.bloodGroup);
      formattedData.append("dikshaDate", values.dikshaDate);
      formattedData.append("occupation", values.occupation);
      formattedData.append("status", values.status);
      formattedData.append("role", values.role);
      formattedData.append("pinCode", values.pinCode);
      formattedData.append("qualification", values.qualification);
      formattedData.append("whatsAppNumber", values.whatsAppNumber);
      formattedData.append(
        "isDisciple",
        values.isDisciple === true ? true : false
      );
      if (values.profilePicture !== null) {
        formattedData.append("file", values.profilePicture);
        axios
          .post(`${userAPIConfig.updateUserWithImage}`, formattedData, {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: `Bearer ${window.localStorage.getItem(
                "jwt_access_token"
              )}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              setLoading(false)
              dispatch(
                showMessage({
                  message: response.data.message,
                  variant: "success",
                })
              );
              // this is beacuse suppose if super admin update the profile of user

              if (getLoggedInPartnerId() == userID) {
                navigate(`/apps/profile/${getLoggedInPartnerId()}`);
                window.location.reload()
              } else {
                // navigate("/app/users/");
                history.back()
              }
            } else {
              setLoading(false)
              dispatch(
                showMessage({
                  message: response.data.errorMessage,
                  variant: "error",
                })
              );
            }
          })
          .catch((error) =>{
            setLoading(false)
             console.log(error)});
      } else {
        formattedData.append("profileImage", values.pic);

        axios
          .post(`${userAPIConfig.updateUser}`, formattedData, {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: `Bearer ${window.localStorage.getItem(
                "jwt_access_token"
              )}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              setLoading(false)
              dispatch(
                showMessage({
                  message: response.data.message,
                  variant: "success",
                })
              );
              // this is beacuse suppose if super admin update the profile of user
              if (getLoggedInPartnerId() == userID) {
                navigate(`/apps/profile/${getLoggedInPartnerId()}`);
                window.location.reload()
              } else {
                // navigate("/app/users/");
                history.back()
              }
            } else {
              setLoading(false)
              dispatch(
                showMessage({
                  message: response.data.errorMessage,
                  variant: "error",
                })
              );
            }
          })
          .catch((error) => {
            setLoading(false)
            console.log(error)});
      }
    } else {
      dispatch(
        showMessage({
          message: "Please check the mandatory fields",
          variant: "error",
        })
      );
    }
  };

  //Showing fields in case of child
  const handleCheckBoxChange = () => {
    setShowCredentials(!showCredentials);
    if(showCredentials){
      setShowCredentials(true)
      setOpen(true)
    }
   
  };

  const clearFieldsForChild=()=>{
        setShowCredentials(false)
        formik.setValues({
          ...formik.values,
          email: "",
          password: "",
          passwordConfirm: "",
          mobileNumber: "",
          countryCode: "",
          whatsAppNumber: "",
        }); 
        setOpen(false)

  } 

  const handleClose=()=>{
    setShowCredentials(true)
    setOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      id: "",
      familyId : "",
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      gender: "",
      dob: "",
      role: "",
      status: "",
      pic: "",
      countryCode: "",
      mobileNumber: "",
      country: "",
      state: "",
      city: "",
      profilePicture: null,
      // isDisciple: "No",
      isDisciple:"",
      addressLine: "",
      bloodGroup: "",
      dikshaDate: "",
      occupation: "",
      pinCode: "",
      qualification: "",
      whatsAppNumber: "",
    },
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

  if (!formik.values.id) {
    return <FuseLoading />;
  }
  function handleTabChange(event, value) {
    setTabValue(value);
  }
 console.log(formik)
  return (
    <FormProvider>
      <FusePageCarded
        header={
          <UserFormHead
            handleSubmit={handleSubmit}
            values={formik.values}
            formik={formik}
          />
        }
        content={
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64 border-b-1" }}
            >
              <Tab className="h-64" label="Phase I" />
              <Tab className="h-64" label="Phase II" />
              <Tab className="h-64" label="Phase III" />
              <Tab className="h-64" label="Phase IV" />
            </Tabs>
            <div className="p-16 sm:p-24 w-full">
              <form onSubmit={formik.handleSubmit}>
                <div className={tabValue !== 0 ? "hidden" : ""}>
                  <TextField
                    label="Full Name"
                    sx={{ mb: 2 }}
                    className="max-w-md"
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
                  />

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <TextField
                      name="dob"
                      label="Date of Birth"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2 }}
                      className="max-w-md"
                      onChange={(e) => {
                        formik.handleChange(e);

                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.dob}
                      error={formik.touched.dob && Boolean(formik.errors.dob)}
                      helperText={formik.touched.dob && formik.errors.dob}
                      variant="outlined"
                      required
                      fullWidth
                      inputProps={{
                        max: new Date().toISOString().split("T")[0],
                      }}
                    />

                    {isChild && (
                      <div style={{ marginBottom: "16px" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={showCredentials}
                              onChange={handleCheckBoxChange}
                              color="primary"
                            />
                          }
                          label="Complete the following fields: Email, Phone Number, and Password?"
                        />
                      </div>
                    )}
                  </div>

                  {showCredentials && (
                    <>
                      <TextField
                        sx={{ mb: 2 }}
                        className="max-w-md"
                        name="email"
                        label="Email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                        variant="outlined"
                        required
                        fullWidth
                      />

                      <div className="d-flex max-w-md">
                        <Autocomplete
                          // options={phoneNumberCountryCodes}
                          options={
                            getcountryCode.length > 0
                              ? getcountryCode.map((country) => country.phonecode)
                              : []
                          }
                          value={formik.values.countryCode}
                          onChange={(event, newValue) => {
                            formik.setFieldValue("countryCode", newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Code"
                              variant="outlined"
                              sx={{ mb: 2 }}
                              required
                              error={
                                formik.touched.countryCode &&
                                Boolean(formik.errors.countryCode)
                              }
                              helperText={
                                formik.touched.countryCode &&
                                formik.errors.countryCode
                              }
                            />
                          )}
                        />
                        <TextField
                          name="mobileNumber"
                          label="Mobile Number"
                          type="number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.mobileNumber}
                          error={
                            formik.touched.mobileNumber &&
                            Boolean(formik.errors.mobileNumber)
                          }
                          helperText={
                            formik.touched.mobileNumber &&
                            formik.errors.mobileNumber
                          }
                          variant="outlined"
                          required
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                      </div>
                    </>
                  )}

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
                        sx={{ mb: 2 }}
                        className="max-w-md"
                        variant="outlined"
                        required
                        error={
                          formik.touched.gender && Boolean(formik.errors.gender)
                        }
                        helperText={
                          formik.touched.gender && formik.errors.gender
                        }
                        disabled={formik.values.isActive}
                      />
                    )}
                  />
                </div>
                <div className={tabValue !== 1 ? "hidden" : ""}>
                  <TextField
                    label="Pin Code"
                    sx={{ mb: 2 }}
                    className="max-w-md"
                    name="pinCode"
                    type="text"
                    value={formik.values.pinCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.pinCode && Boolean(formik.errors.pinCode)
                    }
                    helperText={formik.touched.pinCode && formik.errors.pinCode}
                    variant="outlined"
                    fullWidth
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
                        sx={{ mb: 2 }}
                        className="max-w-md"
                        variant="outlined"
                        required
                        error={
                          formik.touched.country &&
                          Boolean(formik.errors.country)
                        }
                        helperText={
                          formik.touched.country && formik.errors.country
                        }
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
                        variant="outlined"
                        sx={{ mb: 2 }}
                        className="max-w-md"
                        required
                        error={
                          formik.touched.state && Boolean(formik.errors.state)
                        }
                        helperText={formik.touched.state && formik.errors.state}
                      />
                    )}
                  />

                  <Autocomplete
                    options={
                      cityList.length > 0
                        ? cityList.map((city) => city.name)
                        : []
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
                        variant="outlined"
                        sx={{ mb: 2 }}
                        className="max-w-md"
                        required
                        error={
                          formik.touched.city && Boolean(formik.errors.city)
                        }
                        helperText={formik.touched.city && formik.errors.city}
                      />
                    )}
                  />
                </div>

                <div className={tabValue !== 2 ? "hidden" : ""}>
                  {showCredentials && (
                    <>
                      <TextField
                        name="password"
                        label="Password"
                        sx={{ mb: 2 }}
                        className="max-w-md"
                        type={showPassword ? "text" : "password"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        error={
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                        helperText={
                          formik.touched.password && formik.errors.password
                        }
                        variant="outlined"
                        required
                        fullWidth
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
                        sx={{ mb: 2 }}
                        className="max-w-md"
                        name="passwordConfirm"
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.passwordConfirm}
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
                    </>
                  )}

                  {/* <div style={{ marginBottom: "16px" }}> */}
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.isDisciple === "Yes"}
                          onChange={(event) => {
                            formik.setFieldValue(
                              "isDisciple",
                              event.target.checked ? "Yes" : "No"
                            );
                          }}
                          color="primary"
                        />
                      }
                      label="Are you an Ajapa Disciple ?"
                    />
                  </div> */}
                  
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
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "profilePicture",
                          event.target.files[0]
                        );
                      }}
                      onBlur={formik.handleBlur}
                      style={{
                        fontSize: "1.8rem",
                        color: "#1a202c",
                        // padding: '0.75rem',  // Adjust the padding to increase the size
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        background: "transparent",
                        outline: "none",
                        border: "none",
                      }}
                    />
                    {formik.touched.profilePicture &&
                      formik.errors.profilePicture && (
                        <p
                          style={{
                            fontSize: "12px",
                            padding: "0.75rem",
                            color: "red",
                          }}
                        >
                          {formik.errors.profilePicture}
                        </p>
                      )}
                    <p style={{ fontSize: "10px", padding: "0.75rem 0" }}>
                      PNG, JPG, or JPEG (Must be a clear image).
                    </p>
                  </div>
                </div>
                <div className={tabValue !== 3 ? "hidden" : ""}>
                  <TextField
                    label="Address Line"
                    sx={{ mb: 2 }}
                    className="max-w-md"
                    name="addressLine"
                    type="text"
                    value={formik.values.addressLine}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.addressLine &&
                      Boolean(formik.errors.addressLine)
                    }
                    helperText={
                      formik.touched.addressLine && formik.errors.addressLine
                    }
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3} // Set the number of rows you want
                  />
                  <Autocomplete
                    options={["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"]}
                    getOptionLabel={(option) => option}
                    value={formik.values.bloodGroup}
                    onChange={(event, value) =>
                      formik.setFieldValue("bloodGroup", value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Blood Group"
                        sx={{ mb: 2 }}
                        className="max-w-md"
                        // name="bloodGroup"
                        onBlur={formik.handleBlur}
                        // error={formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)}
                        // helperText={formik.touched.bloodGroup && formik.errors.bloodGroup}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <TextField
                    label="Diksha Date"
                    sx={{ mb: 2 }}
                    className="max-w-md"
                    name="dikshaDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.dikshaDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.dikshaDate &&
                      Boolean(formik.errors.dikshaDate)
                    }
                    helperText={
                      formik.touched.dikshaDate && formik.errors.dikshaDate
                    }
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    label="Occupation"
                    sx={{ mb: 2 }}
                    className="max-w-md"
                    name="occupation"
                    type="text"
                    value={formik.values.occupation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.occupation &&
                      Boolean(formik.errors.occupation)
                    }
                    helperText={
                      formik.touched.occupation && formik.errors.occupation
                    }
                    variant="outlined"
                    fullWidth
                  />

                  <TextField
                    label="Qualification"
                    sx={{ mb: 2 }}
                    className="max-w-md"
                    name="qualification"
                    type="text"
                    value={formik.values.qualification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.qualification &&
                      Boolean(formik.errors.qualification)
                    }
                    helperText={
                      formik.touched.qualification &&
                      formik.errors.qualification
                    }
                    variant="outlined"
                    fullWidth
                  />

                  {showCredentials && (
                    <TextField
                      label="whatsApp Number"
                      sx={{ mb: 2 }}
                      className="max-w-md"
                      name="whatsAppNumber"
                      type="text"
                      value={formik.values.whatsAppNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.whatsAppNumber &&
                        Boolean(formik.errors.whatsAppNumber)
                      }
                      helperText={
                        formik.touched.whatsAppNumber &&
                        formik.errors.whatsAppNumber
                      }
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </div>
              </form>
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>{"Do you want to clear the fields"}</DialogTitle>

                <DialogActions>
                  <Button onClick={() => handleClose()}>No</Button>
                  <Button onClick={()=>clearFieldsForChild()} autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default UserForm;
