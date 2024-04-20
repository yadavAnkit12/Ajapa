import { Grid, Button, Modal, Typography } from '@mui/material'
import { Box, Container } from '@mui/system';
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

function Utsav() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState('')





  return (
    <div>

      <div className='flex flex-col  py-4 items-center justify-center  text-white h-128 sm:h-256' style={{ backgroundColor: "#792b00" }}>
        <Typography style={{ fontStyle: 'normal', fontSize: '28px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}>
          Our Utsavs
        </Typography>
      </div>

      <div className="bg-cover bg-center" style={{ backgroundImage: "url('assets/images/cards/background.jpg')" }}>

        <Container style={{ paddingTop: '50px' }}>

          <div className='flex flex-col items-center justify-center my-8 pb-8'>
            <img src="assets/images/cards/hr-design-1.png" alt="" />
          </div>

          <div className='grid grid-cols-12 gap-4 my-4 '>


            <div className='col-span-12  text-justify'>
              <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                6th January
              </Typography>

              <Typography variant="body2" color="text.primary" >
                Birthday of Shri Swami Guru Prasad Ji Paramhans.

              </Typography>

            </div>

          </div>

          <div className='flex flex-col items-center justify-center my-8 pb-8'>
            <img src="assets/images/cards/hr-design-1.png" alt="" />
          </div>

          <div className='grid grid-cols-12 gap-4 my-4 '>


            <div className='col-span-12  text-justify'>
              <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                28th April
              </Typography>

              <Typography variant="body2" color="text.primary" >
                Samadhi Diwas of Shri Swami Janardan Paramhans.

              </Typography>

            </div>

          </div>

          <div className='flex flex-col items-center justify-center my-8 pb-8'>
            <img src="assets/images/cards/hr-design-1.png" alt="" />
          </div>

          <div className='grid grid-cols-12 gap-4 my-4 '>


            <div className='col-span-12  text-justify'>
              <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                Guru Purnima (June July)
              </Typography>

              <Typography variant="body2" color="text.primary" >
                Guru Purnima is observed during Ashadha in the Hindu calendar, which falls either in June or July in the Gregorian calendar.

              </Typography>
              <Typography variant="body2" color="text.primary">

                The Yogic tradition says that on this day, Lord Shiva shared his wisdom with people and became the first known guru. The other popular story is the above mentioned birth of Ved Vyasa, who shared the knowledge of the vedas with his four disciples.
              </Typography>
            </div>

          </div>

          <div className='flex flex-col items-center justify-center my-8 pb-8'>
            <img src="assets/images/cards/hr-design-1.png" alt="" />
          </div>

          <div className='grid grid-cols-12 gap-4 my-4 '>


            <div className='col-span-12  text-justify'>
              <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                14th September
              </Typography>

              <Typography variant="body2" color="text.primary" >
                Birthday of Shri Swami Purnananda Ji Paramhans.
              </Typography>

            </div>

          </div>

          <div className='flex flex-col items-center justify-center my-8 pb-8'>
            <img src="assets/images/cards/hr-design-1.png" alt="" />
          </div>

          <div className='grid grid-cols-12 gap-4 my-4 '>


            <div className='col-span-12  text-justify'>
              <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                2nd December
              </Typography>

              <Typography variant="body2" color="text.primary" >
                Birthday of Shri Swami Janardan Ji Paramhans.
              </Typography>

            </div>

          </div>

          <div className='flex flex-col items-center justify-center my-8 pb-8'>
            <img src="assets/images/cards/hr-design-1.png" alt="" />
          </div>

          <div className='grid grid-cols-12 gap-4 my-4 '>


            <div className='col-span-12  text-justify'>
              <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                24th December
              </Typography>

              <Typography variant="body2" color="text.primary" >
                Birthday of Shri Swami Bhoomanand Ji Paramhans.
              </Typography>

            </div>

          </div>


        </Container>
      </div>
    </div>
  )
}

export default Utsav