import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './admin.css';
import { employeeAPIConfig, userAPIConfig } from 'src/app/main/API/apiConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { getUserRoles } from 'src/app/auth/services/utils/common';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function AdminProfileEdit(props) {

    const dispatch = useDispatch();
    const routeParams = useParams();
    const [adminData, setAdminData] = useState([]);
    const initialValues = {
        name: '',
        email: '',
        mobile: '',
        gender: '',
        age: '',
        status: '',
        points: '',
    };
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        mobile: Yup.string().required('Mobile is required'),
        gender: Yup.string().required('Gender is required'),
        age: Yup.number().typeError('Age must be a number').required('Age is required'),
        status: Yup.string().required('Status is required'),
        points: Yup.number().typeError('Points must be a number').required('Points is required'),
    });

    useEffect(() => {
        if (props.adminId) {
            axios
                .get(`${employeeAPIConfig.getUser}/${props.adminId}`, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        setAdminData(response.data.data);
                        formik.setValues({
                            name: response.data.data.name,
                            email: response.data.data.email,
                            mobile: response.data.data.mobile,
                            gender: response.data.data.gender,
                            age: response.data.data.age,
                            status: response.data.data.status,
                            points: response.data.data.points,
                        });
                    } else {
                        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                    }
                });
        }
    }, []);

    const handleSubmit = (values) => {

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('mobile', values.mobile);
        formData.append('gender', values.gender);
        formData.append('age', values.age);
        formData.append('status', values.status);
        formData.append('points', values.points);

        axios.put(`${userAPIConfig.profileUpdate}/${props.adminId}`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                dispatch(showMessage({ message: "Update successfully", variant: 'success' }));
                props.handleEditClose()
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        }).catch((error) => {
            dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
        })
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

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
                                            <img src={adminData?.image} alt="Maxwell Admin" />
                                        </div>
                                        <h4 className="user-name">{adminData.name}</h4>
                                        <h5 className="user-email">{adminData.email}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row gutters">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                            <h4 className="mb-2 text-primary">Personal Details</h4>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-6">
                                            <TextField
                                                id="fullName"
                                                name="name"
                                                label="Full Name"
                                                variant="outlined"
                                                fullWidth
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                            />
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-6">
                                            <TextField
                                                id="email"
                                                name="email"
                                                label="Email"
                                                variant="outlined"
                                                fullWidth
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-6">
                                            <TextField
                                                id="phone"
                                                name="mobile"
                                                label="Phone"
                                                variant="outlined"
                                                fullWidth
                                                value={formik.values.mobile}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                                helperText={formik.touched.mobile && formik.errors.mobile}
                                            />
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-6">
                                            <TextField
                                                id="gender"
                                                name="gender"
                                                label="Gender"
                                                variant="outlined"
                                                fullWidth
                                                value={formik.values.gender}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                                                helperText={formik.touched.gender && formik.errors.gender}
                                            />
                                        </div>
                                    </div>
                                    <div className="row gutters">
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-6">
                                            <TextField
                                                id="age"
                                                name="age"
                                                label="Age"
                                                variant="outlined"
                                                fullWidth
                                                value={formik.values.age}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.age && Boolean(formik.errors.age)}
                                                helperText={formik.touched.age && formik.errors.age}
                                            />
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-6">
                                            <TextField
                                                id="status"
                                                name="status"
                                                label="Status"
                                                variant="outlined"
                                                fullWidth
                                                disabled
                                                value={formik.values.status}
                                            />
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-6">
                                            <TextField
                                                id="points"
                                                name="points"
                                                label="Points"
                                                variant="outlined"
                                                fullWidth
                                                value={formik.values.points}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.points && Boolean(formik.errors.points)}
                                                helperText={formik.touched.points && formik.errors.points}
                                            />
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-6">
                                            <TextField
                                                id="role"
                                                name="role"
                                                label="Role"
                                                variant="outlined"
                                                fullWidth
                                                disabled
                                                value={getUserRoles()}
                                            />
                                        </div>
                                    </div>
                                    <div className="row gutters my-4">
                                        <div className="flex flex-row justify-end">
                                            <div className="text-right">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={props.handleEditClose}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type='button'
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginLeft: '20px' }}
                                                    onClick={formik.handleSubmit}
                                                >
                                                    Update
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminProfileEdit;
