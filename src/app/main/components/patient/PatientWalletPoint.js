import { TextField, Button, Container, Stack, Typography, IconButton, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import { patientAPIConfig } from '../../API/apiConfig';
import CloseIcon from '@mui/icons-material/Close';

const PatientWalletPoint = (props) => {
  const dispatch = useDispatch();
  const [walletData, setWalletData] = useState({
    availablePoints: '',
    point: '',
    remark: '',
    transactionType: ''
  });

  useEffect(() => {
    return () => {
      formik.resetForm();
    }
  }, []);

  useEffect(() => {
    if (props.patientId) {
      axios.get(`${patientAPIConfig.getAccount}/${props.patientId}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setWalletData(response.data.data);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  }, [props.patientId]);

  useEffect(() => {
    if (walletData) {
      formik.setValues({
        availablePoints: walletData.points || 0,
        point: '',
        remark: '',
        transactionType: ''
      });
    } else {
      formik.resetForm();
    }
  }, [walletData]);

  const handleSubmit = (values) => {
    console.warn(values.transactionType, "******");
    const formData = new FormData();
    formData.append('point', values.point);
    formData.append('remark', values.remark);
    formData.append('transactionType', values.transactionType);
    formData.append('patientId', props.patientId);

    axios.post(patientAPIConfig.walletPonit, formData, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 201) {
        formik.resetForm();
        props.setChange(!props.change);
        dispatch(showMessage({ message: "Points updated successfully", variant: 'success' }));
        props.setOpen(false);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  };

  const validationSchema = Yup.object().shape({
    point: Yup.number().required(' point is required'),
    remark: Yup.string().required('remark  is required'),
    transactionType: Yup.string().required('transaction Type is required'),
  });

  const formik = useFormik({
    initialValues: {
      availablePoints: '',
      point: '',
      remark: '',
      transactionType: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    props.setOpen(false);
    props.setOpen(false);
  };

  return (
    <Container maxWidth="md">
      <React.Fragment>
        <IconButton onClick={() => { props.setOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="600" fontSize="2rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
          {'Do you want to published with these wallet Amount?'}
        </Typography>

        <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
          <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
            <TextField
              type="number"
              variant="outlined"
              color="secondary"
              fullWidth
              required
              disabled
              id="availablePoints"
              label="Available Points"
              {...formik.getFieldProps('availablePoints')}
              error={formik.touched.availablePoints && formik.errors.availablePoints}
              helperText={formik.touched.availablePoints && formik.errors.availablePoints}
              onChange={(e) => {
                if (e.target.value < 0)
                  return;
                formik.getFieldProps('availablePoints').onChange(e);
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              color="secondary"
              fullWidth
              required
              id="point"
              label="Points to be credit/debit"
              {...formik.getFieldProps('point')}
              error={formik.touched.point && formik.errors.point}
              helperText={formik.touched.point && formik.errors.point}
              onChange={(e) => {
                if (e.target.value < 0)
                  return;
                formik.getFieldProps('point').onChange(e);
              }}
            />
            <TextField
              type="string"
              variant="outlined"
              color="secondary"
              fullWidth
              required
              id="remark"
              label="Remark"
              {...formik.getFieldProps('remark')}
              error={formik.touched.remark && formik.errors.remark}
              helperText={formik.touched.remark && formik.errors.remark}
              inputProps={{ min: 0 }}
              onChange={(e) => {
                if (e.target.value < 0)
                  return;
                formik.getFieldProps('remark').onChange(e);
              }}
            />
            <TextField
              select
              variant="outlined"
              color="secondary"
              fullWidth
              id="transactionType "
              label="Transaction Type "
              required
              {...formik.getFieldProps('transactionType')}
              error={(formik.touched.transactionType && !!formik.errors.transactionType)}
              helperText={formik.touched.transactionType && formik.errors.transactionType}
            >
              <MenuItem value={"debit"}>Debit</MenuItem>
              <MenuItem value={"credit"}>Credit</MenuItem>
            </TextField>
          </Stack>

          <Button onClick={handleClose} fontWeight="600" fontSize="2rem">No</Button>
          <Button type="submit"
            variant="contained"
            fontWeight="600" fontSize="2rem"
            color="secondary" autoFocus>
            Yes
          </Button>
        </form>
      </React.Fragment>
    </Container>
  );
};

export default PatientWalletPoint;
