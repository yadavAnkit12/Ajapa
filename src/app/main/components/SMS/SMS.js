import React, { useEffect, useState } from "react";
import { Typography, Autocomplete, TextField } from "@mui/material";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { eventAPIConfig, userAPIConfig } from "../../API/apiConfig";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { Message } from "@mui/icons-material";

function SMS() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [value, setValue] = useState("");

  const [sendMessageTo, setSendMessageTo] = useState([
    {
      key: "to all memebers registered",
      value: 1,
    },
    {
      key: "to the head of the families who have registered",
      value: 2,
    },
    {
      key: "to the people currently Marked as Present",
      value: 3,
    },
    {
      key: "to only head of the family those who are marked as Present",
      value: 4,
    },
    {
      key: "to the members attending Shivir",
      value: 5,
    },
    {
      key: "to all the approved users",
      value: 6,
    },
    {
      key: "to all the Head of the families",
      value: 7,
    },
  ]);

  useEffect(() => {
    axios
      .get(eventAPIConfig.allEventList, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: ` Bearer ${window.localStorage.getItem(
            "jwt_access_token"
          )}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // console.log("Attendance",response)
          setEvents(response?.data?.data);
          //  console.log("hello",events)
        } else {
          dispatch(
            showMessage({
              message: response.data.errorMessage,
              variant: "error",
            })
          );
        }
      });
  }, []);

  const initialValues = {
    event: "",
    check: "",
    message: "",
  };

  const validationSchema = yup.object().shape({
    event: yup.string().required("Please select the event"),
    check: yup.string().required("Please select the check"),
    message: yup
      .string()
      .required("Please enter the message.")
      .max(160, "Message can have atmost 160 characters."),
  });

  const handleSubmit = (values) => {
    // console.log("hi");
    // console.log(values.message);
    // console.log(selectedEventId);
    // console.log(value);

    axios
      .post(
        `${userAPIConfig.sendSMS}/${selectedEventId}/${value}/${values.message}`,
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: ` Bearer ${window.localStorage.getItem(
              "jwt_access_token"
            )}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log("Attendance", response);
          formik.resetForm();
          dispatch(
            showMessage({ message: response.data.message, variant: "success" })
          );
          //  formik.setFieldValue('event', '');
          //  formik.setFieldValue('check', '');
          //  formik.setFieldValue('message', '');
          //  setEvents(response?.data?.data)
          //  console.log("hello",events)

          //  formik.setFieldError('message', null);
        } else {
          dispatch(
            showMessage({
              message: response.data.errorMessage,
              variant: "error",
            })
          );
        }
      });
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex justify-center  h-screen" style={{marginTop:'100px'}}>
    <div className="flex flex-col w-full max-w-md">
      <div className="py-20 px-10">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          style={{
            fontStyle: "normal",
            fontSize: "24px",
            lineHeight: "28px",
            letterSpacing: "0px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Send SMS
        </Typography>
      </div>
      <div className="px-10">
        <form className="flex flex-col" onSubmit={formik.handleSubmit}>
          <div>
            <Autocomplete
              options={
                events.length > 0 ? events.map((event) => event.eventName) : []
              }
              value={formik.values.event}
              onChange={(event, newValue) => {
                const selectedEvent = events.find(
                  (selected) => selected.eventName === newValue
                )?.eventId;
                setSelectedEventId(selectedEvent);
                formik.setFieldValue("event", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="event"
                  label="Event"
                  sx={{ mb: 2, mt: 2, width: "100%" }}
                  className="max-w-md"
                  variant="outlined"
                  required
                  onBlur={formik.handleBlur}
                  error={formik.touched.event && Boolean(formik.errors.event)}
                  helperText={formik.touched.event && formik.errors.event}
                />
              )}
            />
          </div>

          <div>
            <Autocomplete
              options={sendMessageTo.map((item) => item.key)}
              value={formik.values.check}
              onChange={(event, newValue) => {
                const selectedValue = sendMessageTo.find(
                  (item) => item.key === newValue
                )?.value;
                setValue(selectedValue);
                // console.log("hi", selectedEventId)
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
          </div>

          <div>
            <TextField
              label="Type Your Message"
              name="message"
              variant="outlined"
              sx={{ mb: 2, mt: 2, width: "100%" }}
              className="max-w-md"
              type="text"
              required
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
              multiline
              rows={3} // Set the number of rows you want
            />
          </div>

          
            <Button
              variant="contained"
              color="secondary"
              className="max-w-md mt-10"
              aria-label="Register"
              onClick={formik.handleSubmit}
              size="large"
              style={{ backgroundColor: "#792b00" }}
            >
              Send SMS
            </Button>
          
        </form>
      </div>
    </div>
  </div>
  );
}

export default SMS;
