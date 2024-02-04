import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { userAPIConfig } from "src/app/main/API/apiConfig";
import { useParams } from "react-router-dom";
import EventRegisterFormHead from './EventRegisterFormHead';
import EventForm from '../EventRegisterForm/EventForm';
import { Button } from '@mui/material';

const EventRegisterForm = () => {
    // console.log(allEventsData)
    const routeParams = useParams();
    const {eventId, userId, eventDate, eventName}=routeParams
    
    const [isEventFormOpen, setEventFormOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userListData, setUserListData] = useState([]);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(`${userAPIConfig.getUserByFamily}`, {
            headers: {
              'Content-type': 'multipart/form-data',
              Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
          }).then((response) => {
            if (response.status === 200) {
              setUserListData(response?.data);
            } else {
              dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
          });
    }, []);

    const handleEdit = () => {
        dispatch(showMessage({ message: 'We are working on \u270F️ Event' }));
    }

    const handleDelete = () => {
        dispatch(showMessage({ message: 'We are working on \u{1F5D1} Event'}));
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                                                <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10px' }}>
                                                  <Button variant='contained' style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleSave(person.id)}>
                                                     Register
                                                    </Button> 
                                                    
                                                    <Button variant='contained' style={{ backgroundColor: 'Blue', color: 'white' }} onClick={handleEdit} >
                                                     Edit
                                                    </Button> 
                                                    
                                                    <Button variant='contained' style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDelete}>
                                                     Delete
                                                    </Button> 
                                                </div>
                                            </div>
                                     
                            
                                                
                                                {isEventFormOpen && selectedUserId === person.id && (
                                                    <EventForm 
                                                        selectedUserId={selectedUserId} 
                                                        person={person}
                                                        handleClose={handleCloseEventForm} 
                                                        eventId={eventId}
                                                        // userId={userId}
                                                        eventDate={eventDate}
                                                         eventName={eventName}
                                                    />
                                                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            />
            scroll={isMobile ? 'normal' : 'content'}
        </>
    );
}

export default EventRegisterForm;
