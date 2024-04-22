import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import _ from '@lodash';
import 'react-phone-input-2/lib/style.css'
import {
    Autocomplete, Card, Checkbox, FormControlLabel, Button, FormControl,
    FormLabel, FormGroup, Dialog, DialogTitle, DialogActions, Slide
} from '@mui/material';
import { useEffect, useState, forwardRef } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { eventAPIConfig, userAPIConfig } from "src/app/main/API/apiConfig";
import FuseLoading from '@fuse/core/FuseLoading';
import Swal from 'sweetalert2';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const EventForm = (props) => {
    const dispatch = useDispatch()
    const shivirHai = props.isShivirAvailable.data.shivirAvailable
    const lockarrivaldate = props.isShivirAvailable.data.lockArrivalDate
    const lockdeparturedetail = props.isShivirAvailable.data.lockDepartureDate
    const eventDate = props.eventDate
    const [countryList, setCountryList] = useState([])
    const [countryID, setCountryID] = useState('')
    const [stateList, setStateList] = useState([])
    const [stateID, setStateID] = useState('')
    const [cityList, setCityList] = useState([])
    const [cityID, setCityID] = useState('')
    const [shivirCheckBox, setshivirCheckBox] = useState(false)
    const [arrModeOfTransport, setArrModeOfTransport] = useState(false)
    const [depModeOfTransport, setDepModeOfTransport] = useState(false)
    const [open, setOpen] = useState(false)
    const [stateName, setStateName] = useState('')  //for handling a state which have no state

    useEffect(() => {
        formik.resetForm()
    }, [props.person.id])

    useEffect(() => {
        if (shivirHai === true) {
            setshivirCheckBox(true)
        }
    }, [])

    const validationSchema = yup.object().shape({
        fromCountry: yup.string().required('Please enter your country'),
        fromState: yup.string().required('Please enter your state'),
        fromCity: yup.string().required('Please enter your city'),
        arrivalDate: yup.string().required('Please select arrival date'),
        arrivalTime: yup.string().required('Please select arrival time'),
        arrivalModeOfTransport: yup.string().required('Please select arrival mode of transport'),
        arrivalTrainNumber: yup.string()
            .matches(/^[0-9]{5}$/, 'Train number must be exactly 5 digits'),
        departureDate: yup.string().required('Please select departure date'),
        departureTime: yup.string().required('Please select departure time'),
        departureModeOfTransport: yup.string().required('Please select departure mode of transport'),
        departureTrainNumber: yup.string()
            .matches(/^[0-9]{5}$/, 'Train number must be exactly 5 digits'),
        specificRequirements: yup.string()
            .max(160, "Message can have atmost 160 characters."),
        attendingShivir: yup.boolean(),
    });

    //Default Country,City,State
    useEffect(() => {
        if (props.person) {
            formik.setValues({
                fromCity: props.person.city.split(":")[1] || '',
                fromState: props.person.state.split(":")[1] || '',
                fromCountry: props.person.country.split(":")[1] || '',
            })
            setCountryID(props.person.country.split(':')[0])
            setStateID(props.person.state.split(':')[0])
            setCityID(props.person.city.split(':')[0])
        }

    }, [props.person])


    useEffect(() => {
        if (props.registerUser) {

            formik.setValues({
                registrationId: props.registerUser.registrationId || '',
                eventId: props.registerUser.eventId || '',
                userId: props.registerUser.userId || '',
                userName: props.registerUser.userName || '',
                familyId: props.registerUser.familyId || '',
                fromCity: props.registerUser.fromCity.split(":")[1] || '',
                fromState: props.registerUser.fromState.split(":")[1] || '',
                fromCountry: props.registerUser.fromCountry.split(":")[1] || '',
                arrivalDate: props.registerUser.arrivalDate || '',
                arrivalTime: props.registerUser.arrivalTime || '',
                arrivalModeOfTransport: props.registerUser.arrivalModeOfTransport || '',
                arrivalTrainNumber: props.registerUser.arrivalTrainNumber || '',
                departureDate: props.registerUser.departureDate || '',
                departureTime: props.registerUser.departureTime || '',
                departureModeOfTransport: props.registerUser.departureModeOfTransport || '',
                departureTrainNumber: props.registerUser.departureTrainNumber || '',
                specificRequirements: props.registerUser.specificRequirements || '',
                attendingShivir: props.registerUser.attendingShivir,

            })
            setCountryID(props.registerUser.fromCountry.split(':')[0])
            setStateID(props.registerUser.fromState.split(':')[0])
            setCityID(props.registerUser.fromCity.split(':')[0])
        }

    }, [props.registerUser])


    //fetching the country list
    useEffect(() => {
        axios.get(jwtServiceConfig.country, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }).then((response) => {
            if (response.status === 200) {
                setCountryList(response.data)
            }
        })
    }, [])

    //fetch the state on the behalf of country
    useEffect(() => {
        axios.get(`${jwtServiceConfig.state}/${countryID}`, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }).then((response) => {
            if (response.status === 200) {
                setStateList(response.data)
            }
        })
    }, [countryID])

    //fetch the city on the behalf of state
    useEffect(() => {
        axios.get(`${jwtServiceConfig.city}/${stateID}`, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }).then((response) => {
            if (response.status === 200) {
                if (response.data.length === 0) {
                    // If no cities are available, set the city list to an array containing the state name
                    setCityList([{ id: stateID, name: stateName }]);
                } else {
                    // If cities are available, set the city list to the response data
                    setCityList(response.data);
                }
            }
        })
    }, [stateID])



    const handleSubmit = (values) => {
        console.log(values)
        if (formik.isValid) {

            if (shivirCheckBox && formik.values.attendingShivir === undefined) {
                return dispatch(showMessage({ message: 'Please tell whether you are attending the shivir or not', variant: 'error' }));
            }

            else if (values.arrivalModeOfTransport === 'Train' && (values.arrivalTrainNumber === '')) {
                return dispatch(showMessage({ message: 'Train number required when you are travelling from train', variant: 'error' }))
            }

            props.setLoading(true)
            const formData = new FormData()
            formData.append('eventId', props.eventId)
            formData.append('userId', props.selectedUserId)
            formData.append('userName', props.person.name)
            formData.append('eventDate', props.eventDate)
            formData.append('eventName', props.eventName)
            formData.append('familyId', sessionStorage.getItem('familyId'))
            formData.append('fromCountry', `${countryID}:${formik.values.fromCountry}`)
            formData.append('fromState', `${stateID}:${formik.values.fromState}`)
            formData.append('fromCity', `${cityID}:${formik.values.fromCity}`)
            formData.append('arrivalDate', formik.values.arrivalDate)
            formData.append('arrivalTime', formik.values.arrivalTime)
            formData.append('arrivalModeOfTransport', formik.values.arrivalModeOfTransport)
            if (formik.values.arrivalModeOfTransport !== 'Train') {
                formData.append('arrivalTrainNumber', '');
            } else {
                formData.append('arrivalTrainNumber', formik.values.arrivalTrainNumber);
            }
            formData.append('departureDate', formik.values.departureDate)
            formData.append('departureTime', formik.values.departureTime)
            formData.append('departureModeOfTransport', formik.values.departureModeOfTransport)
            if (formik.values.departureModeOfTransport !== 'Train') {
                formData.append('departureTrainNumber', '');
            } else {
                formData.append('departureTrainNumber', formik.values.departureTrainNumber);
            }
            formData.append('specificRequirements', formik.values.specificRequirements || '')

            if (shivirCheckBox) {
                formData.append('attendingShivir', formik.values.attendingShivir)
            } else {
                formData.append('attendingShivir', false)
            }


            if (props.registerUser) {
                formData.append('registrationId', values.registrationId)
                axios.post(`${eventAPIConfig.userEventRegistration}`, formData, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        props.setLoading(false)
                        formik.resetForm()
                        // dispatch(showMessage({ message: `Jai Guru. Your registration for ${props.eventName} is updated successful`, variant: 'success' }));
                        Swal.fire({
                            title: "<span style='font-weight: bold; font-size: 20px;'>Registration successful</span>",
                            html: `<span style="font-weight: bold; font-size: 16px;">Jai Guru. Your registration for ${props.eventName} is updated successfully</span>`,
                            icon: "success",
                            confirmButtonText: "<span style='font-weight: bold; font-size: 16px;'>OK</span>"
                        }); 
                        props.setChange(!props.change)
                        props.setEventFormOpen(false)

                        setTimeout(() => {
                            dispatch({
                                type: 'HIDE_MESSAGE'
                            });
                        }, 10000);
                    } else {
                        props.setLoading(false)
                        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
                    }
                }).catch((error) => {
                    props.setLoading(false)
                    dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))

                })

            } else {

                axios.post(`${eventAPIConfig.userEventRegistration}`, formData, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        props.setLoading(false)
                        formik.resetForm()
                        // dispatch(showMessage({ message: `Jai Guru. Your registration for ${props.eventName} is successfull`, variant: 'success' }));
                        Swal.fire({
                            title: "<span style='font-weight: bold; font-size: 20px;'>Registration successful</span>",
                            html: `<span style="font-weight: bold; font-size: 16px;">Jai Guru. Your registration for ${props.eventName} is successful</span>`,
                            icon: "success",
                            confirmButtonText: "<span style='font-weight: bold; font-size: 16px;'>OK</span>"
                        });                        
                        props.setChange(!props.change)
                        props.setEventFormOpen(false)
                    } else {
                        props.setLoading(false)
                        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
                    }
                }).catch((error) => {
                    props.setLoading(false)
                    dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))

                })
            }

        } else {
            dispatch(showMessage({ message: 'Please fill the required details correctly', variant: 'error' }))

        }
    }


    const formik = useFormik({
        initialValues: {
            registrationId: '',
            eventId: '',
            userId: '',
            userName: '',
            familyId: '',
            fromCity: '',
            fromState: '',
            fromCountry: '',
            arrivalDate: '',
            arrivalTime: '',
            arrivalModeOfTransport: '',
            arrivalTrainNumber: '',
            departureDate: '',
            departureTime: '',
            departureModeOfTransport: '',
            departureTrainNumber: '',
            specificRequirements: '',
            attendingShivir: '',

        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleClose = () => {
        setOpen(false)
    }

    const openDialog = () => {
        setOpen(true)
    }

    const closeForm = () => {
        formik.resetForm()
        props.handleClose()
    }


    useEffect(() => {
        if (formik.values.arrivalModeOfTransport === 'Train') {
            setArrModeOfTransport(true)
        }
        else {
            setArrModeOfTransport(false)
        }
    }, [formik.values.arrivalModeOfTransport])


    useEffect(() => {
        if (formik.values.departureModeOfTransport === 'Train') {
            setDepModeOfTransport(true)
        } else {
            setDepModeOfTransport(false)
        }
    }, [formik.values.departureModeOfTransport])

    const handleUserNameChange = (newValue) => {
        if (newValue) {

            formik.setValues({
                ...formik.values,
                eventId: newValue.eventId || '',
                userId: newValue.userId || '',
                userName: newValue.userName || '',
                familyId: newValue.familyId || '',
                fromCity: newValue.fromCity.split(":")[1] || '',
                fromState: newValue.fromState.split(":")[1] || '',
                fromCountry: newValue.fromCountry.split(":")[1] || '',
                arrivalDate: newValue.arrivalDate || '',
                arrivalTime: newValue.arrivalTime || '',
                arrivalModeOfTransport: newValue.arrivalModeOfTransport || '',
                arrivalTrainNumber: newValue.arrivalTrainNumber || '',
                departureDate: newValue.departureDate || '',
                departureTime: newValue.departureTime || '',
                departureModeOfTransport: newValue.departureModeOfTransport || '',
                departureTrainNumber: newValue.departureTrainNumber || '',
                specificRequirements: newValue.specificRequirements || '',
                attendingShivir: newValue.attendingShivir || false,
            });

            setCountryID(newValue.fromCountry.split(':')[0]);
            setStateID(newValue.fromState.split(':')[0]);
            setCityID(newValue.fromCity.split(':')[0]);

            setArrModeOfTransport(newValue.arrivalModeOfTransport === 'Train');
            setDepModeOfTransport(newValue.departureModeOfTransport === 'Train');
        } else {
            formik.resetForm();
        }
    };

    const filteredOptions = props.sameAsDD.filter(option => option.userId !== props.selectedUserId);

    const getDate = (date) => {
        if (date) {
            const formatDate = date.split('-')
            return `${formatDate[2]}-${formatDate[1]}-${formatDate[0]}`
        } else {
            return ''
        }
    }
    return (
        <Card style={{ marginTop: '10px' }} className='shadow-5'>
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <Autocomplete
                    disablePortal
                    value={props.sameAsDD.userName}
                    id="userName"
                    options={props.sameAsDD.length > 0 ? filteredOptions : []}
                    getOptionLabel={(option) => option.userName}
                    sx={{ my: 1, mx: 1 }}
                    onChange={(e, newValue) => handleUserNameChange(newValue)}
                    renderInput={(params) => <TextField fullWidth sty {...params} label="Same as" variant="standard" sx={{ minWidth: '300px' }} />}
                />
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-9 mx-3">

                    {/* Left side: Arrival details */}
                    <div className='shadow-3 rounded-md' style={{ padding: '10px' }}>
                        <h2 className="text-lg font-semibold mb-4 mt-2 text-center">Arrival Details</h2>


                        {/* Arrival details fields */}
                        <div className="space-y-2 " style={{ marginTop: '21px' }}>
                            <div>

                                <Autocomplete
                                    options={countryList.length > 0 ? countryList.map(country => country.name) : []}

                                    value={formik.values.fromCountry}
                                    onChange={(event, newValue) => {
                                        const selectedCountry = countryList.find(country => country.name === newValue)?.id;
                                        setCountryID(selectedCountry)
                                        formik.setFieldValue('fromCountry', newValue);
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Country"
                                            name='fromCountry'
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            variant="outlined"
                                            required
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.fromCountry && Boolean(formik.errors.fromCountry)}
                                            helperText={formik.touched.fromCountry && formik.errors.fromCountry}

                                        />
                                    )}
                                />
                            </div>
                            <div>

                                <Autocomplete
                                    options={stateList.length > 0 ? stateList.map(state => state.name) : []}

                                    value={formik.values.fromState}
                                    onChange={(event, newValue) => {
                                        const selectedSate = stateList.find(state => state.name === newValue)?.id;
                                        const selectedStateName = stateList.find((state) => state.name === newValue)?.name;
                                        setStateName(selectedStateName)
                                        setStateID(selectedSate)
                                        formik.setFieldValue('fromState', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="State"
                                            name='fromState'
                                            variant="outlined"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            required
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.fromState && Boolean(formik.errors.fromState)}
                                            helperText={formik.touched.fromState && formik.errors.fromState}
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <Autocomplete
                                    options={cityList.length > 0 ? cityList.map(city => city.name) : []}
                                    value={formik.values.fromCity}
                                    onChange={(event, newValue) => {
                                        const selectedCity = cityList.find(city => city.name === newValue)?.id;
                                        setCityID(selectedCity)
                                        formik.setFieldValue('fromCity', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="City"
                                            name='fromCity'
                                            variant="outlined"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            required
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.fromCity && Boolean(formik.errors.fromCity)}
                                            helperText={formik.touched.fromCity && formik.errors.fromCity}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <TextField
                                    name="arrivalDate"
                                    label="Arrival Date"
                                    variant="outlined"
                                    sx={{ mb: 2, mt: 2, width: '100%' }}
                                    className="max-w-md"
                                    type="date"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.arrivalDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        (formik.touched.arrivalDate && Boolean(formik.errors.arrivalDate)) ||
                                        (formik.values.arrivalDate < (lockarrivaldate || eventDate) || formik.values.arrivalDate > eventDate)
                                    }
                                    helperText={
                                        formik.touched.arrivalDate && (formik.errors.arrivalDate ||
                                            (formik.values.arrivalDate < (lockarrivaldate || eventDate) || formik.values.arrivalDate > eventDate) ? lockarrivaldate ? `Date must be ${getDate(lockarrivaldate)} - ${getDate(eventDate)} ` : `Date must be ${getDate(eventDate)}` : "")
                                    }
                                    inputProps={{ min: lockarrivaldate || eventDate, max: eventDate }}
                                />

                            </div>
                            <div>
                                <TextField
                                    name="arrivalTime"
                                    label="Arrival Time"
                                    variant="outlined"
                                    sx={{ mb: 2, mt: 2, width: '100%' }}
                                    className="max-w-md"
                                    type="time"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.arrivalTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.arrivalTime && Boolean(formik.errors.arrivalTime)}
                                    helperText={formik.touched.arrivalTime && formik.errors.arrivalTime}
                                />
                            </div>
                            <div>

                                <Autocomplete
                                    options={['Train', 'Flight', 'Bus', 'Car']}
                                    value={formik.values.arrivalModeOfTransport}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('arrivalModeOfTransport', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name='arrivalModeOfTransport'
                                            label="Mode of Transport"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            variant="outlined"
                                            required
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.arrivalModeOfTransport && Boolean(formik.errors.arrivalModeOfTransport)}
                                            helperText={formik.touched.arrivalModeOfTransport && formik.errors.arrivalModeOfTransport}

                                        />
                                    )}
                                />
                            </div>

                            {
                                arrModeOfTransport && (
                                    <div>
                                        <TextField
                                            name="arrivalTrainNumber"
                                            label="Train Number"
                                            variant="outlined"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            type="text"
                                            value={formik.values.arrivalTrainNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                (formik.touched.arrivalTrainNumber && Boolean(formik.errors.arrivalTrainNumber)) ||
                                                (formik.values.arrivalModeOfTransport === 'Train' && !formik.values.arrivalTrainNumber)
                                            }
                                            helperText={
                                                (formik.touched.arrivalTrainNumber && formik.errors.arrivalTrainNumber) ||
                                                ((formik.values.arrivalModeOfTransport === 'Train' && !formik.values.arrivalTrainNumber) && 'Train number required')
                                            }
                                        />

                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Right side: Departure details */}

                    <div className='shadow-3 rounded-md' style={{ position: 'relative', padding: '10px' }}>


                        <h2 className="text-lg font-semibold mb-4 mt-2 text-center">Departure Details</h2>
                        {/* Departure details fields */}
                        <div className="space-y-2 " style={{ marginTop: '21px' }}>

                            <div>

                                <TextField
                                    name="departureDate"
                                    label="Departure Date"
                                    variant="outlined"
                                    sx={{ mb: 2, mt: 2, width: '100%' }}
                                    className="max-w-md"
                                    type="date"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.departureDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        (formik.touched.departureDate && Boolean(formik.errors.departureDate)) ||
                                        (formik.values.departureDate<formik.values.arrivalDate)
                                    }
                                    helperText={
                                        formik.touched.departureDate && (formik.errors.departureDate ||
                                            (formik.values.departureDate < formik.values.arrivalDate) ? lockdeparturedetail ? `Date must be ${getDate(formik.values.arrivalDate)} - ${getDate(lockdeparturedetail)} ` : `Date must be ${getDate(eventDate)}` : "")
                                    }
                                    inputProps={{ min: lockarrivaldate || eventDate, max: lockdeparturedetail || eventDate }}
                                />

                            </div>
                            <div>
                                <TextField
                                    name="departureTime"
                                    label="Departure Time"
                                    variant="outlined"
                                    sx={{ mb: 2, mt: 2, width: '100%' }}
                                    className="max-w-md"
                                    type="time"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.departureTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.departureTime && (
                                            Boolean(formik.errors.departureTime) ||
                                            (formik.values.arrivalDate === formik.values.departureDate && formik.values.departureTime && formik.values.arrivalTime && formik.values.departureTime < formik.values.arrivalTime)
                                        )
                                    }
                                    helperText={
                                        formik.touched.departureTime &&
                                        (formik.errors.departureTime ||
                                            ((formik.values.arrivalDate === formik.values.departureDate && formik.values.departureTime && formik.values.arrivalTime && formik.values.departureTime < formik.values.arrivalTime) ?
                                                'Departure time must be greater than arrival time' :
                                                '')
                                        )
                                    }
                                />

                            </div>
                            <div>

                                <Autocomplete
                                    options={['Train', 'Flight', 'Bus', 'Car']}
                                    value={formik.values.departureModeOfTransport}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('departureModeOfTransport', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name='departureModeOfTransport'
                                            label="Mode of Transport"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            variant="outlined"
                                            required
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.departureModeOfTransport && Boolean(formik.errors.departureModeOfTransport)}
                                            helperText={formik.touched.departureModeOfTransport && formik.errors.departureModeOfTransport}

                                        />
                                    )}
                                />
                            </div>
                            {
                                depModeOfTransport && (

                                    <div>
                                        <TextField
                                            name="departureTrainNumber"
                                            label="Train Number"
                                            variant="outlined"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            type="text"
                                            value={formik.values.departureTrainNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                (formik.touched.departureTrainNumber && Boolean(formik.errors.departureTrainNumber)) ||
                                                (formik.values.departureModeOfTransport === 'Train' && !formik.values.departureTrainNumber)
                                            }
                                            helperText={
                                                (formik.touched.departureTrainNumber && formik.errors.departureTrainNumber) ||
                                                ((formik.values.departureModeOfTransport === 'Train' && !formik.values.departureTrainNumber) && 'Train number required')
                                            }
                                        />
                                    </div>
                                )
                            }
                            <div>
                                <TextField
                                    label="Do You Have Any Specific Requirements "
                                    name="specificRequirements"
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Max 160 Characters'
                                    variant="outlined"
                                    sx={{ mb: 2, mt: 2, width: '100%' }}
                                    className="max-w-md"
                                    type="text"
                                    value={formik.values.specificRequirements}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.specificRequirements && Boolean(formik.errors.specificRequirements)}
                                    helperText={formik.touched.specificRequirements && formik.errors.specificRequirements}
                                    multiline
                                    rows={3}  // Set the number of rows you want
                                />
                            </div>
                            {shivirCheckBox && (
                                <div>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">You want to attend the Shivir ?</FormLabel>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox checked={formik.values.attendingShivir === true}
                                                        onChange={() => formik.setFieldValue('attendingShivir', true)} />}
                                                label="Yes"

                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox checked={formik.values.attendingShivir === false}
                                                        onChange={() => formik.setFieldValue('attendingShivir', false)} />}
                                                label="No"
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>

                    <Button variant="outlined" onClick={openDialog} className='mx-2'>Close</Button>
                    <Button variant="outlined" type='submit' className='mx-2'>Save</Button>
                </div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{`Do you want to close this form ?`}</DialogTitle>

                    <DialogActions>
                        <Button onClick={handleClose}>No</Button>
                        <Button onClick={closeForm} autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

            </form>
        </Card>
    );
};

export default EventForm;
