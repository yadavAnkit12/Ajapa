const key = process.env.REACT_APP_URL;
import React from 'react'
import { useState, useEffect } from 'react'
import './admin.css';
import { adminAPIConfig, userAPIConfig } from 'src/app/main/API/apiConfig';
import './admin.css';
import AdminProfileEdit from './AdminProfileEdit'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, Modal, Typography } from '@mui/material';
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from '@fuse/core/FuseLoading';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box } from '@mui/system';
import AdminChangePasswordForm from '../AdminChangePasswordForm';

const style = {
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
};

function AdminProfile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userEmail, setUserEmail] = useState('');
    const [data, setData] = useState('')
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(true)
    const role = sessionStorage.getItem('userRole')
    const [open, setOpen] = useState(false)


    useEffect(() => {
        if (sessionStorage.getItem('userRole') == 'Admin') {
            axios.get(`${adminAPIConfig.getById}?id=${sessionStorage.getItem('id')}`, {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: `Bearer ${window.localStorage.getItem("jwt_access_token")}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setData(response.data.user);
                    setLoading(false)
                } else {
                    dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
                }
            }).catch((error) => {
                setLoading(false)
                dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
            })
        } else {
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
            }).catch((error) => {
                setLoading(false)
                dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
            })
        }

    }, [])

    const handleEditProfile = (id) => {
        navigate(`/app/useredit/${id}`)
    }
    if (loading) {
        return <FuseLoading />
    }

    // function to convert date from yyyy-mm-dd format to dd-mm-yyyy
    function formatDate(inputDate) {
        if (inputDate !== "NA" && inputDate !== null && inputDate !== "null" && inputDate !== "undefined" && inputDate !== undefined && inputDate !== "") {
            const parts = inputDate.split('-');
            const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

            return formattedDate;
        }
        else {
            return 'dd/mm/yyyy'
        }
    }
    const handleEditAdmin = (email) => {
        setUserEmail(email)
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <div className="container">
                <div className="row gutters">
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
                                        {role !== 'Admin' && <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label htmlFor="whatsAppNumber" className='labelFont'>WhatsApp Number</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.whatsAppNumber} id="whatsAppNumber" />
                                            </div>
                                        </div>}

                                        {role !== 'Admin' && <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="gender" className='labelFont'>Gender</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.gender} id="gender" />
                                            </div>
                                        </div>}
                                        {role !== 'Admin' && <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label htmlFor="bloodGroup" className='labelFont'>Blood Group</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.bloodGroup} id="bloodGroup" />
                                            </div>
                                        </div>}
                                        {role !== 'Admin' && <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label htmlFor="dikshaDate" className='labelFont'>Diksha Date</label>
                                                <input type="text" className="form-control" style={{ fontSize: '14px' }} defaultValue={data.dikshaDate ? `${formatDate(data.dikshaDate)}` : 'dd/mm/yyyy'} id="dikshaDate" />
                                            </div>
                                        </div>}
                                        {role !== 'Admin' && <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="Street" className='labelFont'>DOB</label>
                                                <input type="dob" className="form-control" style={{ fontSize: '14px' }} defaultValue={formatDate(data.dob)} id="dob" />
                                            </div>
                                        </div>}

                                    </div>
                                    {role !== 'Admin' && <div className="row gutters">

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
                                    </div>}
                                </fieldset>
                                {role !== 'Admin' ? <Button
                                    style={{
                                        backgroundColor: '#4f46e5',
                                        color: 'white',
                                    }}
                                    onClick={() => handleEditProfile(data.id)}
                                    className='float-right m-1 cursor-pointer'
                                >
                                    Edit
                                </Button> : <Button
                                    style={{
                                        backgroundColor: '#4f46e5',
                                        color: 'white',
                                    }}
                                    onClick={() => handleEditAdmin(data.email)}
                                    className='float-right m-1 cursor-pointer'
                                >
                                    Change Password
                                </Button>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    ...style,
                    '@media (max-width: 600px)': { // Apply media query for mobile devices
                        width: '70%', // Set width to 100% for smaller screens
                    },
                    '@media (max-width: 280px)': { // Additional media query for smaller screens
                        width: '93%', // Set width to 82% for screens up to 280px
                    },
                }}>
                    <AdminChangePasswordForm handleClose={handleClose} userEmail={userEmail} />
                </Box>
            </Modal>
        </div>
    );
}
export default AdminProfile;