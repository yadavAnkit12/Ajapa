import React, { useEffect, useState } from "react";
import { Typography, Autocomplete, TextField, Card } from "@mui/material";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { getEventLevelPermissions, getUserRoles } from 'src/app/auth/services/utils/common';
import { eventAPIConfig, userAPIConfig } from "../../API/apiConfig";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { Box } from "@mui/system";
import FuseLoading from "@fuse/core/FuseLoading";

function SMS() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [value, setValue] = useState("");
  const [smsTemplate, setSMSTemplate] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPermission, setIsPermission] = useState(true)

  const [sendMessageTo, setSendMessageTo] = useState([
    {
      key: 1,
      value: "to all memebers registered",
    },
    {
      key: 2,
      value: "to the head of the families who have registered",
    },
    {
      key: 3,
      value: "to the people currently Marked as Present",
    },
    {
      key: 4,
      value: "to only head of the family those who are marked as Present",
    },
    {
      key: 5,
      value: "to the members attending Shivir",
    },
    {
      key: 6,
      value: "to all the approved users",
    },
    {
      key: 7,
      value: "to all the Head of the families",
    },
  ]);

  useEffect(() => {
    formik.resetForm()
  }, [])

  useEffect(() => {
    axios
      .get(userAPIConfig.smsTemplate, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: ` Bearer ${window.localStorage.getItem("jwt_access_token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSMSTemplate(response?.data?.messageTemplates)
        } else {
          dispatch(showMessage({ message: response.data.errorMessage, variant: "error", }));
        }
      }).catch((error) => {
        setLoading(false)
        dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
      });
  }, []);


  useEffect(() => {
    axios
      .get(eventAPIConfig.allEventList, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: ` Bearer ${window.localStorage.getItem("jwt_access_token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setEvents(response?.data?.data);
        } else {
          dispatch(showMessage({ message: response.data.errorMessage, variant: "error", }));
        }
      }).catch((error) => {
        setLoading(false)
        dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
      });
  }, []);

  const initialValues = {
    check: "",
    event: "",
    smsType: '',
    message: "",
  };

  const validationSchema = yup.object().shape({
    // event: yup.string().required("Please select the event"),
    check: yup.string().required("Please select the check"),
    message: yup
      .string()
      .required("Please enter the message.")
      .max(160, "Message can have atmost 160 characters."),
  });

  const handleSubmit = (values) => {
    if (!isPermission) {
      return dispatch(showMessage({ message: `You don't have permission`, variant: "error" }))

    }
    if ((value !== 6 && value !== 7) && selectedEventId === "") {
      return dispatch(showMessage({ message: 'Please select an event', variant: "error" }))
    }

    let event = value === 6 || value === 7 ? 0 : selectedEventId
    setLoading(true)
    axios.post(`${userAPIConfig.sendSMS}/${event}/${value}/${values.message}`,
      {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${window.localStorage.getItem("jwt_access_token")}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          formik.resetForm()
          setLoading(false)
          dispatch(showMessage({ message: response.data.message, variant: "success" }));
          formik.resetForm()
        } else {
          setLoading(false)
          dispatch(showMessage({ message: response.data.errorMessage, variant: "error" }));
        }
      }).catch(() => {
        setLoading(false)
        dispatch(showMessage({ message: 'Something went wrong', variant: "error" }));

      })
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });
  useEffect(() => {
    if (formik.values.event && getUserRoles() === 'Admin') {
      const permissionList = getEventLevelPermissions()
      const validateAdmin = permissionList.find((permission) => permission.eventId === events.find((event) => event.eventName === formik.values.event).eventId)
      if (validateAdmin && validateAdmin.cansendSMS) {
        setIsPermission(true)
      } else {
        dispatch(showMessage({ message: `You don't have permission`, variant: "error" }))
        setIsPermission(false)
      }
    }
  }, [formik.values.event])

  if (loading) {
    return <FuseLoading />
  }

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Card className='shadow-5' sx={{ padding: { md: '16px 64px', sm: '16px' }, margin: '0 auto', maxWidth: '700px' }}>

        <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
          SMS
        </Typography>
        <form className="flex flex-col" onSubmit={formik.handleSubmit}>
          <Autocomplete
            options={sendMessageTo.map((item) => item.value)}
            value={formik.values.check}
            onChange={(event, newValue) => {
              const selectedValue = sendMessageTo.find((item) => item.value === newValue)?.key;
              setValue(selectedValue);
              formik.setFieldValue("check", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="check"
                label="Check"
                sx={{ mb: 2, mt: 2, width: "100%" }}
                className="max-w-md"
                variant="outlined"
                required
                onBlur={formik.handleBlur}
                error={formik.touched.check && Boolean(formik.errors.check)}
                helperText={formik.touched.check && formik.errors.check}
              />
            )}
          />
          {!(value === 6 || value === 7) && <Autocomplete
            options={events.length > 0 ? events.map((event) => event.eventName) : []}
            value={formik.values.event}
            onChange={(event, newValue) => {
              const selectedEvent = events.find((selected) => selected.eventName === newValue)?.eventId;
              setSelectedEventId(selectedEvent);
              formik.setFieldValue("event", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="event"
                label="Event"
                sx={{ mb: 2, width: "100%" }}
                className="max-w-md"
                variant="outlined"
                onBlur={formik.handleBlur}
                error={formik.touched.event && Boolean(formik.errors.event)}
                helperText={formik.touched.event && formik.errors.event}
              />
            )}
          />}
          <Autocomplete
            options={smsTemplate.length > 0 ? smsTemplate.map((sms) => sms.title) : []}
            value={formik.values.sms}
            onChange={(event, newValue) => {
              formik.setFieldValue('sms', newValue)
              formik.setFieldValue('message', smsTemplate.find((sms) => sms.title === newValue).message)

            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="sms"
                label="SMS Type"
                sx={{ mb: 2, width: "100%" }}
                className="max-w-md"
                variant="outlined"
                required
                onBlur={formik.handleBlur}
              // error={formik.touched.event && Boolean(formik.errors.event)}
              // helperText={formik.touched.event && formik.errors.event}
              />
            )}
          />
          <TextField
            label="Type Your Message"
            name="message"
            variant="outlined"
            sx={{ mb: 2, width: "100%" }}
            className="max-w-md"
            type="text"
            required
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.message && Boolean(formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
            multiline
            rows={3}
          />

          <Button
            variant="contained"
            color="secondary"
            className="m-10"
            aria-label="Register"
            onClick={formik.handleSubmit}
          >
            Send SMS
          </Button>

        </form>
      </Card>
    </Box>
  );
}

export default SMS;
