import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import _ from '@lodash';
import 'react-phone-input-2/lib/style.css'
import { Autocomplete, Checkbox, FormControlLabel,IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { caseAPIConfig, eventAPIConfig, userAPIConfig } from "src/app/main/API/apiConfig";
import { values } from 'lodash';
import { Button } from 'bootstrap';


const EventForm = (props) => {
    const dispatch = useDispatch()
    // console.log(routeParams.eventId)
    // const id = useParams()
    
    const [countryList, setCountryList] = useState([])
    const [countryID, setCountryID] = useState('')
    const [stateList, setStateList] = useState([])
    const [stateID, setStateID] = useState('')
    const [cityList, setCityList] = useState([])
    const [cityID, setCityID] = useState('')
    

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
        // console.log(person.id)
        // console.log(formik.values)
        const formData = new FormData()
        formData.append('eventId',props.eventId)
        formData.append('userId',props.selectedUserId)
        formData.append('userName',props.person.name)
        formData.append('eventDate',props.eventDate)
        formData.append('eventName',props.eventName)
        formData.append('familyId',sessionStorage.getItem('familyId'))
        formData.append('fromCountry', `${countryID}:${formik.values.country}`)
        formData.append('fromState', `${stateID}:${formik.values.state}`)
        formData.append('fromCity', `${cityID}:${formik.values.city}`)
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
    

        axios.post(`${eventAPIConfig.userEventRegistration}` , formData ,{
        headers: {
            'Content-type': 'multipart/form-data',
             Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            console.log(response)
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        });
    }



    const formik = useFormik({
        initialValues : {
            eventId:'',
            userId:'',
            userName:'',
            familyId:'',
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
        // validationSchema: validationSchema,
        onSubmit : handleSubmit,
    });

  return (
    
     <form onSubmit={formik.handleSubmit}>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
    
    {/* Left side: Arrival details */}
    <div className='shadow-8 rounded-md' style={{ padding: '10px'}}>
        <h2 className="text-lg font-semibold mb-4 mt-2 text-center">Arrival Details</h2>
        {/* Arrival details fields */}
        <div className="space-y-2 " style={{marginTop: '21px'}}>
                            <div>
              
                                <Autocomplete
                                    options={countryList.length > 0 ? countryList.map(country => country.name) : []}
                                    value={formik.values.country}
                                    onChange={(event, newValue) => {
                                        const selectedCountry = countryList.find(country => country.name === newValue)?.id;
                                        setCountryID(selectedCountry)
                                        formik.setFieldValue('country', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Country"
                                            sx={{ mb: 2 , mt:2 , width:'100%'}}
                                            className="max-w-md"
                                            variant="outlined"
                                            required
                                            error={formik.touched.country && Boolean(formik.errors.country)}
                                            helperText={formik.touched.country && formik.errors.country}
                                        />
                                    )}
                                />
                            </div>
                            <div>
    
                                 <Autocomplete
                                    options={stateList.length > 0 ? stateList.map(state => state.name) : []}
                             
                                    value={formik.values.state}
                                    onChange={(event, newValue) => {
                                        const selectedSate = stateList.find(state => state.name === newValue)?.id;
                                        setStateID(selectedSate)
                                        formik.setFieldValue('state', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="State"
                                            variant="outlined"
                                            sx={{ mb: 2 , mt:2 , width:'100%'}}
                                            className="max-w-md"
                                            required
                                            error={formik.touched.state && Boolean(formik.errors.state)}
                                            helperText={formik.touched.state && formik.errors.state}
                                        />
                                    )}
                                />
                             </div>
                       
                           <div>
                                <Autocomplete
                                    options={cityList.length > 0 ? cityList.map(city => city.name) : []}
                                    value={formik.values.city}
                                    onChange={(event, newValue) => {
                                        const selectedCity = cityList.find(city => city.name === newValue)?.id;
                                        setCityID(selectedCity)
                                        formik.setFieldValue('city', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="City"
                                            variant="outlined"
                                            sx={{ mb: 2 , mt:2, width:'100%'}}
                                            className="max-w-md"
                                            required
                                            error={formik.touched.city && Boolean(formik.errors.city)}
                                            helperText={formik.touched.city && formik.errors.city}
                                        />
                                    )}
                                />
                            </div>
            <div>
                <TextField 
                name="arrivalDate" 
                label="Arrival Date"   
                variant="outlined" 
                sx={{ mb: 2 , mt:2 , width:'100%'}}
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
                sx={{ mb: 2 , mt:2 , width:'100%'}}
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
                                            label="Mode of Transport"  
                                            sx={{ mb: 2 , mt:2 , width:'100%'}}
                                            className="max-w-md"
                                            variant="outlined"
                                            required
                                            error={formik.touched.arrivalModeOfTransport && Boolean(formik.errors.arrivalModeOfTransport)}
                                            helperText={formik.touched.arrivalModeOfTransport && formik.errors.arrivalModeOfTransport}
                                            
                                        />
                                    )}
                                />
                            </div>

            <div>
                <TextField 
                name="arrivalTrainNumber" 
                label="Train Number"   
                variant="outlined" 
                sx={{ mb: 2 , mt:2 , width:'100%'}}
                className="max-w-md"
                type="text"
                value={formik.values.arrivalTrainNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.arrivalTrainNumber && Boolean(formik.errors.arrivalTrainNumber)}
                helperText={formik.touched.arrivalTrainNumber && formik.errors.arrivalTrainNumber}
                />
            </div>
        </div>
    </div>
    {/* Right side: Departure details */}
   
    <div className='shadow-8 rounded-md' style={{ position: 'relative', padding: '10px'}}>
    {/* <IconButton onClick={handleClose} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}> */}
        <CloseIcon />
         {/* </IconButton> */}
    
        <h2 className="text-lg font-semibold mb-4 mt-2 text-center">Departure Details</h2>
        {/* Departure details fields */}
        <div className="space-y-2 " style={{marginTop: '21px'}}>
        
            <div>
                
                <TextField 
                  name="departureDate" 
                  label="Departure Date" 
                  variant="outlined" 
                  sx={{ mb: 2 , mt:2 , width:'100%'}}
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
                  sx={{ mb: 2 , mt:2 , width:'100%'}}
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
                                            sx={{ mb: 2 , mt:2 , width:'100%'}}
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
                  sx={{ mb: 2 , mt:2 , width:'100%'}}
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
                    sx={{ mb: 2 , mt:2 , width:'100%'}}
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
            <div>
                <FormControlLabel
                    control={
                    <Checkbox 
                    checked={formik.values.attendingShivir === 'true'} 
                    onChange={(event) => {
                        formik.setFieldValue('attendingShivir', event.target.checked ? 'true' : 'false');
                      }}
                    name="attendingShivir" />}
                    label="Attending Shivir"
                />
            </div>
        </div>
    </div>
</div>
<button 
    type='submit' 
    style={{
        backgroundColor: '#FF3333',
        color: 'white',
        padding: '10px 35px', 
        borderRadius: '19px', 
        border: 'none', 
        cursor: 'pointer',
        fontSize : '17px',
        fontFamily: 'cursive',
        marginTop: '12px',
        marginLeft: '4px',
    }}
>
    Save
</button>
</form>
  );
};

export default EventForm;
