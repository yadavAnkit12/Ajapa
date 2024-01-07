import { TextField, Button, Container, Stack, Typography, IconButton, InputAdornment, Autocomplete } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import { ConfigurationAPIConfig, doctorAPIConfig } from '../../API/apiConfig';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { FormProvider } from 'react-hook-form';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import SettingFormHead from './SettingFormHead';
import { useFormik } from 'formik';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import './Setting.css'





const Setting = (props) => {

  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [doctorData, setDoctorData] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [docId, setDocId] = useState('')
  const [doctorOption, setDoctorOption] = useState([])
  const [doctorList, setDoctorList] = useState('')
  let initialValues = {
    doctorPayOnMembershipAppointment: '',
    patientReferredCodePoint: '',
    patientUseReferralCodePoint: '',
    doctorAppointmentLever1: '',
    doctorAppointmentLever2: '',
    doctorAppointmentLever3: '',
    taxMembership: '',
    taxConsultation: '',
    taxLabTest: '',
    defaultDocterDirectAppointment: { name: '', _id: '' }

  }
  const validationSchema = Yup.object().shape({
    doctorPayOnMembershipAppointment: Yup.number().required('Required').typeError('Please enter a number only').positive('Please enter a positive number'),
    patientReferredCodePoint: Yup.number().required('Required').typeError('Please enter a number only').positive('Please enter a positive number'),
    patientUseReferralCodePoint: Yup.number().required('Required').typeError('Please enter a number only').positive('Please enter a positive number'),
    doctorAppointmentLever1: Yup.number().required('Required').typeError('Please enter a number only').positive('Please enter a positive number'),
    doctorAppointmentLever2: Yup.number().required('Required').typeError('Please enter a number only').positive('Please enter a positive number'),
    doctorAppointmentLever3: Yup.number().required('Required').typeError('Please enter a number only').positive('Please enter a positive number'),
    taxMembership: Yup.number().required('Required').typeError('Please enter a number only').min(0, 'Value must be 0 or').max(100, 'Value must not be greater than 100'),
    taxConsultation: Yup.number().required('Required').typeError('Please enter a number only').min(0, 'Value must be 0 or').max(100, 'Value must not be greater than 100'),
    taxLabTest: Yup.number().required('Required').typeError('Please enter a number only').min(0, 'Value must be 0 or').max(100, 'Value must not be greater than 100'),
    defaultDocterDirectAppointment: Yup.object().shape({
      name: Yup.string().required('Required'),
      _id: Yup.string().required('Required'),
    }),  });

  useEffect(() => {
    if (doctorList) {
      const options = Array.from(doctorList, (doctor) => ({ name: doctor.name, _id: doctor._id }));
      setDoctorOption(options);
    }
  }, [doctorList]);


  useEffect(() => {
    axios.get(doctorAPIConfig.getDoctorList, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setDoctorList(response.data.data.doctorList)
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    });

  }, [])

  useEffect(() => {
    axios.get(`${ConfigurationAPIConfig.fetchConfiguration}`
    ).then((response) => {
      if (response.status === 200) {
        setDoctorData(response)
        setDocId(response.data.data._id)
        formik.setValues({
          doctorPayOnMembershipAppointment: response.data.data.doctorPayOnMembershipAppointment,
          patientReferredCodePoint: response.data.data.patientReferredCodePoint,
          patientUseReferralCodePoint: response.data.data.patientUseReferralCodePoint,
          doctorAppointmentLever1: response.data.data.doctorAppointmentLever1,
          doctorAppointmentLever2: response.data.data.doctorAppointmentLever2,
          doctorAppointmentLever3: response.data.data.doctorAppointmentLever3,
          taxMembership: response.data.data.taxMembership,
          taxConsultation: response.data.data.taxConsultation,
          taxLabTest: response.data.data.taxLabTest,
          defaultDocterDirectAppointment: { name: response.data.data.defaultDocterDirectAppointment.name, _id: response.data.data.defaultDocterDirectAppointment._id }
        })
        setIsLoaded(true)

      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }, [])


  const handleSubmit = (values) => {
    if (formik.isValid) {
     console.log(values)
      const formData = new FormData();
      formData.append('doctorPayOnMembershipAppointment', values.doctorPayOnMembershipAppointment);
      formData.append('patientReferredCodePoint', values.patientReferredCodePoint);
      formData.append('patientUseReferralCodePoint', values.patientUseReferralCodePoint);
      formData.append('doctorAppointmentLever1', values.doctorAppointmentLever1);
      formData.append('doctorAppointmentLever2', values.doctorAppointmentLever2);
      formData.append('doctorAppointmentLever3', values.doctorAppointmentLever3);
      formData.append('taxMembership', values.taxMembership);
      formData.append('taxConsultation', values.taxConsultation);
      formData.append('taxLabTest', values.taxLabTest);
      formData.append('defaultDocterDirectAppointment', values.defaultDocterDirectAppointment._id);
      

      axios.post(`${ConfigurationAPIConfig.create}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          dispatch(showMessage({ message: 'Update Successfully', variant: 'success' }));

        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
    else {
      dispatch(showMessage({ message: "Please Check all Fields are correctly Filled", variant: 'error' }))
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,

  })

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  if (!isLoaded) {
    return <FuseLoading />;
  }

  return (
    <FormProvider>
      {isLoaded &&
        <FusePageCarded
          header={<SettingFormHead handleSubmit={handleSubmit} values={formik.values} />}

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

                <Tab className="h-64" label="Referel Point" />
                <Tab className="h-64" label="Appointment" />
                <Tab className="h-64" label="GST %" />
                <Tab className="h-64" label="Pathalogy" />


              </Tabs>

              <div className="p-16 sm:p-24 max-w-3xl">
                <form onSubmit={formik.handleSubmit}>
                  <div className={tabValue !== 0 ? 'hidden' : ''}>
                    <div className='setting-field'>
                      <TextField
                        label='Membership Appointment'
                        style={{ width: '100%' }}
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        name='doctorPayOnMembershipAppointment'
                        fullWidth
                        value={formik.values.doctorPayOnMembershipAppointment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.doctorPayOnMembershipAppointment && Boolean(formik.errors.doctorPayOnMembershipAppointment)}
                        helperText={formik.touched.doctorPayOnMembershipAppointment && formik.errors.doctorPayOnMembershipAppointment}
                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the Membership Appointment field.
                      </Typography>
                    </div>
                    <div className='setting-field'>
                      <TextField
                        label='Referred CodePoint'
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        name='patientReferredCodePoint'
                        fullWidth
                        value={formik.values.patientReferredCodePoint}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.patientReferredCodePoint && Boolean(formik.errors.patientReferredCodePoint)}
                        helperText={formik.touched.patientReferredCodePoint && formik.errors.patientReferredCodePoint}

                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the patient referred CodePoint.
                      </Typography>
                    </div>
                    <div className='setting-field'>
                      <TextField
                        label='Referrel CodePoint'
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        fullWidth
                        name='patientUseReferralCodePoint'
                        value={formik.values.patientUseReferralCodePoint}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.patientUseReferralCodePoint && Boolean(formik.errors.patientUseReferralCodePoint)}
                        helperText={formik.touched.patientUseReferralCodePoint && formik.errors.patientUseReferralCodePoint}

                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the patient Usereferred CodePoint.
                      </Typography>
                    </div>
                  </div>

                  <div className={tabValue !== 1 ? 'hidden' : ''}>
                    <div className='setting-field'>
                      <TextField
                        label='Appointment Lever1'
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        fullWidth
                        name='doctorAppointmentLever1'
                        value={formik.values.doctorAppointmentLever1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.doctorAppointmentLever1 && Boolean(formik.errors.doctorAppointmentLever1)}
                        helperText={formik.touched.doctorAppointmentLever1 && formik.errors.doctorAppointmentLever1}

                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the Doctor Appointment Lever1.
                      </Typography>
                    </div>
                    <div className='setting-field'>
                      <TextField
                        label='Appointment Lever2'
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        fullWidth
                        name='doctorAppointmentLever2'
                        value={formik.values.doctorAppointmentLever2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.doctorAppointmentLever2 && Boolean(formik.errors.doctorAppointmentLever2)}
                        helperText={formik.touched.doctorAppointmentLever2 && formik.errors.doctorAppointmentLever2}

                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the Doctor Appointment Lever2.
                      </Typography>
                    </div>
                    <div className='setting-field'>
                      <TextField
                        label='Appointment Lever3'
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        fullWidth
                        name='doctorAppointmentLever3'
                        value={formik.values.doctorAppointmentLever3}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.doctorAppointmentLever3 && Boolean(formik.errors.doctorAppointmentLever3)}
                        helperText={formik.touched.doctorAppointmentLever3 && formik.errors.doctorAppointmentLever3}

                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the Doctor Appointment Lever2.
                      </Typography>
                    </div>
                    <div className='setting-field'>
                      <Autocomplete
                        options={doctorOption}
                        className="mt-8 mb-16 field-width"
                        getOptionLabel={(option) => option.name}
                        name="defaultDocterDirectAppointment"
                        value={formik.values.defaultDocterDirectAppointment} // Set the value to the selected doctor
                        onChange={(event, newValue) => {
                          // Update the defaultDocterDirectAppointment field with the selected doctor's name and _id
                          formik.setFieldValue("defaultDocterDirectAppointment", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Default Doctor"
                            variant="outlined"
                          />)}
                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        Select a default Doctor for Appointment
                      </Typography>
                    </div>
                  </div>

                  <div className={tabValue !== 2 ? 'hidden' : ''}>
                    <div className='setting-field'>
                      <TextField
                        label='Tax Membership'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              %
                            </InputAdornment>
                          ),
                        }}
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        fullWidth
                        name='taxMembership'
                        value={formik.values.taxMembership}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.taxMembership && Boolean(formik.errors.taxMembership)}
                        helperText={formik.touched.taxMembership && formik.errors.taxMembership}
                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the tax Membership.
                      </Typography>
                    </div>
                    <div className='setting-field'>
                      <TextField
                        label='Tax Consulation'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              %
                            </InputAdornment>
                          ),
                        }}
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        fullWidth
                        name='taxConsultation'
                        value={formik.values.taxConsultation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.taxConsultation && Boolean(formik.errors.taxConsultation)}
                        helperText={formik.touched.taxConsultation && formik.errors.taxConsultation}

                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the tax Consulation.
                      </Typography>
                    </div>
                    <div className='setting-field'>
                      <TextField
                        label='Tax LabTest'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              %
                            </InputAdornment>
                          ),
                        }}
                        className="mt-8 mb-16 field-width"
                        variant="outlined"
                        fullWidth
                        name='taxLabTest'
                        value={formik.values.taxLabTest}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.taxLabTest && Boolean(formik.errors.taxLabTest)}
                        helperText={formik.touched.taxLabTest && formik.errors.taxLabTest}
                      />
                      <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2 field-width">
                        description of the tax Lab Test.
                      </Typography>
                    </div>
                  </div>

                  <div className={tabValue !== 3 ? 'hidden' : ''}>
                    <div className='setting-field'>
                      <Autocomplete

                        options={['test 1', 'test 2', 'test 3']}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Pathalogy" />}
                      />
                      {/* <Typography variant="body2" color="textSecondary" className="mt-8 mb-16 ml-2">
                        description of the tax Membership.
                      </Typography> */}
                    </div>
                  </div>

                </form>
              </div>
            </>
          }
          scroll={isMobile ? 'normal' : 'content'}
        />
      }
    </FormProvider>
  );
};

export default Setting;
