import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import FusePageCarded from '@fuse/core/FusePageCarded';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Formik, useFormik } from 'formik';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { TextField, Autocomplete, Typography } from '@mui/material';
import { eventAPIConfig } from "src/app/main/API/apiConfig";
import { useParams } from "react-router-dom";
import { getUserRoles } from "src/app/auth/services/utils/common";
import { useNavigate } from "react-router-dom";
import { Box, lighten } from "@mui/system";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import EventFormHead from "./EventFormHead";




const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
    maxWidth: '1200px',
    maxHeight: '650px',
    overflow: 'auto'
};
const EventForm = () => {

    const routeParams = useParams()
    const navigate = useNavigate()
    const [tabValue, setTabValue] = useState(0)
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const dispatch = useDispatch();
    const [eventId, setEventId] = useState('')
    const [selectedFileName, setSelectedFileName] = useState('');

    const [eventData, setEventData] = useState({
        eventName: '',
        eventType: '',
        eventLocation: '',
        startTime: '',
        endTime: '',
        eventDate: '',
        lockArrivalDate: '',
        lockDepartureDate: '',
        shivirStartDate: '',
        shivirEndDate: '',
        shivirAvailable: '',
        eventImage: null,
        eventStatus: true,
        bookingStatus: true

    });

    useEffect(() => {
        return () => {
            setEventData(null);
            formik.resetForm();
        }
    }, [])


    useEffect(() => {

        const { eventId } = routeParams;
        if (eventId == "new") {

        } else {
            setEventId(eventId);
        }
    }, []);

    useEffect(() => {
        if (eventId) {
            axios.get(`${eventAPIConfig.getById}/${eventId}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    console.log(response)
                    setEventData(response.data.data)
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
        }
    }, [eventId]);

    useEffect(() => {
        if (eventData) {
            formik.setValues({
                eventName: eventData.eventName || '',
                eventType: eventData.eventType || '',
                eventLocation: eventData.eventLocation || '',
                startTime: eventData.startTime || '',
                endTime: eventData.endTime || '',
                eventDate: eventData.eventDate || '',
                lockArrivalDate: eventData.lockArrivalDate || '',
                lockDepartureDate: eventData.lockDepartureDate || '',
                shivirStartDate: eventData.shivirStartDate || '',
                shivirEndDate: eventData.shivirEndDate || '',
                shivirAvailable: eventData.shivirAvailable === true ? 'Yes' : 'No' || '',
                eventImage: eventData.eventImage || '',
                file: null,
                eventStatus: eventData.eventStatus || true,
                bookingStatus: eventData.bookingStatus || true
            });
        }
    }, [eventData]);

    const validationSchema = Yup.object().shape({
        eventName: Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Only characters and spaces are allowed')
            .test('no-numbers', 'Numbers are not allowed', value => {
                return !/\d/.test(value);
            })
            .required('Event Name is required'),

        eventType: Yup.string().required('Event Type is required'),
        eventLocation: Yup.string().required('Event Location is required'),
        eventDate: Yup.date().required('Event Date is required'),
        lockArrivalDate: Yup.date()
            .nullable()
            .test({
                message: 'Lock Arrival Date should be on or before Event Date',
                test: function (value) {
                    const { eventDate } = this.parent;
                    return !eventDate || !value || value <= eventDate;
                }
            }),

        lockDepartureDate: Yup.date()
            .nullable()
            .test({
                message: 'Lock Departure Date should be on or After Event Date',
                test: function (value) {
                    const { eventDate } = this.parent;
                    return !eventDate || !value || value >= eventDate;
                }
            }),

        shivirStartDate: Yup.date()
            .nullable()
            .test({
                message: 'Shivir Start Date should be in between Lock Arrival and Departure Date',
                test: function (value) {
                    const { lockArrivalDate, lockDepartureDate } = this.parent;
                    return !lockArrivalDate || !lockDepartureDate || !value ||
                        (value >= lockArrivalDate && value <= lockDepartureDate)
                }
            }),

        shivirEndDate: Yup.date()
            .nullable()
            .test({
                message: 'Shivir End Date should be in between Lock Arrival and Departure Date',
                test: function (value) {
                    const { lockArrivalDate, lockDepartureDate } = this.parent;
                    return !lockArrivalDate || !lockDepartureDate || !value ||
                        (value >= lockArrivalDate && value <= lockDepartureDate)
                }
            }),

        file: Yup.mixed().nullable()
            .test('fileType', 'Unsupported file type. Only JPG, JPEG, and PNG files are allowed.', (value) => {
                if (!value) return true; // Allow null values
                const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                return allowedTypes.includes(value.type);
            }),
    });


    const handleSubmit = (values) => {
        console.log("Formik",formik)

        if (new Date(values.eventDate) < new Date()) {
            return dispatch(showMessage({ message: "Event Date must be current or future date", variant: 'error' }));

        }

        if (values.eventType === 'Offline' && (!values.lockArrivalDate || !values.lockDepartureDate)) {
            dispatch(showMessage({ message: "Lock Dates are required for offline events", variant: 'error' }));
            return;
        }

        if (values.eventType === 'Offline' && values.shivirAvailable === 'Yes' && (!values.shivirStartDate || !values.shivirEndDate)) {
            dispatch(showMessage({ message: "Shivir Dates are required", variant: 'error' }));
            return;
        }
        if (formik.isValid) {
            const formData = new FormData()
            formData.append('eventName', values.eventName)
            formData.append('eventType', values.eventType)
            formData.append('eventLocation', values.eventLocation)
            formData.append('startTime', values.startTime)
            formData.append('endTime', values.endTime)
            formData.append('eventDate', values.eventDate)
            formData.append('lockArrivalDate', values.lockArrivalDate)
            formData.append('lockDepartureDate', values.lockDepartureDate)
            formData.append('shivirAvailable', values.shivirAvailable === 'Yes' ? true : false)
            formData.append('shivirStartDate', values.shivirStartDate)
            formData.append('shivirEndDate', values.shivirEndDate)
            // formData.append('eventImage', values.eventImage)
            formData.append('eventStatus', values.eventStatus)
            formData.append('bookingStatus', values.bookingStatus)
            if (eventId !== '') {

                formData.append('eventId', eventId)

            }

            if (values.file !== null) {
                formData.append('file', values.file)
                axios.post(eventAPIConfig.createWithImage, formData, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                        formik.resetForm();
                        navigate('/app/event')
                    } else {
                        dispatch(showMessage({ message: response.data.errormessage, variant: 'error' }));
                    }
                })

            } else {
                if (eventId !== '') {

                    formData.append('eventImage', values.eventImage)
                }

                axios.post(eventAPIConfig.create, formData, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                        formik.resetForm();
                        navigate('/app/event')
                    } else {
                        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
                    }
                }).catch((error) => console.log(error))
            }
        } else {
            if (formik.errors.file) {
                dispatch(showMessage({ message: formik.errors.file, variant: 'error' }));
            } else {
                dispatch(showMessage({ message: "Please fill the required fields ", variant: 'error' }));
            }
        }
    };



    const formik = useFormik({
        initialValues: {
            eventName: '',
            eventType: '',
            eventLocation: '',
            startTime: '',
            endTime: '',
            eventDate: '',
            lockArrivalDate: '',
            lockDepartureDate: '',
            shivirAvailable: '',
            shivirStartDate: '',
            shivirEndDate: '',
            file: '',
            eventImage: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    function handleTabChange(event, value) {
        setTabValue(value);
    }


    return (
        <FusePageCarded
            header={<EventFormHead handleSubmit={handleSubmit} values={formik.values} eventId={eventId} />}

            content={
                <>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        classes={{ root: 'w-full h-64 border-b-1' }}
                    >

                        <Tab className="h-64" label="Phase I" />
                        <Tab className="h-64" label="Phase II" />
                        <Tab className="h-64" label="Phase III" />

                    </Tabs>

                    <div className="p-16 sm:p-24 w-full">
                        <form onSubmit={formik.handleSubmit}>
                            <div className={tabValue !== 0 ? 'hidden' : ''}>
                                <TextField
                                    fullWidth
                                    name="eventName"
                                    label="Event Name"
                                    value={formik.values.eventName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.eventName && Boolean(formik.errors.eventName)}
                                    helperText={formik.touched.eventName && formik.errors.eventName}
                                    required
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                />


                                <TextField
                                    fullWidth
                                    name="eventLocation"
                                    label="Event Location"
                                    value={formik.values.eventLocation}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.eventLocation && Boolean(formik.errors.eventLocation)}
                                    helperText={formik.touched.eventLocation && formik.errors.eventLocation}
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    name="startTime"
                                    label="Start Time"
                                    type="time" // Assuming startTime is a time input, adjust type as needed
                                    value={formik.values.startTime}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                                    helperText={formik.touched.startTime && formik.errors.startTime}
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                />
                                <TextField
                                    fullWidth
                                    name="endTime"
                                    label="End Time"
                                    type="time" // Assuming endTime is a time input, adjust type as needed
                                    value={formik.values.endTime}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                                    helperText={formik.touched.endTime && formik.errors.endTime}
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                />

                            </div>
                            <div className={tabValue !== 1 ? 'hidden' : ''}>
                                <Autocomplete
                                    fullWidth
                                    name="eventType"
                                    label="Event Type"
                                    value={formik.values.eventType}
                                    onChange={(event, newValue) => {
                                        formik.handleChange("eventType")(newValue);
                                    }}
                                    onBlur={formik.handleBlur}
                                    options={['Offline', 'Online']}
                                    getOptionLabel={(option) => option}
                                    error={formik.touched.eventType && Boolean(formik.errors.eventType)}
                                    helperText={formik.touched.eventType && formik.errors.eventType}
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    required
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Event Type"
                                        />
                                    )}
                                />
                                <TextField
                                    value={formik.values.eventDate}
                                    fullWidth
                                    name="eventDate"
                                    label="Event Date"
                                    type="date" // Assuming eventDate is a date input, adjust type as needed
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                                    helperText={formik.touched.eventDate && formik.errors.eventDate}
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    required
                                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                />
                                {formik.values.eventType === 'Offline' && <> <TextField
                                    fullWidth
                                    name="lockArrivalDate"
                                    label="Lock Arrival Date"
                                    type="date" // Assuming lockArrivalDate is a date input, adjust type as needed
                                    value={formik.values.lockArrivalDate}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lockArrivalDate && Boolean(formik.errors.lockArrivalDate)}
                                    helperText={formik.touched.lockArrivalDate && formik.errors.lockArrivalDate}
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    required
                                />

                                    <TextField
                                        fullWidth
                                        name="lockDepartureDate"
                                        label="Lock Departure Date"
                                        type="date" // Assuming lockDepartureDate is a date input, adjust type as needed
                                        value={formik.values.lockDepartureDate}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.lockDepartureDate && Boolean(formik.errors.lockDepartureDate)}
                                        helperText={formik.touched.lockDepartureDate && formik.errors.lockDepartureDate}
                                        sx={{ mb: 2 }}
                                        className="max-w-md"
                                        required
                                    />
                                </>}
                            </div>
                            <div className={tabValue !== 2 ? 'hidden' : ''}>

                                <Autocomplete
                                    fullWidth
                                    name="shivirAvailable"
                                    label="Shivir Available"
                                    value={formik.values.shivirAvailable}
                                    onChange={(event, newValue) => {
                                        formik.handleChange("shivirAvailable")(newValue);
                                    }}
                                    onBlur={formik.handleBlur}
                                    options={['Yes', 'No']}
                                    getOptionLabel={(option) => option}
                                    error={formik.touched.shivirAvailable && Boolean(formik.errors.shivirAvailable)}
                                    helperText={formik.touched.shivirAvailable && formik.errors.shivirAvailable}
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    required
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Shivir Available"
                                        />
                                    )}
                                />

                                {formik.values.shivirAvailable === 'Yes' && (
                                    <>
                                        <TextField
                                            fullWidth
                                            name="shivirStartDate"
                                            label="Shivir Start Date"
                                            type="date" // Assuming shivirStartDate is a date input, adjust type as needed
                                            value={formik.values.shivirStartDate}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.shivirStartDate && Boolean(formik.errors.shivirStartDate)}
                                            helperText={formik.touched.shivirStartDate && formik.errors.shivirStartDate}
                                            sx={{ mb: 2 }}
                                            className="max-w-md"
                                            required
                                        />

                                        <TextField
                                            fullWidth
                                            name="shivirEndDate"
                                            label="Shivir End Date"
                                            type="date" // Assuming shivirEndDate is a date input, adjust type as needed
                                            value={formik.values.shivirEndDate}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.shivirEndDate && Boolean(formik.errors.shivirEndDate)}
                                            helperText={formik.touched.shivirEndDate && formik.errors.shivirEndDate}
                                            sx={{ mb: 2 }}
                                            className="max-w-md"
                                            required
                                        />
                                    </>
                                )}

                                <div className="d-flex gap-5">
                                    <Box
                                        sx={{
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? lighten(theme.palette.background.default, 0.4)
                                                    : lighten(theme.palette.background.default, 0.02),
                                        }}
                                        component="label"
                                        htmlFor="profile-file"
                                        className="productImageUpload flex items-center justify-center relative w-128 h-40 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                                    >
                                        <div className="flex flex-col justify-between text-center m-8">
                                            <h4>Upload</h4>
                                            <span style={{ fontSize: '1rem' }}>(jpg/jpeg/png)</span>
                                        </div>

                                        <input
                                            type="file"
                                            name='file'
                                            accept=".png, .jpg, .jpeg"
                                            className="hidden"
                                            id="profile-file"
                                            onBlur={formik.handleBlur}
                                            onChange={(event) => {
                                                formik.setFieldValue('file', event.target.files[0]);
                                                setSelectedFileName(event?.target.files[0]?.name);
                                            }}
                                        />
                                        <FuseSvgIcon size={32} color="action">
                                            heroicons-outline:upload
                                        </FuseSvgIcon>
                                    </Box>
                                    
                                    {selectedFileName && (
                                        <Typography variant="body2" color="blue" sx={{ mt: 1 }}>
                                            Selected File: {selectedFileName}
                                        </Typography>
                                    )}
                        
        

                                </div>
                                {
                      formik.errors.file && (
                        <p
                          style={{
                            fontSize: "12px",
                            padding: "0.75rem",
                            color: "red",
                          }}
                        >
                          {formik.errors.file}
                        </p>
                      )}
                            </div>
                        </form>
                    </div>
                </>
            }
            scroll={isMobile ? 'normal' : 'content'}
        />
    )

}

export default EventForm