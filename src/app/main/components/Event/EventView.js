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
import Box from '@mui/material/Box';


const boxStyle  = {
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
    overflow: 'auto',
    width: 'auto',
  };

export default function EventView(props) {
    const dispatch = useDispatch()
    // console.log(props)
    const [data, setData] = React.useState('')

    React.useEffect(() => {
        if (props?.viewid) {
            axios.get(`${eventAPIConfig.view}/${props.viewid}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setData(response.data.data)
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
                <CardMedia
                    component="img"
                    sx={{ width: '100%', height: 'auto' }}
                    image={`${key}/events/${data.eventId}.jpg`}
                    alt="event"
                />
                <CardContent style={{fontSize:'16px'}}>
                    <div className="my-3 mx-4">
                                <p className='font-bold inline'>Event Name:</p>
                                <span className='font-semibold'>{data.eventName}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Event Type: </p>
                                <span className='font-semibold'>{data.eventType}</span>
                            </div>
                            <hr />
                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Event Location: </p>
                                <span className='font-semibold'>{data.eventLocation}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Time: </p>
                                <span className='font-semibold'>{data.startTime} - {data.endTime}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Event Date: </p>
                                <span className='font-semibold'>{data.eventDate}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
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
                            <hr />

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