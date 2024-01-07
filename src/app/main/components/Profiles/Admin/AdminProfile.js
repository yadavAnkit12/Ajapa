
import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './admin.css';
import { employeeAPIConfig, partnerAPIConfig } from 'src/app/main/API/apiConfig';
import './admin.css';
import AdminProfileEdit from './AdminProfileEdit'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Modal, Box, } from '@mui/material';
import { getUserRoles } from '../../../../auth/services/utils/common';
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";

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
    overflow: 'auto'
};



function AdminProfile() {
    const dispatch = useDispatch()
    const routeParams = useParams();
    const [adminID, setAdminID] = useState(null);
    const [adminData, setAdminData] = useState('')
    const [open, setOpen] = useState(false);
    const [change, setChange] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [adminId, setAdminId] = useState("");

    useEffect(() => {
        setAdminID(routeParams.userId);
    }, [])

    const handleEditOpen = (empId) => {
        setAdminId(empId)
        setOpenEdit(true);
    };


    const handleEditClose = () => {
        setOpenEdit(false);
    };


    useEffect(() => {
        if (adminID) {
            // if(getUserRoles()==='clinic'){
            //     axios.get(`${partnerAPIConfig.getById}/${adminID}`, {
            //         headers: {
            //             'Content-type': 'multipart/form-data',
            //             authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            //         },
            //     }).then((response) => {
            //         if (response.status === 200) {
            //             setAdminData(response.data.data);
            //         } else {
            //             dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            //         }
            //     })
            // }
            // else{
            axios.get(`${employeeAPIConfig.getUser}/${adminID}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setAdminData(response.data.data);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
            // }

        }
    }, [adminID, openEdit])

    return (
        <div>
            <div className="container">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="account-settings">
                                    <div className="user-profile">
                                        <div className="user-avatar">
                                            <img src={adminData.image || adminData.profileImage} alt="Maxwell Admin" />
                                        </div>
                                        <h4 className="user-name">{adminData.name}</h4>
                                        <h5 className="user-email">{adminData.email}</h5>
                                        {getUserRoles() === 'admin' && <IconButton aria-label="edit" color="success" onClick={() => { handleEditOpen(adminID) }}>
                                            <EditIcon />
                                        </IconButton>}
                                    </div>

                                    <Modal
                                        open={openEdit}
                                        onClose={handleEditClose}

                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <AdminProfileEdit adminId={adminId} setOpen={setOpenEdit} open={openEdit} setChange={setChange} change={change} handleEditClose={handleEditClose} />
                                        </Box>
                                    </Modal>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <fieldset disabled={true}>
                                    <div className="row gutters">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                            <h4 className="mb-2 text-primary">Personal Details</h4>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="fullName" style={{ fontWeight: "600" }}>Name</label>
                                                <input type="text" className="form-control" defaultValue={adminData.name} id="fullName" placeholder="Enter Full name" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="eMail" style={{ fontWeight: "600" }}>Email</label>
                                                <input type="email" className="form-control" defaultValue={adminData.email} id="email" placeholder="Enter Email ID" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="phone" style={{ fontWeight: "600" }}>Phone</label>
                                                <input type="text" className="form-control" defaultValue={adminData.mobile} id="phone" placeholder="Enter Phone Number" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            {(getUserRoles() === 'clinic') ? <div className="form-group">
                                                <label html-for="website" style={{ fontWeight: "600" }}>Gst No.</label>
                                                <input type="text" className="form-control" defaultValue={adminData.gstNo} id="brandName" placeholder="Enter Brand Name" />
                                            </div> : <div className="form-group">
                                                <label html-for="website" style={{ fontWeight: "600" }}>Gender</label>
                                                <input type="gender" className="form-control" defaultValue={adminData.gender} id="gender" placeholder="Enter Gender" />
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="row gutters">
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            {(getUserRoles() !== 'clinic') ? <div className="form-group">
                                                <label html-for="Street" style={{ fontWeight: "600" }}>Age</label>
                                                <input type="age" className="form-control" defaultValue={adminData.age} id="age" placeholder="Enter Age" />
                                            </div> :<div className="form-group">
                                                <label html-for="ciTy" style={{ fontWeight: "600" }}>license No.</label>
                                                <input type="licenseNo" className="form-control" defaultValue={adminData.licenseNo} id="licenseNo" placeholder="Enter license no." />
                                            </div>}
                                        </div>
                                        {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            {(getUserRoles() === 'clinic') && <div className="form-group">
                                                <label html-for="ciTy" style={{ fontWeight: "600" }}>license No.</label>
                                                <input type="licenseNo" className="form-control" defaultValue={adminData.licenseNo} id="licenseNo" placeholder="Enter license no." />
                                            </div>}
                                        </div> */}
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="sTate" style={{ fontWeight: "600" }}>Point</label>
                                                <input type="points" className="form-control" defaultValue={adminData.points ? adminData.points : '0'} id="points" placeholder="Enter points" />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="form-group">
                                                <label html-for="zIp" style={{ fontWeight: "600" }}>Role</label>
                                                <input type="role" className="form-control" defaultValue={getUserRoles()} id="role" placeholder="role Code" />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminProfile;