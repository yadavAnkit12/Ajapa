import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material"
import axios from "axios";
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch } from "react-redux";
import { foodAPIConfig } from "../../API/apiConfig";

const validationSchema = Yup.object().shape({
    eventId: Yup.string().required('Event is required'),
    entryDate: Yup.date().required('Entry date is required'),
    timings: Yup.string().required('Timings are required'),
    presentCount: Yup.number().required('Present count is required'),
    totalCount: Yup.number().required('Total count is required'),
    foodTakenCount: Yup.number().required('Food taken count is required'),
});


const FoodForm = (props) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [lowerLimit, setLowerLimit] = useState('')
    const [upperLimit, setUpperLimit] = useState('')



    const handleSubmit = (values) => {

        if (formik.isValid) {
            setLoading(true)
            const formData = new FormData()
            formData.append('eventId', props.eventList.find((event) => event.eventName === formik.values.eventId).eventId)
            formData.append('entryDate', values.entryDate)
            formData.append('timings', values.timings.split(' ')[0])
            formData.append('presentCount', values.presentCount)
            formData.append('totalCount', values.totalCount)
            formData.append('foodTakenCount', values.foodTakenCount)
            axios.post(foodAPIConfig.saveFood, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    formik.resetForm()
                    setLoading(false)
                    dispatch(showMessage({ message: response.data.message, variant: 'success' }));

                } else {
                    setLoading(false)
                    dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
                }
            }).catch((error) => {
                setLoading(false)
                dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
            })
        }

    }


    const formik = useFormik({
        initialValues: {
            eventId: '',
            entryDate: '',
            timings: '',
            presentCount: '',
            totalCount: '',
            foodTakenCount: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit

    })

    const handleSetDate = (value) => {
        const event = props.eventList.find((event) => event.eventName === value)
        setLowerLimit(event.lockArrivalDate ? event.lockArrivalDate : event.eventDate)
        setUpperLimit(event.lockDepartureDate ? event.lockDepartureDate : event.eventDate)

    }

    useEffect(() => {
        if (formik.values.timings && formik.values.eventId && formik.values.entryDate) {
            if (formik.values.entryDate < lowerLimit || formik.values.entryDate > upperLimit) {
                dispatch(showMessage({ message: `Entry data must be between ${lowerLimit} - ${upperLimit}`, variant: 'error' }));

            } else {
                const event = props.eventList.find((event) => event.eventName === formik.values.eventId).eventId
                axios.get(`${foodAPIConfig.getFoodCheck}/${event}/${formik.values.entryDate}/${formik.values.timings.split(' ')[0]}`, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        formik.setValues({
                            ...formik.values,
                            presentCount: response.data.presentCount,
                            totalCount: response.data.totalCount
                        })

                    } else {
                        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
                    }
                }).catch((error) => dispatch(showMessage({ message: 'Something went wrong', variant: 'error' })))
            }

        }
    }, [formik.values.eventId, formik.values.entryDate, formik.values.timings])


    return <>
        <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
            Food
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ mt: 2, marginBottom: 2 }}>
                <Autocomplete
                    fullWidth
                    name="eventId"
                    options={props.eventList.map((event) => event.eventName)}
                    getOptionLabel={(option) => option}
                    value={formik.values.eventId}
                    onChange={(event, value) => {
                        formik.setFieldValue('eventId', value);
                        handleSetDate(value);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Event"
                            error={formik.touched.eventId && Boolean(formik.errors.eventId)}
                            helperText={formik.touched.eventId && formik.errors.eventId}
                            sx={{ mb: 2, width: '100%' }}
                            required
                        />
                    )}
                />

                <TextField
                    value={formik.values.entryDate}
                    fullWidth
                    name="entryDate"
                    label="Entry Date"
                    type="date"
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.entryDate && Boolean(formik.errors.entryDate)}
                    helperText={formik.touched.entryDate && formik.errors.entryDate}
                    sx={{ mb: 2, width: '100%' }}
                    required
                    inputProps={{
                        min: lowerLimit,
                        max: upperLimit,
                    }}
                />

                <Autocomplete
                    fullWidth
                    name="timings"
                    options={['06:30 Breakfast', '11:30 Lunch', '14:15 Tea', '17:30 Dinner', '20:30 Tea']}
                    getOptionLabel={(option) => option}
                    value={formik.values.timings}
                    onChange={(event, value) => {
                        formik.setFieldValue('timings', value);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Timing"
                            error={formik.touched.timings && Boolean(formik.errors.timings)}
                            helperText={formik.touched.timings && formik.errors.timings}
                            sx={{ mb: 2, width: '100%' }}
                            required
                        />
                    )}
                />


                <TextField
                    fullWidth
                    name="presentCount"
                    label="Present User"
                    value={formik.values.presentCount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.presentCount && Boolean(formik.errors.presentCount)}
                    helperText={formik.touched.presentCount && formik.errors.presentCount}
                    required
                    sx={{ mb: 2, width: '100%' }}
                    disabled
                />

                <TextField
                    fullWidth
                    name="totalCount"
                    label="Total Register User"
                    value={formik.values.totalCount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.totalCount && Boolean(formik.errors.totalCount)}
                    helperText={formik.touched.totalCount && formik.errors.totalCount}
                    required
                    sx={{ mb: 2, width: '100%' }}
                    disabled
                />

                <TextField
                    fullWidth
                    name="foodTakenCount"
                    label="Food Taken Count"
                    value={formik.values.foodTakenCount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.foodTakenCount && Boolean(formik.errors.foodTakenCount)}
                    helperText={formik.touched.foodTakenCount && formik.errors.foodTakenCount}
                    required
                    sx={{ mb: 2, width: '100%' }}
                />

                <Button
                    variant="contained"
                    color="secondary"
                    className="m-10"
                    aria-label="Register"
                    type="submit"
                >
                    Submit
                </Button>

            </Stack>
        </form>
    </>
}

export default FoodForm