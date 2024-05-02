const key = process.env.REACT_APP_URL;
import { Grid, Typography } from '@mui/material'

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { blogAPIConfig } from '../../API/apiConfig';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
    maxWidth: '900px',
    maxHeight: '650px',
    overflow: 'auto',
};

function Feed() {
    const navigate = useNavigate()
    const isDesktop = useMediaQuery('(min-width:768px)');

    const [userId, setUserId] = useState('')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [feedData, setFeedData] = useState([])


    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);



    const fetchData = () => {
        const params = {
            page: page + 1,
            rowsPerPage: rowsPerPage
        };
        axios.get(blogAPIConfig.getAllPosts, { params }, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {

                console.log("response", response.data.data);
                setFeedData(response.data.data)
            } else {
                // setLoading(false)
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
            }
        }).catch((error) => {
            setLoading(false)
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
        })
    };

    useEffect(() => {
        fetchData()
    }, [])

    function formatDateString(dateString) {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).replace(',', ''); // Remove comma
        return formattedDate;
    }


    return (
        <div>
            <div className='flex flex-col py-4 items-center justify-center' style={{ marginTop: '4rem' }} >
                <Typography style={{ fontStyle: 'normal', fontSize: '24px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}>
                    New Feed
                </Typography>
            </div>
            <div style={{
                paddingLeft: isDesktop ? '4rem' : '10px',
                paddingRight: isDesktop ? '4rem' : '10px'
            }} className='mt-1'>
                <hr></hr>
            </div>
            {/* <div style={{
                paddingLeft: isDesktop ? '4rem' : '10px',
                paddingRight: isDesktop ? '4rem' : '10px'
            }} className='mt-1'>
                <hr></hr>
            </div> */}
            <div className='p-4' >
                <Grid container spacing={2}>
                    {feedData.map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                            <Card className="flex flex-col h-full  sm:m-0">
                                {/* <CardContent>
                  <Typography variant="body1" component="div" style={{
                    fontStyle: 'normal', fontSize: '16px',
                    lineHeight: '28px', letterSpacing: '0px',
                    textAlign: 'center', fontWeight: 600,
                    marginTop: '5px'
                  }} >
                    {formatDateString(item.dop)}
                  </Typography>
                </CardContent> */}
                                {item.imageName !== null && (
                                    <div className='h-full w-full'>
                                        <CardMedia
                                            component="img"
                                            className='h-full w-full object-cover'
                                            style={{ objectFit: 'cover' }}
                                            image={`${key}/posts/${item.imageName}`}
                                            alt="image"
                                        />
                                    </div>
                                )}
                                <CardContent>
                                    <Typography variant="body1" component="div" style={{
                                        fontStyle: 'normal', fontSize: '16px',
                                        lineHeight: '28px', letterSpacing: '0px',
                                        fontWeight: 600, marginTop: '5px'
                                    }}>
                                        {item.message}
                                    </Typography>
                                </CardContent>


                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    )
}

export default Feed