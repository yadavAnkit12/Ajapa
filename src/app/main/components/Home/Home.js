import {Grid , Button, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

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
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState('')

  // const feedData = [
  //   { id: 1, image: 'https://img.freepik.com/premium-photo/man-sits-lotus-pose-person-practices-yoga-meditation-radiating-energy-generative-ai_788189-3992.jpg', title: 'Item 1' },
  //   { id: 2, image: 'https://thumbs.dreamstime.com/z/random-click-squirrel-wire-random-picture-cute-squirrel-219506797.jpg', title: 'Item 2' },
  //   { id: 3, image: 'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg', title: 'Item 3' },
  //   { id: 4, image: 'https://thumbs.dreamstime.com/z/random-click-squirrel-wire-random-picture-cute-squirrel-219506797.jpg', title: 'Item 4' },
  //   { id: 5, image: 'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg', title: 'Item 5' },
  //   { id: 6, image: 'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg', title: 'Item 6' },
  // ];

  const feedData = [
    { id: 1, type: 'text', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce placerat justo at diam pretium, nec placerat ipsum volutpat.' },
    { id: 2, type: 'image', image: 'https://thumbs.dreamstime.com/z/random-click-squirrel-wire-random-picture-cute-squirrel-219506797.jpg', alt: 'Image 1' },
    { id: 3, type: 'text', content: 'Sed vehicula ipsum sit amet ligula pellentesque lacinia. Integer tincidunt neque eu risus dictum, id hendrerit metus vehicula.' },
    { id: 4, type: 'image', image: 'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg', alt: 'Image 2' },
    { id: 5, type: 'text', content: 'Praesent eget libero quis ex suscipit lacinia sit amet nec mi. Ut in felis a nibh volutpat scelerisque.' },
    { id: 6, type: 'text', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce placerat justo at diam pretium, nec placerat ipsum volutpat.' },
    { id: 7, type: 'image', image: 'https://thumbs.dreamstime.com/z/random-click-squirrel-wire-random-picture-cute-squirrel-219506797.jpg', alt: 'Image 1' },
    { id: 8, type: 'text', content: 'Sed vehicula ipsum sit amet ligula pellentesque lacinia. Integer tincidunt neque eu risus dictum, id hendrerit metus vehicula.' },
    { id: 9, type: 'image', image: 'https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg', alt: 'Image 2' },
    { id: 10, type: 'text', content: 'Praesent eget libero quis ex suscipit lacinia sit amet nec mi. Ut in felis a nibh volutpat scelerisque.' },

    

  ];

  useEffect(() => {
    const userData = sessionStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      delete user.password // beacuse we recive passowrd as empty
      const status = Object.keys(user).some(key => user[key] === '' || user[key] === undefined || user[key] === 'undefined' || user[key] === 'null' || user[key] === null);
      if (status) {
        setUserId(user.id)
        setOpen(true)
      }
    }
  }, []);

  const handleClose = () => {
    setOpen(false)
  }

  const handleComplete = () => {
    navigate(`/app/useredit/${userId}`)
  }

  return (
    <div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      className="flex flex-col  justify-center "
    >
      {/* <Typography color="text.secondary" variant="h5">
        Home page is under construction!
      </Typography> */}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4'>

      <Card sx={{ maxWidth: 345 }} className='mx-auto'  onClick={() => navigate("/ashrams")}>
      <CardActionArea>
        <CardMedia className='h-256'
          component="img"
          height="140"
          image="assets/images/cards/ashram1.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Ashrams
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Discover serene retreats at our ashrams. Immerse yourself in yogic teachings and tranquil surroundings.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    <Card sx={{ maxWidth: 345 }} className='mx-auto' onClick={() => navigate("/gurus")}>
      <CardActionArea>
        <CardMedia className='h-256'
          component="img"
          height="140"
          image="assets/images/cards/guruji.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Gurus
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Meet our experienced and dedicated yoga gurus. Learn from the best to enhance your practice and well-being.
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
          <Typography variant="body2" color="text.secondary">
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
          image="assets/images/cards/contactus.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Contact Us
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Reach out to us for all your yoga inquiries and queries. We're here to support your wellness journey.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
 </div>


<div className='flex flex-col my-5 py-4 items-center justify-center'>
       <Typography  style={{ fontStyle: 'normal', fontSize: '24px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}>
        Feed Section
      </Typography>







      </div>

      <div >
      <Grid container spacing={2}>
      {feedData.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
          <Card className="flex flex-col h-full m-4 sm:m-0">
            {item.type === 'text' && (
              <CardContent>
                <Typography variant="body1" component="div">
                  {item.content}
                </Typography>
              </CardContent>
            )}
            {item.type === 'image' && (
              <CardMedia
                component="img"
                height={item.type === 'text' ? "100" : "140"}
                image={item.image}
                alt={item.alt}
              />
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
    </div>



      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" style={{
            // fontFamily: "BentonSans bold",
            fontStyle: 'normal', fontSize: '20px',
            lineHeight: '28px', letterSpacing: '0px',
            textAlign: 'center', fontWeight: 600,
          }}>
            Your profile appears to be incomplete.
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <Button variant='contained' color='secondary' sx={{ mr: 1.5 }} onClick={handleClose}>Skip</Button>
            <Button variant='contained' color='secondary' onClick={handleComplete}>Complete</Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default Home