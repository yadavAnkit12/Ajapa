import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import _ from '@lodash';
import 'react-phone-input-2/lib/style.css'
import InputAdornment from '@mui/material/InputAdornment';
import { Autocomplete, Checkbox, FormControlLabel} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import axios from 'axios';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import UserFormHead from './UserFormHead';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { userAPIConfig } from 'src/app/main/API/apiConfig';

const fontStyles = {
    fontFamily:
        "'Hoefler Text', 'Baskerville Old Face','Garamond', 'Times new Roman' ,serif",
}

const phoneNumberCountryCodes = [
    '+91 (IN)',
    '+1 (US)',
    '+44 (UK)',
    '+33 (FR)',
    '+49 (DE)',
    '+81 (JP)',
    // Add more country codes as needed
];

function UserForm() {
    const dispatch = useDispatch()
    const routeParams = useParams()
    const [tabValue, setTabValue] = useState(0)
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [showPassword, setShowPassword] = useState(false);
    const [openEdit, setOpenEdit] = useState(false)
    const [countryList, setCountryList] = useState([])
    const [countryID, setCountryID] = useState('')
    const [stateList, setStateList] = useState([])
    const [stateID, setStateID] = useState('')
    const [cityList, setCityList] = useState([])
    const [cityID, setCityID] = useState('')
    const [userId, setUserId] = useState('')
    const initialValues = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        gender: '',
        dob: null,
        countryCode: '+91 (IN)',
        mobileNumber: '',
        country: '',
        state: '',
        city: '',
        profilePicture: null,
        isDisciple: 'No'
    };

    const validationSchema = yup.object().shape({
        name: yup.string().required('Please enter your full name').max(100, 'Full name should be less than 100 chars'),
        email: yup.string().email('Invalid email address').matches(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, 'Invalid email').required('Please enter your email'),
        password: yup
            .string()
            .required('Please enter your password.')
            .min(4, 'Password is too short - should be 4 chars minimum'),
        passwordConfirm: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
        gender: yup.string().required('Please select your gender'),
        dob: yup.date().required('Please enter your date of birth').test('is-adult', 'You must be at least 18 years old', function (value) {
            const currentDate = new Date();
            const minAgeDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
            return value <= minAgeDate;
        }),
        countryCode: yup.string().required('select country code').required('required'),
        mobileNumber: yup.string().matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits').required('Please enter your mobile number'),
        country: yup.string().required('Please enter your country'),
        state: yup.string().required('Please enter your state'),
        city: yup.string().required('Please enter your city'),
        profilePicture: yup.mixed().required('Please upload your profile picture'),
        isDisciple: yup.string()
    });

    useEffect(() => {
        const { id } = routeParams;
        setUserId(id)

        axios.get(`${userAPIConfig.getUserById}/${id}`, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }).then((response) => {
            console.log(response)
            if (response.status === 200) {
            }
        })

    }, []);

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

        axios.post(`${jwtServiceConfig.otpSent}`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }).then((response) => {
            if (response.status === 200) {
                setOpenEdit(true)
            }
            else {
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        }).catch((error) => console.log(error))

    }


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });
    function handleTabChange(event, value) {
        setTabValue(value);
    }

    return <FormProvider>
        <FusePageCarded
            header={<UserFormHead handleSubmit={handleSubmit} values={formik.values} />}

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

                        <Tab className="h-64" label="Phse I" />
                        <Tab className="h-64" label="Pahse II" />
                        <Tab className="h-64" label="Phase III" />

                    </Tabs>
                    <div className="p-16 sm:p-24 w-full">
                        <form onSubmit={formik.handleSubmit}>
                            <div className={tabValue !== 0 ? 'hidden' : ''}>
                                <TextField
                                    label="Full Name"
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    name='name'
                                    type="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    variant="outlined"
                                    required
                                    fullWidth
                                
                                />

                                <TextField
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    name='email'
                                    label="Email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    variant="outlined"
                                    required
                                    fullWidth
                                  
                                />

                                <div className='d-flex max-w-md'>
                                    <Autocomplete
                                        options={phoneNumberCountryCodes}
                                        value={formik.values.countryCode}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('countryCode', newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Code"
                                                variant="outlined"
                                                required
                                                error={formik.touched.countryCode && Boolean(formik.errors.countryCode)}
                                                helperText={formik.touched.countryCode && formik.errors.countryCode}
                                            />
                                        )}
                                    />
                                    <TextField
                                        name="mobileNumber"
                                        label="Mobile Number"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                                        helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />
                                </div>
                            </div>
                            <div className={tabValue !== 1 ? 'hidden' : ''}>
                                <TextField
                                    name="dob"
                                    label="Date of Birth"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                                    helperText={formik.touched.dob && formik.errors.dob}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    inputProps={{
                                        max: new Date().toISOString().split('T')[0], // Set max date to current date
                                    }}
                                />

                                <TextField
                                    name='password'
                                    label="Password"
                                    sx={{ mb: 2 }}
                                    className="max-w-md"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
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
                                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                   sx={{ mb: 2 }}
                                   className="max-w-md"
                                    name='passwordConfirm'
                                    label="Confirm Password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.passwordConfirm && Boolean(formik.errors.passwordConfirm)}
                                    helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
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
                                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Autocomplete
                                    options={['Male', 'Female', 'Others']}
                                    fullWidth
                                    value={formik.values.gender}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('gender', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Gender"
                                            sx={{ mb: 2 }}
                                    className="max-w-md"
                                            variant="outlined"
                                            required
                                            error={formik.touched.gender && Boolean(formik.errors.gender)}
                                            helperText={formik.touched.gender && formik.errors.gender}
                                            disabled={formik.values.isActive}
                                        />
                                    )}
                                />
                            </div>
                            <div className={tabValue !== 2 ? 'hidden' : ''}>
                                <Autocomplete
                                    options={countryList.length > 0 ? countryList.map(country => country.name) : []}
                                    fullWidth
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
                                            sx={{ mb: 2 }}
                                    className="max-w-md"
                                            variant="outlined"
                                            required
                                         
                                            error={formik.touched.country && Boolean(formik.errors.country)}
                                            helperText={formik.touched.country && formik.errors.country}
                                        />
                                    )}
                                />
                                <Autocomplete
                                    options={stateList.length > 0 ? stateList.map(state => state.name) : []}
                                    fullWidth
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
                                            sx={{ mb: 2 }}
                                            className="max-w-md"
                                            required
                                            error={formik.touched.state && Boolean(formik.errors.state)}
                                            helperText={formik.touched.state && formik.errors.state}
                                        />
                                    )}
                                />

                                <Autocomplete
                                    options={cityList.length > 0 ? cityList.map(city => city.name) : []}
                                    fullWidth
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
                                            sx={{ mb: 2 }}
                                            className="max-w-md"
                                            required
                                            error={formik.touched.city && Boolean(formik.errors.city)}
                                            helperText={formik.touched.city && formik.errors.city}
                                        />
                                    )}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.isDisciple === 'Yes'}
                                            onChange={(event) => {
                                                formik.setFieldValue('isDisciple', event.target.checked ? 'Yes' : 'No');
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label="Are you an Ajapa Disciple ?"
                                />
                                <div>
                                    <input
                                        type="file"
                                        name='profilePicture'
                                        onChange={(event, newValue) => { formik.setFieldValue('profilePicture', event.target.files[0]) }}
                                        style={{
                                            fontSize: '1.8rem',
                                            color: '#1a202c',
                                            // padding: '0.75rem',  // Adjust the padding to increase the size
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                            background: 'transparent',
                                            outline: 'none',
                                            border: 'none',
                                        }}
                                    />
                                    <p style={{ fontSize: '10px', padding: '0.75rem 0' }}>
                                        PNG, JPG, or JPEG (Must be a clear image).
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            }
            scroll={isMobile ? 'normal' : 'content'}
        />

    </FormProvider>

}

export default UserForm;
