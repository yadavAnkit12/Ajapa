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

function LabOrderSampleCollected() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const routeParams = useParams();
    const [orderData, setOrderData] = useState([]);
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        const { orderId } = routeParams;
        setOrderId(orderId);
    }, [])

    useEffect(() => {
        if (orderId) {
            fetchOrderData();
        }
    }, [orderId])

    const fetchOrderData = () => {
        axios.get(`${LabOrderAPIConfig.view}/${orderId}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setOrderData(response.data.data);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        });
    }

    const statusChangeHandler = (orderId, patientId, serviceId) => {
        const params = {
            orderId: orderId,
            patientId: patientId,
            serviceId: serviceId
        }
        axios.put(`${LabOrderAPIConfig.setSampleCollected}`, params, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then(response => {
            if (response.status === 200) {
                dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                fetchOrderData();
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
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
                            <TableCell>Action</TableCell>
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
                                        <Button
                                            disabled={member.isCollect}
                                            sx={{
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode === 'dark'
                                                        ? lighten(theme.palette.background.default, 0.4)
                                                        : lighten(theme.palette.background.default, 0.02),
                                            }}
                                            className="flex items-center justify-center relative p-10 rounded-4 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                                            onClick={(e) => statusChangeHandler(orderData._id, member.memberId._id, row.serviceId._id)}
                                        >
                                            Sample Collected
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

export default LabOrderSampleCollected;