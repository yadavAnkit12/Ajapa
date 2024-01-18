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
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function UserView(props) {
    console.log(props)
    const dispatch = useDispatch()
    const [userId, setUserId] = React.useState('')
    const [check, setCheck] = React.useState('')
    const [open, setOpen] = React.useState(false)

    const handleDialogOpen = (id, check) => {
        setUserId(id)
        setCheck(check)
        setOpen(true)

    }

    const handleClose = () => {
        setOpen(false)
    }


    const handleApproveReject = () => {
        const formData = new FormData()
        if (check === 'Approved') {

            formData.append('status', 'Approved')
        }
        else {
            formData.append('status', 'Rejected')
        }
        formData.append('id', userId)
        axios.post(userAPIConfig.changeStatus, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`
            },
        }).then((response) => {
            if (response.status === 200) {
                dispatch(showMessage({ message: response.data.message, variant: 'success' }));
            }
            else {
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));

            }
        })
    }
    if (props.data === '') {
        return <FuseLoading />
    }


    return (
        <div>
            <IconButton onClick={props.handleEditClose} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                <CloseIcon />
            </IconButton>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>

                    <CardMedia
                        component="img"
                        height="140"
                        image={`${key}/images/${props.data.id}.jpg`}
                        alt="event"
                    />
                    <CardContent style={{ fontSize: '16px' }}>
                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Name: </p>
                            <span className='font-semibold'>{props.data.name}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>City: </p>
                            <span className='font-semibold'>{props.data.city.split(':')[1]}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Country: </p>
                            <span className='font-semibold'>{props.data.country.split(':')[1]}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Gender: </p>
                            <span className='font-semibold'>{props.data.gender}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>DOB: </p>
                            <span className='font-semibold'>{props.data.dob}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Email: </p>
                            <span className='font-semibold'>{props.data.email}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Mobile Number: </p>
                            <span className='font-semibold'>{props.data.mobileNumber}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Role: </p>
                            <span className='font-semibold'>{props.data.role}</span>
                        </div>
                        <hr />

                        <div className="my-3 mx-4">
                            <p className='font-bold inline'>Is Disciple: </p>
                            <span className='font-semibold'>{props.data.disciple === true? 'Yes' : 'No'}</span>
                        </div>
                        <hr />

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <Button variant='contained' style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleDialogOpen(props.data.id, 'Approve')}>
                                Approve
                            </Button>
                            <Button variant='contained' style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDialogOpen(props.data.id, 'Rejected')}>
                                Reject
                            </Button>

                            {/* <button
                            onClick={props.handleViewClose}
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button> */}
                        </div>
                    </CardContent>

                </CardActionArea>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{`Do you want to ${check} is user`}</DialogTitle>

                    <DialogActions>
                        <Button onClick={handleClose}>No</Button>
                        <Button onClick={handleApproveReject} autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
    );
}