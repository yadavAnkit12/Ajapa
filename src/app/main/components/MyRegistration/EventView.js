const key = process.env.REACT_APP_URL;
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, Grid ,Stack} from '@mui/material';
import axios from 'axios';
import { eventAPIConfig } from '../../API/apiConfig';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';


export default function EventView(props) {
    const dispatch = useDispatch()
    console.log(props)
    const [data, setData] = React.useState('')

    React.useEffect(() => {
        if (props?.registrationId) {
            axios.get(`${eventAPIConfig.myRegistration}/${props.registrationId}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    // console.log("hi")
                    // console.log(response.data.eventRegistration)
                    setData(response.data.eventRegistration)
                    dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            }).catch((error) => console.log(error))
        }
    }, [])

    if(!data){
        return <FuseLoading/>
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <div className='text-2xl text-center'>
                  Event Details
                </div>
                <CardContent style={{fontSize:'16px'}}>
                <div className="my-3 mx-4">
                                <p className='font-bold inline'>User Name: </p>
                                <span className='font-semibold'>{data.userName}</span>
                            </div>
                            <hr />
                    <div className="my-3 mx-4">
                                <p className='font-bold inline'>Event Name: </p>
                                <span className='font-semibold'>{data.eventName}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Event Date: </p>
                                <span className='font-semibold'>{data.eventDate}</span>
                            </div>
                            <hr />
                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Arrival Date: </p>
                                <span className='font-semibold'>{data.arrivalDate}</span>
                            </div>
                            <hr />
                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Arrival Mode : </p>
                                <span className='font-semibold'>{data.arrivalModeOfTransport}</span>
                            </div>
                            <hr />
                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Arrival Time : </p>
                                <span className='font-semibold'>{data.arrivalTime}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Departure Date: </p>
                                <span className='font-semibold'>{data.departureDate}</span>
                            </div>
                            <hr />
                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Departure Mode : </p>
                                <span className='font-semibold'>{data.departureModeOfTransport}</span>
                            </div>
                            <hr />
                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Departure Time : </p>
                                <span className='font-semibold'>{data.departureTime}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Attending Shivir: </p>
                                <span className='font-semibold'>{data.attendingShivir? "Yes" :"No"}</span>
                            </div>
                            

                            {/* <div className="my-3 mx-4">
                                <p className='font-bold inline'>Booking Status: </p>
                                <span className='font-semibold'>{data.bookingStatus===true?'Yes':'No'}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'> Event Type: </p>
                                <span className='font-semibold'> Conference</span>
                            </div>
                            <hr />


                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>End Time: </p>
                                <span className='font-semibold'> 10:00 AM</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Event Status: </p>
                                <span className='font-semibold'>{data.eventStatus===true?'Yes':'No'}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Lock Date: </p>
                                <span className='font-semibold'>{data.lockArrivalDate} - {data.lockDepartureDate}</span>
                            </div>
                            <hr /> */}

                            {/* Close button */}
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={props.handleViewClose}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                </CardContent>
            </CardActionArea>
        </Card>
    
    );
}