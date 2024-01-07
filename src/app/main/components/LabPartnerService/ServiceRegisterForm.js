import { Grid, TextField, Button, Container, Stack, Typography, IconButton, Autocomplete, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import ReactQuill from 'react-quill';
import { caseAPIConfig, clinicAPIConfig, patientAPIConfig, specializationAPIConfig } from '../../API/apiConfig';
// import { labPartnerAPIConfig, partnerAPIConfig } from '../../API/apiConfig';

const ServiceRegisterForm = (props) => {
    const dispatch = useDispatch();
    // const [selectedPartner, setSelectedPartner] = useState('')
    // const [partnerListData, setPartnerListData] = useState([]);
    // const [selectedSample, setSelectedSample] = useState('')
    const [clinicList, setClinicList] = useState([])
    const [ID, setID] = useState('')
    const [clinicOptions, setClinicOptions] = useState('')
    const [caseOption, setCaseOption] = useState([])
    const [caseList, setCaseList] = useState([])
    const [patientList, setPatientList] = useState([])
    const [patientOption, setPatientOption] = useState('')
    const [planData, setPlanData] = useState({
        ReferenceNo: '',
        Date: '',
        ExpectedDispatchDate: '',
        CaseType: [],
        Remark: '',
        PatientRefID: '',
        clinicId: ''
    });


    useEffect(() => {
        return () => {
            setPlanData(null);
            formik.resetForm();
        }
    }, [])

    useEffect(() => {
        if (caseList) {
            const options = caseList.map((clinic) => clinic.Subspecialization)
            setCaseOption(options);
        }
    }, [caseList]);

    useEffect(() => {
        axios.get(`${specializationAPIConfig.fetch}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data.data)
                // here I recive the case Type
                setCaseList(response.data.data)

            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }, [])

    useEffect(() => {
        if (clinicList) {
            const options = clinicList.map((clinic) => clinic.name)
            setClinicOptions(options);
        }
    }, [clinicList]);
    useEffect(() => {
        axios.get(`${clinicAPIConfig.list}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setClinicList(response.data.data.PartnerList)

            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }, [])

    useEffect(() => {
        if (patientList) {
            const options = patientList.map((clinic) => clinic.name)
            setPatientOption(options);
        }
    }, [patientList]);

    useEffect(() => {
        if (ID) {
            axios.get(`${patientAPIConfig.patientListForClinic}/${ID}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setPatientList(response.data.data)

                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
        }

    }, [ID])



    useEffect(() => {
        if (props?.CaseID) {
            axios.get(`${caseAPIConfig.getCaseByID}/${props.CaseID}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setID(response.data.data.clinicId._id)
                    setPlanData(response.data.data);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
        }
    }, [props.CaseID]);

    useEffect(() => {
        if (planData) {
            formik.setValues({
                ReferenceNo: planData.ReferenceNo || '',
                Date: planData.Date || '',
                ExpectedDispatchDate: planData.ExpectedDispatchDate || '',
                CaseType: planData.CaseType || [],
                Remark: planData.Remark || '',
                PatientRefID: planData.PatientRefID.name || '',
                clinicId: planData.clinicId.name || ''
            });
        }
    }, [planData]);

    const validationSchema = Yup.object().shape({
        ReferenceNo: Yup.string().required('Reference number is required'),
        Date: Yup.date().required('Date is required'),
        ExpectedDispatchDate: Yup.date()
            .required('Expected dispatch date is required')
            .when('Date', (date, schema) => {
                return schema.min(date, 'Expected dispatch date must be greater than date');
            })
            .transform((originalValue, originalObject) => {
                const expectedDispatchDate = new Date(originalValue);
                return isNaN(expectedDispatchDate) ? new Date() : expectedDispatchDate;
            }),
        CaseType: Yup.array().required('Case type is required').min(1, 'Select at least one case type'),
        Remark: Yup.string(),
        PatientRefID: Yup.string().required('Patient reference ID is required'),
        clinicId: Yup.string().required('Clinic is required')
    });


    const handleSubmit = (values) => {
        const formData = new FormData();
        // let CaseID=[]
        // if (values.CaseType) {
        //     values.CaseType.forEach((caseType) => {
        //         CaseID.push(caseList.find((clinic) => clinic.Subspecialization === caseType)._id);
        //     });
        // }
        const clinicId = clinicList?.find((clinic) => clinic.name === values.clinicId)._id
        const patientId = patientList?.find((clinic) => clinic.name === values.PatientRefID)._id

        formData.append('ReferenceNo', values.ReferenceNo);
        formData.append('Date', values.Date);
        formData.append('ExpectedDispatchDate', values.ExpectedDispatchDate);
        formData.append('CaseType', values.CaseType);
        formData.append('Remark', values.Remark);
        formData.append('PatientRefID', patientId);
        formData.append('clinicId', clinicId)

        if (props.CaseID) {
            axios.put(`${caseAPIConfig.edit}/${props.CaseID}`, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    dispatch(showMessage({ message: 'Case updated successfully', variant: 'success' }));
                    props.setOpen(!props.open);
                    props.setChange(!props.change);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })

        } else {
            axios.post(caseAPIConfig.register, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 201) {
                    dispatch(showMessage({ message: 'Case added successfully', variant: 'success' }));
                    formik.resetForm();
                    props.setOpen(!props.open);
                    props.setChange(!props.change);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })
        }
    };

    const formik = useFormik({
        initialValues: {
            ReferenceNo: '',
            Date: '',
            ExpectedDispatchDate: '',
            CaseType: [],
            Remark: '',
            PatientRefID: '',
            clinicId: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <Container maxWidth="md">
            <IconButton onClick={() => { props.setOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                <CloseIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="600" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
                {props.labPartnerPlanId ? 'Service Plan Update Form' : 'Register case'}
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="ReferenceNo"
                    name="ReferenceNo"
                    label="Reference Number"
                    value={formik.values.ReferenceNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.ReferenceNo && Boolean(formik.errors.ReferenceNo)}
                    helperText={formik.touched.ReferenceNo && formik.errors.ReferenceNo}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    id="Date"
                    name="Date"
                    type="date"
                    label="Date"
                    variant='outlined'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={formik.values.Date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Date && Boolean(formik.errors.Date)}
                    helperText={formik.touched.Date && formik.errors.Date}
                    sx={{ mb: 2 }}
                />
                <Autocomplete
                    options={clinicOptions}
                    name="clinicId"
                    value={formik.values.clinicId}
                    onChange={(event, newValue) => {
                        setID(clinicList?.find((clinic) => clinic.name === newValue)?._id)
                        formik.setFieldValue("clinicId", newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ mb: 2 }}

                            label="Clinic"
                            variant="outlined"
                        />)}
                />

                <TextField
                    fullWidth
                    id="ExpectedDispatchDate"
                    name="ExpectedDispatchDate"
                    type="date"
                    label="Expected Dispatch Date"
                    variant='outlined'
                    value={formik.values.ExpectedDispatchDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.ExpectedDispatchDate && Boolean(formik.errors.ExpectedDispatchDate)}
                    helperText={formik.touched.ExpectedDispatchDate && formik.errors.ExpectedDispatchDate}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Autocomplete
                    options={caseOption}
                    name="CaseType"
                    value={formik.values.CaseType || []}
                    onChange={(event, newValue) => {
                        formik.setFieldValue("CaseType", newValue);
                    }}
                    multiple
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ mb: 2 }}

                            label="Case Type"
                            variant="outlined"
                        />)}
                        
                />

                <TextField
                    fullWidth
                    id="Remark"
                    name="Remark"
                    label="Remark"
                    value={formik.values.Remark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Remark && Boolean(formik.errors.Remark)}
                    helperText={formik.touched.Remark && formik.errors.Remark}
                    sx={{ mb: 2 }}
                />

                <Autocomplete
                    options={patientOption}
                    name=""
                    value={formik.values.PatientRefID}
                    onChange={(event, newValue) => {
                        formik.setFieldValue("PatientRefID", newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ mb: 2 }}

                            label="Patient Name"
                            variant="outlined"
                        />)}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>


            </form>


        </Container>
    );
};

export default ServiceRegisterForm;



