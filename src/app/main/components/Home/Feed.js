const key = process.env.REACT_APP_URL;
import { Grid, Typography } from '@mui/material'

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { blogAPIConfig } from '../../API/apiConfig';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

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

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Feed() {

    const navigate = useNavigate()
    const isDesktop = useMediaQuery('(min-width:768px)');
        // const maxWidth = isDesktop ? 445 : 345;

    const [userId, setUserId] = useState('')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [feedData, setFeedData] = useState([])
    const [expandedId, setExpandedId] = useState(null);

    const handleExpandClick = (id) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };


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

    if (feedData.length == 0) {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="flex flex-1 items-center justify-center h-full"
          >
            <Typography color="text.secondary" variant="h5">
              There is no feed!
            </Typography>
          </motion.div>
        );
      }


    return (
        <div>

            {/* <div style={{
                paddingLeft: isDesktop ? '4rem' : '10px',
                paddingRight: isDesktop ? '4rem' : '10px'
            }} className='mt-1'>
                <hr></hr>
            </div> */}
            <div className='p-4' >
                <Grid container spacing={2}>
                    {feedData.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>  
                            {/* <Card className="flex flex-col h-full  sm:m-0">
                                <CardContent>
                  <Typography variant="body1" component="div" style={{
                    fontStyle: 'normal', fontSize: '16px',
                    lineHeight: '28px', letterSpacing: '0px',
                    textAlign: 'center', fontWeight: 600,
                    marginTop: '5px'
                  }} >
                    {formatDateString(item.dop)}
                  </Typography>
                </CardContent>
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


                            </Card> */}

                            <Card sx={{ maxWidth: 345 , minHeight:445}} key={item.id}>
                                <CardHeader
                                    // avatar={
                                    //     <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    //         R
                                    //     </Avatar>
                                    // }
                                    action={
                                        <IconButton aria-label="settings">
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    // title="Shrimp and Chorizo Paella"
                                         sx={{ color: 'rgba(0, 0, 0, 0.87)' }} 
                                    subheader={
                                            <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
            {formatDateString(item.dop)}
        </Typography>
                                    }
                                  
                                    
                                />
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
                                    <Typography variant="body2" color="text.secondary">
                                        {item.message}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    {/* <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton> */}
                                    <ExpandMore
                                        expand={expandedId === item.id}
                                        onClick={() => handleExpandClick(item.id)}
                                        aria-expanded={expandedId === item.id}
                                        aria-label="show more"
                                    >
                                  <Typography variant="body2" color="text.primary">
                                        Read More
                                    </Typography>
                                    </ExpandMore>
                                </CardActions>
                                <Collapse in={expandedId === item.id} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>
                                            {item.message}
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    )
}

export default Feed