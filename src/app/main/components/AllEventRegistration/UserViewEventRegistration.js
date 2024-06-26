const key = process.env.REACT_APP_URL;
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, Dialog, DialogActions, DialogTitle, Grid, IconButton, Slide, Stack } from '@mui/material';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import { userAPIConfig } from 'src/app/main/API/apiConfig';
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { useEffect } from 'react';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function UserViewEventRegistration(props) {
    console.log(props)
    const dispatch = useDispatch()
    const [userId, setUserId] = React.useState(props.modalUserId)
    const [userData, setUserData] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(()=>{
    axios.get(`${userAPIConfig.getUserById}/${userId}`, {
        headers: {
            'Content-type': 'multipart/form-data',
        },
    }).then((response) => {
        if (response.status === 200) {
            setIsLoading(false);
            setUserData(response.data.user)
            // dispatch(showMessage({ message: response.data.message, variant: 'success' }));
        }
    }).catch((error) => {
        setIsLoading(false);
        dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
    })
},[])
    
if (isLoading) {
    return <FuseLoading />;
}

   // function to convert date from yyyy-mm-dd format to dd-mm-yyyy
   function formatDate(inputDate) {
    const parts = inputDate.split('-');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    return formattedDate;
}

    return (
        <div>
            <IconButton onClick={props.handleClose} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                <CloseIcon />
            </IconButton>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>

                    <CardMedia
                        component="img"
                        height="140"
                        image={`${key}/images/${userData.profileImage}`}
                        alt="event"
                    />
                    <CardContent style={{ fontSize: '16px' }}>
                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Name: </p>
                            <span>{userData.name}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>City: </p>
                            <span>{userData.city?.split(':')[1]}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Country: </p>
                            <span>{userData.country?.split(':')[1]}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Gender: </p>
                            <span>{userData.gender}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>DOB: </p>
                            <span>{formatDate(userData.dob)}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Email: </p>
                            <span>{userData.email === '' ? 'N/A' : userData.email}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Mobile Number: </p>
                            <span>{userData.mobileNumber === '' ? 'N/A' : userData.mobileNumber}</span>
                        </div>
                        <hr />

                        {/* <div className="my-3 mx-4">
                            <p className='font-bold inline'>Role: </p>
                            <span>{userData.role}</span>
                        </div>
                        <hr /> */}

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Is Disciple: </p>
                            <span>{userData.isDisciple=== true ? 'Yes':'No'}</span>
                        </div>
                        <hr />

                          {/* Close button */}
                           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={props.handleClose}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                    </CardContent>
                </CardActionArea>
            </Card>
          
        </div>
    );
}