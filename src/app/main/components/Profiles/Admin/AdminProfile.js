const key = process.env.REACT_APP_URL;
import React from 'react'
import { useState, useEffect } from 'react'
import './admin.css';
import { userAPIConfig } from 'src/app/main/API/apiConfig';
import './admin.css';
import AdminProfileEdit from './AdminProfileEdit'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, Typography } from '@mui/material';
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from '@fuse/core/FuseLoading';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';



function AdminProfile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userID, setUserID] = useState(null);
    const [data, setData] = useState('')
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        // axios.get(`${userAPIConfig.getUserById}/${userID}`, {
        axios.get(`${userAPIConfig.getUserById}/${sessionStorage.getItem('id')}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setData(response.data.user);
                setLoading(false)
            } else {
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        }).catch((error) =>{
            setLoading(false)
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
          })


    }, [])

    const handleEditProfile = (id) => {
        navigate(`/app/useredit/${id}`)
    }
    if (loading) {
        return <FuseLoading />
    }

       // function to convert date from yyyy-mm-dd format to dd-mm-yyyy
       function formatDate(inputDate) {
        if(inputDate!=="NA" && inputDate!==null && inputDate!=="null" && inputDate!=="undefined" && inputDate!==undefined && inputDate!==""){
            const parts = inputDate.split('-');
            const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        
            return formattedDate;
        }
         else {
            return 'dd/mm/yyyy'
         }
    }

    return (
        <div>
            <div className="container">
                <div className="row gutters">
                    {/* <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="account-settings">
                                    <div className="user-profile">
                                        <div className="user-avatar">
                                            <img src={`${key}/images/${data.profileImage}`} alt="Not Found" />
                                        </div>
                                        <h4 className="user-name labelFont">{data.name}</h4>
                                        <h5 className="user-email labelFont">{data.email}</h5>
                                        <IconButton aria-label="edit" color="success" onClick={() => handleEditProfile(data.id)}>
                                            <EditIcon />
                                        </IconButton>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-10">
                        <Typography
                            component={motion.span}
                            initial={{ x: -20 }}
                            animate={{ x: 0, transition: { delay: 0.2 } }}
                            delay={300}
                            style={{ fontStyle: 'normal', fontSize: '24px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}
                        >
                            My Profile
                        </Typography>

                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <fieldset disabled={true}>
                                    <div className="row gutters">
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="fullName" className='labelFont'>Name</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.name} id="fullName" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="eMail" className='labelFont'>Email</label>
                                                <input type="email" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.email} id="email" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="phone" className='labelFont'>Mobile</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.mobileNumber} id="phone" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label htmlFor="whatsAppNumber" className='labelFont'>WhatsApp Number</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.whatsAppNumber} id="whatsAppNumber" />
                                            </div>
                                        </div>

                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="gender" className='labelFont'>Gender</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.gender} id="gender" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label htmlFor="bloodGroup" className='labelFont'>Blood Group</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.bloodGroup} id="bloodGroup" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label htmlFor="dikshaDate" className='labelFont'>Diksha Date</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.dikshaDate ?`${formatDate(data.dikshaDate)}`:'dd/mm/yyyy'} id="dikshaDate" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="Street" className='labelFont'>DOB</label>
                                                <input type="dob" className="form-control" style={{ fontSize: '14px' }} defaultValue={formatDate(data.dob)} id="dob" />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row gutters">

                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label htmlFor="pinCode" className='labelFont'>Pin Code</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.pinCode} id="pinCode" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="address" className='labelFont'>Address</label>
                                                <input type="address" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.addressLine} id="address" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="country" className='labelFont'>Country</label>
                                                <input type="country" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.country?.split(':')[1]} id="country" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="state" className='labelFont'>State</label>
                                                <input type="state" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.state?.split(':')[1]} id="state" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="city" className='labelFont'>City</label>
                                                <input type="city" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.city?.split(':')[1]} id="state" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label htmlFor="qualification" className='labelFont'>Qualification</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.qualification} id="qualification" />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <Button
                                    // variant='contained'

                                    style={{
                                        backgroundColor: '#4f46e5', // Use light gray for disabled
                                        color: 'white',
                                    }}
                                    onClick={() => handleEditProfile(data.id)}
                                    className='float-right m-1 cursor-pointer'
                                >
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminProfile;