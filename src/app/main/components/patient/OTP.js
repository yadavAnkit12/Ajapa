import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from "react-redux";
import { Typography, Container, Button, TextField, Stack } from '@mui/material';
import { patientAPIConfig } from '../../API/apiConfig';
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";

const INITIAL_COUNT = 120

const twoDigit = (num) => String(num).padStart(2, '0')


const Otp = (props) => {
    const dispatch = useDispatch();
    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT);
    const [status, setStatus] = useState(null);
    const secondsToDisplay = secondsRemaining % 60;
    const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
    const minutesToDisplay = minutesRemaining % 60;

    useEffect(() => {
        setStatus(STATUS.STARTED);
    }, []);


    const handleStart = () => {
        axios.get(`${patientAPIConfig.sendOTP}?mobile=${props.mobile}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setStatus(STATUS.STARTED);
                setSecondsRemaining(INITIAL_COUNT);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        });
    };

    const STATUS = {
        STOPPED: <b>
            <a
                type="button"
                onClick={handleStart}
                className="text-danger"
                style={{ marginLeft: '160px', cursor: 'pointer', textDecoration: 'underline' }}
            > Resend OTP
            </a>
        </b>
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const otpValue = e.target.elements.otp.value;
        axios.post(patientAPIConfig.otpVerify, {
            otp: otpValue,
            mobile: props.mobile,
        }, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                dispatch(showMessage({ message: 'Patient verified successfully', variant: 'success' }));
                props.setIsActive(true);
                props.setSuccess(false);
                props.setOpenOTPDialog(false);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        });
    };

    useInterval(
        () => {
            if (secondsRemaining > 0) {
                setSecondsRemaining(secondsRemaining - 1)
            }

            else {
                setStatus(STATUS.STOPPED)
            }
        },
        status === STATUS.STARTED ? 1000 : null,
        // passing null stops the interval
    )

    function useInterval(callback, delay) {
        const savedCallback = useRef()


        useEffect(() => {

            savedCallback.current = callback

        }, [callback])

        useEffect(() => {

            function tick() {

                savedCallback.current()

            }

            if (delay !== null) {

                let id = setInterval(tick, delay)
                return () => clearInterval(id)
            }

        }, [delay])

    }
    return (
        <Container maxWidth="md">
            <Typography variant="h4" fontWeight="600" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">Verify OTP for Registration </Typography>

            <form onSubmit={handleFormSubmit}>
                <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>
                    <TextField
                        type="number"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        id="otp"
                        label="Enter OTP"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth>
                        Verify
                    </Button>
                </Stack>
            </form>
            {status == STATUS.STARTED ?
                <div style={{ marginLeft: "100px" }}> <b className="text-success">Resend OTP </b>
                    <b className="ml-2 text-danger"> {twoDigit(minutesToDisplay)}:
                        {twoDigit(secondsToDisplay)}</b>
                </div>
                :
                status
            }
        </Container>
    )
}

export default Otp;