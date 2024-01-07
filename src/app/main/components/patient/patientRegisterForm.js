import { TextField, Button, Container, Stack, Typography, Dialog, DialogActions, Slide, IconButton, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState, forwardRef } from 'react';

import { useFormik } from 'formik';

import * as Yup from 'yup';

import axios from "axios";

import { useDispatch } from "react-redux";

import { showMessage } from "app/store/fuse/messageSlice";

import { clinicAPIConfig, patientAPIConfig } from '../../API/apiConfig';

import OTP from './OTP';
import { min } from 'lodash';
import { getUserRoles } from 'src/app/auth/services/utils/common';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  mobile: Yup
    .string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  patientNumber: Yup.string().required('Patient number is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  age: Yup
    .number()
    .typeError('Age must be a number')
    .positive('Age must be a positive number')
    .integer('Age must be an integer')
    .required('Age is required'),
  gender: Yup.string().required('Gender is required'),
  // clinicId: Yup.string().required('Clinic ID is required'),
});

const PatientRegisterForm = (props) => {
  console.log(props)
  const dispatch = useDispatch();
  const [openOTPDialog, setOpenOTPDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [clinicList, setClinicList] = useState('');
  const [clinicOptions, setClinicOptions] = useState([])
  const [patientData, setPatientData] = useState({
    name: '',
    mobile: '',
    patientNumber: '',
    email: '',
    age: '',
    gender: '',
    clinicId: ''
  });

  useEffect(() => {
    return () => {
      formik.resetForm();
    }
  }, []);

  // useEffect(() => {
  //   formik.setFieldValue('isActive', isActive);
  // }, [isActive])

  useEffect(() => {
    if (props.patientId) {
      axios.get(`${patientAPIConfig.getPatientbyId}/${props.patientId}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setPatientData(response.data.data);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  }, [props.patientId]);

 

  const handleSubmit = (values) => {
    let clinicId
    if(getUserRoles()==='clinic'){
      clinicId=sessionStorage.getItem('id')
    }
    else{
      const selectedClinic = clinicList.find((clinic) => clinic.name === values.clinicId);
      clinicId = selectedClinic ? selectedClinic._id : ''; // Default to an empty string if not found
    }

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('mobile', values.mobile);
      formData.append('email', values.email);
      formData.append('patientNumber', values.patientNumber);
      formData.append('age', values.age);
      formData.append('gender', values.gender);
      formData.append('clinicId', clinicId);

      if (props.patientId) {
        axios.put(`${patientAPIConfig.edit}/${props.patientId}`, formData, {
          headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            dispatch(showMessage({ message: 'Patient updated successfully', variant: 'success' }));
            formik.resetForm();
            props.setChange(true);
            props.setOpen(false);
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        })
      } else {
        axios.post(patientAPIConfig.register, formData, {
          headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 201) {
            dispatch(showMessage({ message: 'Patient registered successfully', variant: 'success' }));
            formik.resetForm();
            props.setChange && props.setChange(true);
            // props.setSearchedData && props.setSearchedData(response.data.data);
            props.setOpen(false);
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        })
      }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: '',
      patientNumber: '',
      email: '',
      age: '',
      gender: '',
      clinicId: ''

    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });


  useEffect(() => {
    if (clinicList) {
      const options = clinicList.map((clinic) => clinic.name)
      setClinicOptions(options);
    }
  }, [clinicList]);


  useEffect(() => {
    axios.get(clinicAPIConfig.list, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setClinicList(response.data.data.PartnerList);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    });
  }, [])



  useEffect(() => {
    if (patientData) {
      formik.setValues({
        name: patientData.name || '',
        mobile: patientData.mobile || '',
        patientNumber: patientData.patientNumber || '',
        email: patientData.email || '',
        age: patientData.age || '',
        gender: patientData.gender || '',
        clinicId: patientData.clinicId.name || ''
      });
    }
  }, [patientData]);
  

  // const handleCloseOTPDialog = () => {
  //   setOpenOTPDialog(false);
  // };

  // const verifyPatient = () => {

  //   axios.get(`${patientAPIConfig.checkPatient}/${formik.values.mobile}`, {
  //     headers: {
  //       'Content-type': 'multipart/form-data',
  //       authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
  //     },
  //   }).then((response) => {
  //     if (response.data.data !== null) {
  //       dispatch(showMessage({ message: 'Patient Already Exist', variant: 'error' }));
  //     }
  //     else {
  //       axios.get(`${patientAPIConfig.sendOTP}?mobile=${formik.values.mobile}`, {
  //         headers: {
  //           'Content-type': 'multipart/form-data',
  //           authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
  //         },
  //       }).then((response) => {
  //         if (response.status === 200) {
  //           setSuccess(true);
  //           setOpenOTPDialog(true);
  //         } else {
  //           dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
  //         }
  //       })
  //     }

  //   })


  // }

  return (
    <Container maxWidth="md">
      <React.Fragment>
        <IconButton onClick={() => { props.setOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
          {props.patientId ? 'Patient Update Form' : 'Patient Register Form'}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              fullWidth
              id="name"
              label="Name"
              require
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Stack>
        {getUserRoles()!='clinic' && <Autocomplete
            options={clinicOptions}
            name="clinicId"
            value={formik.values.clinicId}
            onChange={(event, newValue) => {
              formik.setFieldValue("clinicId", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ mb: 2 }}

                label="Clinic"
                variant="outlined"
              />)}
          />}
          <TextField
            type="tel"
            variant="outlined"
            color="secondary"
            fullWidth
            id="mobile"
            label="Mobile"
            value={formik.values.mobile}
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
            sx={{ mb: 2 }}
            disabled={formik.values.isActive}
          />
          <TextField
            type="tel"
            variant="outlined"
            color="secondary"
            fullWidth
            id="patientNumber"
            label="Patient Refrence Number"
            required
            value={formik.values.patientNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.patientNumber && Boolean(formik.errors.patientNumber)}
            helperText={formik.touched.patientNumber && formik.errors.patientNumber}
            sx={{ mb: 2 }}
            disabled={formik.values.isActive}
          />
          <TextField
            type="tel"
            variant="outlined"
            color="secondary"
            fullWidth
            id="email"
            label="Email"
            value={formik.values.email}

            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2 }}
            disabled={formik.values.isActive}
          />
          <TextField
            type="tel"
            variant="outlined"
            color="secondary"
            fullWidth
            id="age"
            label="Age"
            required
            value={formik.values.age}

            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
            sx={{ mb: 2 }}
            disabled={formik.values.isActive}
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
                variant="outlined"
                required
                sx={{ mb: 2 }}

                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
                disabled={formik.values.isActive}
              />
            )}
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={formik.handleSubmit}
            sx={{ mb: 2 }}
          >
            Save

          </Button>
        </form>
      </React.Fragment>
    </Container>
  );
};

export default PatientRegisterForm;