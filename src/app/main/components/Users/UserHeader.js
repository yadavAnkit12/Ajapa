import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
const key = process.env.REACT_APP_URL;
import Autocomplete from '@mui/material/Autocomplete';
import { Input, Paper, Typography, Modal, Box, Button, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import axios from 'axios';
import { userAPIConfig } from '../../API/apiConfig';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './user.css'

function UsersHeader(props) {
    const routeParams = useParams();
    const dispatch = useDispatch();
    const [filterData, setFilterData] = useState({
        status: 'Approved',
        country: 'All',
        state: 'All',
        city: 'All',
        isHead: 'All',
        isDisciple: 'All'
    });

    const [countryList, setCountryList] = useState([])
    const [countryID, setCountryID] = useState('')
    const [stateList, setStateList] = useState([])
    const [stateID, setStateID] = useState('')
    const [cityList, setCityList] = useState([])
    const [cityID, setCityID] = useState('')

    useEffect(() => {
        const { status, isHead, isDisciple } = routeParams
        setFilterData({ ...filterData, status: status, isHead: isHead, isDisciple: isDisciple })
        props.setFilterValue({ ...filterData, status: status, isHead: isHead, isDisciple: isDisciple })
    }, [])


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
            status: filterData.status,
            country: (countryID !== '' && countryID !== undefined) ? `${countryID}:${filterData.country}` : 'All',
            state: (stateID !== '' && stateID !== undefined) ? `${stateID}:${filterData.state}` : 'All',
            city: (cityID !== '' && cityID !== undefined) ? `${cityID}:${filterData.city}` : 'All',
            isHead: filterData.isHead,
            isDisciple: filterData.isDisciple
        });
    };


    const clearFilters = () => {
        setFilterData({
            status: 'Approved',
            country: 'All',
            state: 'All',
            city: 'All',
            isHead: 'All',
            isDisciple: 'All'
        });
        setCountryID('');
        props.setFilterValue({
            status: 'Approved',
            country: 'All',
            state: 'All',
            city: 'All',
            isHead: 'All',
            isDisciple: 'All'
        });
    }

    const handleCreateReport = () => {
        const params = {
            searchText: props.searchText,
            status: filterData.status,
            ...(countryID !== '' && countryID !== undefined && filterData.country !== 'All' && ({ country: `${countryID}:${filterData.country}` })),
            ...(stateID !== '' && stateID !== undefined && filterData.state !== 'All' && ({ state: `${stateID}:${filterData.state}` })),
            ...(cityID !== '' && cityID !== undefined && filterData.city !== 'All' && ({ city: `${cityID}:${filterData.city}` })),
            ...(filterData.isHead !== 'All' && ({ role: 'User' })),
            ...(filterData.isDisciple !== 'All' && ({ role: filterData.isDisciple === 'Disciple' ? 'Yes' : 'No' })),
        };

        axios.get(userAPIConfig.userReport, { params }, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                // Extract filename from the URL
                const urlParts = response.data.fileName.split('/');
                const fileName = urlParts[urlParts.length - 1];

                const baseUrl = `${key}/reports/`;
                const fullUrl = baseUrl + fileName;
                const link = document.createElement('a');
                link.href = fullUrl;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);

                // Trigger the download
                link.click();

                document.body.removeChild(link);

            } else {
                // Handling error
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        }).catch((error) => {
            dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
        });


    }
    const handleCreateReportPDF = () => {
        const params = {
            searchText: props.searchText,
            status: filterData.status,
            ...(countryID !== '' && countryID !== undefined && filterData.country !== 'All' && ({ country: `${countryID}:${filterData.country}` })),
            ...(stateID !== '' && stateID !== undefined && filterData.state !== 'All' && ({ state: `${stateID}:${filterData.state}` })),
            ...(cityID !== '' && cityID !== undefined && filterData.city !== 'All' && ({ city: `${cityID}:${filterData.city}` })),
            ...(filterData.isHead !== 'All' && ({ role: 'User' })),
            ...(filterData.isDisciple !== 'All' && ({ role: filterData.isDisciple === 'Disciple' ? 'Yes' : 'No' })),
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
                const baseUrl = `${key}/reports/`;
                const fullUrl = baseUrl + fileName;

                // Create a new tab and open the link in it
                const newTab = window.open(fullUrl, '_blank');

            } else {
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        }).catch((error) => {
            dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
        });
    }

    const handleCheckExcelPDF = () => {
        Swal.fire({
            title: "Do you want PDF or Excel?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "PDF",
            denyButtonText: `Excel`,
            customClass: 'custom-modal-height'
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) { // PDF
                handleCreateReportPDF()
            } else if (result.isDenied) { // excel
                handleCreateReport()
            }
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
                        Users
                    </Typography>
                    <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
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
                        </Paper>
                    </div>
                </div>
                <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16'>
                    <div className="flex sm:flex-row flex-wrap flex-col justify-start">
                        <Autocomplete
                            disablePortal
                            value={filterData.status}
                            id="status"
                            options={['Approved', 'Pending', 'Rejected', 'All']}
                            sx={{ my: 1, minWidth: 140, mx: 1 }}
                            onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue || 'All' })}
                            renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
                        />

                        <Autocomplete
                            disablePortal
                            value={filterData.country}
                            id="country"
                            options={countryList.length > 0 ? countryList.map(country => country.name) : []}
                            sx={{ my: 1, minWidth: 140, mx: 1 }}
                            onChange={(e, newValue) => {
                                setFilterData({ ...filterData, country: newValue || 'All' })
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
                                setFilterData({ ...filterData, state: newValue || 'All' })
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
                                setFilterData({ ...filterData, city: newValue || 'All' })
                            }}
                            renderInput={(params) => <TextField {...params} label="City" variant="standard" />}
                        />

                        <Autocomplete
                            disablePortal
                            value={filterData.isHead}
                            id="status"
                            options={['Head', 'All']}
                            sx={{ my: 1, minWidth: 140, mx: 1 }}
                            onChange={(e, newValue) => setFilterData({ ...filterData, isHead: newValue || 'All' })}
                            renderInput={(params) => <TextField {...params} label="Is head" variant="standard" />}
                        />

                        <Autocomplete
                            disablePortal
                            value={filterData.isDisciple}
                            id="status"
                            options={['Disciples', 'Non Disciples', 'All']}
                            sx={{ my: 1, minWidth: 140, mx: 1 }}
                            onChange={(e, newValue) => setFilterData({ ...filterData, isDisciple: newValue || 'All' })}
                            renderInput={(params) => <TextField {...params} label="Is disciple" variant="standard" />}
                        />
                        <Button
                            onClick={() => handleCheckExcelPDF()}
                            variant="outlined"
                            color="secondary"
                            startIcon={<FileDownloadOutlinedIcon />}
                            sx={{ my: 2, mx: 1 }}
                        >
                            Export
                        </Button>
                        {/* <Button
                            // component={Link}
                            onClick={() => handleCreateReportPDF()}
                            variant="outlined"
                            color="secondary"
                            startIcon={<FileDownloadOutlinedIcon />}
                            sx={{ my: 2, mx: 1 }}
                        >
                            Export PDF
                        </Button> */}
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

export default UsersHeader;
