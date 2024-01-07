import _ from '@lodash';
import { Typography, Card, CardContent, IconButton, Grid, Stack, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import { caseAPIConfig, labPartnerAPIConfig } from 'src/app/main/API/apiConfig';
import axios from 'axios';
import { getUserRoles } from '../../../auth/services/utils/common';
import FuseLoading from '@fuse/core/FuseLoading';

function ServiceView(props) {
    const [serviceData, setServiceData] = useState('')
    const [loading,setLoading]=useState(true)
    const dispatch=useDispatch()

    useEffect(() => {
        if (props?.viewid) {
            axios.get(`${caseAPIConfig.getCaseByID}/${props?.viewid}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setServiceData(response.data.data);
                    setLoading(false)
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            });
        }
    }, [props?.viewid])

    const container = {
        show: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0 },
    };
    const extractTextFromHTML = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    if(loading){
        return <FuseLoading/>
    }

    const descriptionText = extractTextFromHTML(serviceData.description);
    return (
        <div height="auto">
            <div className="w-full flex flex-col min-h-full">
                <IconButton onClick={() => { props.setOpen(!props.open) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                    <CloseIcon />
                </IconButton>
            </div>

            <div className="w-full flex flex-col min-h-full">

                <motion.div variants={container} initial="hidden" animate="show" className="w-full">
                    <div className="md:flex  flex-col justify-between">
                        <div className="flex flex-col flex-1 mx-10">
                            <Card component={motion.div} variants={item} className="w-full mb-32">
                                <div className="flex justify-center pt-24">
                                    <Typography className="text-3xl mx-auto font-semibold leading-tight">
                                        Case Details
                                    </Typography>
                                </div>
                                <CardContent className="px-32 py-24">
                                    <Grid container>
                                        <Grid item xs={3}>
                                            <Stack spacing={3} sx={{ mt: 2, padding: '16px' }}>
                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Reference No.</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData.ReferenceNo}</Typography>
                                                </div>

                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Clinic Name</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData?.clinicId?.name}</Typography>
                                                </div>

                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Clinic GST no.</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData?.clinicId?.gstNo}</Typography>
                                                </div>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <Stack spacing={3} sx={{ mt: 2, padding: '16px' }}>
                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Status</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData.status}</Typography>
                                                </div>

                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Clinic Mobile no.</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData?.clinicId?.mobile}</Typography>
                                                </div>

                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Case Types</Typography>
                                                    {serviceData?.CaseTypes?.map((caseItem, index) => (
                                                        <Typography className="font-semibold mb-4 text-12 text-muted" key={index}>
                                                            {caseItem.subSpecialization}
                                                            {index < serviceData.CaseTypes.length - 1 && ','}
                                                        </Typography>
                                                    ))}
                                                </div>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <Stack spacing={3} sx={{ mt: 2, padding: '16px' }}>
                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Patient Name</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData?.PatientRefID?.name}</Typography>
                                                </div>

                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15" style={{ whiteSpace: 'nowrap' }}>Clinic license no.</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData?.clinicId?.licenseNo}</Typography>
                                                </div>

                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Date</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData.Date}</Typography>
                                                </div>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <Stack spacing={3} sx={{ mt: 2, marginBottom: 2, marginLeft: 2, padding: '16px' }}>
                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15 " style={{ whiteSpace: 'nowrap' }}>Patient Mobile no.</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData?.PatientRefID?.mobile}</Typography>
                                                </div>

                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Patient Age</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData?.PatientRefID?.age}</Typography>
                                                </div>

                                                <div className="mb-12">
                                                    <Typography className="font-semibold mb-2 text-15">Expected Dispatch Date</Typography>
                                                    <Typography className="font-semibold mb-4 text-12 text-muted">{serviceData.ExpectedDispatchDate}</Typography>
                                                </div>
                                            </Stack>
                                        </Grid>
                                    </Grid>

                                    <TableContainer>
                                        <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Case Type</TableCell>
                                                    <TableCell style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Document URL</TableCell>
                                                    <TableCell style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Remark</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {serviceData?.CaseTypes?.map((caseItem, index) => (
                                                    <TableRow key={index} style={{ border: '1px solid #dddddd' }}>
                                                        <TableCell style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{caseItem.subSpecialization}</TableCell>
                                                        <TableCell style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                                            {caseItem.attachments.map((attachment, attachmentIndex) => (
                                                                <div key={attachmentIndex}>
                                                                    <a href={attachment.documentUrl} >
                                                                        {attachment.documentName}
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{caseItem.remark}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </div>



                    </div>
                </motion.div>
            </div>
        </div>

    );
}

export default ServiceView;