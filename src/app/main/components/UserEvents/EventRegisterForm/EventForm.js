import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import _ from '@lodash';
import 'react-phone-input-2/lib/style.css'
import { Autocomplete, Card, Checkbox, FormControlLabel, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { eventAPIConfig, userAPIConfig } from "src/app/main/API/apiConfig";
import { values } from 'lodash';


const EventForm = (props) => {
    console.log(props.isShivirAvailable.data)
    const dispatch = useDispatch()
    const shivirHai = props.isShivirAvailable.data.shivirAvailable

    const [countryList, setCountryList] = useState([])
    const [countryID, setCountryID] = useState('')
    const [stateList, setStateList] = useState([])
    const [stateID, setStateID] = useState('')
    const [cityList, setCityList] = useState([])
    const [cityID, setCityID] = useState('')
    const [shivirCheckBox, setshivirCheckBox] = useState(false)
    const [arrModeOfTransport, setArrModeOfTransport] = useState(false)
    console.log(arrModeOfTransport)

    useEffect(() => {
        if (shivirHai === true) {
            setshivirCheckBox(true)
        }
    }, [])


    useEffect(() => {
        formik.resetForm()
    }, [])

    
  const validationSchema = yup.object().shape({
    // name: yup.string().required('Please enter your full name').max(100, 'Full name should be less than 100 chars'),
    // email: yup.string().email('Invalid email address').matches(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, 'Invalid email').required('Please enter your email'),
    // password: yup
    //   .string()
    //   .required('Please enter your password.')
    //   .min(4, 'Password is too short - should be 4 chars minimum'),
    // passwordConfirm: yup
    //   .string()
    //   .oneOf([yup.ref('password'), null], 'Passwords must match'),
    // gender: yup.string().required('Please select your gender'),
    // dob: yup.date().required('Please enter your date of birth').test('is-adult', 'You must be at least 18 years old', function (value) {
    //   const currentDate = new Date();
    //   const minAgeDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
    //   return value <= minAgeDate;
    // }),
    // countryCode: yup.string().required('select country code'),
    // mobileNumber: yup
    //   .string()
    //   .matches(/^[1-9]\d{9}$/, 'Invalid mobile number')
    //   .required('Please enter your mobile number'),
    fromCountry: yup.string().required('Please enter your country'),
    fromState: yup.string().required('Please enter your state'),
    fromCity: yup.string().required('Please enter your city'),
    // profilePicture: yup.mixed()
    //   .test('fileType', 'Unsupported file type', (value) => {
    //     if (!value) return true;
    //     const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    //     return allowedTypes.includes(value.type);
    //   }).required('Image is required'),
    // isDisciple: yup.string()
  });


    useEffect(() => {
        if (props.registerUser) {
            console.log(props.registerUser)
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
                setCityList(response.data)
            }
        })
    }, [stateID])



    const handleSubmit = (values) => {

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
        formData.append('arrivalTrainNumber', formik.values.arrivalTrainNumber)
        formData.append('departureDate', formik.values.departureDate)
        formData.append('departureTime', formik.values.departureTime)
        formData.append('departureModeOfTransport', formik.values.departureModeOfTransport)
        formData.append('departureTrainNumber', formik.values.departureTrainNumber)
        formData.append('specificRequirements', formik.values.specificRequirements)
        formData.append('attendingShivir', formik.values.attendingShivir)
        formik.resetForm()

        if (props.registerUser) {
            formData.append('registrationId', values.registrationId)
            axios.post(`${eventAPIConfig.userEventRegistration}`, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    formik.resetForm()
                    dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                    props.setChange(!props.change)
                    props.setEventFormOpen(false)
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            });

        } else {

            axios.post(`${eventAPIConfig.userEventRegistration}`, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    formik.resetForm()
                    dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                    props.setChange(!props.change)
                    props.setEventFormOpen(false)
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            });
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
            attendingShivir: false,

        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const closeForm = () => {
        formik.resetForm()
        props.handleClose()
    }

    useEffect(()=>{
        if(values.arrivalModeOfTransport === 'Train'){
           setArrModeOfTransport(true)
        }else{
           setArrModeOfTransport(false)
        }
     },[])

    return (
        <Card style={{ marginTop: '10px' }} className='shadow-5'>
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
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            variant="outlined"
                                            required
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
                                        setStateID(selectedSate)
                                        formik.setFieldValue('fromState', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="State"
                                            variant="outlined"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            required
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
                                            variant="outlined"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            required
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
                                    error={formik.touched.arrivalDate && Boolean(formik.errors.arrivalDate)}
                                    helperText={formik.touched.arrivalDate && formik.errors.arrivalDate}
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
                                    error={formik.touched.arrivalTrainNumber && Boolean(formik.errors.arrivalTrainNumber)}
                                    helperText={formik.touched.arrivalTrainNumber && formik.errors.arrivalTrainNumber}
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
                                    error={formik.touched.departureDate && Boolean(formik.errors.departureDate)}
                                    helperText={formik.touched.departureDate && formik.errors.departureDate}
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
                                    error={formik.touched.departureTime && Boolean(formik.errors.departureTime)}
                                    helperText={formik.touched.departureTime && formik.errors.departureTime}
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
                                            label="Mode of Transport"
                                            sx={{ mb: 2, mt: 2, width: '100%' }}
                                            className="max-w-md"
                                            variant="outlined"
                                            required
                                            error={formik.touched.departureModeOfTransport && Boolean(formik.errors.departureModeOfTransport)}
                                            helperText={formik.touched.departureModeOfTransport && formik.errors.departureModeOfTransport}

                                        />
                                    )}
                                />
                            </div>
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
                                    error={formik.touched.departureTrainNumber && Boolean(formik.errors.departureTrainNumber)}
                                    helperText={formik.touched.departureTrainNumber && formik.errors.departureTrainNumber}
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Specific Requirements"
                                    name="specificRequirements"
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
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formik.values.attendingShivir}
                                                onChange={(event) => {
                                                    formik.setFieldValue('attendingShivir', event.target.checked ? true : false);
                                                }}
                                                name="attendingShivir" />}
                                        label="You want to attend the Shivir ?"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ float: 'right', padding: '10px' }}>

                    <Button variant="outlined" onClick={closeForm}>Close</Button>
                    <Button variant="outlined" type='submit'>Save</Button>
                </div>

            </form>
        </Card>
    );
};

export default EventForm;
