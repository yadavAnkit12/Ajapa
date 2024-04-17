
const key = process.env.REACT_APP_URL;
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { Button, Modal, Box } from "@mui/material";
import { eventAPIConfig, userAPIConfig } from "../../API/apiConfig";
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FuseLoading from "@fuse/core/FuseLoading";
import { useNavigate } from "react-router-dom";
import { getLoggedInPartnerId } from "src/app/auth/services/utils/common";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { formatDiagnosticsWithColorAndContext } from "typescript";


const UserEventCard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [allEventsData, setAllEventsData] = useState([]);


    useEffect(() => {
        const params = {
            page: 1,
            rowsPerPage: 200,
            eventName: '',
            eventStatus: true,
            bookingStatus: true
        };
        axios.get(eventAPIConfig.allEventList, { params }, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setAllEventsData(response.data)
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        });
    }, [])


    if (allEventsData.length === 0) {
        return <FuseLoading />

    }

    const handleEventRegister = async (id, eventDate, eventName) => {
        const userId = await getLoggedInPartnerId()
        navigate(`/app/UserEventsRegisteration/${id}/${userId}/${eventDate}/${eventName}`)
    }

    // function to convert date from yyyy-mm-dd format to dd-mm-yyyy
    function formatDate(inputDate) {
        const parts = inputDate.split('-');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    
        return formattedDate;
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {allEventsData?.data?.map((data, idx) => (
                    <div key={idx} className="max-w-sm bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 m-4">
                        {/* Event image */}
                        <img

                            style={{ width: '100%', height: '200px' }}
                            src={`${key}/events/${data.eventImage}`} alt="Event Image" />
                        <div className="p-5">
                            <h5
                                className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{data.eventName}</h5>
                            <div className="flex items-center gap-2 mb-2 my-3">
                                <EventIcon />
                                <span className="text-lg text-center" style={{
                                    fontStyle: 'normal', fontSize: '12px',
                                    lineHeight: '28px', letterSpacing: '0px',
                                    textAlign: 'center', fontWeight: 600,
                                    marginTop: '3px'
                                }}>Event Date: {formatDate(data.eventDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <EventIcon />
                                <span className="text-lg" style={{
                                    fontStyle: 'normal', fontSize: '12px',
                                    lineHeight: '28px', letterSpacing: '0px',
                                    textAlign: 'center', fontWeight: 600,
                                    marginTop: '3px'
                                }}>Shivir Start Date: {data.shivirStartDate === "" ? "N/A" : `${formatDate(data.shivirStartDate)}`}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <EventIcon />
                                <span className="text-lg" style={{
                                    fontStyle: 'normal', fontSize: '12px',
                                    lineHeight: '28px', letterSpacing: '0px',
                                    textAlign: 'center', fontWeight: 600,
                                    marginTop: '3px'
                                }}>Shivir End Date: {data.shivirStartDate === "" ? "N/A" : `${formatDate(data.shivirEndDate)}`}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-2" >
                                <LocationOnIcon />
                                <span className="text-lg 
                  "style={{
                                        fontStyle: 'normal', fontSize: '12px',
                                        lineHeight: '28px', letterSpacing: '0px',
                                        textAlign: 'center', fontWeight: 600,
                                        marginTop: '5px'
                                    }}>Event Location: {data.eventLocation}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2" >
                               {data.bookingStatus? <NotificationsActiveIcon/>:<NotificationsOffIcon/>}
                                <span className="text-lg 
                  "style={{
                                        fontStyle: 'normal', fontSize: '12px',
                                        lineHeight: '28px', letterSpacing: '0px',
                                        textAlign: 'center', fontWeight: 600,
                                        marginTop: '5px',
                                    }}>Registration status: {data.bookingStatus ? 'On' : 'Off'}</span>
                            </div>
                            <Button className="my-4 text-white bg-gradient-to-r 
                from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
                focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
                shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium 
                rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 "
                                onClick={() => handleEventRegister(data.eventId, data.eventDate, data.eventName)}>
                                Manage Registration
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}

export default UserEventCard

