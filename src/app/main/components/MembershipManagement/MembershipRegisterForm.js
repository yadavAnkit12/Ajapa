import { Grid, TextField, Button, Container, Stack, Avatar, Typography, Box, IconButton } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from '@mui/icons-material/Close';

import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';

import * as Yup from 'yup';

import axios from "axios";

import 'react-quill/dist/quill.snow.css';

import { useDispatch } from "react-redux";

import { showMessage } from "app/store/fuse/messageSlice";

import ReactQuill from 'react-quill';

import { membershipAPIConfig } from '../../API/apiConfig';

const MembershipRegisterForm = (props) => {
  const dispatch = useDispatch();
  const [profileImg, setProfileImg] = useState('');
  const [planData, setPlanData] = useState({

    planName: '',
    priceWithGst: '',
    appointmentSlot: 0,
    offPercentMedicine: 0,
    maxOffAmountMedicine: 0,
    offPercentTest: 0,
    maxOffAmountTest: 0,
    expiryMonth: '',
    description: '',

    image: '',
  });

  useEffect(() => {
    return () => {
      setPlanData(null);
      formik.resetForm();
    }
  }, [])

  useEffect(() => {
    if (props.membershipPlanId) {
      axios.get(`${membershipAPIConfig.getPlan}/${props.membershipPlanId}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setPlanData(response.data.data);
          setProfileImg(response?.data?.data?.image);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          setProfileImg('');
        }
      })
    }
  }, [props.membershipPlanId]);

  useEffect(() => {
    if (planData) {
      formik.setValues({
        planName: planData.planName || '',
        priceWithGst: planData.priceWithGst || '',
        appointmentSlot: planData.appointmentSlot || 0,
        offPercentMedicine: planData.offPercentMedicine || 0,
        maxOffAmountMedicine: planData.maxOffAmountMedicine || 0,
        offPercentTest: planData.offPercentTest || 0,
        maxOffAmountTest: planData.maxOffAmountTest || 0,
        expiryMonth: planData.expiryMonth || '',
        description: planData.description || '',
        image: planData.image || ''

      });
    }
  }, [planData]);


  const validationSchema = Yup.object().shape({
    planName: Yup.string().required('Plan name is required'),
    priceWithGst: Yup.number().positive("Price must be more than 0").integer("Price must be more than 0").required("Price is required"),
    appointmentSlot: Yup.number().positive("Appointment must be an integer").min(0, "Appointment must be 0 or more"),
    offPercentMedicine: Yup.number().positive("Off percentage on medicine must be an integer").min(0, " Off percentage on medicine must be 0 or more"),
    maxOffAmountMedicine: Yup.number().positive("Maximum off amount on medicine must be more than 0").min(0, " Maximum off amount on medicine must be 0 or more"),
    offPercentTest: Yup.number().positive("Off percentage on lab test must be more than 0").min(0, " Off percentage on lab test must be 0 or more"),
    maxOffAmountTest: Yup.number().positive("Maximum off amount on lab test must be more than 0").min(0, " Maximum off amount on lab tes must be 0 or more"),
    expiryMonth: Yup.number().positive("Expire month must be more than 0").integer("Expire month must  be more than 0").required("Expire month  is required"),

    description: Yup.string()
  });

  const handleSubmit = (values) => {

    const formData = new FormData();
    formData.append('planName', values.planName);
    formData.append('priceWithGst', values.priceWithGst);
    formData.append('appointmentSlot', values.appointmentSlot);
    formData.append('offPercentMedicine', values.offPercentMedicine);
    formData.append('maxOffAmountMedicine', values.maxOffAmountMedicine);
    formData.append('offPercentTest', values.offPercentTest);
    formData.append('maxOffAmountTest', values.maxOffAmountTest);
    formData.append('expiryMonth', values.expiryMonth);
    formData.append('description', values.description);

    formData.append('image', values.image)

    if (props.membershipPlanId) {
      axios.put(`${membershipAPIConfig.edit}/${props.membershipPlanId}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          dispatch(showMessage({ message: 'Plan updated successfully', variant: 'success' }));
          props.setOpen(!props.open);
          props.setChange(!props.change);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })

    } else {
      axios.post(membershipAPIConfig.create, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 201) {
          dispatch(showMessage({ message: 'Plan added successfully', variant: 'success' }));
          formik.resetForm();
          setProfileImg(null);
          props.setOpen(!props.open);
          props.setChange(!props.change);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  };

  const formik = useFormik({
    initialValues: {
      planName: '',
      priceWithGst: '',
      appointmentSlot: 0,
      offPercentMedicine: 0,
      maxOffAmountMedicine: 0,
      offPercentTest: 0,
      maxOffAmountTest: 0,
      expiryMonth: '',
      description: '',

      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });


  const handleAvatarChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('image', file);
      setProfileImg(URL.createObjectURL(file));
    } else {
      formik.setFieldValue('image', '');
      setProfileImg('');
    }
  };

  return (
    <Container maxWidth="md">
      <IconButton onClick={() => { props.setOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h4" fontWeight="600" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
        {props.membershipPlanId ? 'Membership Plan Update Form' : 'Membership Plan Add Form'}
      </Typography>


      <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
        <Grid container>
          <Grid item xs={6}>
            <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
              <TextField
                type="tel"
                variant="outlined"
                color="secondary"
                fullWidth
                id="planName"
                label="Plan name"
                autoFocus
                required
                {...formik.getFieldProps('planName')}
                error={formik.touched.planName && formik.errors.planName}
                helperText={formik.touched.planName && formik.errors.planName}
              />

              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                fullWidth
                id="priceWithGst"
                label="Price with GST"
                required
                {...formik.getFieldProps('priceWithGst')}
                error={formik.touched.priceWithGst && formik.errors.priceWithGst}
                helperText={formik.touched.priceWithGst && formik.errors.priceWithGst}
                sx={{ mb: 2 }}
                onChange={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  formik.getFieldProps('priceWithGst').onChange(e);
                }}
              />

              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                fullWidth
                id="appointmentSlot"
                label="Appointment Slots"
                required
                {...formik.getFieldProps('appointmentSlot')}
                error={formik.touched.appointmentSlot && formik.errors.appointmentSlot}
                helperText={formik.touched.appointmentSlot && formik.errors.appointmentSlot}
                sx={{ mb: 2 }}
                onChange={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  formik.getFieldProps('appointmentSlot').onChange(e);
                }}
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                fullWidth
                id="offPercentMedicine"
                label="How much percent off is to be given on medicine?"
                required
                {...formik.getFieldProps('offPercentMedicine')}
                error={formik.touched.offPercentMedicine && formik.errors.offPercentMedicine}
                helperText={formik.touched.offPercentMedicine && formik.errors.offPercentMedicine}
                sx={{ mb: 2 }}
                onChange={(e) => {
                  if (e.target.value < 0 || e.target.value > 100) {
                    return;
                  }
                  formik.getFieldProps('offPercentMedicine').onChange(e);
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={2} sx={{ mt: 2, marginBottom: 2, marginLeft: 2 }}>
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                fullWidth
                id="maxOffAmountMedicine"
                label="Maximum amount of rupees to be given off on medicine?"
                required
                {...formik.getFieldProps('maxOffAmountMedicine')}
                error={formik.touched.maxOffAmountMedicine && formik.errors.maxOffAmountMedicine}
                helperText={formik.touched.maxOffAmountMedicine && formik.errors.maxOffAmountMedicine}
                onChange={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  formik.getFieldProps('maxOffAmountMedicine').onChange(e);
                }}
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                fullWidth
                id="offPercentTest"
                label="How much percent off is to be given on lab tests?"
                required
                {...formik.getFieldProps('offPercentTest')}
                error={formik.touched.offPercentTest && formik.errors.offPercentTest}
                helperText={formik.touched.offPercentTest && formik.errors.offPercentTest}
                sx={{ mb: 2 }}
                onChange={(e) => {
                  if (e.target.value < 0 || e.target.value > 100) {
                    return;
                  }
                  formik.getFieldProps('offPercentTest').onChange(e);
                }}
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                fullWidth
                id="maxOffAmountTest"
                label="Maximum amount of rupees to be given off on lab test"
                required
                {...formik.getFieldProps('maxOffAmountTest')}
                error={formik.touched.maxOffAmountTest && formik.errors.maxOffAmountTest}
                helperText={formik.touched.maxOffAmountTest && formik.errors.maxOffAmountTest}
                sx={{ mb: 2 }}
                onChange={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  formik.getFieldProps('maxOffAmountTest').onChange(e);
                }}
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                fullWidth
                id="expiryMonth"
                label="Expiry Month"
                required
                {...formik.getFieldProps('expiryMonth')}
                error={formik.touched.expiryMonth && formik.errors.expiryMonth}
                helperText={formik.touched.expiryMonth && formik.errors.expiryMonth}
                sx={{ mb: 2 }}
                onChange={(e) => {
                  if (e.target.value < 1 || e.target.value > 12) {
                    return;
                  }
                  formik.getFieldProps('expiryMonth').onChange(e);
                }}
              />

            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" alignItems="flex-end" sx={{ mb: 4 }} spacing={2}>
              <label htmlFor="membership-avatar-input">
                <Button variant="outlined" component="span" sx={{ justifyContent: 'center' }} startIcon={<AddAPhotoIcon />}>
                  Upload Photo
                </Button>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  id="membership-avatar-input"
                  onChange={(e) => { e.preventDefault(); handleAvatarChange(e); }}
                  hidden
                />
              </label>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar alt="Avatar Preview" src={profileImg} sx={{
                  width: 60,
                  height: 60,
                  marginLeft: 1,
                }}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <ReactQuill
              id="description"
              required
              theme="snow"
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue('description', value)}
              placeholder="Any description type here...."

            />


            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {props.membershipPlanId ? 'Update' : 'Save'}
            </Button>
          </Grid>
        </Grid>

      </form>

    </Container>
  );
};

export default MembershipRegisterForm;


