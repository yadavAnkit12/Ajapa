import React from 'react';
import { Container, Typography, Autocomplete, FormGroup, FormControlLabel, Checkbox, FormControl, FormLabel } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import FuseLoading from "@fuse/core/FuseLoading";
import { adminAPIConfig } from 'src/app/main/API/apiConfig';

const validationSchema = yup.object().shape({
    admin: yup.string().required("Please select an Admin"),
});

const initialValues = {
    id: "",
    email: "",
    admin: '',
    readUser: false,
    updateUser: false,
    statusUser: false,
    createEvent: false,
    readEvent: false,
    updateEvent: false,
};

const RootLevelPermissionForm = (props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [adminList, setAdminList] = useState([])

    useEffect(()=>{
       if(props.permissionId && adminList.length>0){
        axios.get(`${adminAPIConfig.getRootLevelPermissionByEmail}?email=${props.permissionId.email}`, {
            headers: {
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${window.localStorage.getItem("jwt_access_token")}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                   console.log(response)
                   const data=response.data.data
                   formik.setValues({
                    id: data.id || "",
                    email: data.email || "",
                    admin: `${adminList.find((admin)=>admin.email===data.email).name}(${data.email})` || '',
                    readUser: data.readUser || false,
                    updateUser:data.updateUser ||  false,
                    statusUser:data.statusUser ||  false,
                    createEvent: data.createEvent || false,
                    readEvent: data.readEvent || false,
                    updateEvent: data.updateEvent || false,
                   })
                }
                else {
                    setLoading(false)
                    dispatch(showMessage({ message: response.data.errorMessage, variant: "error", }));
                }
            })
            .catch(() => {
                dispatch(showMessage({ message: "Something went wrong", variant: 'error' }));
            })
       }
    },[props,adminList])

    useEffect(() => {
        axios.get(`${adminAPIConfig.list}`, {
            headers: {
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${window.localStorage.getItem("jwt_access_token")}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    setAdminList(response.data.data)
                }
                else {
                    setLoading(false)
                    dispatch(showMessage({ message: response.data.errorMessage, variant: "error", }));
                }
            })
            .catch(() => {
                dispatch(showMessage({ message: "Something went wrong", variant: 'error' }));
            })
    }, [])

    const handleSubmit = (values) => {

        if (formik.isValid) {
            setLoading(true)

            const selectedAdmin = adminList.find((admin) => admin.name === values.admin.split('(')[0]);

            const formData = new FormData();
            formData.append("id", selectedAdmin?.id);
            formData.append("email", selectedAdmin?.email);
            formData.append("readUser", values.readUser);
            formData.append("updateUser", values.updateUser);
            formData.append("statusUser", values.statusUser);
            formData.append("createEvent", values.createEvent);
            formData.append("readEvent", values.readEvent);
            formData.append("updateEvent", values.updateEvent);
            if(props.permissionId){
                formData.append("id",values.id)
            }

            axios.post(`${adminAPIConfig.rootLevelPermission}`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: `Bearer ${window.localStorage.getItem("jwt_access_token")}`,
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setLoading(false)
                        props.setChange(!props.change)
                        props.handleModalClose()
                        formik.resetForm()
                        dispatch(showMessage({ message: response.data.message, variant: "success", }));
                    }
                    else {
                        setLoading(false)
                        dispatch(showMessage({ message: response.data.errorMessage, variant: "error", }));
                    }
                })
                .catch(() => {
                    dispatch(showMessage({ message: "Something went wrong", variant: 'error' }));
                })
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    if (loading) {
        return <FuseLoading />;
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
                    <Autocomplete
                        options={adminList.length > 0 ? adminList.map((admin) => `${admin.name}(${admin.email})`) : []}
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
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.readUser}
                                            onChange={(event) => formik.setFieldValue("readUser", event.target.checked)}
                                            name="readUser" />}
                                    label="Read User"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.updateUser}
                                            onChange={(event) => formik.setFieldValue("updateUser", event.target.checked)}
                                            name="updateUser" />}
                                    label="Update User"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.statusUser}
                                            onChange={(event) => formik.setFieldValue("statusUser", event.target.checked)}
                                            name="statusUser" />}
                                    label="Status User"
                                />
                            </FormGroup>
                        </FormControl>

                        <FormControl component="fieldset" required>
                            <FormLabel className="text-black">
                                Events Permission
                            </FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.createEvent}
                                            onChange={(event) => formik.setFieldValue("createEvent", event.target.checked)}
                                            name="createEvent" />}
                                    label="Create Event"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.readEvent}
                                            onChange={(event) => formik.setFieldValue("readEvent", event.target.checked)}
                                            name="readEvent" />}
                                    label="Read Event"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.updateEvent}
                                            onChange={(event) => formik.setFieldValue("updateEvent", event.target.checked)}
                                            name="updateEvent" />}
                                    label="Update Event"
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
                                onClick={props.handleModalClose}
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

export default RootLevelPermissionForm;
