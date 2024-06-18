const key = process.env.REACT_APP_URL;
import { Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState, forwardRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { motion } from 'framer-motion';
import { useMediaQuery, Dialog, DialogActions, DialogTitle, Slide } from '@mui/material';
import axios from 'axios';
import { blogAPIConfig } from '../../API/apiConfig';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import { showMessage } from "app/store/fuse/messageSlice";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDispatch } from 'react-redux';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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


const cardStyles = {
    maxWidth: 345,
    minHeight: 475,
};

const cardContentStyles = {
    maxHeight: 75,
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
};

const cardContentExpandedStyles = {
    maxHeight: 150, // Set the height as needed
    overflowY: 'auto',
};

function Feed() {

    const navigate = useNavigate()
    const isDesktop = useMediaQuery('(min-width:768px)');
    // const maxWidth = isDesktop ? 445 : 345;

    const [userId, setUserId] = useState('')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [feedData, setFeedData] = useState([])
    const [expandedId, setExpandedId] = useState(null);
    const [open, setOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const [expandedIds, setExpandedIds] = useState({});

    const handleExpandClick = (id) => {
        setExpandedId(id === expandedId ? null : id);
    };


    const location = useLocation();
    const role = localStorage.getItem('role')

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);


    const handleDeletePost = () => {
        setLoading(true)
        const formData = new FormData();
        formData.append("id", deleteId);
        axios.post(blogAPIConfig.deletePost, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setLoading(false)
                dispatch(showMessage({ message: response.data.message, variant: 'success' }));
                setOpen(false)
            } else {
                setLoading(false)
                dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
                setOpen(false)
            }
        }).catch((error) => {
            setLoading(false)
            setOpen(false)
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
        })

    }



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
                console.log("Feed Data", response.data.data)
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

    const ConfirmationForDelete = (postId) => {
        setOpen(true)
        setDeleteId(postId)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        fetchData()
    }, [loading])

    function formatDateString(dateString) {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        return formattedDate;
    }

    if (loading) {
        return (
            <FuseLoading />
        );
    }

    if (feedData.length == 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-1 items-center justify-center h-full my-8"
            >
                <Typography color="text.primary" variant="h5">
                    Nothing new !
                </Typography>
            </motion.div>
        );
    }


    return (

        <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="flex flex-col  justify-center " style={{ margin: '0 0 0 2rem' }}>

            <div className='p-4' >
                <Grid container spacing={2}>
                    {feedData.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>


                            <Card sx={{ maxWidth: 345, minHeight: 475 }} key={item.id}>
                                <CardHeader
                                    action={
                                        <IconButton aria-label="settings">
                                            {role !== 'User' ? <DeleteIcon onClick={() => ConfirmationForDelete(item.id)} /> : ''}
                                        </IconButton>
                                    }
                                    sx={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                    subheader={
                                        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                                            {formatDateString(item.dop)}
                                        </Typography>
                                    }
                                />
                                {item.imageName !== null && (
                                    <div className='h-256'>
                                        <CardMedia
                                            component="img"
                                            className='h-full w-full object-cover'
                                            style={{ objectFit: 'contain' }}
                                            image={`${key}/posts/${item.imageName}`}
                                            alt="image"
                                        />
                                    </div>
                                )}
                                {item.message && <CardContent
                                    sx={expandedId === item.id ? cardContentExpandedStyles : cardContentStyles}
                                >
                                    <Typography variant="body2" color="text.primary" className='text-justify'>
                                        {expandedId === item.id ? item.message : `${item.message.slice(0, 80)}`}
                                    </Typography>
                                </CardContent>
                                }
                                <CardActions disableSpacing>
                                    {item.message && item.message.length > 76 &&
                                        <ExpandMore
                                            expand={expandedId === item.id}
                                            onClick={() => handleExpandClick(item.id)}
                                            aria-expanded={expandedId === item.id}
                                            aria-label="show more"
                                        >
                                            <Typography variant="body2" color="text.primary">
                                                {expandedId === item.id ? 'Read Less' : 'Read More'}
                                            </Typography>
                                        </ExpandMore>
                                    }
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{`Do you want to delete this Post?`}</DialogTitle>

                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleDeletePost} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}

export default Feed