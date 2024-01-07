import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DoneIcon from '@mui/icons-material/Done';
import { Button, Slide, Box, Modal } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, forwardRef } from 'react';
import SelectDoctor from './dialogs/SelectDoctor';
import SelectPatient from './dialogs/SelectPatient';
import SubscriptionRegisterForm from '../subscription/SubscriptionRegistrationForm';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  maxHeight: '650px',
  overflow: 'auto'
};

function CalendarAppSidebar(props) {
  const [openPatient, setOpenPatient] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePatientClickOpen = () => {
    setOpenPatient(true);
  };

  const handlePatientClickClose = () => {
    setOpenPatient(false);
  };

  const handleSubscribeClickOpen = () => {
    setSubscribe(true);
  };

  const handleSubscribeClickClose = () => {
    setSubscribe(false);
  };

  const handleSubClose = () => {
    setSubscribe(false)
  };




  return (
    <>
      <div className="flex flex-col flex-auto min-h-full p-32">
        <motion.span
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="pb-24 text-4xl font-extrabold tracking-tight"
        >
          Appointment
        </motion.span>
        <div className="group flex items-center justify-between mb-12">
          <Button
            className=""
            disabled={!!props.appointmentId}
            onClick={() => handlePatientClickOpen()}
            variant="contained"
            color={(props.patientData) ? "success" : "secondary"}
            startIcon={(props.patientData) ? <DoneIcon /> : <FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            {(props.patientData) ? " Patient Selected" : "Select Patient"}
          </Button>
        </div>

        <div className="group flex items-center justify-between mb-12" >
          <Button
            className=""
            onClick={() => handleClickOpen()}
            variant="contained"
            color={(props.doctorData) ? "success" : "secondary"}
            startIcon={(props.doctorData) ? <DoneIcon /> : <FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            {(props.doctorData) ? " Doctor Selected" : "Select Doctor"}
          </Button>
        </div>
        {(props?.patientData && _.get(props, 'doctorData.doctorType') === 'Kapeefit') &&
          <div className="group flex items-center justify-between mb-12" >
            <Button
              className=""
              onClick={handleSubscribeClickOpen}
              variant="contained"
              color={(props.patientData?.status == "subscribed") ? "success" : "secondary"}
              startIcon={(props.patientData?.status == "subscribed") ? <DoneIcon /> : <FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
            >
              {(props.patientData?.status == "subscribed") ? "R-Membership" : "N-Membership"}
            </Button>
          </div>
        }


        {props.patientData && <div>
          <div style={{ height: '1px', backgroundColor: 'black' }} />
          <div>
            <h4 className="text-lg md:text-24 font-extrabold tracking-tight">Patient Details</h4>
            <label className="text-lg">N: {props.patientData?.name}</label>
            <br />
            <label className="text-lg">M: {props.patientData?.mobile}</label>
            <br />
            <label className="text-lg">S: {props.patientData?.status}</label>
            <br />
            <label className="text-lg">F: {props.patientData?.freeAppointment}</label>
          </div>
        </div>
        }
        {props.doctorData && <div>
          < div style={{ height: '1px', backgroundColor: 'black' }} />
          <div>
            <h4 className="text-lg md:text-24 font-extrabold tracking-tight">Doctor Details</h4>
            <label className="text-lg">N: {props.doctorData?.name}</label>
            <br />
            <label className="text-lg">S: {props.doctorData?.specialization}</label>
            <br />
            <label className="text-lg">M: {props.doctorData?.mobile}</label>
            <br />
            <label className="text-lg">F: {props.doctorData?.publishedFee}</label>
          </div>
        </div>
        }
      </div>



      <div>
        <Modal
          open={openPatient}
          onClose={handlePatientClickClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box sx={style} style={{ minHeight: '350px' }}>
            <SelectPatient setPatientData={props.setPatientData} setOpenPatient={setOpenPatient} />
          </Box>
        </Modal>
      </div >

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box sx={style}>
            <SelectDoctor setDoctorData={props.setDoctorData} setOpen={setOpen} />
          </Box>
        </Modal>

        <Modal
          open={subscribe}
          onClose={handleSubscribeClickClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box sx={style}>
            <SubscriptionRegisterForm patientData={props.patientData} setOpen={setSubscribe} open={subscribe} />
          </Box>
        </Modal>
      </div>
    </>
  );
}


export default CalendarAppSidebar;