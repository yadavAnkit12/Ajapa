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
                    // dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            }).catch((error) => {
                dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
            })
        }
    }, [])

    if(!data){
        return <FuseLoading/>
    }

       // function to convert date from yyyy-mm-dd format to dd-mm-yyyy
       function formatDate(inputDate) {
        const parts = inputDate.split('-');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    
        return formattedDate;
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={`${key}/events/${data.eventImage}`}
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
                                <span className='font-semibold'>{formatDate(data.eventDate)}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Registration Status: </p>
                                <span className='font-semibold'>{data.bookingStatus===true?'Yes':'No'}</span>
                            </div>
                            <hr />


                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Event Status: </p>
                                <span className='font-semibold'>{data.eventStatus===true?'Yes':'No'}</span>
                            </div>
                            <hr />

                            <div className="my-3 mx-4">
                                <p className='font-bold inline'>Lock Date: </p>
                                <span className='font-semibold'>{formatDate(data.lockArrivalDate)} - {formatDate(data.lockDepartureDate)}</span>
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