import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
const key = process.env.REACT_APP_URL;

import Autocomplete from '@mui/material/Autocomplete';
import { Input, Paper, Typography, Modal, Box, Button, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import axios from 'axios';
import { userAPIConfig } from '../../API/apiConfig';
import { useNavigate } from 'react-router-dom';
// import VehicleRegisterForm from './VehicleRegisterForm';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';


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
function ManageFamilyHeader(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [filterData, setFilterData] = useState({
        status: 'Approved',
        country: 'All',
        state: 'All',
        city: 'All'
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
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
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
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
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
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
        })
    }, [stateID])


    const filterPartnerData = () => {
        props.setFilterValue({
            status: filterData.status,
            country: countryID !== '' ? `${countryID}:${filterData.country}` : '',
            state: stateID !== '' ? `${stateID}:${filterData.state}` : '',
            city: cityID !== '' ? `${cityID}:${filterData.city}` : ''
        });
    };


    const clearFilters = () => {
        setFilterData({
            status: '',
            country: '',
            state: '',
            city: ''

        });
        setCountryID('');
        props.setFilterValue('');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateReport = () => {
        const params = {
            searchText: props.searchText,
            status: filterData.status,
            country: countryID !== '' ? `${countryID}:${filterData.country}` : 'All',
            state: stateID !== '' ? `${stateID}:${filterData.state}` : 'All',
            city: cityID !== '' ? `${cityID}:${filterData.city}` : 'All'
        };

        axios.get(userAPIConfig.userReport, { params }, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                // Extract filename from the URL
                const urlParts = response.data.fileName.split('/');
                const fileName = urlParts[urlParts.length - 1];

                const baseUrl = 'http://18.212.201.202:8080/ajapa_yog-0.0.1-SNAPSHOT/reports/';
                const fullUrl = baseUrl + fileName;
                const link = document.createElement('a');
                link.href = fullUrl;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);

                // Trigger the download
                link.click();

                // Remove the link from the DOM after the download
                document.body.removeChild(link);

            } else {
                // Handling error
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        }).catch((error) => {
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
        });


    }
    const handleCreateReportPDF = () => {
        const params = {
            searchText: props.searchText,
            status: filterData.status,
            country: countryID !== '' ? `${countryID}:${filterData.country}` : 'All',
            state: stateID !== '' ? `${stateID}:${filterData.state}` : 'All',
            city: cityID !== '' ? `${cityID}:${filterData.city}` : 'All'
        };

        axios.get(userAPIConfig.userReportPDF, { params }, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                // Extract filename from the URL
                const urlParts = response.data.fileName.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const baseUrl = 'http://18.212.201.202:8080/ajapa_yog-0.0.1-SNAPSHOT/reports/';
                const fullUrl = baseUrl + fileName;

                 // Create a new tab and open the link in it
                const newTab = window.open(fullUrl, '_blank');
                
                // Create a download link
                // const link = document.createElement('a');
                // link.href = fullUrl;
                // link.setAttribute('download', fileName);
                // document.body.appendChild(link);
                
                // // Trigger the download
                // link.click();
                
                // // Remove the link from the DOM after the download
                // document.body.removeChild(link);
                
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        }).catch((error) => {
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
        });
    }

    return (
        <>
            <div className="w-full flex flex-col min-h-full">
                <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-10">
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={{ fontStyle: 'normal', fontSize: '24px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}
                    >
                        Family Members
                    </Typography>
                    </div>
                    {/* <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
                        <Paper
                            component={motion.div}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                            className="flex items-center w-full sm:max-w-256 space-x-8 px-16 ml-5 mr-5 rounded-full border-1 shadow-0"
                        >
                            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
                            <Input
                                placeholder="Search User"
                                className="flex flex-1"
                                disableUnderline
                                fullWidth
                                value={props?.searchText}
                                inputProps={{
                                    'aria-label': 'Search',
                                }}
                                onChange={(ev) => props?.setSearchText(ev.target.value)}
                            />
                            {props?.searchText && <FuseSvgIcon
                                color="disabled"
                                size={16}
                                style={{ cursor: "pointer" }}
                                onClick={() => props?.setSearchText('')}>
                                heroicons-solid:x
                            </FuseSvgIcon>
                            }
                        </Paper>
                    
                </div>
                <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16'>
                    <div className="flex sm:flex-row flex-wrap flex-col justify-start">
                        <Autocomplete
                            disablePortal
                            value={filterData.status}
                            id="status"
                            options={['Approved', 'Pending', 'Rejected']}
                            sx={{ my: 1, minWidth: 140, mx: 1 }}
                            onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue })}
                            renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
                        />

                        <Autocomplete
                            disablePortal
                            value={filterData.country}
                            id="country"
                            options={countryList.length > 0 ? countryList.map(country => country.name) : []}
                            sx={{ my: 1, minWidth: 140, mx: 1 }}
                            onChange={(e, newValue) => {
                                setFilterData({ ...filterData, country: newValue })
                                const selectedCountry = countryList.find(country => country.name === newValue)?.id;
                                setCountryID(selectedCountry)

                            }}
                            renderInput={(params) => <TextField {...params} label="Country" variant="standard" />}
                        />

                        <Autocomplete
                            disablePortal
                            value={filterData.state}
                            id="state"
                            options={stateList.length > 0 ? stateList.map(state => state.name) : []}
                            sx={{ my: 1, minWidth: 140, mx: 1 }}
                            onChange={(e, newValue) => {
                                setFilterData({ ...filterData, state: newValue })
                                const selectedSate = stateList.find(state => state.name === newValue)?.id;
                                setStateID(selectedSate)
                            }}
                            renderInput={(params) => {
                                return <TextField {...params} label="State" variant="standard" />;
                            }}
                        />
                        <Autocomplete
                            disablePortal
                            value={filterData.city}
                            id="city"
                            options={cityList.length > 0 ? cityList.map(city => city.name) : []}
                            sx={{ my: 1, minWidth: 140, mx: 1 }}
                            onChange={(e, newValue) => {
                                const selectedCity = cityList.find(city => city.name === newValue)?.id;
                                setCityID(selectedCity)
                                setFilterData({ ...filterData, city: newValue })
                            }}
                            renderInput={(params) => <TextField {...params} label="City" variant="standard" />}
                        />
                        {/* <Button
                            // component={Link}
                            onClick={() => handleCreateReport()}
                            variant="outlined"
                            color="secondary"
                            startIcon={<FileDownloadOutlinedIcon />}
                            sx={{ my: 2, mx: 1 }}
                        >
                            Export Excel
                        </Button>
                        <Button
                            // component={Link}
                            onClick={() => handleCreateReportPDF()}
                            variant="outlined"
                            color="secondary"
                            startIcon={<FileDownloadOutlinedIcon />}
                            sx={{ my: 2, mx: 1 }}
                        >
                            Export PDF
                        </Button> */}
                    {/* </div>
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
                    </div>  */}
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

export default ManageFamilyHeader;
