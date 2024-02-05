import React, { forwardRef, useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { eventAPIConfig, userAPIConfig } from "src/app/main/API/apiConfig";
import { useParams } from "react-router-dom";
import EventRegisterFormHead from './EventRegisterFormHead';
import EventForm from '../EventRegisterForm/EventForm';
import { Button, Dialog, DialogActions, DialogTitle, Slide, Typography } from '@mui/material';
import { Formik } from 'formik';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EventRegisterForm = () => {
    // console.log(allEventsData)
    const routeParams = useParams();
    const { eventId, userId, eventDate, eventName } = routeParams

    const [isEventFormOpen, setEventFormOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userListData, setUserListData] = useState([]);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [register, setRegister] = useState([])
    const [registerList, setRegisterList] = useState([])
    const dispatch = useDispatch();
    const [registerUser, setRegisterUser] = useState('')
    const [change, setChange] = useState(false)
    const [open, setOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [isShivirAvailable, setIsShivirAvailable] = useState(false)


    //get Event By Id
    useEffect(() => {
        axios.get(`${eventAPIConfig.view}/${eventId}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                console.log("jii",response?.data)
                setIsShivirAvailable(response?.data)
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        }).catch((error) => console.log(error))
    
    }, [])


    useEffect(() => {

        axios.get(`${eventAPIConfig.checkEventRegistration}?eventId=${eventId}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                console.log(response)
                if (response.data.data.length > 0) {
                    setRegisterList(response.data.data)
                    if (userListData.users.length > 0) {
                        const arr = userListData.users.map((user) => {
                            const matchingEventRegister = response.data.data.find((eventRegister) => eventRegister.userId === user.id);
                            return matchingEventRegister ? user.id : null;
                        });

                        console.log(arr);
                        setRegister(arr)

                    }
                }

            } else {
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        });

    }, [userListData, change])

    useEffect(() => {
        axios.get(`${userAPIConfig.getUserByFamily}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                console.log(response)
                setUserListData(response?.data);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        });
    }, [change]);

    const handleEdit = (userId) => {
        setRegisterUser(registerList.find((register) => register.userId === userId))
        setSelectedUserId(userId);
        setEventFormOpen(true);

    }

    const handleDelete = () => {
        const registrationId = registerList.find((register) => register.userId === deleteId)?.registrationId
        const formData = new FormData()
        formData.append('registrationId', registrationId)
        axios.post(`${eventAPIConfig.registrationDelete}`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                setOpen(false)
                setChange(!change)
            } else {
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        })
    }

    const ConfirmationForDelete = (userId) => {
        setOpen(true)
        setDeleteId(userId)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = (userId) => {
        setSelectedUserId(userId);
        setEventFormOpen(true);
    };

    const handleCloseEventForm = () => {
        setEventFormOpen(false);
        setSelectedUserId(null);
    };


    return (
        <>
            <FusePageCarded
                header={<EventRegisterFormHead />}
                content={
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3.5 text-15 font-bold text-gray-700">
                                        Disciple Name
                                    </th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {userListData?.users?.map(person => (
                                    <tr key={person.id}>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div style={{ display: 'flex',flexWrap:'wrap', justifyContent: 'space-between' }}>
                                                <Typography variant="h5" 
                                                style={{
                                                    // fontFamily: "BentonSans bold",
                                                    fontStyle: 'normal', fontSize: '16px',
                                                    lineHeight: '28px', letterSpacing: '0px',
                                                    textAlign: 'center', fontWeight: 600,
                                                    marginTop: '5px'
                                                  }}
                                                gutterBottom>
                                                   {person.name}
                                                </Typography>
                                                <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10px' }}>
                                                    <Button
                                                        // variant='contained'
                                                        disabled={register.includes(person.id)}
                                                        style={{
                                                            backgroundColor: register.includes(person.id) ? '#d3d3d3' : 'green', color: 'white',
                                                        }}
                                                        onClick={() => handleSave(person.id)}
                                                    >
                                                        Register
                                                    </Button>

                                                    <Button
                                                        // variant='contained'
                                                        disabled={!register.includes(person.id)}
                                                        style={{
                                                            backgroundColor: register.includes(person.id) ? '#007FFF' : '#d3d3d3', // Use light gray for disabled
                                                            color: 'white',
                                                        }}
                                                        onClick={() => handleEdit(person.id)}
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        // variant='contained'
                                                        disabled={!register.includes(person.id)}
                                                        style={{
                                                            backgroundColor: register.includes(person.id) ? '#D70040' : '#d3d3d3', // Use light gray for disabled
                                                            color: 'white',
                                                        }}
                                                        onClick={() => ConfirmationForDelete(person.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>

                                            {isEventFormOpen && selectedUserId === person.id && (
                                                <EventForm
                                                    selectedUserId={selectedUserId}
                                                    person={person}
                                                    handleClose={handleCloseEventForm}
                                                    setEventFormOpen={setEventFormOpen}
                                                    eventId={eventId}
                                                    // userId={userId}
                                                    eventDate={eventDate}
                                                    eventName={eventName}
                                                    register={register}
                                                    registerUser={registerUser}
                                                    change={change}
                                                    setChange={setChange}
                                                    isShivirAvailable={isShivirAvailable}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle>{`Do you want to delete this user registration ?`}</DialogTitle>

                            <DialogActions>
                                <Button onClick={handleClose}>No</Button>
                                <Button onClick={handleDelete} autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>

                }
            />
            scroll={isMobile ? 'normal' : 'content'}
        </>
    );
}

export default EventRegisterForm;