import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import _ from '@lodash';
import 'react-phone-input-2/lib/style.css'
import { Autocomplete, Card, Checkbox, FormControlLabel, Button, FormControl, FormLabel, FormGroup } from '@mui/material';
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
    console.log(props.person.id)
    const dispatch = useDispatch()
    const shivirHai = props.isShivirAvailable.data.shivirAvailable
    const lockarrivaldate = props.isShivirAvailable.data.lockArrivalDate
    const lockdeparturedetail = props.isShivirAvailable.data.lockDepartureDate
    // console.log(lockdeparturedetail,"hnn",lockarrivaldate)
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


    useEffect(() => {
        console.log('unde',props)
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
            .matches(/^[0-9]{6}$/, 'Train number must be exactly 6 digits'),
        departureDate: yup.string().required('Please select departure date'),
        departureTime: yup.string().required('Please select departure time'),
        departureModeOfTransport: yup.string().required('Please select departure mode of transport'),
        departureTrainNumber: yup.string()
            .matches(/^[0-9]{6}$/, 'Train number must be exactly 6 digits'),
        specificRequirements: yup.string(),
        attendingShivir: yup.boolean(),
    });


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
                setCityList(response.data)
            }
        })
    }, [stateID])



    const handleSubmit = (values) => {

        if(shivirCheckBox && formik.values.attendingShivir === ''){
            return dispatch(showMessage({ message: 'Please Check', variant: 'error' }));
        }

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
        formData.append('specificRequirements', formik.values.specificRequirements)
        // formData.append('attendingShivir', formik.values.attendingShivir )
        if(shivirCheckBox){
            formData.append('attendingShivir', formik.values.attendingShivir )
        }else{
            formData.append('attendingShivir', false )
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
            attendingShivir: '',

        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });
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
                registrationId: newValue.registrationId || '',
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


    return (
        <Card style={{ marginTop: '10px' }} className='shadow-5'>
            <div style={{display:'flex',justifyContent:'center',alignContent:'center'}}>
                <Autocomplete
                    disablePortal
                    value={props.sameAsDD.userName}
                    id="userName"
                    options={props.sameAsDD.length > 0 ? props.sameAsDD : []}
                    getOptionLabel={(option) => option.userName}
                    sx={{ my: 1, mx: 1 }}
                    onChange={(e, newValue) => handleUserNameChange(newValue)}
                    renderInput={(params) => <TextField fullWidth sty {...params} label="Same as" variant="standard" sx={{minWidth:'300px'}} />}
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
                                    error={formik.touched.arrivalDate && Boolean(formik.errors.arrivalDate)}
                                    helperText={formik.touched.arrivalDate && formik.errors.arrivalDate}
                                    inputProps={{ min: lockarrivaldate, max: eventDate }}
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
                                            required
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
                                    inputProps={{ min: eventDate, max: lockdeparturedetail }}
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
                                            required
                                            value={formik.values.departureTrainNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.departureTrainNumber && Boolean(formik.errors.departureTrainNumber)}
                                            helperText={formik.touched.departureTrainNumber && formik.errors.departureTrainNumber}
                                        />
                                    </div>
                                )
                            }
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

                <div style={{ float: 'right', padding: '10px' }}>

                    <Button variant="outlined" onClick={closeForm}>Close</Button>
                    <Button variant="outlined" type='submit'>Save</Button>
                </div>

            </form>
        </Card>
    );
};

export default EventForm;
