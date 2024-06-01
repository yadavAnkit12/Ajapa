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
import { adminAPIConfig, eventAPIConfig } from 'src/app/main/API/apiConfig';

const validationSchema = yup.object().shape({
    admin: yup.string().required("Please select an Admin"),
});

const initialValues = {
    id: "",
    email: "",
    eventId: '',
    admin: '',
    canreadEventRegistration:false,
    canreadAttendance:false,
    canupdateAttendance:false,
    cancreateFood:false,
    canupdateFood:false,
    canreadFood:false,
    canreadReport:false,
    cansendSMS:false
};

const EventLevelPermissionForm = (props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [eventList, setEventList] = useState([])
    const [adminList, setAdminList] = useState([])

    useEffect(()=>{
       if(props.permissionId && eventList.length>0){
        axios.get(`${adminAPIConfig.getRootLevelPermissionByEmail}?email=${props.permissionId.email}`, {
            headers: {
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${window.localStorage.getItem("jwt_access_token")}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                   const data=response.data.data
                   formik.setValues({
                    id: data.id || "",
                    email: data.email || "",
                    event: `${eventList.find((event)=>event.id===data.email).name}(${data.email})` || '',
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
    },[props,eventList])

    useEffect(() => {
        axios.get(eventAPIConfig.allEventList, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setEventList(response.data.data)
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        }).catch((error) => {
            dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
        });
    }, [])
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
            const eventId = eventList?.find((event) => event.eventName === values.event)?.eventId || '';
            const formData = new FormData();
            // formData.append("id", selectedAdmin?.id);
            formData.append("email", selectedAdmin?.email);
            formData.append("eventId", eventId);
            formData.append("canreadEventRegistration", values.canreadEventRegistration);
            formData.append("canreadAttendance", values.canreadAttendance);
            formData.append("canupdateAttendance", values.canupdateAttendance);
            formData.append("cancreateFood", values.cancreateFood);
            formData.append("canupdateFood", values.canupdateFood);
            formData.append("canreadFood", values.canreadFood);
            formData.append("canreadReport", values.canreadReport);
            formData.append("cansendSMS", values.cansendSMS);

            if(props.permissionId){
                formData.append("id",values.id)
            }

            axios.post(`${adminAPIConfig.eventLevelPermission}`, formData, {
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
                    Event Level Permission
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
                    <Autocomplete
                        options={eventList.length > 0 ? eventList.map((event) => `${event.eventName}`) : []}
                        value={formik.values.event}
                        onChange={(event, value) =>
                            formik.setFieldValue("event", value)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Event"
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
                                Event Registartions
                            </FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.readUser}
                                            onChange={(event) => formik.setFieldValue("canreadEventRegistration", event.target.checked)}
                                            name="readEventRegistration" />}
                                    label="Read Event Regitrations"
                                />

                            </FormGroup>
                        </FormControl>

                        <FormControl component="fieldset" required>
                            <FormLabel className="text-black">
                                Attendance
                            </FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.createEvent}
                                            onChange={(event) => formik.setFieldValue("canreadAttendance", event.target.checked)}
                                            name="readAttendance" />}
                                    label="Read Attendance"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.readEvent}
                                            onChange={(event) => formik.setFieldValue("canupdateAttendance", event.target.checked)}
                                            name="updateAttendance" />}
                                    label="Update Attendance"
                                />
                            </FormGroup>
                        </FormControl>

                        <FormControl component="fieldset" required>
                            <FormLabel className="text-black">
                              Food
                            </FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.createEvent}
                                            onChange={(event) => formik.setFieldValue("canreadFood", event.target.checked)}
                                            name="readFood" />}
                                    label="Read Food"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.readEvent}
                                            onChange={(event) => formik.setFieldValue("cancreateFood", event.target.checked)}
                                            name="createFood" />}
                                    label="Create Food"
                                />
                               <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.readEvent}
                                            onChange={(event) => formik.setFieldValue("canupdateFood", event.target.checked)}
                                            name="updateFood" />}
                                    label="Update Food"
                                />
                            </FormGroup>
                        </FormControl>

                        <FormControl component="fieldset" required>
                            <FormLabel className="text-black">
                              Report
                            </FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.createEvent}
                                            onChange={(event) => formik.setFieldValue("canreadReport", event.target.checked)}
                                            name="readReport" />}
                                    label="Read Report"
                                />
                            </FormGroup>
                        </FormControl>
                        
                        <FormControl component="fieldset" required>
                            <FormLabel className="text-black">
                              SMS
                            </FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={formik.values.createEvent}
                                            onChange={(event) => formik.setFieldValue("cansendSMS", event.target.checked)}
                                            name="sendSMS" />}
                                    label="Send SMS"
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

export default EventLevelPermissionForm;
