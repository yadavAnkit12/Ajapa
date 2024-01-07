import { MenuItem, TextField, Button, Container, Stack, Avatar, Typography, Box, IconButton } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from '@mui/icons-material/Close';

import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';

import * as Yup from 'yup';

import axios from "axios";

import { useDispatch } from "react-redux";

import { showMessage } from "app/store/fuse/messageSlice";

import { symptomAPIConfig } from '../../API/apiConfig';

import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

const SymptomForm = (props) => {

  const dispatch = useDispatch();
  const [profileImg, setProfileImg] = useState('');
  const [isImageTouched, setIsImageTouched] = useState(false);
  const [symptomData, setSymptomData] = useState({
    name: '',
    image: null,
    description: ''
  });

  useEffect(() => {
    if (props.symptomId) {
      axios.get(`${symptomAPIConfig.fetch}/${props.symptomId}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setSymptomData(response.data.data);
          setProfileImg(response?.data?.data?.image);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          setProfileImg('');
        }
      })
    }
  }, [props.symptomId]);

  useEffect(() => {
    if (symptomData) {
      formik.setValues({
        name: symptomData.name || '',
        image: symptomData.image || '',
        description: symptomData.description || ''
      });
    }
  }, [symptomData]);

  useEffect(() => {
    return () => {
      setSymptomData(null);
      formik.resetForm();
    }
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[A-Za-z ]*$/, 'Please enter Symptom name').min(2).max(40).required(),
    image: Yup.mixed()
      .required('Please select an image')
      .test('fileSize', 'File size is too large', (value) => {
        if (!value || typeof (value) === "string") return true; // Skip the test if no file is selected
        const maxSizeInBytes = 1 * 1024 * 1024; // 11MB
        return value.size <= maxSizeInBytes;
      }),
    description: Yup.string().required('About the symptom is required')
  });

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', values.image || '');
    formData.append('description', values.description || '')

    if (props.symptomId) {
      axios.put(`${symptomAPIConfig.edit}/${props.symptomId}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          dispatch(showMessage({ message: 'Symptom updated successfully', variant: 'success' }));
          setProfileImg('');
          formik.resetForm();
          props.setOpen(false);
          props.setChange(!props.change);

        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    } else {
      axios.post(symptomAPIConfig.addSymptom, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 201) {
          dispatch(showMessage({ message: 'Symptom added successfully', variant: 'success' }));
          formik.resetForm();
          setProfileImg('');
          props.setOpen(false);
          props.setChange(!props.change);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      image: null,
      description: '',
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
      setIsImageTouched(true);
    } else {
      formik.setFieldValue('image', '');
      setProfileImg('');
      setIsImageTouched(false);
    }
  };


  return (
    <Container maxWidth="md">
      <>
        <IconButton onClick={() => { props.setOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
          {props.symptomId ? 'Symptom Update Form' : 'Add Symptom Form'}
        </Typography>

        <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">

          <TextField
            variant="outlined"
            color="secondary"
            fullWidth
            id="name"
            label="Symptom Name"
            autoComplete='off'
            required
            {...formik.getFieldProps('name')}
            error={(formik.touched.name && !!formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ mb: 4 }}
          />

          <Stack direction="row" alignItems="flex-end" sx={{ mb: 4 }} spacing={2}>
            <label htmlFor="avatar-input">
              <Button variant="outlined" component="span" sx={{ justifyContent: 'center' }} startIcon={<AddAPhotoIcon />}>
                Upload Photo
              </Button>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.avif,.gif"
                id="avatar-input"
                onChange={(e) => { e.preventDefault(); handleAvatarChange(e); }}
                hidden
              />
              {formik.touched.image && formik.errors.image && !isImageTouched && (
                <Typography color="error" sx={{ mx: '14px', mt: '3px', fontSize: '1.2rem' }}>{formik.errors.image}</Typography>
              )}
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

          <ReactQuill
            id="description"
            required
            theme="snow"
            value={formik.values.description}
            onChange={(value) => formik.setFieldValue('description', value)}
            placeholder="Any description type here...."
            sx={{ mt: 1 }}

          />
          
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {props.symptomId ? 'Update' : 'Add'}
          </Button>
        </form>
      </>
    </Container>
  );
};

export default SymptomForm;   