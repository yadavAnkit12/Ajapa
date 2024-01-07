import _ from '@lodash';
import { Typography, TableContainer, TableCell, TableRow, TableHead, Paper, Table, TableBody, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { LabOrderAPIConfig } from '../../API/apiConfig';
import axios from 'axios';
import './order.css';
import { lighten } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showMessage } from "app/store/fuse/messageSlice";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate } from 'react-router-dom';


function LabOrderEHR() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const routeParams = useParams();
    const [orderData, setOrderData] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [EHRList, setEHRList] = useState({});

    useEffect(() => {
        const { orderId } = routeParams;
        setOrderId(orderId);
    }, [])

    useEffect(() => {
        if (orderId) {
            axios.get(`${LabOrderAPIConfig.view}/${orderId}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    console.log(response.data.data)
                    setOrderData(response.data.data);
                } else {
                    dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
                }
            });
        }
    }, [orderId])

    useEffect(() => {
        if (orderData && orderId) {
            fetchEHRList();
        }
    }, [orderData])

    const fetchEHRList = () => {
        axios.get(`${LabOrderAPIConfig.getEHRList}/${orderId}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then(response => {
            if (response.status === 200) {
                let list = {};
                if (_.size(orderData.services) > 0) {
                    orderData.services.forEach((row, idx) => {
                        if (_.size(row.members) > 0) {
                            row.members.forEach((member, index) => {
                                list[`${idx}${index}-input`] = _.find(response.data.data, (doc) => doc.patientId === member._id && doc.serviceId === row.serviceId._id)?.report[0]?.originalName || '';
                            })
                        }
                    })
                }
                setEHRList(list);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }

    const handleFileChange = (file, id) => {
        let list = { ...EHRList };
        list[id] = file;
        setEHRList(list);
    };

    const uploadDocument = (docId, patientId, serviceId) => {
        const params = {
            orderId: orderId,
            patientId: patientId,
            serviceId: serviceId,
            report: EHRList[docId] || {}
        }
        axios.post(`${LabOrderAPIConfig.uploadEHR}`, params, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then(response => {
            if (response.status === 200) {
                if(response.data.data===null){
                    dispatch(showMessage({ message: response.data.error_message,variant:'error' }));

                }
                else{

                    dispatch(showMessage({ message: response.data.message }));
                }
                fetchEHRList();
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }

    const getDocumentTitle = (id) => {
        if (typeof (EHRList[id]) === "string") {
            return EHRList[id];
        } else if (typeof (EHRList[id]) === "object") {
            return EHRList[id].name;
        }
        return '';

    }

    const back=()=>{
        navigate(`/app/pathologyOrder`);
    }

    return (
        <>
            <div className="flex justify-start pt-24 mx-32">
                <div className='flex'>
                    <div style={{marginRight:'10px'}}>
                    <ArrowCircleLeftIcon onClick={back} fontSize="large" ></ArrowCircleLeftIcon>
                    </div>
                <Typography className="font-semibold mb-4 text-3xl">
                    Lab Order EHR Upload
                </Typography>
                </div>
            </div>
            {orderData && <TableContainer component={Paper} className="mx-32 mb-24 w-auto">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? lighten(theme.palette.background.default, 0.4)
                                    : lighten(theme.palette.background.default, 0.02),
                        }}>
                            <TableCell>Name</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Service Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Sample Type</TableCell>
                            <TableCell>Select</TableCell>
                            <TableCell>Document</TableCell>
                            <TableCell>Upload</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.size(orderData.services) > 0 && orderData.services.map((row, idx) => (
                            _.size(row.members) > 0 && row.members.map((member, index) => (
                                <TableRow
                                    key={idx + index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {member.memberId.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {member.memberId.mobile}
                                    </TableCell>
                                    <TableCell>{row.serviceId.serviceName}</TableCell>
                                    <TableCell>{row.serviceId.email}</TableCell>
                                    <TableCell>{row.serviceId.sampleType}</TableCell>
                                    <TableCell>
                                        <label htmlFor={`${idx}${index}-input`}>
                                            <Button component="span"
                                                sx={{
                                                    backgroundColor: (theme) =>
                                                        theme.palette.mode === 'dark'
                                                            ? lighten(theme.palette.background.default, 0.4)
                                                            : lighten(theme.palette.background.default, 0.02),
                                                }}
                                                className="flex items-center justify-center relative p-10 rounded-4 overflow-hidden cursor-pointer shadow hover:shadow-lg">
                                                Select
                                            </Button>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                id={`${idx}${index}-input`}
                                                onChange={async (e) => {
                                                    function readFileAsync() {
                                                        return new Promise((resolve, reject) => {
                                                            const file = e.target.files[0];
                                                            if (!file) {
                                                                return;
                                                            } else {
                                                                resolve(file)
                                                            }
                                                        });
                                                    }
                                                    const newImage = await readFileAsync();
                                                    handleFileChange(newImage, `${idx}${index}-input`);
                                                    e.target.value = '';
                                                }}
                                                hidden
                                            />
                                        </label>
                                    </TableCell>
                                    <TableCell>{getDocumentTitle(`${idx}${index}-input`)}</TableCell>
                                    <TableCell>
                                        <Button
                                            disabled={typeof (EHRList[`${idx}${index}-input`]) !== "object"}
                                            sx={{
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode === 'dark'
                                                        ? lighten(theme.palette.background.default, 0.4)
                                                        : lighten(theme.palette.background.default, 0.02),
                                            }}
                                            className="flex items-center justify-center relative p-10 rounded-4 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                                            onClick={(e) => uploadDocument(`${idx}${index}-input`, member.memberId._id, row.serviceId._id)}
                                        >
                                            Upload
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer >}
        </>
    )
}

export default LabOrderEHR;