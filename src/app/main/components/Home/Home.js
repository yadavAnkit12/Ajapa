const key = process.env.REACT_APP_URL;
import { Grid, Button, Modal, Typography } from '@mui/material'
import { Box, Container } from '@mui/system';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { blogAPIConfig, eventAPIConfig } from '../../API/apiConfig';
import Feed from './Feed';

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

function Home() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width:768px)');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [feedData, setFeedData] = useState([])






  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // useEffect(() => {
  //   const userData = sessionStorage.getItem('user_data');
  //   if (userData) {
  //     const user = JSON.parse(userData);
  //     delete user.password // beacuse we recive passowrd as empty
  //     const status = Object.keys(user).some(key => user[key] === '' || user[key] === undefined || user[key] === 'undefined' || user[key] === 'null' || user[key] === null);
  //     if (status) {
  //       setUserId(user.id)
  //       setOpen(true)
  //     } else {
  //       if (sessionStorage.getItem('userRole') !== 'Super' && sessionStorage.getItem('userRole') !== 'Admin') {
  //         checkActiveEvents()
  //       }
  //     }
  //   }
  // }, []);


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
        setFeedData(response.data.data)
      } else {
        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
      }
    }).catch((error) => {
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
    <div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      className="flex flex-col  justify-center "
    >

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 '>

        <Card sx={{ maxWidth: 345 }} className='mx-auto' onClick={() => navigate("/ashrams")}>
          <CardActionArea>
            <CardMedia className='h-256'
              component="img"
              height="140"
              image="assets/images/cards/Ashrams.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Ashrams
              </Typography>
              <Typography variant="body2" color="text.secondary" className='text-justify'>
                Visit Ashram to dive deep into timeless wisdom, unlock your true potential, and embark on a transformative journey of self-realisation.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345 }} className='mx-auto' onClick={() => navigate("/gurus")}>
          <CardActionArea>
            <CardMedia className='h-256'
              component="img"
              height="140"
              image="assets/images/cards/Gurus.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Gurus
              </Typography>
              <Typography variant="body2" color="text.secondary" className='text-justify'>
                Guru is the revered Ajapa master, the self realized spiritual guide, embodying deep wisdom and compassion. The ancient Ajapa meditation technique is imparted by him to aid seekers on their journey of self realisation.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345 }} className='mx-auto' onClick={() => navigate("/utsavs")}>
          <CardActionArea>
            <CardMedia className='h-256'
              component="img"
              height="140"
              image="assets/images/cards/utsav.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Utsavs
              </Typography>
              <Typography variant="body2" color="text.secondary" className='text-justify'>
                Utsav is organised by the foundation for all Ajapa followers to celebrate the existence of Ajapa Yog and honor our Gurus.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345 }} className='mx-auto' onClick={() => navigate("/contactus")}>
          <CardActionArea>
            <CardMedia className='h-256'
              component="img"
              height="140"
              image="assets/images/cards/Contact us.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" className='text-justify'>
                Contact Us
              </Typography>
              <Typography variant="body2" color="text.secondary" className='text-justify' >
                Have questions or seeking guidance on your spiritual journey? Reach out to us for personalized support and assistance. Our team at Ajapa Yog Sansthan is here to help you embark on a path of inner growth and self-discovery.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
      <div className='flex flex-col items-center justify-center my-8 py-8'>
            <img src="assets/images/cards/hr-design-1.png" alt="" />
          </div>

      <div>
        <Feed />
      </div>

    </div>
  )
}

export default Home