import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState, forwardRef, lazy } from 'react';
import { useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import CalendarHeader from './CalendarHeader';
import CalendarAppSidebar from './CalendarAppSidebar';
import CalendarAppEventContent from './CalendarAppEventContent';

import { Slide, Dialog, Container } from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Slots = lazy(() => import('./dialogs/Slots'));
import { appointmentAPIConfig } from '../../API/apiConfig';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

import { useParams, useNavigate } from 'react-router-dom';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& a': {
    color: `${theme.palette.text.primary}!important`,
    textDecoration: 'none!important',
  },
  '&  .fc-media-screen': {
    minHeight: '100%',
    width: '100%',
  },
  '& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
    borderColor: `${theme.palette.divider}!important`,
  },
  '&  .fc-scrollgrid-section > td': {
    border: 0,
  },
  '& .fc-daygrid-day': {
    '&:last-child': {
      borderRight: 0,
    },
  },
  '& .fc-col-header-cell': {
    borderWidth: '0 1px 0 1px',
    padding: '8px 0 0 0',
    '& .fc-col-header-cell-cushion': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: 12,
      textTransform: 'uppercase',
    },
  },
  '& .fc-view ': {
    '& > .fc-scrollgrid': {
      border: 0,
    },
  },
  '& .fc-daygrid-day.fc-day-today': {
    backgroundColor: 'transparent!important',
    '& .fc-daygrid-day-number': {
      borderRadius: '100%',
      backgroundColor: `${theme.palette.secondary.main}!important`,
      color: `${theme.palette.secondary.contrastText}!important`,
    },
  },
  '& .fc-daygrid-day-top': {
    justifyContent: 'center',

    '& .fc-daygrid-day-number': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 26,
      height: 26,
      margin: '4px 0',
      borderRadius: '50%',
      float: 'none',
      lineHeight: 1,
    },
  },
  '& .fc-h-event': {
    background: 'initial',
  },
  '& .fc-event': {
    border: 0,
    padding: '0 ',
    fontSize: 12,
    margin: '0 6px 4px 6px!important',
  },
}));

