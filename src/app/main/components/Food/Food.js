import { Card } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";
import { eventAPIConfig } from "../../API/apiConfig";
import FoodForm from "./FoodForm";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { Box } from "@mui/system";

const Food = () => {
    const dispatch = useDispatch()
    const [eventList, setEventList] = useState([])


    useEffect(() => {
        axios.get(eventAPIConfig.allEventList, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setEventList(response.data.data)

            } else {
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        }).catch((error) => {
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
        });
    }, [])



    return <Box sx={{ width: '100%', padding: 2 }}>
        <Card className='shadow-5' sx={{ padding: { md: '16px 64px', sm: '16px' }, margin: '0 auto', maxWidth: '700px' }}>
            <FoodForm eventList={eventList} />

        </Card>
    </Box>
}

export default Food