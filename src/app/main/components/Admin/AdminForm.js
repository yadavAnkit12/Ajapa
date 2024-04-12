import React from 'react'
import { Container, Typography, Autocomplete } from "@mui/material"
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import _ from "@lodash";
import "react-phone-input-2/lib/style.css";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import jwtServiceConfig from "src/app/auth/services/jwtService/jwtServiceConfig";
import FuseLoading from "@fuse/core/FuseLoading";


const validationSchema = yup.object().shape({
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
  countryCode: yup.string().required("select country code"),
  mobileNumber: yup
    .string()
    .matches(/^[1-9]\d{9}$/, "Invalid mobile number")
    .required("Please enter your mobile number"),
});


const initialValues = {
  email: "",
  countryCode: '+91',
  mobileNumber: '',
  password: "",
};


const AdminForm = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [getcountryCode, setGetCountryCode] = useState([])
  const [loading, setLoading] = useState(false)

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
          setGetCountryCode(response?.data)
        }
      });
  }, []);

  const handleSubmit = (values) => {
    console.log(values)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Container>
        <Typography textAlign='center'>
          Create Admin
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          style={{marginTop:'1rem'}}
        >
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
        </form>
        <Button
          variant="contained"
          color="secondary"
          className="w-1/2 lg:w-1/4 mt-10"
          aria-label="save"
          // type="submit"
          onClick={formik.handleSubmit}
          size="large"
          style={{ margin: "0 auto" }}
        >
          Save
        </Button>
      </Container>
    </>
  )
}

export default AdminForm