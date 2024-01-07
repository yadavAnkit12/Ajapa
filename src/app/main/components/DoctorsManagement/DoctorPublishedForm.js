import { TextField, Button, Container, Stack, Typography, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import { doctorAPIConfig } from '../../API/apiConfig';
import CloseIcon from '@mui/icons-material/Close';

const DoctorPublishedForm = (props) => {
  const dispatch = useDispatch();
  const [doctorData, setDoctorData] = useState({
    fee: '',
    publishedFee: ''
  });

  useEffect(() => {
    return () => {
      formik.resetForm();
    }
  }, []);

  useEffect(() => {
    if (props.docId) {
      axios.get(`${doctorAPIConfig.getDoctorbyId}/${props.docId}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setDoctorData(response.data.data);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  }, [props.docId]);

  useEffect(() => {
    if (doctorData) {
      formik.setValues({
        fee: doctorData.fee || '0',
        publishedFee: doctorData.publishedFee || '0'
      });
    } else {
      formik.resetForm();
    }
  }, [doctorData]);

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('fee', values.fee);
    formData.append('publishedFee', values.publishedFee);
    axios.put(`${doctorAPIConfig.updateFee}/${props.docId}`, formData, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        formik.resetForm();
        props.setChange(!props.change);
        dispatch(showMessage({ message: "Doctor published successfully", variant: 'success' }));
        props.setEditOpen(false);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  };

  const validationSchema = Yup.object().shape({
    fee: Yup.number().required('Fee is required'),
    publishedFee: Yup.number().required('Published Fee is required'),
  });

  const formik = useFormik({
    initialValues: {
      fee: '',
      publishedFee: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    props.setEditOpen(false);
    props.setEditOpen(false);
  };

  return (
    <Container maxWidth="md">
      <React.Fragment>
        <IconButton onClick={() => { props.setEditOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="600" fontSize="2rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
          {'Do you want to published with these fees?'}
        </Typography>

        <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
          <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
            <TextField
              type="number"
              variant="outlined"
              color="secondary"
              fullWidth
              id="fee"
              label="Fee"
              {...formik.getFieldProps('fee')}
              error={formik.touched.fee && formik.errors.fee}
              helperText={formik.touched.fee && formik.errors.fee}
              onChange={(e) => {
                if (e.target.value < 0)
                  return;
                formik.getFieldProps('fee').onChange(e);
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              color="secondary"
              fullWidth
              id="publishedFee"
              label="Published Fee"
              {...formik.getFieldProps('publishedFee')}
              error={formik.touched.publishedFee && formik.errors.publishedFee}
              helperText={formik.touched.publishedFee && formik.errors.publishedFee}
              inputProps={{ min: 0 }}
              onChange={(e) => {
                if (e.target.value < 0)
                  return;
                formik.getFieldProps('publishedFee').onChange(e);
              }}
            />
          </Stack>


          <Button onClick={handleClose}>No</Button>
          <Button type="submit"
            variant="contained"
            color="secondary" autoFocus>
            Yes
          </Button>
        </form>
      </React.Fragment>
    </Container>
  );
};

export default DoctorPublishedForm;
