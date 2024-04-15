import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { forwardRef, useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogTitle, Slide } from '@mui/material';
import axios from 'axios';
import { eventAPIConfig } from 'src/app/main/API/apiConfig';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const fontHead = {
    fontStyle: "normal",
    fontSize: "24px",
    lineHeight: "28px",
    letterSpacing: "0px",
    textAlign: "center",
    fontWeight: "bold",
}

const fontSmall = {
    fontStyle: 'normal', fontSize: '16px',
    lineHeight: '28px', letterSpacing: '0px',
    textAlign: 'center', fontWeight: 600,
    marginTop: '5px'
}
function EventRegisterFormHead(props) {
    const dispatch = useDispatch()
    const [data, setData] = useState('')
    const [open, setOpen] = useState(false)

            // function to convert date from yyyy-mm-dd format to dd-mm-yyyy
            function formatDate(inputDate) {
                
                if(inputDate == undefined)
                  return inputDate

                const parts = inputDate.split('-');
                const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            
                return formattedDate;
            }


    useEffect(() => {
        if (props?.eventData) {
            console.log("Data", props.eventData.data)
            setData(props.eventData.data)
        }
    }, [props?.eventData])

    const handleCancelAllRegistration = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const deleteEventRegistration = () => {
        props.setLoading(true)
        const formData = new FormData()
        formData.append('eventId', props.registerList[0].eventId)
        formData.append('familyId', props.registerList[0].familyId)

        axios.post(`${eventAPIConfig.cancelAllRegistration}`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                props.setLoading(false)
                dispatch(showMessage({ message: `Jai Guru. Your registration for ${data.eventName} is deleted successfully for all members`, variant: 'success' }));
                setOpen(false)
                props.setChange(!props.change)
            } else {
                props.setLoading(false)
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        }).catch((error) => {
            props.setLoading(false)
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));

        })

    }




    return <>
        <div className="w-full flex flex-col min-h-full">
            <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-10">
                <Typography
                    component={motion.span}
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    delay={300}
                    style={fontHead}
                >
                    Event Registration
                </Typography>
                <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
                    <motion.div
                        className="flex"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                    >

                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            // color="secondary"
                            disabled={props?.registerList?.length === 0}
                            style={{
                                backgroundColor: props?.registerList?.length === 0 ? '#d3d3d3' : '#4f46e5', color: 'white',
                            }}
                            onClick={() => handleCancelAllRegistration()}
                        >
                            Cancel All Registrations
                        </Button>
                    </motion.div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center  py-16 px-10 shadow-1 rounded-16">
                <div className='mx-4'>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={fontSmall}
                    >
                        Event name :
                    </Typography>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={{ ...fontSmall, color: '#792b00', fontSize: '14px' }}
                    >
                        {data.eventName}
                    </Typography>
                </div>
                <div className='mx-4'>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={fontSmall}
                    >
                        Event date :
                    </Typography>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={{ ...fontSmall, color: '#792b00', fontSize: '14px' }}
                    >
                        {formatDate(data.eventDate)}
                    </Typography>
                </div>


                {/* <div>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={fontSmall}
                    >
                        Event location :
                    </Typography>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={{ ...fontSmall, color: '#C4A484', fontSize: '14px' }}
                    >
                        {data.eventLocation}
                    </Typography>
                </div> */}
                {/* <div>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={fontSmall}
                    >
                        Event type :
                    </Typography>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={{ ...fontSmall, color: '#C4A484', fontSize: '14px' }}
                    >
                        {data.eventType}
                    </Typography>
                </div> */}

                {
                    data.shivirStartDate &&
                    <div className='mx-4'>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={fontSmall}
                    >
                        Shivir Data :
                    </Typography>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={{ ...fontSmall, color: '#792b00', fontSize: '14px' }}
                    >
                        {formatDate(data.shivirStartDate)} - {formatDate(data.shivirEndDate)}
                    </Typography>
                </div> 
                }

                {/* <div>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={fontSmall}
                    >
                        Registration status :
                    </Typography>
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={{ ...fontSmall, color: data.bookingStatus ? 'green' : 'red', fontSize: '14px', fontWeight: 'bold' }}
                    >
                        {data.bookingStatus ? 'On' : 'Off'}
                    </Typography>
                </div> */}
            </div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Do you want to delete registration for all members ?"}</DialogTitle>

                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={deleteEventRegistration} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    </>

}

export default EventRegisterFormHead