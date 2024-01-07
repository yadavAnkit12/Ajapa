import _ from '@lodash';
import { Typography, Card, CardContent, IconButton, Grid, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { appointmentAPIConfig } from 'src/app/main/API/apiConfig';
import axios from 'axios';
import './Appointment.css';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function AppointmentView(props) {
    const [appointmentData, setAppointmentData] = useState([])

    useEffect(() => {

        if (props?.viewid) {
            axios.get(`${appointmentAPIConfig.appointmentView}/${props?.viewid}`, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setAppointmentData(response.data.data);
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

    const printHandler = () => {
        let elem = document.getElementById("printThis");
        let domClone = elem.cloneNode(true);
        domClone.id = "clonedElement";

        let $printSection = document.getElementById("printSection");

        if (!$printSection) {
            $printSection = document.createElement("div");
            $printSection.id = "printSection";
            document.body.appendChild($printSection);
        }

        $printSection.innerHTML = "";
        $printSection.appendChild(domClone);
        window.print();
    }
    return (
        <div height="100px">
            <div className="w-full flex flex-col min-h-full">
                <IconButton onClick={() => { props.setOpen(!props.open) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                    <CloseIcon />
                </IconButton>
            </div>

            <div className="w-full flex flex-col min-h-full" id="printThis">

                <motion.div variants={container} initial="hidden" animate="show" className="w-full">
                    <div className="md:flex  flex-col justify-between">
                        <div className="flex flex-col flex-1 mx-10">
                            <Card component={motion.div} variants={item} className="w-full mb-32">
                                <div className="flex sm:flex-row flex-col justify-center items-center pt-24 printContent">
                                    <Typography className="text-3xl mx-auto font-semibold leading-tight text-center">
                                        Appointment Details
                                    </Typography>
                                    <FuseSvgIcon className="text-48 float-left mx-10" size={24} color="action" onClick={() => printHandler()}>material-outline:local_printshop</FuseSvgIcon>
                                </div>
                                <CardContent className="flex sm:flex-row flex-col flex-wrap px-32 py-24 justify-between printContent">
                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Appointment Number</Typography>
                                        {appointmentData?.appointment?.appointmentNo}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Appointment Date</Typography>
                                        {appointmentData?.appointment?.date}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Rescheduled</Typography>
                                        {appointmentData?.appointment?.reSchedule}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Appointment Type</Typography>
                                        {appointmentData?.appointment?.appointmentType}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Slot Time</Typography>
                                        {appointmentData?.appointment?.slot}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Appointment Status</Typography>
                                        {appointmentData?.appointment?.status}
                                    </div>

                                    <div className="grid-items">
                                        <Typography className="font-semibold mb-4 text-15">Appointment Day</Typography>
                                        {appointmentData?.appointment?.day}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex md:flex-row flex-col w-full">
                            {(_.get(appointmentData, 'patient') && props.type !== 'patient') && <div className="flex flex-col w-full mx-10 md:w-1/2 mb-24">
                                <Card component={motion.div} variants={item} className="w-full">
                                    <div className="flex flex-col justify-center items-center pt-24 printContent">
                                        <Typography className="text-2xl mx-auto font-semibold leading-tight text-center">
                                            Patient's Details
                                        </Typography>
                                    </div>

                                    <CardContent className="flex flex-row flex-wrap px-32 py-24 justify-between printContent">
                                        <div className="grid-items">
                                            <Typography className="font-semibold mb-4 text-15">Name</Typography>
                                            {appointmentData?.patient.name}
                                        </div>

                                        <div className="grid-items">
                                            <Typography className="font-semibold mb-4 text-15">Mobile</Typography>
                                            {appointmentData?.patient.mobile}
                                        </div>

                                        <div className="grid-items">
                                            <Typography className="font-semibold mb-4 text-15">Patient Status</Typography>
                                            {appointmentData?.patient.status}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>}

                            {(_.get(appointmentData, 'doctor') && props.type !== 'doctor') && <div className="flex flex-col w-full mx-10 md:w-1/2  mb-24">
                                <Card component={motion.div} variants={item} className="w-full">
                                    <div className="flex sm:flex-row flex-col justify-center items-center pt-24 printContent">
                                        <Typography className="text-2xl mx-auto font-semibold leading-tight">
                                            Doctor's Details
                                        </Typography>
                                    </div>

                                    <CardContent className="flex sm:flex-row flex-col flex-wrap px-32 py-24 justify-between printContent">
                                        <div className="grid-items">
                                            <Typography className="font-semibold mb-4 text-15">Name</Typography>
                                            {appointmentData?.doctor.name}
                                        </div>

                                        <div className="grid-items">
                                            <Typography className="font-semibold mb-4 text-15">Mobile</Typography>
                                            {appointmentData?.doctor.mobile}
                                        </div>

                                        <div className="grid-items">
                                            <Typography className="font-semibold mb-4 text-15">Email</Typography>
                                            {appointmentData?.doctor.email}
                                        </div>

                                        <div className="grid-items">
                                            <Typography className="font-semibold mb-4 text-15">Doctor Type</Typography>
                                            {appointmentData?.doctor.doctorType}
                                        </div>

                                        <div className="grid-items">
                                            <Typography className="font-semibold mb-4 text-15">Specialization</Typography>
                                            {appointmentData?.doctor.specialization}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

    );
}

export default AppointmentView;