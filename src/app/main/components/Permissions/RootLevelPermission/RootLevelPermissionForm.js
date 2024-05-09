import React from 'react'
import { Container, Typography, Autocomplete, FormGroup, FormControlLabel, Checkbox, FormControl, FormLabel } from "@mui/material"
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
    admin: yup
        .string()
        .required("Please select an admin"),
    events: yup
        .string()
        .required("Please select an event"),
});


const initialValues = {
    admin: "",
    // isCreate: false,
    isRead: false,
    isUpdate: false,
    isDelete: false,
    // events: "",
    isCreateEvent: false,
    isReadEvent: false,
    isUpdateEvent: false,
    isDeleteEvent: false,
};


const RootLevelPermissionForm = ({ setOpen }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)



    const handleModalClose = () => {
        setOpen(false)
    }

    const handleSubmit = (values) => {
       console.log(values)
        // if (formik.isValid) {
        //   setLoading(true)

        //   const formData = new FormData();
        //   formData.append("email", values.email);
        //   formData.append("countryCode", values.countryCode.split(" ")[0]);
        //   formData.append("mobileNumber", values.mobileNumber);
        //   formData.append("password", values.password);
        //   formData.append("dob", '1983-11-16');
        //   formData.append("role", "Admin");

        //   axios.post(`${jwtServiceConfig.addAdmin}`, formData, {
        //     headers: {
        //       "Content-type": "multipart/form-data",
        //       Authorization: `Bearer ${window.localStorage.getItem("jwt_access_token")}`,
        //     },
        //   })
        //     .then((response) => {
        //       if (response.status === 200) {
        //         setLoading(false)
        //         handleModalClose()
        //         formik.resetForm()
        //         dispatch(showMessage({ message: response.data.message, variant: "success", }));
        //       }
        //       else {
        //         setLoading(false)
        //         dispatch(showMessage({ message:  response.data.errorMessage, variant: "error", }));
        //       }
        //     })
        //     .catch(() => {
        //       dispatch(showMessage({ message: "Something went wrong", variant: 'error' }));
        //     })
        // }
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
        <>
            <Container>
                <Typography textAlign='center'
                    style={{ fontStyle: 'normal', fontSize: '24px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}
                >
                    Root Level Permission
                </Typography>
                <form
                    onSubmit={formik.handleSubmit}
                    style={{ marginTop: '1rem' }}
                >


                    {/* <Autocomplete
                        options={
                            cityList.length > 0
                                ? cityList.map((city) => city.name)
                                : []
                        }
                        fullWidth
                        value={formik.values.city}
                        onChange={(event, newValue) => {
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
                    /> */}

                    <Autocomplete
                        options={["Admin1", "Admin2", "Admin3"]}
                        // getOptionLabel={(option) => option}
                        value={formik.values.admin}
                        onChange={(event, value) =>
                            formik.setFieldValue("admin", value)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Admin"
                                sx={{ mb: 2 }}
                                className="max-w-md"
                                name="admin"
                                onBlur={formik.handleBlur}
                                error={formik.touched.admin && Boolean(formik.errors.admin)}
                                helperText={formik.touched.admin && formik.errors.admin}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    <div className='flex flex-col'>
                    <FormControl component="fieldset" required>
                        <FormLabel className="text-black">
                            Users Permission
                        </FormLabel>
                        <FormGroup row>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox checked={formik.values.isCreate}
                                        onChange={(event) => formik.setFieldValue("isCreate", event.target.checked)}
                                        name="isCreate" />}
                                label="Create"
                            /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formik.values.isRead}
                                        onChange={(event) => formik.setFieldValue("isRead", event.target.checked)}
                                        name="isRead" />}
                                label="Read"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formik.values.isUpdate}
                                        onChange={(event) => formik.setFieldValue("isUpdate", event.target.checked)}
                                        name="isUpdate" />}
                                label="Update"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formik.values.isDelete}
                                        onChange={(event) => formik.setFieldValue("isDelete", event.target.checked)}
                                        name="isDelete" />}
                                label="Delete"
                            />
                        </FormGroup>
                    </FormControl>


                    {/* <Autocomplete
                        options={["Event1", "Event2", "Event3"]}
                        // getOptionLabel={(option) => option}
                        value={formik.values.events}
                        onChange={(event, value) =>
                            formik.setFieldValue("events", value)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Event"
                                sx={{ mb: 2 }}
                                className="max-w-md  mt-4"
                                name="events"
                                onBlur={formik.handleBlur}
                                error={formik.touched.events && Boolean(formik.errors.events)}
                                helperText={formik.touched.events && formik.errors.events}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    /> */}
                    
                    <FormControl component="fieldset" required>
                        <FormLabel className="text-black">
                            Events Permission
                        </FormLabel>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formik.values.isCreateEvent}
                                        onChange={(event) => formik.setFieldValue("isCreateEvent", event.target.checked)}
                                        name="isCreate" />}
                                label="Create"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formik.values.isReadEvent}
                                        onChange={(event) => formik.setFieldValue("isReadEvent", event.target.checked)}
                                        name="isRead" />}
                                label="Read"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formik.values.isUpdateEvent}
                                        onChange={(event) => formik.setFieldValue("isUpdateEvent", event.target.checked)}
                                        name="isUpdate" />}
                                label="Update"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formik.values.isDeleteEvent}
                                        onChange={(event) => formik.setFieldValue("isDeleteEvent", event.target.checked)}
                                        name="isDelete" />}
                                label="Delete"
                            />
                        </FormGroup>
                    </FormControl>
                    </div>


                    <div style={{ display: "flex", justifyContent: "flex-end" }}  >
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                className="w-1/2 lg:w-1/4 mt-10"
                                aria-label="cancel"
                                onClick={handleModalClose}
                                size="large"
                                style={{ marginRight: '1rem' }}
                            >
                                Close
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                className="w-1/2 lg:w-1/4 mt-10"
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
        </>
    )
}

export default RootLevelPermissionForm