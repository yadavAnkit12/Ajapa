import { TextField, Button, Container, Stack, Avatar, Typography, MenuItem, Box, IconButton } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from '@mui/icons-material/Close';

import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';

import * as Yup from 'yup';

import axios from "axios";

import { useDispatch } from "react-redux";

import { showMessage } from "app/store/fuse/messageSlice";

import { LabOrderAPIConfig } from '../../API/apiConfig';
import { min } from 'lodash';



const documentList = [
  {
    type: 'license',
    name: 'licenseDocument',
    label: 'License'
  },
  {
    type: 'certificate',
    name: 'certificateDocument',
    label: 'Certificate'
  }
];

const LabOrderForm = (props) => {
  const dispatch = useDispatch();
  const [profileImg, setProfileImg] = useState('');
  const [empData, setEmpData] = useState({

    orderNumber: '',
    patientName: '',
    patientMobile: '',
    brandName: '',
    totalAmount: '',
    totalLabTest: '',


  });


  useEffect(() => {
    if (props.employeeId) {
      axios.get(`${LabOrderAPIConfig.getUser}/${props.employeeId}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setEmpData(response.data.data);
          setProfileImg(response?.data?.data?.image);
        } else {
          console.error("err", er);
          formik.resetForm();
          setProfileImg('');
        }
      })
    }
  }, [props.employeeId]);

  useEffect(() => {
    if (empData) {
      formik.setValues({
        orderNumber: empData.orderNumber || '',
        patientName: empData.patientName || '',
        patientMobile: empData.patientMobile || '',
        brandName: empData.brandName || '',
        totalAmount: empData.totalAmount || '',
        totalLabTest: empData.totalLabTest || ''
      });

    }
  }, [empData]);

  useEffect(() => {
    return () => {
      setEmpData(null);
      formik.resetForm();
    }
  }, [])
  const validationSchema = Yup.object().shape({
    orderNumber: Yup.number().positive("orderNumber must be more than 0").integer("orderNumber must be an integer").required("orderNumber is required"),
    patientName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name').min(2).max(40).required(),
    patientMobile: Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required('Mobile number is required'),
    brandName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name').min(2).max(40).required(),
    totalAmount: Yup.number().positive("totalAmount must be more than 0").integer("totalAmount must be an integer").required("totalAmount is required"),
    totalLabTest: Yup.number().positive("totalLabTest must be more than 0").integer("totalLabTest must be an integer").required("totalLabTest is required"),

  });

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('orderNumber', values.orderNumber);
    formData.append('patientName', values.patientName);
    formData.append('patientMobile', values.patientMobile);
    formData.append('brandName', values.brandName);
    formData.append('totalAmount', values.totalAmount);
    formData.append('totalLabTest', values.totalLabTest);

    axios.post(LabOrderAPIConfig.register, formData, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 201) {
        dispatch(showMessage({ message: 'Employee registered successfully', variant: 'success' }));
        formik.resetForm();
        props.setChange(!props.change);
        props.closeHandler(false);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })

  };

  const formik = useFormik({
    initialValues: {
      orderNumber: '',
      patientName: '',
      patientMobile: '',
      brandName: '',
      totalAmount: '',
      totalLabTest: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  }, []);

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
      <>
        <IconButton onClick={() => { props.closeHandler(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
          {props.employeeId ? 'Employee Update Form' : 'Employee Register Form'}
        </Typography>

        <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">


          <TextField
            type="string"
            variant="outlined"
            color="secondary"
            fullWidth
            id="patientName"
            label="patientName"
            autoComplete='off'
            required
            {...formik.getFieldProps('patientName')}
            error={(formik.touched.patientName && !!formik.errors.patientName)}
            helperText={formik.touched.patientName && formik.errors.patientName}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            type="number"
            variant="outlined"
            color="secondary"
            fullWidth
            id="patientMobile"
            label="patientMobile"
            autoComplete='patientMobile'
            required
            {...formik.getFieldProps('patientMobile')}
            error={(formik.touched.patientMobile && !!formik.errors.patientMobile)}
            helperText={formik.touched.patientMobile && formik.errors.patientMobile}
          
          />


          <TextField
            type="number"
            variant="outlined"
            color="secondary"
            fullWidth
            id="orderNumber"
            label="orderNumber"
            autoComplete='off'
            required
            {...formik.getFieldProps('orderNumber')}
            error={(formik.touched.orderNumber && !!formik.errors.orderNumber)}
            helperText={formik.touched.orderNumber && formik.errors.orderNumber}
            sx={{ mb: 2, mt: 1 }}
          />


          <TextField
            type="number"
            variant="outlined"
            color="secondary"
            fullWidth
            id="brandName"
            label="brandName"
            autoComplete='off'
            required
            {...formik.getFieldProps('brandName')}
            error={(formik.touched.brandName && !!formik.errors.brandName)}
            helperText={formik.touched.brandName && formik.errors.brandName}
            sx={{ mb: 2, mt: 1 }}
          />


          <TextField
            type="number"
            variant="outlined"
            color="secondary"
            fullWidth
            id="totalAmount"
            label="totalAmount"
            autoComplete='off'
            required
            {...formik.getFieldProps('totalAmount')}
            error={(formik.touched.totalAmount && !!formik.errors.totalAmount)}
            helperText={formik.touched.totalAmount && formik.errors.totalAmount}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            type="number"
            variant="outlined"
            color="secondary"
            fullWidth
            id="totalLabTest"
            label="totalLabTest"
            autoComplete='off'
            required
            {...formik.getFieldProps('totalLabTest')}
            error={(formik.touched.totalLabTest && !!formik.errors.totalLabTest)}
            helperText={formik.touched.totalLabTest && formik.errors.totalLabTest}
            sx={{ mb: 2, mt: 1 }}
          />

          <Stack direction="row" alignItems="flex-end" sx={{ mb: 4 }} spacing={2}>
            <label htmlFor="avatar-input">
              <Box variant="outlined" component="span" sx={{ justifyContent: 'center' }} startIcon={<AddAPhotoIcon />}>
              <FuseSvgIcon size={32} color="action">
                    heroicons-outline:upload
                  </FuseSvgIcon>
              </Box>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                id="avatar-input"
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

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
          >
            {props.employeeId ? 'Update' : 'Register'}
          </Button>
        </form>
      </>
    </Container>
  );
};

export default LabOrderForm;
