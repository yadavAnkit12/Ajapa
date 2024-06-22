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
import jwtServiceConfig from "src/app/auth/services/jwtService/jwtServiceConfig";

function AllEventRegistrationHeader(props) {

  const dispatch = useDispatch();

  const [filterData, setFilterData] = useState({
    eventName: "",
    userName: "",
    isAttendingShivir: 'All',
    arrivalDate: '',
    departureDate: '',
    fromCountry: 'All',
    fromState: 'All',
    fromCity: 'All'
  });
  const [countryList, setCountryList] = useState([])
  const [countryID, setCountryID] = useState('')
  const [stateList, setStateList] = useState([])
  const [stateID, setStateID] = useState('')
  const [cityList, setCityList] = useState([])
  const [cityID, setCityID] = useState('')

  //fetching the country list
  useEffect(() => {
    axios.get(jwtServiceConfig.country, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    }).then((response) => {
      if (response.status === 200) {
        setCountryList(response.data)
      }
    }).catch((error) => {
      dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
    })
  }, [])

  //fetch the state on the behalf of country
  useEffect(() => {
    axios.get(`${jwtServiceConfig.state}/${countryID}`, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    }).then((response) => {
      if (response.status === 200) {
        setStateList(response.data)
      }
    }).catch((error) => {
      dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
    })
  }, [countryID])

  //fetch the city on the behalf of state
  useEffect(() => {
    axios.get(`${jwtServiceConfig.city}/${stateID}`, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    }).then((response) => {
      if (response.status === 200) {
        setCityList(response.data)
      }
    }).catch((error) => {
      dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
    })
  }, [stateID])

  const filterPartnerData = () => {
    props.setFilterValue({
      eventName: filterData.eventName,
      isAttendingShivir: filterData.isAttendingShivir,
      arrivalDate: filterData.arrivalDate,
      departureDate: filterData.departureDate,
      country: (countryID !== '' && countryID !== undefined) ? `${countryID}:${filterData.fromCountry}` : 'All',
      state: (stateID !== '' && stateID !== undefined) ? `${stateID}:${filterData.fromState}` : 'All',
      city: (cityID !== '' && cityID !== undefined) ? `${cityID}:${filterData.fromCity}` : 'All',
    });
  };

  const clearFilters = () => {
    setFilterData({
      eventName: "",
      userName: "",
      isAttendingShivir: 'All',
      arrivalDate: '',
      departureDate: '',
      fromCountry: 'All',
      fromState: 'All',
      fromCity: 'All'
    });
    props.setFilterValue('');
  };


  const handleCreateReport = () => {
    const params = {
      eventId: props.eventList?.find((event) => event.eventName === filterData.eventName)?.eventId,
      userName: props.searchText,
      ...(filterData.isAttendingShivir !== 'All' && ({ isAttendingShivir: filterData.isAttendingShivir })),
      ...(filterData.arrivalDate !== '' && ({ arrivalDate: filterValue.arrivalDate })),
      ...(filterData.departureDate !== '' && ({ departureDate: filterValue.departureDate })),
      ...((countryID !== '' && countryID !== undefined && filterData.fromCountry !== 'All') && ({ fromCountry: `${countryID}:${filterData.fromCountry}` })),
      ...((stateID !== '' && stateID !== undefined && filterData.fromState !== 'All') && ({ fromState: `${stateID}:${filterData.fromState}` })),
      ...((cityID !== '' && cityID !== undefined && filterData.fromCity !== 'All') && ({ fromCity: `${cityID}:${filterData.fromCity}` })),

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
      eventId: props.eventList?.find((event) => event.eventName === filterData.eventName)?.eventId,
      userName: props.searchText,
      ...(filterData.isAttendingShivir !== 'All' && ({ isAttendingShivir: filterData.isAttendingShivir })),
      ...(filterData.arrivalDate !== '' && ({ arrivalDate: filterValue.arrivalDate })),
      ...(filterData.departureDate !== '' && ({ departureDate: filterValue.departureDate })),
      ...((countryID !== '' && countryID !== undefined && filterData.fromCountry !== 'All') && ({ fromCountry: `${countryID}:${filterData.fromCountry}` })),
      ...((stateID !== '' && stateID !== undefined && filterData.fromState !== 'All') && ({ fromState: `${stateID}:${filterData.fromState}` })),
      ...((cityID !== '' && cityID !== undefined && filterData.fromCity !== 'All') && ({ fromCity: `${cityID}:${filterData.fromCity}` })),
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
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
          >
            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

            <Input
              placeholder="Search"
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={props.searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => props.setSearchText(ev.target.value)}
            />
            {props.searchText && <FuseSvgIcon
              color="disabled"
              size={16}
              style={{ cursor: "pointer" }}
              onClick={() => props.setSearchText('')
              }>
              heroicons-solid:x
            </FuseSvgIcon>
            }
          </Paper>
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
            <Autocomplete
              disablePortal
              value={filterData.isAttendingShivir}
              id="isAttendingShivir"
              options={['Yes', 'No', 'All']}
              sx={{ my: 1, minWidth: 200, mx: 1 }}
              onChange={(e, newValue) =>
                setFilterData({ ...filterData, isAttendingShivir: newValue })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Attendanding Shivir"
                  variant="standard"
                />
              )}
            />
            <TextField
              id="arrivalDate"
              label="Arrival Date"
              variant="standard"
              type='date'
              value={filterData.arrivalDate}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={e => setFilterData({ ...filterData, arrivalDate: e.target.value })}
            />
            <TextField
              id="departureDate"
              label="Departure Date"
              variant="standard"
              type='date'
              value={filterData.departureDate}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={e => setFilterData({ ...filterData, departureDate: e.target.value })}
            />
            <Autocomplete
              disablePortal
              value={filterData.fromCountry}
              id="fromCountry"
              options={countryList.length > 0 ? countryList.map((country) => country.name) : []}
              sx={{ my: 1, minWidth: 200, mx: 1 }}
              onChange={(e, newValue) => {
                setFilterData({ ...filterData, fromCountry: newValue })
                const selectedCountry = countryList.find(country => country.name === newValue)?.id;
                setCountryID(selectedCountry)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  variant="standard"
                />
              )}
            />
            <Autocomplete
              disablePortal
              value={filterData.fromState}
              id="fromState"
              options={stateList.length > 0 ? stateList.map((state) => state.name) : []}
              sx={{ my: 1, minWidth: 200, mx: 1 }}
              onChange={(e, newValue) => {
                setFilterData({ ...filterData, fromState: newValue })
                const selectedSate = stateList.find(state => state.name === newValue)?.id;
                setStateID(selectedSate)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  variant="standard"
                />
              )}
            />
            <Autocomplete
              disablePortal
              value={filterData.fromCity}
              id="fromCity"
              options={cityList.length > 0 ? cityList.map((city) => city.name) : []}
              sx={{ my: 1, minWidth: 200, mx: 1 }}
              onChange={(e, newValue) => {
                setFilterData({ ...filterData, fromCity: newValue })
                const selectedCity = cityList.find(city => city.name === newValue)?.id;
                setCityID(selectedCity)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  variant="standard"
                />
              )}
            />
            {(props.Role === 'Admin' ? props.eventPermission.canreadEventRegistration : true) && <Button
              onClick={() => handleCreateReport()}
              variant="outlined"
              color="secondary"
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{ my: 2, mx: 1 }}
            >
              Export Excel
            </Button>}
            {(props.Role === 'Admin' ? props.eventPermission.canreadEventRegistration : true) && <Button
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
    </>
  );
}

export default AllEventRegistrationHeader;