function AppointmentsApp(props) {
  const routeParams = useParams();
  const [currentDate, setCurrentDate] = useState();
  const [doctorData, setDoctorData] = useState(null)
  const [patientData, setPatientData] = useState(null)
  const [events, setEvents] = useState([])
  const [getEvents, setGetEvents] = useState('monthly');
  const [appointmentId, setAppointmentId] = useState(null)
  const [booked, setBooked] = useState(null)
  const [slots, setSlots] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    appointmentType: '',
    price: '',
    paymentMode: '',
    transactionGatewayId: '',
    userRemark: ''
  });

  useEffect(() => {
    if (doctorData && currentDate) {
      if (getEvents !== "monthly") {
        axios.get(appointmentAPIConfig.getWeekEvents, {
          params: { startDate: currentDate.start, endDate: currentDate.end, doctorId: doctorData._id },
          headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            setEvents(response.data.data)
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        })
      } else if (getEvents === "monthly") {
        axios.get(appointmentAPIConfig.getAllEvents, {
          params: { date: currentDate.start, doctorId: doctorData._id },
          headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            setEvents(response.data.data)
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        })
      }
    }

  }, [currentDate, doctorData, booked])

  useEffect(() => {
    const { appointmentId } = routeParams;
    if (appointmentId != "new") {
      setAppointmentId(appointmentId)
      axios.get(`${appointmentAPIConfig.appointmentByID}/${appointmentId}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 201) {
          setDoctorData({ id: response.data.data.doctorId._id, ...response.data.data.doctorId })
          setPatientData(response.data.data.patientId)
          setPaymentData({
            appointmentType: _.get(response, 'data.data.appointmentType'),
            price: _.get(response, 'data.data.price'),
            paymentMode: _.get(response, 'data.data.paymentMode'),
            transactionGatewayId: _.get(response, 'data.data.transactionGatewayId'),
            userRemark: _.get(response, 'data.data.userRemark')
          })
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })

    }
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const calendarRef = useRef();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [
    leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const theme = useTheme();

  useEffect(() => {
  }, [dispatch]);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    setTimeout(() => {
      calendarRef.current?.getApi()?.updateSize();
    }, 300);
  }, [leftSidebarOpen]);

  const handleDateSelect = (selectInfo) => {
    if (!patientData) {
      dispatch(showMessage({ message: "Select patient first" }));
      return
    }
    if (!doctorData) {
      dispatch(showMessage({ message: "Select doctor first" }));
      return
    }

    if (selectInfo.start.getTime() < new Date().getTime()) {
      dispatch(showMessage({ message: "You can not book appointment past date!" }));
      return
    }
    getSlots(selectInfo.startStr, doctorData.doctorId)
  };

  useEffect(() => {
    if (slots) {
      handleClickOpen(true)
    }
  }, [slots])

  const getSlots = (startStr, id) => {
    axios.get(appointmentAPIConfig.getSlots, {
      params: { date: startStr, doctorId: id },
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 201) {
        setSlots(response.data.data)
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }

  const bookSlot = (slotBookData) => {
    if (!patientData) {
      dispatch(showMessage({ message: "Select patient first" }));
      return
    }
    if (!doctorData) {
      dispatch(showMessage({ message: "Select doctor first" }));
      return
    }

    const { type, appointmentId } = routeParams;
    const formData = new FormData();
    formData.append('doctorId', slotBookData.doctorId);
    formData.append('patientId', slotBookData.patientId);
    formData.append('date', slotBookData.date);
    formData.append('slot', slotBookData.slot);
    formData.append('appointmentType', slotBookData.appointmentType);

    if (type === "edit") {
      axios.put(`${appointmentAPIConfig.rescheduleAppointment}/${appointmentId}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 201) {
          dispatch(showMessage({ message: response.data.message }));
          setDoctorData(null)
          setPatientData(null)
          setPaymentData(null)
          setEvents([])
          setBooked(response.data.data)
          navigate('/apps/appointment')
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    } else {
      axios.post(appointmentAPIConfig.bookAppointment, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 201) {
          dispatch(showMessage({ message: response.data.message }));
          setDoctorData(null)
          setPatientData(null)
          setPaymentData(null)
          setEvents([])
          setBooked(response.data.data)
          navigate('/apps/appointment')
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  };

  const handleEventDrop = (eventDropInfo) => {
  };

  const handleEventClick = (clickInfo) => {
    if (!patientData) {
      dispatch(showMessage({ message: "Select patient first" }));
      return
    }

    if (!doctorData) {
      dispatch(showMessage({ message: "Select doctor first" }));
      return
    }

    if (clickInfo.event.start.getTime() < new Date().getTime()) {
      dispatch(showMessage({ message: "You can not book appointment past date!" }));
      return
    }
    getSlots(clickInfo.event.start, doctorData._id);
  };

  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };

  const handleEventAdd = (addInfo) => { };

  const handleEventChange = (changeInfo) => { };

  const handleEventRemove = (removeInfo) => { };

  function handleToggleLeftSidebar() {
    setLeftSidebarOpen(!leftSidebarOpen);
  }

  return (
    <>
      <Root
        header={

          <CalendarHeader
            calendarRef={calendarRef}
            currentDate={currentDate}
            onToggleLeftSidebar={handleToggleLeftSidebar}
            setGetEvents={setGetEvents}
          />
        }

        content={
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            timeZone='UTC'
            headerToolbar={false}
            initialView="dayGridMonth"
            editable
            selectable
            selectMirror
            dayMaxEvents
            weekends
            datesSet={handleDates}
            select={handleDateSelect}
            events={events}
            eventContent={(eventInfo) => <CalendarAppEventContent eventInfo={eventInfo} />}
            eventClick={handleEventClick}
            eventAdd={handleEventAdd}
            eventChange={handleEventChange}
            eventRemove={handleEventRemove}
            eventDrop={handleEventDrop}
            initialDate={new Date()}
            ref={calendarRef}
            slotMinTime="09:00:00"
            slotMaxTime="21:00:00"
          />
        }
        leftSidebarContent={
          <CalendarAppSidebar
            setPatientData={setPatientData}
            patientData={patientData}
            setDoctorData={setDoctorData}
            doctorData={doctorData}
            appointmentId={appointmentId}
          />}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarOnClose={() => setLeftSidebarOpen(false)}
        leftSidebarWidth={240}
        scroll="content"
      />



      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="md"
        >

          <Container maxWidth="md" sx={{ paddingTop: 5, paddingBottom: 5 }}>
            <Slots slots={slots} patientData={patientData} doctorData={doctorData} paymentData={paymentData} setPaymentData={setPaymentData} bookSlot={bookSlot} />
          </Container>
        </Dialog>
      </div>
    </>
  );
}

export default AppointmentsApp;