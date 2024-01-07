import React, { useState, useEffect, forwardRef } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Button, Container, Dialog, DialogActions, Box, Paper, Grid, Slide, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoctorAppointmentForm from './DoctorAppoitmentForm';
import { useParams } from 'react-router-dom';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Slots(props) {
  console.log(props)
  const routeParams = useParams();
  const [slotBook, setSlotBook] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPaymentOption, setOpenPaymentOption] = useState(false);
  const [openDoctorForm, setOpenDoctorForm] = useState(false);
  const { appointmentId } = routeParams;

  const handleClickOpen = (slotData) => {
    if (appointmentId === "new") {
      setOpenPaymentOption(true);
      setSlotBook(slotData);
    } else {
      setOpen(true);
      setSlotBook(slotData);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function createSlotBook() {
    if (slotBook) {
      try {
        await props.bookSlot({
          doctorId: props.slots?._id,
          patientId: props.patientData?._id,
          date: props.slots?.date,
          slot: slotBook.slot,
          appointmentType: props?.paymentData?.appointmentType
        });

        handleClose();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handlePaymentOptionClose = () => {
    setOpenPaymentOption(!openPaymentOption);
  }

  const handlePaymentOption = (type) => {
    if (type === "membership") {
      props.setPaymentData({ ...props.paymentData, appointmentType: 'membership' });
      setOpen(true);
    } else {
      props.setPaymentData({ ...props.paymentData, appointmentType: 'paid' });
      setOpenDoctorForm(true);
    }
    setOpenPaymentOption(!openPaymentOption);
  }

  const handleDoctorFormClose = () => {
    setOpenDoctorForm(false);
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-start justify-between py-32 px-24 md:px-32">
        <div>
          <h4 className="text-lg md:text-24 font-extrabold tracking-tight">Slot</h4>
          <label className="text-lg">Date: {props.slots?.date}</label>
          <br />
          <label className="text-lg">Day: {props.slots?.day}</label>
        </div>
        <div>
          <h4 className="text-lg md:text-24 font-extrabold tracking-tight">Doctor Details</h4>
          <label className="text-lg">Name: {props.slots?.name}</label>
          <br />
          <label className="text-lg">Specialization: {props.slots?.specialization}</label>
          <br />
          <label className="text-lg">Mobile: {props.slots?.mobile}</label>
          <br />
        </div>

        <div>
          <h4 className="text-lg md:text-24 font-extrabold tracking-tight">Patient Details</h4>
          <label className="text-lg">Name: {props.patientData?.name}</label>
          <br />
          <label className="text-lg">Mobile: {props.patientData?.mobile}</label>
          <br />
          <label className="text-lg">Status: {props.patientData?.status}</label>
          <br />
          <label className="text-lg">FreeSlot: {props.patientData?.freeAppointment}</label>
        </div>
      </div>

      <div style={{ flex: 1, height: '1px', backgroundColor: 'black' }} />
      <br />
      <Box sx={{ flexGrow: 2 }}>
        <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 8, md: 18 }}>
          {props.slots?.slots.map((data, index) => (
            <Grid item xs={2} sm={3} md={3} key={index}>
              <Button
                variant="contained"
                color="success"
                disabled={!data.active}
                onClick={() => {
                  handleClickOpen(data);
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'blue',
                    boxShadow: 'none',
                  },
                }}
              >
                {data.slot}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={openPaymentOption}
        TransitionComponent={Transition}
        keepMounted
        onClose={handlePaymentOptionClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Select from below option to book appointment slot`}</DialogTitle>
        <DialogActions sx={{ mx: 1, my: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handlePaymentOption('membership')}
            disabled={props?.doctorData?.doctorType !== 'Kapeefit_Doctor_Membership' && props?.doctorData?.doctorType !== 'Kapeefit_Doctor_Paid_And_Membership'}
          >
            Pay through membership
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handlePaymentOption('paid')}
            disabled={props?.doctorData?.doctorType !== 'Kapeefit_Doctor_Paid' && props?.doctorData?.doctorType !== 'Kapeefit_Partner' && props?.doctorData?.doctorType !== 'Kapeefit_Doctor_Paid_And_Membership'}
          >
            Pay without membership
          </Button>

        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Do you want to book ${slotBook?.slot} slot?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={createSlotBook} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDoctorForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDoctorFormClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogActions>
          <IconButton
            onClick={() => {
              handleDoctorFormClose();
            }}
            sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <Container maxWidth="md" sx={{ paddingTop: 5, paddingBottom: 5 }}>
          <DoctorAppointmentForm
            slots={props.slots}
            patientData={props.patientData}
            paymentData={props.paymentData}
            doctorData={props.doctorData}
            setPaymentData={props.setPaymentData}
            slotBook={slotBook}
            open={openDoctorForm}
            setOpen={setOpenDoctorForm}
          />
        </Container>
      </Dialog>
    </>
  );
}
