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
    <div>

      <div className='flex flex-col mb-5 py-4 items-center justify-center  text-white h-128 sm:h-256' style={{ backgroundColor: "#792b00" }}>
        <Typography style={{ fontStyle: 'normal', fontSize: '28px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}>
          Our Utsavs
        </Typography>
      </div>

      <div className='flex flex-col items-center justify-center my-8 pb-8'>
        <img src="assets/images/cards/hr-design-1.png" alt="" />
      </div>

      <Container  >

        <div className='grid grid-cols-12 gap-4 my-4 '>


          <div className='col-span-12  text-justify'>
            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
              SHRI SWAMI GURU PRASAD PARAMHANS (1966)
            </Typography>

            <Typography variant="body2" color="text.secondary" >
              Swami Guru Prasad Paramhans is the living master of Ajapa Yog - A Science, which traces its origin to Adi Guru Lord Shiva in ancient times. On Jan 6, 1966 following the prophecy and his mystical experience, Swami Janardan found a majestic newborn child on the banks of the river Ganga. He knew at once that this boy would be his successor and named the newborn ‘Guru Prasad – a gift from god’. A self-realized child since birth, Swami Guru Prasad was raised in the ashram under the guidance of Swami Janardan Paramhans, who trained him in the science of Ajapa Yog. Before leaving this material world, Swami Janardan Paramhans named Guru Prasad his successor. At the young age of 14 Swami Guru Prasad took over the reins of the ashram.

            </Typography>
            <Typography variant="body2" color="text.secondary">

              Thus began a new age of spirituality in the contemporary world. Swami Guru Prasad grew to be a powerful and graceful saint ready to help all who came to him seeking solace and true knowledge. Under his guidance, the number of people seeking self-realization increased manifold globally. His ashrams in India and abroad are helping people to raise their lives to higher states of knowledge and blissful existence. According to Swami Guru Prasad, Ajapa Yog is the greatest science on this Earth, and he wants to spread this knowledge around the world for the welfare of mankind. Today there are five ashrams and several Ajapa centers, which are being maintained under his guidance. Swami Guru Prasad organizes Seminars and meditation camps on Ajapa Yog in India and abroad.
            </Typography>
          </div>

        </div>

        <div className='flex flex-col items-center justify-center my-8 pb-8'>
          <img src="assets/images/cards/hr-design-1.png" alt="" />
        </div>

        <div className='grid grid-cols-12 gap-4 my-4 '>


          <div className='col-span-12  text-justify'>
            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
              SHRI SWAMI GURU PRASAD PARAMHANS (1966)
            </Typography>

            <Typography variant="body2" color="text.secondary" >
              Swami Guru Prasad Paramhans is the living master of Ajapa Yog - A Science, which traces its origin to Adi Guru Lord Shiva in ancient times. On Jan 6, 1966 following the prophecy and his mystical experience, Swami Janardan found a majestic newborn child on the banks of the river Ganga. He knew at once that this boy would be his successor and named the newborn ‘Guru Prasad – a gift from god’. A self-realized child since birth, Swami Guru Prasad was raised in the ashram under the guidance of Swami Janardan Paramhans, who trained him in the science of Ajapa Yog. Before leaving this material world, Swami Janardan Paramhans named Guru Prasad his successor. At the young age of 14 Swami Guru Prasad took over the reins of the ashram.

            </Typography>
            <Typography variant="body2" color="text.secondary">

              Thus began a new age of spirituality in the contemporary world. Swami Guru Prasad grew to be a powerful and graceful saint ready to help all who came to him seeking solace and true knowledge. Under his guidance, the number of people seeking self-realization increased manifold globally. His ashrams in India and abroad are helping people to raise their lives to higher states of knowledge and blissful existence. According to Swami Guru Prasad, Ajapa Yog is the greatest science on this Earth, and he wants to spread this knowledge around the world for the welfare of mankind. Today there are five ashrams and several Ajapa centers, which are being maintained under his guidance. Swami Guru Prasad organizes Seminars and meditation camps on Ajapa Yog in India and abroad.
            </Typography>
          </div>

        </div>

        <div className='flex flex-col items-center justify-center my-8 pb-8'>
          <img src="assets/images/cards/hr-design-1.png" alt="" />
        </div>

        <div className='grid grid-cols-12 gap-4 my-4 '>


          <div className='col-span-12  text-justify'>
            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
              SHRI SWAMI GURU PRASAD PARAMHANS (1966)
            </Typography>

            <Typography variant="body2" color="text.secondary" >
              Swami Guru Prasad Paramhans is the living master of Ajapa Yog - A Science, which traces its origin to Adi Guru Lord Shiva in ancient times. On Jan 6, 1966 following the prophecy and his mystical experience, Swami Janardan found a majestic newborn child on the banks of the river Ganga. He knew at once that this boy would be his successor and named the newborn ‘Guru Prasad – a gift from god’. A self-realized child since birth, Swami Guru Prasad was raised in the ashram under the guidance of Swami Janardan Paramhans, who trained him in the science of Ajapa Yog. Before leaving this material world, Swami Janardan Paramhans named Guru Prasad his successor. At the young age of 14 Swami Guru Prasad took over the reins of the ashram.

            </Typography>
            <Typography variant="body2" color="text.secondary">

              Thus began a new age of spirituality in the contemporary world. Swami Guru Prasad grew to be a powerful and graceful saint ready to help all who came to him seeking solace and true knowledge. Under his guidance, the number of people seeking self-realization increased manifold globally. His ashrams in India and abroad are helping people to raise their lives to higher states of knowledge and blissful existence. According to Swami Guru Prasad, Ajapa Yog is the greatest science on this Earth, and he wants to spread this knowledge around the world for the welfare of mankind. Today there are five ashrams and several Ajapa centers, which are being maintained under his guidance. Swami Guru Prasad organizes Seminars and meditation camps on Ajapa Yog in India and abroad.
            </Typography>
          </div>

        </div>

        <div className='flex flex-col items-center justify-center my-8 pb-8'>
          <img src="assets/images/cards/hr-design-1.png" alt="" />
        </div>

        <div className='grid grid-cols-12 gap-4 my-4 '>


          <div className='col-span-12  text-justify'>
            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
              SHRI SWAMI GURU PRASAD PARAMHANS (1966)
            </Typography>

            <Typography variant="body2" color="text.secondary" >
              Swami Guru Prasad Paramhans is the living master of Ajapa Yog - A Science, which traces its origin to Adi Guru Lord Shiva in ancient times. On Jan 6, 1966 following the prophecy and his mystical experience, Swami Janardan found a majestic newborn child on the banks of the river Ganga. He knew at once that this boy would be his successor and named the newborn ‘Guru Prasad – a gift from god’. A self-realized child since birth, Swami Guru Prasad was raised in the ashram under the guidance of Swami Janardan Paramhans, who trained him in the science of Ajapa Yog. Before leaving this material world, Swami Janardan Paramhans named Guru Prasad his successor. At the young age of 14 Swami Guru Prasad took over the reins of the ashram.

            </Typography>
            <Typography variant="body2" color="text.secondary">

              Thus began a new age of spirituality in the contemporary world. Swami Guru Prasad grew to be a powerful and graceful saint ready to help all who came to him seeking solace and true knowledge. Under his guidance, the number of people seeking self-realization increased manifold globally. His ashrams in India and abroad are helping people to raise their lives to higher states of knowledge and blissful existence. According to Swami Guru Prasad, Ajapa Yog is the greatest science on this Earth, and he wants to spread this knowledge around the world for the welfare of mankind. Today there are five ashrams and several Ajapa centers, which are being maintained under his guidance. Swami Guru Prasad organizes Seminars and meditation camps on Ajapa Yog in India and abroad.
            </Typography>
          </div>

        </div>


      </Container>
    </div>
  )
}

export default Utsav