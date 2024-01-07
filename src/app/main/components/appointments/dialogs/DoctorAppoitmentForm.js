import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Container, TextField, Typography, Button } from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { paymentModeAPIConfig, appointmentAPIConfig } from 'src/app/main/API/apiConfig';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const DoctorAppointmentForm = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentList, setPaymentList] = useState([]);

  useEffect(() => {
    axios
      .get(paymentModeAPIConfig.list, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setPaymentList(response.data.data);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
  }, []);

  useEffect(() => {
    formik.setValues({ ...formik.values, price: props?.slots?.fee });
  }, [props?.slots]);

  const validationSchema = Yup.object().shape({
    transactionGatewayId: Yup.string().min(10, "Not negative number").max(60, "Not Positive number").required('Transaction id is required'),
    paymentMode: Yup.string().required('Payment mode is required'),
    price: Yup.number().required('Price is required')
  });

  const handleSubmit = (values) => {
    if (props?.slotBook?.slot && props?.slots?.date) {
      const formData = new FormData();
      formData.append('patientId', _.get(props, 'patientData._id'));
      formData.append('doctorId', _.get(props, 'doctorData._id'));
      formData.append('date', _.get(props, 'slots.date'));
      formData.append('slot', _.get(props, 'slotBook.slot'));
      formData.append('appointmentType', props?.paymentData?.appointmentType);
      formData.append('transactionGatewayId', values.transactionGatewayId);
      formData.append('paymentMode', values.paymentMode);
      formData.append('userRemark', values.userRemark);
      formData.append('price', values.price);

      axios.post(appointmentAPIConfig.bookAppointment, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 201) {
          dispatch(showMessage({ message: response.data.message }));
          formik.resetForm();
          navigate('/apps/appointment')
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    } else {
      dispatch(showMessage({ message: 'Select slot again', variant: 'error' }));
    }
  };

  const formik = useFormik({
    initialValues: {
      transactionGatewayId: '',
      paymentMode: '',
      userRemark: '',
      price: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  });

  return (
    <Container maxWidth="md">
      <>
        <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
          Appointment Form
        </Typography>

        <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
          <TextField
            required
            autoFocus
            select
            variant="outlined"
            color="secondary"
            fullWidth
            id="paymentMode"
            label="Payment Mode"
            name="paymentMode"
            {...formik.getFieldProps('paymentMode')}
            sx={{ mb: 2 }}
            error={(formik.touched.paymentMode && !!formik.errors.paymentMode)}
            helperText={formik.touched.paymentMode && formik.errors.paymentMode}
          >
            {paymentList.map((paymentMode) => (
              <MenuItem key={paymentMode._id} value={paymentMode.name}>
                {paymentMode.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            type="text"
            variant="outlined"
            color="secondary"
            fullWidth
            id="transactionGatewayId"
            label="Transaction Id"
            name="transactionGatewayId"
            {...formik.getFieldProps('transactionGatewayId')}
            error={(formik.touched.transactionGatewayId && !!formik.errors.transactionGatewayId)}
            helperText={formik.touched.transactionGatewayId && formik.errors.transactionGatewayId}
            sx={{ mb: 2 }}
          />


          <ReactQuill
            id="userRemark"
            required
            theme="snow"
            value={formik.values.userRemark}
            onChange={(value) => formik.setFieldValue('userRemark', value)}
            placeholder="Any Remark type here...."

          />


          <Box sx={{ width: 700, maxWidth: '150%', marginBottom: 10 }}>
            <TextField
              type="number"
              id="price"
              label="Amount"
              variant="standard"
              name="price"
              disabled
              {...formik.getFieldProps('price')}
              error={(formik.touched.price && !!formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              
            />
          </Box>
          <Button variant="contained" color="secondary" fullWidth type="submit">
            Book Appointment
          </Button>
        </form>
      </>
    </Container>
  );
}
export default DoctorAppointmentForm;