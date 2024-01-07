import { TextField, Typography, Modal, Box, Container, Button, Link, InputAdornment, IconButton } from '@mui/material'
import React, { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { patientAPIConfig } from 'src/app/main/API/apiConfig';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useFormik } from 'formik';
import PatientRegisterForm from '../../patient/patientRegisterForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxWidth: '1200px',
  maxHeight: '500px',
  overflow: 'auto'
};

function SelectPatient(props) {

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [mobile, setMobile] = useState("");
  const [numerr, setNumERR] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [searchedData, setSearchedData] = useState({
    name: '',
    mobile: ''
  });

  useEffect(() => {
    return () => {
      formik.resetForm();
    }
  }, []);

  useEffect(() => {
    if (searchedData) {
      formik.setValues({
        name: searchedData.name || '',
        mobile: searchedData.mobile || ''
      });
    } else {
      formik.resetForm();
    }
  }, [searchedData]);

  const confirmHandle = () => {
    if (searchedData) {
      props.setPatientData(searchedData);
      props.setOpenPatient(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: ''
    },
    onSubmit: confirmHandle,
  });

  function getPatientDetail(mobile) {

    let item = mobile;
    if (item.length !== 10) {
      setNumERR(true);
      return;
    } else {
      setNumERR(false);
    }
    setMobile(item)
    axios.get(`${patientAPIConfig.getPatientByMobile}/${mobile}`, {

      headers: {
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {

      if (!response.data.data) {
        setErrMsg(true);
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        setSearchedData({});
        props.setPatientData(null);
      } else {
        setErrMsg(false);
        setSearchedData(response.data.data);
      }

    })
  }

  const keyDownHandler = (e) => {
    ((e.code === "Enter" || e.code === "NumpadEnter") && e.target.value.length === 10) && getPatientDetail(mobile)
  }

  return (
    <Container>
      <IconButton onClick={() => { props.setOpenPatient(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
        Select Patient
      </Typography>
      <div className="group flex items-center justify-between mb-12">
        <Box
          sx={{
            width: 500,
            maxWidth: '100%',
          }}
        >
          <TextField
            autoFocus
            fullWidth
            label="Patient Mobile"
            id="fullWidth"
            onChange={(e) => setMobile(e.target.value)}
            onKeyDown={keyDownHandler}
            InputProps={{
              endAdornment: (
                <InputAdornment style={{ cursor: 'pointer' }} position="end" size="small" onClick={() => getPatientDetail(mobile)}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
         {numerr ? <span style={{ fontSize: "1.2rem", marginTop: "5px", marginRight: "130px", color: "danger" }}>mobile number must be 10 digit</span> : ""}
        </Box>
      </div>

      {
        (searchedData && !errMsg) && <Box
          sx={{
            maxWidth: '100%',
            height: 100,
          }}
        >
          <form onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
            <Box sx={{ mb: 2, mt: 1 }}>
              <TextField
                type="text"
                fullWidth
                variant="outlined"
                label="Name"
                id="name"
                {...formik.getFieldProps('name')}
                disabled={true}
              />
            </Box>
            <Box sx={{ mb: 2, mt: 1 }}>
              <TextField
                type="text"
                fullWidth
                variant="outlined"
                label="Mobile"
                id="mobile"
                {...formik.getFieldProps('mobile')}
                disabled={true}
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ mb: 2, mt: 1 }}
            >
              Confirm
            </Button>
          </form>
        </Box>
      }

      {
        (!Object.keys(searchedData).length && errMsg && !numerr) &&
        <Box
          sx={{
            maxWidth: '100%',
            height: 100,
          }}
        >
          <Button
            className=""
            component={Link}
            onClick={() => setOpen(true)}
            variant="contained"
            color="secondary"
            fullWidth
            disabled={!mobile}
          >
            Register Patient
          </Button>
        </Box>
      }

      {
        open &&

        <Modal
          open={open}
          onClose={props.setOpenPatient(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <PatientRegisterForm mobile={mobile} setOpen={setOpen} setSearchedData={props.setPatientData} />
          </Box>
        </Modal>

      }
    </Container >
  )

}
export default SelectPatient;