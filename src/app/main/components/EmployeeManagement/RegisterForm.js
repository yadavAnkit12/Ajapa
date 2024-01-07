import { TextField, Button, Container, Stack, Avatar, Typography, MenuItem, Box, IconButton } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from '@mui/icons-material/Close';

import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';

import * as Yup from 'yup';

import axios from "axios";

import { useDispatch } from "react-redux";

import { showMessage } from "app/store/fuse/messageSlice";

import { employeeAPIConfig } from '../../API/apiConfig';
import { min } from 'lodash';

const RegisterForm = (props) => {
  const dispatch = useDispatch();
  const [profileImg, setProfileImg] = useState('');
  const [empData, setEmpData] = useState({
    name: '',
    email: '',
    roleID: '',
    mobile: '',
    gender: '',
    image: null,
    password: '12345678',
    // age: ''
  });
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('');


  useEffect(() => {
    if (props.employeeId) {
      axios.get(`${employeeAPIConfig.getUser}/${props.employeeId}`, {
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
        name: empData.name || '',
        email: empData.email || '',
        role: empData.roleID || '',
        mobile: empData.mobile || '',
        gender: empData.gender || 'male',
        image: empData.image || '',
        password: '12345678',
        // age: empData.age || ''
      });
      setRole(empData.roleID);
    }
  }, [empData]);

  useEffect(() => {
    return () => {
      setEmpData(null);
      formik.resetForm();
    }
  }, [])
  const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name').min(2).max(40).required(),
    email: Yup.string().email('Invalid email address').min(6).max(30).required('Email is required'),
    role: Yup.string().required('Select a role'),
    mobile: Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required('Mobile number is required'),
    // age: Yup.number().min(18, 'Age must be at least 18 years old and above').max(100,'Please enter a correct age').required('Age is required'),

  });

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('roleID', values.role);
    formData.append('mobile', values.mobile);
    formData.append('password', '12345678');
    formData.append('gender', values.gender);
    formData.append('image', values.image || '');
    // formData.append('age', values.age || '');

    if (props.employeeId) {
      axios.put(`${employeeAPIConfig.edit}/${props.employeeId}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          dispatch(showMessage({ message: 'Employee updated successfully', variant: 'success' }));
          formik.resetForm();
          props.setChange(!props.change);
          props.closeHandler(false);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    } else {
      axios.post(employeeAPIConfig.register, formData, {
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
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      roleID: '',
      mobile: '',
      gender: '',
      image: null,
      password: '12345678',
      // age: ''
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

  const handleClick = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
    setEmpData({ ...formik.values, roleID: event.target.value });
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
            id="name"
            label="Name"
            autoComplete='off'
            required
            {...formik.getFieldProps('name')}
            error={(formik.touched.name && !!formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            type="email"
            variant="outlined"
            color="secondary"
            fullWidth
            id="email"
            label="Email"
            autoComplete='off'
            required
            {...formik.getFieldProps('email')}
            error={(formik.touched.email && !!formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2, mt: 1 }}
          />
          {/* <TextField
            type="number"
            variant="outlined"
            color="secondary"
            fullWidth
            id="age"
            label="Age"
            autoComplete='off'
            required
            {...formik.getFieldProps('age')}
            error={(formik.touched.age && !!formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
            sx={{ mb: 2, mt: 1 }}
            onChange={(e) => {
              if (e.target.value < 0)
                return;
              formik.getFieldProps('age').onChange(e);
            }}
          /> */}

          <TextField
            select
            variant="outlined"
            color="secondary"
            fullWidth
            id="role"
            label="Role"
            name="role"
            autoComplete='off'
            required
            open={open}
            value={role}
            onChange={handleChange}
            onClick={handleClick}
            sx={{ mb: 2, mt: 1 }}
          >
            <MenuItem value="">Select Role</MenuItem>
            {/* {props.roleList.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.role}
              </MenuItem>
            ))} */}
            <MenuItem value='6539eca3ac81f794ba885ebf'>Employee</MenuItem>
          </TextField>
          {(formik.touched.role && formik.errors.role) && (
            <span style={{ fontSize: "20", color: "red" }}>{formik.errors.role}</span>
          )}

          <TextField
            type="number"
            variant="outlined"
            color="secondary"
            fullWidth
            id="mobile"
            label="Mobile"
            autoComplete='off'

            required
            {...formik.getFieldProps('mobile')}
            error={(formik.touched.mobile && !!formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
            sx={{ mb: 2, mt: 1 }}
          />

          <Stack direction="row" alignItems="flex-end" sx={{ mb: 4 }} spacing={2}>
            <label htmlFor="avatar-input">
              <Button variant="outlined" component="span" sx={{ justifyContent: 'center' }} startIcon={<AddAPhotoIcon />}>
                Upload Photo
              </Button>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
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

export default RegisterForm;
