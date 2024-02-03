import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import FusePageCarded from '@fuse/core/FusePageCarded';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Formik, useFormik } from 'formik';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { TextField, Autocomplete, Typography} from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { caseAPIConfig, eventAPIConfig, userAPIConfig } from "src/app/main/API/apiConfig";
import { useParams } from "react-router-dom";
import { getUserRoles } from "src/app/auth/services/utils/common";
import { useNavigate } from "react-router-dom";
import { Box, lighten } from "@mui/system";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import EventRegisterFormHead from './EventRegisterFormHead';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import EventForm from '../EventRegisterForm/EventForm';



const EventRegisterForm = () => {

    const routeParams = useParams()
    const navigate = useNavigate()
    const [tabValue, setTabValue] = useState(0)
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const dispatch = useDispatch();
    const [eventId, setEventId] = useState(0)
    const [selectedFileName, setSelectedFileName] = useState('');

    const [userListData, setUserListData] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    
    
    
    

    const [eventData, setEventData] = useState({
        addFamilyMember: '',
        sameAsMember: '',
        country: '',
        state: '',
        city: '',
        arrivalDate: '',
        arrivalTime: '',
        arrModeOfTransport: '',
        leavingDate: '',
        leavingTime: '',
        depModeOfTransport: '',
        attendingShivir: 'false',
        description: ''
    
    });


    useEffect(() => {
        return () => {
            setEventData(null);
            formik.resetForm();
        }
    }, [])

      //getting All the family Member details
      useEffect(() => {
        axios.get(`${userAPIConfig.getUserByFamily}`, {
            headers: {
              'Content-type': 'multipart/form-data',
              Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
          }).then((response) => {
            if (response.status === 200) {
            //   console.log(response.data)
              setUserListData(response?.data);
            //   setLoading(false);
            } else {
              dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
          });
    },[])


    useEffect(() => {

        const { eventId,userId } = routeParams;
        //here you recive the eventId and user Id
        
        // if (eventId == "new") {

        // } else {
        //     setEventId(eventId);
        // }
    }, []);

    useEffect(() => {
        if (eventId) {
            axios.get(`${eventAPIConfig.getById}/${eventId}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    // console.log(response)
                    setEventData(response.data.data)
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
        }
    }, [eventId]);

    useEffect(() => {
        if (eventData) {
            formik.setValues({
                eventName: eventData.eventName || '',
                eventType: eventData.eventType || '',
                eventLocation: eventData.eventLocation || '',
                startTime: eventData.startTime || '',
                endTime: eventData.endTime || '',
                eventDate: eventData.eventDate || '',
                lockArrivalDate: eventData.lockArrivalDate || '',
                lockDepartureDate: eventData.lockDepartureDate || '',
                shivirStartDate: eventData.shivirStartDate || '',
                shivirEndDate: eventData.shivirEndDate || '',
                shivirAvailable: eventData.shivirAvailable === true ? 'Yes' : 'No' || '',
                eventImage: eventData.eventImage || '',
                file:null,
                eventStatus: eventData.eventStatus || true,
                bookingStatus: eventData.bookingStatus || true
            });
        }
    }, [eventData]);

   
    
    const validationSchema = Yup.object().shape({
        addFamilyMember: Yup.string()
            .required('Enter Family Member required'),
      
        arrivalDate: Yup.date()
            .required('Arrival Date is required'),

        arrivalTime: Yup.string().required('Arrival Time is required'),

        arrModeOfTransport: Yup.string()
            .required('Please select mode of transport'),

        leavingDate: Yup.date()
            .required('Leaving Date is required'),

        leavingTime: Yup.string().required('Arrival Time is required'),

        depModeOfTransport: Yup.string()
            .required('Please select mode of transport'),
    
        attendingShivir: Yup.string()
     
    });

    

    const handleSubmit = (values) => {
        
        
        // if (formik.isValid) {
        //     const formData = new FormData()
        //     formData.append('eventName', values.eventName)
        //     formData.append('eventType', values.eventType)
        //     formData.append('eventLocation', values.eventLocation)
        //     formData.append('startTime', values.startTime)
        //     formData.append('endTime', values.endTime)
        //     formData.append('eventDate', values.eventDate)
        //     formData.append('lockArrivalDate', values.lockArrivalDate)
        //     formData.append('lockDepartureDate', values.lockDepartureDate)
        //     formData.append('shivirAvailable', values.shivirAvailable === 'Yes' ? true : false)
        //     formData.append('shivirStartDate', values.shivirStartDate)
        //     formData.append('shivirEndDate', values.shivirEndDate)
        //     // formData.append('eventImage', values.eventImage)
        //     formData.append('eventStatus', values.eventStatus)
        //     formData.append('bookingStatus', values.bookingStatus)
        //     if (eventId !== 0) {
        //         formData.append('eventId', eventId)

        //     }

        //     if (values.file !== null) {
        //         formData.append('file',values.file)
        //         axios.post(eventAPIConfig.createWithImage, formData, {
        //             headers: {
        //                 'Content-type': 'multipart/form-data',
        //                 authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        //             },
        //         }).then((response) => {
        //             if (response.status === 200) {
        //                 dispatch(showMessage({ message: response.data.message, variant: 'success' }));
        //                 formik.resetForm();
        //                 navigate('/app/event')
        //             } else {
        //                 dispatch(showMessage({ message: response.data.errormessage, variant: 'error' }));
        //             }
        //         })

        //     } else {
        //         formData.append('eventImage',values.eventImage)

        //         axios.post(eventAPIConfig.create, formData, {
        //             headers: {
        //                 'Content-type': 'multipart/form-data',
        //                 authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        //             },
        //         }).then((response) => {
        //             if (response.status === 200) {
        //                 dispatch(showMessage({ message: response.data.message, variant: 'success' }));
        //                 formik.resetForm();
        //                 navigate('/app/event')
        //             } else {
        //                 dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
        //             }
        //         }).catch((error) => console.log(error))
        //     }
        // } else {
        //     dispatch(showMessage({ message: "Please fill the required fields ", variant: 'error' }));
        // }
    };

    const formik = useFormik({
        initialValues: {
            addFamilyMember: '',
            sameAsMember: '',
            country: '',
            state: '',
            city: '',
            arrivalDate: '',
            arrivalTime: '',
            arrModeOfTransport: '',
            leavingDate: '',
            leavingTime: '',
            depModeOfTransport: '',
            attendingShivir: 'false',
            description: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleCheckboxChange = (userId) => {
        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(userId)) {
                // If already selected remove from the list
                return prevSelected.filter((id) => id !== userId);
            } else {
                // If not selected add to the list
                return [...prevSelected, userId];
            }
        });
    };
    

    function handleTabChange(event, value) {
        setTabValue(value);
    }


    return (
        <>
        <FusePageCarded
            header={<EventRegisterFormHead handleSubmit={handleSubmit} values={formik.values} />}

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
                                <div style={{ display: 'flex' , gap:'5px' , justifyContent:'space-between'}}>
                                    
                                         <div className="text-sm font-medium text-gray-900">{person.name}</div>

                                        <Checkbox
                                          checked={selectedUsers.includes(person.id)}
                                          onChange={() => handleCheckboxChange(person.id)}
                                        />
                                   
                               </div>   
                    {selectedUsers.includes(person.id) && (
                                        <div >
                                            <EventForm person={person} />
                                        </div>
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
    )

}

export default EventRegisterForm