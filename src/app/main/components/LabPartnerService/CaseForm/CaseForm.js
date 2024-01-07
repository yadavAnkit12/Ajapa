import ServiceFormHead from "./CaseFormHead";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import FusePageCarded from '@fuse/core/FusePageCarded';
import { FormProvider } from 'react-hook-form';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useFormik } from 'formik';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { TextField, Autocomplete, Typography, Tooltip, Card, CardContent, Grid, IconButton, Fab, Modal } from '@mui/material';
import { caseAPIConfig, clinicAPIConfig, patientAPIConfig, specializationAPIConfig } from "src/app/main/API/apiConfig";
import { useParams } from "react-router-dom";
import { getUserRoles } from "src/app/auth/services/utils/common";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import PatientRegisterForm from "../../patient/patientRegisterForm";
import { Box } from "@mui/system";



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
const CaseForm = () => {

    const routeParams = useParams()
    const navigate = useNavigate()
    const [tabValue, setTabValue] = useState(0)
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const dispatch = useDispatch();
    const [attachmentValues, setAttachmentValues] = useState('')
    const [selectedFile, setSelectedFile] = useState([]);
    const [clinicList, setClinicList] = useState([])
    const [remarkData, setRemarkData] = useState([])
    const [ID, setID] = useState('')
    const [clinicOptions, setClinicOptions] = useState('')
    const [caseOption, setCaseOption] = useState([])
    const [caseList, setCaseList] = useState([])
    const [CaseID, setCaseID] = useState('')
    const [patientList, setPatientList] = useState([])
    const [patientOption, setPatientOption] = useState('')
    const [selectedCaseType, setSelectedCaseType] = useState(null);
    const [fileData, setFileData] = useState([])
    const [selectedPatient, setSelectedPatient] = useState('')
    const [addPatiennt, setAddPatient] = useState(false)
    const [planData, setPlanData] = useState({
        ReferenceNo: '',
        Date: '',
        ExpectedDispatchDate: '',
        CaseTypes: [],
        Remark: '',
        PatientRefID: '',
        clinicId: ''
    });

    const menuItem =
        [
            {
                key: 1,
                label: 'Edit',
                status: 'Edit',
            },
            {
                key: 2,
                label: 'Delete',
                status: 'Delete',
            },

        ];

    useEffect(() => {
        return () => {
            setPlanData(null);
            formik.resetForm();
        }
    }, [])

    useEffect(() => {
        if (caseList) {
            const options = caseList.map((clinic) => clinic.subSpecialization)
            setCaseOption(options);
        }
    }, [caseList]);


    //list of Case Type
    useEffect(() => {
        axios.get(`${specializationAPIConfig.fetch}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setCaseList(response.data.data)
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }, [])

    const handleCaseTypeChange = (event, newValue) => {

        const selectedCase = caseList?.filter((caseType) => newValue.includes(caseType.subSpecialization));
        setSelectedCaseType(selectedCase);
    };

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
            const options = patientList.map((patient) => `${patient.name} (${patient.mobile})`);
            setPatientOption(options);
        }
    }, [patientList]);

    useEffect(() => {
        if (getUserRoles() === 'clinic') {
            const roleID = sessionStorage.getItem('id');
            setID(roleID)
        }

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
        const { CaseID } = routeParams;
        if (CaseID == "new") {
            //   setIsLoaded(true)
        } else {
            setCaseID(CaseID);
        }
    }, []);

    useEffect(() => {
        if (CaseID) {
            axios.get(`${caseAPIConfig.getCaseByID}/${CaseID}`, {
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
    }, [CaseID]);

    useEffect(() => {
        if (planData) {
            formik.setValues({
                ReferenceNo: planData.ReferenceNo || '',
                Date: planData.Date || '',
                ExpectedDispatchDate: planData.ExpectedDispatchDate || '',
                CaseTypes: (planData?.CaseTypes || []).map((caseItem) => caseItem?.subSpecialization) || [],
                Remark: planData.Remark || '',
                PatientRefID: planData.PatientRefID.name || '',
                clinicId: planData.clinicId.name || ''
            });
            setSelectedCaseType(planData?.CaseTypes)
            setSelectedPatient(planData.PatientRefID)
            planData?.CaseTypes?.forEach((caseType) => {
                caseType?.attachments?.forEach((attachment) => {
                    setFileData((prevFileData) => [
                        ...prevFileData,
                        {
                            [`${attachment.documentName}_for_${caseType.subSpecialization}`]: {
                                HeaderId: attachment.HeaderID || '',
                                location: attachment.documentUrl,
                            },
                        },
                    ]);

                    setSelectedFile((prevFileData) => [
                        ...prevFileData,
                        {
                            'fieldName': `${attachment.documentName}_for_${caseType.subSpecialization}`,
                            'fileName': attachment.documentUrl.substring(attachment.documentUrl.lastIndexOf('/') + 1),
                        },
                    ]);
                });

                setRemarkData((prevFileData) => [
                    ...prevFileData,
                    {
                        'fieldName': caseType.subSpecialization,
                        'value': caseType.remark
                    },
                ]);
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
        PatientRefID: Yup.string().required('Patient reference ID is required'),
        clinicId: Yup.string().required('Clinic is required')
    });


    const handleSubmit = (values) => {
        const clinicId = getUserRoles() === 'clinic' ? ID : clinicList?.find((clinic) => clinic.name === values.clinicId)?._id
        const patientId = patientList?.find((clinic) => clinic.name === values.PatientRefID.split('(')[0].trim())?._id

        const formattedData = {
            AddedBy: sessionStorage.getItem('id'),
            clinicId: clinicId,
            ReferenceNo: values.ReferenceNo,
            Date: values.Date,
            ExpectedDispatchDate: values.ExpectedDispatchDate,
            CaseTypes: selectedCaseType.map((caseType) => {
                return {
                    subSpecialization: caseType.subSpecialization,
                    attachments: caseType.attachments.map((attachment) => {
                        const fieldName = `${attachment.documentName}_for_${caseType.subSpecialization}`;
                        const fileObject = fileData.find((file) => file.hasOwnProperty(fieldName))?.[fieldName];
                        return {
                            documentName: attachment.documentName,
                            documentUrl: fileObject.location,
                            HeaderID: fileObject.HeaderId
                        };
                    }),
                    remark: remarkData
                        .filter((data) => data.fieldName === caseType.subSpecialization)
                        .map((data) => data.value)
                        .join()
                };
            }),
            PatientRefID: patientId,
        };
        console.log(formattedData)

        if (CaseID) {
            axios.put(`${caseAPIConfig.edit}/${CaseID}`, formattedData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 201) {
                    dispatch(showMessage({ message: 'Case updated successfully', variant: 'success' }));
                    navigate('/app/case')
                    // props.setOpen(!props.open);
                    // props.setChange(!props.change);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            })

        } else {
            axios.post(caseAPIConfig.register, formattedData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 201) {
                    dispatch(showMessage({ message: 'Case added successfully', variant: 'success' }));
                    formik.resetForm();
                    navigate('/app/case')
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

    function handleTabChange(event, value) {
        setTabValue(value);
    }


    // handling file or url data
    const handleFileUpload = (value, type, FieldName) => {
        if (type === 'Upload') {
            const formData = new FormData();
            formData.append('file', value.files[0]);

            if (fileData.length > 0) {
                // console.log(fileData);
                const existingFile = fileData.find(file => file.hasOwnProperty(FieldName))?.HeaderId;
                formData.append('HeaderId', existingFile);
            }

            axios.post(`${caseAPIConfig.fileUpload}`, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    // console.log(response);
                    const existingFileIndex = fileData.findIndex(file => file.hasOwnProperty(FieldName));
                    if (existingFileIndex > -1) {
                        setFileData(prevFileData => {
                            const updatedFileData = [...prevFileData];
                            updatedFileData[existingFileIndex] = { [FieldName]: { HeaderId: response.data.data.HeaderId, location: response.data.data.Location } };
                            return updatedFileData;
                        });
                    } else {
                        setFileData(prevFileData => [
                            ...prevFileData,
                            { [FieldName]: { HeaderId: response.data.data.HeaderId, location: response.data.data.Location } },
                        ]);
                    }
                }
            });
        } else {
            setFileData(prevFileData => [
                ...prevFileData,
                { [FieldName]: { location: value.value } },
            ]);
        }
    };
    const handleRemark = (FieldName, value) => {

        setRemarkData((prevData) => {
            const updatedData = prevData.map((data) => {
                if (data.fieldName === FieldName) {
                    // If the fieldName matches, update the value
                    return {
                        ...data,
                        value: value,
                    };
                }
                return data;
            });

            // If the fieldName doesn't exist, add a new entry
            if (!updatedData.some((data) => data.fieldName === FieldName)) {
                updatedData.push({
                    fieldName: FieldName,
                    value: value,
                });
            }

            return updatedData;
        });
    };


    const handleFileAction = (id, selectedValue) => {
        // console.log(id, selectedValue)

    }

    const handleFileName = (fieldName, newFileName) => {

        setSelectedFile((prevFileData) => {
            // Check if fieldName already exists in prevFileData
            const isFieldNameExists = prevFileData.some((file) => file.fieldName === fieldName);

            if (isFieldNameExists) {
                // Update the fileName if fieldName matches
                const updatedFileData = prevFileData.map((file) => {
                    if (file.fieldName === fieldName) {
                        return {
                            ...file,
                            fileName: newFileName,
                        };
                    }
                    return file;
                });

                return updatedFileData;
            } else {
                // Add a new entry if fieldName doesn't exist
                return [
                    ...prevFileData,
                    {
                        fieldName: fieldName,
                        fileName: newFileName,
                    },
                ];
            }
        });
    };

    const handleViewDocument = (name) => {
        fileData.map((file) => {
            if (file.hasOwnProperty(name)) {
                window.open(file[name].location, '_blank');
            }
        })
    }

    const handleAddNewPatient = () => {
        setAddPatient(true)
    }
    const handleAddNewPatientClose = () => {
        setAddPatient(false)
    }
    

    return <FormProvider>
        <FusePageCarded
            header={<ServiceFormHead handleSubmit={handleSubmit} values={formik.values} />}

            content={
                <>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        classes={{ root: 'w-full h-64 border-b-1' }}
                    >

                        <Tab className="h-64" label="Clinic & Patient" />
                        <Tab className="h-64" label="Referel & Dates" />
                        <Tab className="h-64" label="Cases" />

                    </Tabs>

                    <div className="p-16 sm:p-24 w-full">
                        <form onSubmit={formik.handleSubmit}>
                            <div className={tabValue !== 0 ? 'hidden' : ''}>
                                {getUserRoles() !== 'clinic' && <Autocomplete
                                    options={clinicOptions}
                                    name="clinicId"
                                    value={formik.values.clinicId}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("clinicId", newValue);
                                        setID(clinicList?.find((clinic) => clinic.name === newValue)?._id)
                                    }}
                                    className="max-w-2xl"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            sx={{ mb: 2 }}

                                            label="Clinic"
                                            variant="outlined"
                                        />)}
                                />}
                                <div className="d-flex">
                                    <Autocomplete
                                        options={patientOption}
                                        name="PatientRefID"
                                        value={formik.values.PatientRefID}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue("PatientRefID", newValue);
                                            const selectedPatientDetails = patientList.find((patient) => patient.name === newValue.split('(')[0].trim());
                                            setSelectedPatient(selectedPatientDetails)
                                        }}
                                        style={{ width: '100%' }}
                                        className="max-w-2xl"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                sx={{ mb: 2 }}
                                                label="Patient Name"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                    <Tooltip title="Add a new patient" arrow placement="top">
                                        <Fab color="primary" size="medium" aria-label="add" className="ml-5" onClick={handleAddNewPatient}>
                                            <AddIcon />
                                        </Fab>
                                    </Tooltip>
                                </div>


                                {selectedPatient && <div>
                                    <Card sx={{ p: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Patient Details
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6}>
                                                    <div className="mb-12">
                                                        <Typography className="font-semibold mb-2 text-15">Patient Name</Typography>
                                                        <Typography className="font-semibold mb-2 text-12 text-muted">{selectedPatient.name}</Typography>
                                                    </div>
                                                    <div className="mb-12">
                                                        <Typography className="font-semibold mb-2 text-15">Email</Typography>
                                                        <Typography className="font-semibold mb-2 text-12 text-muted">{selectedPatient.email}</Typography>
                                                    </div>
                                                    <div className="mb-12">
                                                        <Typography className="font-semibold mb-2 text-15">Age</Typography>
                                                        <Typography className="font-semibold mb-2 text-12 text-muted">{selectedPatient.age}</Typography>
                                                    </div>
                                                </Grid>
                                                <Grid item sm={6}>
                                                    <div className="mb-12">
                                                        <Typography className="font-semibold mb-2 text-15">Mobile no.</Typography>
                                                        <Typography className="font-semibold mb-2 text-12 text-muted">{selectedPatient.mobile}</Typography>
                                                    </div>
                                                    <div className="mb-12">
                                                        <Typography className="font-semibold mb-2 text-15">Gender</Typography>
                                                        <Typography className="font-semibold mb-2 text-12 text-muted">{selectedPatient.gender}</Typography>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                </div>}
                            </div>
                            <div className={tabValue !== 1 ? 'hidden' : ''}>
                                <Tooltip title="This is a reference number" arrow placement="right">
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
                                        className="max-w-2xl"
                                    />
                                </Tooltip>

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
                                    className="max-w-2xl"

                                    value={formik.values.Date}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Date && Boolean(formik.errors.Date)}
                                    helperText={formik.touched.Date && formik.errors.Date}
                                    sx={{ mb: 2 }}
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
                                    className="max-w-2xl"

                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>

                            <div className={tabValue !== 2 ? 'hidden' : ''}>
                                <Autocomplete
                                    options={caseOption}
                                    name="CaseTypes"
                                    value={formik.values.CaseTypes || []}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("CaseTypes", newValue);
                                        handleCaseTypeChange(event, newValue);
                                    }}
                                    className="max-w-2xl"
                                    multiple
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            sx={{ mb: 2 }}

                                            label="Case Type"
                                            variant="outlined"
                                        />)}

                                />
                                {selectedCaseType &&
                                    selectedCaseType?.map((caseType) => (
                                        <>
                                            {caseType.attachments?.map((attachment) => (
                                                <div key={attachment._id} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        fullWidth
                                                        required={attachment.isRequired}
                                                        id={`${attachment.documentName}_for_${caseType.subSpecialization}`}
                                                        name={attachment.documentName}
                                                        label={`${attachment.documentName} for ${caseType.subSpecialization}`}
                                                        type={attachment.documentType === 'Upload' ? 'file' : (attachment.documentUrl?.toLowerCase().endsWith(".pdf") ? 'file' : 'text')}
                                                        variant='outlined'
                                                        className="max-w-2xl"
                                                        onChange={(event, newValue) => {
                                                            const FieldName = `${attachment.documentName}_for_${caseType.subSpecialization}`;
                                                            const fieldName = FieldName;
                                                            const fileName = event.target.files[0]?.name || attachment.documentUrl;

                                                            const type = attachment.documentType || attachment.documentType === 'Upload' ? 'Upload' : (attachment.documentUrl?.toLowerCase().endsWith(".pdf") ? 'Upload' : 'text');
                                                            handleFileUpload(event.target, type, FieldName);

                                                            handleFileName(fieldName, fileName);
                                                        }}
                                                        onBlur={formik.handleBlur}
                                                        sx={{ mb: 2, mr: 1 }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {selectedFile.length > 0 && selectedFile.map((file) => {
                                                        if (file.fieldName === `${attachment.documentName}_for_${caseType.subSpecialization}`) {
                                                            return <>
                                                                <Tooltip title="Click to view" arrow placement="top">
                                                                    <IconButton onClick={() => handleViewDocument(`${attachment.documentName}_for_${caseType.subSpecialization}`)}>
                                                                        <RemoveRedEyeIcon></RemoveRedEyeIcon>
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Typography color='blueviolet'>{file.fieldName}</Typography>
                                                            </>
                                                        }
                                                    })}
                                                </div>
                                            ))}


                                            {(caseType.remarkRequired || caseType.remark) && (
                                                <TextField
                                                    fullWidth
                                                    id="Remark"
                                                    // name="Remark"
                                                    required
                                                    label="Remark"
                                                    value={remarkData.map((remark) =>
                                                        remark.fieldName === caseType.subSpecialization ? remark.value : null
                                                      )}
                                                      
                                                    onChange={(event, newValue) => {
                                                        const FieldName = caseType.subSpecialization
                                                        handleRemark(FieldName, event.target.value)
                                                    }}
                                                    className="max-w-2xl"

                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.Remark && Boolean(formik.errors.Remark)}
                                                    helperText={formik.touched.Remark && formik.errors.Remark}
                                                    sx={{ mb: 2 }}
                                                />
                                            )}
                                        </>
                                    ))}
                            </div>
                        </form>
                        <Modal
                            open={addPatiennt}
                            onClose={handleAddNewPatientClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <PatientRegisterForm setOpen={setAddPatient} />
                            </Box>
                        </Modal>

                    </div>
                </>
            }
            scroll={isMobile ? 'normal' : 'content'}
        />

    </FormProvider>
}

export default CaseForm