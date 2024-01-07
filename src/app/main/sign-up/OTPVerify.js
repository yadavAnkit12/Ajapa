import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from "react-redux";
import { Typography, Container, Button, TextField, Stack, IconButton } from '@mui/material';
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import { MuiOtpInput } from 'mui-one-time-password-input';
import CloseIcon from '@mui/icons-material/Close';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';


const INITIAL_COUNT = 120

const twoDigit = (num) => String(num).padStart(2, '0')


const OTPVerify = ({ data, handleEditClose, countryID, stateID, cityID }) => {
    console.log(data, countryID, stateID, cityID)
    const dispatch = useDispatch();
    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT);
    const [status, setStatus] = useState(null);
    const secondsToDisplay = secondsRemaining % 60;
    const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
    const minutesToDisplay = minutesRemaining % 60;
    const [otp, setOtp] = useState('')


    useEffect(() => {
        setStatus(STATUS.STARTED);
    }, []);

    const handleStart = () => {
        const formData = new FormData()
        formData.append('email', data.email)
        formData.append('countryCode', data.countryCode)
        formData.append('mobileNumber', data.mobileNumber)
        axios.post(`${jwtServiceConfig.otpSent}`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
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
                style={{ marginLeft: '160px', cursor: 'pointer', textDecoration: 'underline',fontSize:'1.3rem' }}
            > Resend OTP
            </a>
        </b>
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('otp', otp)
        formData.append('email', data.email)
        // verifying the otp
        axios.post(jwtServiceConfig.otpVerify, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
        }).then((response) => {
            // after successfully verifying the otp register the user
            if (response.status === 200) {
                const formattedData = new FormData()
                formattedData.append('name', data.name)
                formattedData.append('email', data.email)
                formattedData.append('password', data.password)
                formattedData.append('gender', data.gender)
                formattedData.append('countryCode', data.countryCode.split(' ')[0])
                formattedData.append('mobileNumber', data.mobileNumber)
                formattedData.append('country', countryID)
                formattedData.append('state', stateID)
                formattedData.append('city', cityID)
                formattedData.append('dob', data.dob)
                formattedData.append('file', data.profilePicture)
                formattedData.append('isDisciple', data.isDisciple === 'Yes' ? 1 : 0)

                axios.post(`${jwtServiceConfig.signUp}`, formattedData, {
                    headers: {
                        'Content-type': 'multipart/form-data',
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        dispatch(showMessage({ message: 'Data recived successfully', variant: 'success' }));
                        handleEditClose()
                    }
                })

            } else {
                dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
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
            <IconButton onClick={handleEditClose} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
                <CloseIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="600" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">Verify OTP for Registration </Typography>

            <form>
                <Stack spacing={2} sx={{ mt: 2, marginBottom: 2 }}>

                    <MuiOtpInput style={{ maxWidth: '400px' }} value={otp} onChange={(newValue) => setOtp(newValue)} />

                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleFormSubmit}
                    >
                        Verify
                    </Button>
                </Stack>
            </form>
            {status == STATUS.STARTED ?
                <div style={{ display: 'flex', justifyContent: 'center' }}> <b className="text-success" style={{fontSize:'1.3rem'}}>Resend OTP </b>
                    <b className="ml-2 text-danger" style={{fontSize:'1.3rem'}}> {twoDigit(minutesToDisplay)}:
                        {twoDigit(secondsToDisplay)}</b>
                </div>
                :
                status
            }
        </Container>
    )
}

export default OTPVerify;