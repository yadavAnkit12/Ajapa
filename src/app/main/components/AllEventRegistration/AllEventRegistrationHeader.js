const key = process.env.REACT_APP_URL;
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Input,
  Paper,
  Typography,
  Modal,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { showMessage } from "app/store/fuse/messageSlice";
import { eventAPIConfig } from "../../API/apiConfig";
import axios from "axios";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

// import VehicleRegisterForm from './VehicleRegisterForm';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
  maxWidth: "1200px",
  maxHeight: "650px",
  overflow: "auto",
};
function AllEventRegistrationHeader(props) {

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    eventName: "",
  });

  const id = "new";

  const filterPartnerData = () => {
    props.setFilterValue(filterData);
  };

  const clearFilters = () => {
    setFilterData({
      eventName: "",
    });
    props.setFilterValue('');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateReport = () => {
    const params = {
      eventId: props.eventList?.find(
        (event) => event.eventName === filterData.eventName
      )?.eventId,
    };

    axios
      .get(
        eventAPIConfig.eventReport,
        { params },
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${window.localStorage.getItem(
              "jwt_access_token"
            )}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Extract filename from the URL
          const urlParts = response.data.fileName.split("/");
          const fileName = urlParts[urlParts.length - 1];

          const baseUrl =
            `${key}/reports/`;
          const fullUrl = baseUrl + fileName;
          const link = document.createElement("a");
          link.href = fullUrl;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);

          // Trigger the download
          link.click();

          // Remove the link from the DOM after the download
          document.body.removeChild(link);
        } else {
          dispatch(
            showMessage({
              message: "Failed to fetch Excel. Please try again later.",
              variant: "error",
            })
          );
        }
      }).catch((error) => {
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
      });
  };

  const handleCreateReportPDF = () => {
    const params = {
      eventId: props.eventList?.find(
        (event) => event.eventName === filterData.eventName
      )?.eventId,
    };

    axios
      .get(
        eventAPIConfig.eventReportPdf,
        { params },
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${window.localStorage.getItem(
              "jwt_access_token"
            )}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Extract filename from the URL
          const urlParts = response.data.fileName.split("/");
          const fileName = urlParts[urlParts.length - 1];
          const baseUrl =
            `${key}/reports/`;
          const fullUrl = baseUrl + fileName;

          // Create a new tab and open the link in it
          const newTab = window.open(fullUrl, "_blank");
          if (!newTab) {
            // If pop-up blocker prevents opening the new tab
            dispatch(
              showMessage({
                message: "Please allow pop-ups to download the PDF.",
                variant: "error",
              })
            );
          }
        } else {
          dispatch(
            showMessage({
              message: "Failed to fetch PDF. Please try again later.",
              variant: "error",
            })
          );
        }
      }).catch((error) => {
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
      })
  };

  return (
    <>
      <div className="w-full flex flex-col min-h-full">
        <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-10">
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
            Event Registrations
          </Typography>
        </div>
        <div className="flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16">
          <div className="flex sm:flex-row flex-wrap flex-col justify-start">
            <Autocomplete
              disablePortal
              value={filterData.eventName}
              id="eventName"
              options={
                props.eventList.length > 0
                  ? props.eventList.map((event) => event.eventName)
                  : []
              }
              sx={{ my: 1, minWidth: 200, mx: 1 }}
              onChange={(e, newValue) =>
                setFilterData({ ...filterData, eventName: newValue })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Event"
                  variant="standard"
                />
              )}
            />
            {(props.Role === 'Admin' ? props.eventPermission.canreadEventRegistration : true) && <Button
              // component={Link}
              onClick={() => handleCreateReport()}
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{ my: 2, mx: 1 }}
            >
              Export Excel
            </Button>}
            {(props.Role === 'Admin' ? props.eventPermission.canreadEventRegistration : true) && <Button
              // component={Link}
              onClick={() => handleCreateReportPDF()}
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{ my: 2, mx: 1 }}
            >
              Export PDF
            </Button>}
          </div>
          <div className="flex flex-row justify-end">
            <Button
              component={Link}
              onClick={filterPartnerData}
              variant="contained"
              color="secondary"
              startIcon={<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>}
              sx={{ my: 2, mx: 1 }}
              fullWidth
            >
              Search
            </Button>
            <Button
              component={Link}
              onClick={clearFilters}
              variant="outlined"
              color="secondary"
              startIcon={<FuseSvgIcon>heroicons-outline:refresh</FuseSvgIcon>}
              sx={{ my: 2, mx: 1 }}
              fullWidth
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <VehicleRegisterForm setChange={props.setChange} change={props.change} setOpen={setOpen} /> */}
        </Box>
      </Modal>
    </>
  );
}

export default AllEventRegistrationHeader;
