import {Grid , Button, Modal, Typography } from '@mui/material'
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

function Gurus() {
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

<div className='flex flex-col mb-5 py-4 items-center justify-center  text-white h-128 sm:h-256'  style={{  backgroundColor: "#792b00" }}>
       <Typography  style={{ fontStyle: 'normal', fontSize: '28px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}>
        Our Gurus
      </Typography>
</div>

      <div className='flex flex-col items-center justify-center my-8 pb-8'>
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

    <Container  >

    <div className='grid grid-cols-12 gap-4 my-4 '>

<div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-start  items-center'>
  
    <img className='h-256 ' src="assets/images/cards/guruji.jpg" alt="" />

</div>

<div className='col-span-12 sm:col-span-8 text-justify'>
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
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

<div className='grid grid-cols-12 gap-4 my-4 '>

<div className='col-span-12 sm:col-span-8 text-justify'>
    <Typography variant="body2" color="text.primary" className='font-bold my-4' >
    SHRI SWAMI PURNANAND PARAMHANS (1834-1928)
    </Typography>

    <Typography variant="body2" color="text.secondary">
    The method of Ajapa Sadhana was carefully guarded through the ages at ‘Siddhashram’- a hidden monastery in the Himalayas. In modern times, Shri Swami Purnanand Paramhans – the greatest guru of our times, brought Ajapa Sadhana to us from Siddhashram. In 1860’s Shri Swami Purnanand Paramhans made the arduous journey to Siddhashram. He stayed in Siddhashram for five years, and mastered the ancient Science of Ajapa Yog and attained Brahm Gyan. After returning to India, Swami Purnanand Paramhans established two ashrams, one in Bangladesh and other in Guwahati (Assam). He taught this Science of Ajapa when India was under British rule and became a beacon of light to millions suffering in pain and subjugation. In 1928 after Shri Purnanand Paramhans left his material body, his mission was taken over by his disciple Shri Swami Bhumanand Paramhans. 
    </Typography>

</div>

<div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-end items-center'>
  
    <img className='h-256' src="assets/images/cards/guru2.jpg" alt="" />

</div>

</div>

<div className='flex flex-col items-center justify-center my-8 pb-8'>
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

<div className='grid grid-cols-12 gap-4 my-4'>

<div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-start  items-center'>
  
  <img className='h-256' src="assets/images/cards/guru3.jpg" alt="" />

</div>

<div className='col-span-12 sm:col-span-8 text-justify'>
    <Typography variant="body2" color="text.primary" className='font-bold my-4' >
    SHRI SWAMI BHUMANAND PARAMHANS (1873-1958)
    </Typography>

    <Typography variant="body2" color="text.secondary">
    Swami Bhumanand was born as Panchanan Gangopadhyay on Dec. 24, 1873, to devout parents in the state of Bengal. He worked as an accountant for many years. He was a great scholar, but despite reading the Hindu Scriptures over and over, he felt something was amiss, making him restless and tormented. One day Swami Purnanand came to Raj Shahi to visit a disciple there. Panchanan came to meet him, and after a long talk with Swami Purnanand, he realized that at last he had met a Guru who had realized the essence of the Scriptures. He had to wait for two more years, after which finally he got initiation from Shri Swami Purnanand Paramhans.
After receiving initiation Swami Bhumanand practiced Kriya with great devotion and achieved extraordinary results in a short period of time. When Swami Purnanand became advanced in age and began the final purification process before leaving the material body, the disciples wondered who would be his successor, but were afraid to ask. Swami Purnanand looked at them and said, “Bhumanand”. On April 29, 1928, Swami Purnananda left the body. Shri Swami Bhumanand continued the Ajapa lineage from Kalipur Ashram (Guwahati) in Assam Province. Before Shri Swami Bhumanand left his material body in 1958 he gave Swami Janardan Paramhans the power to initiate others into Ajapa Yog.
    </Typography>

</div>

</div>

<div className='flex flex-col items-center justify-center my-8 pb-8'>
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

<div className='grid grid-cols-12 gap-4 my-4 '>


<div className='col-span-12 sm:col-span-8 text-justify'>
    <Typography variant="body2" color="text.primary" className='font-bold my-4' >
    SHRI SWAMI JANARDAN PARAMHANS (1888-1980)
    </Typography>

    <Typography variant="body2" color="text.secondary">
    Shri Swami Janardan Paramhans was born in the province of East Bengal, India, on December 2, 1888. When he was 12 years old his father died, young Janardan ran away from home, seeking to understand the meaning of Life and Death. He wandered all over India, covering the length and breadth of the country more than seven times on foot. Swami Janardan was also a part of India’s non-violent Freedom struggle. After years of searching, he met Shri Swami Bhumanand, who initiated him into Ajapa Yog. Swami Janardan practiced this Yog with an attitude of “Do or Die” and eventually achieved complete Self-knowledge. When Swami Bhumanand left his material body in 1958, Swami Janardan carried on the lineage of teaching Ajapa to the world. Shri Swami Janardan Paramhans travelled around the world and introduced the science of Ajapa Yog to the western world. He was invited to Germany, Prague, Canada and United States to deliver a series of lectures on Ajapa. He made many disciples there and established an Ashram at California USA. He set up three ashrams in India at Rishikesh, Kanpur and Jamshedpur, one ashram in Poland and one in California USA.
    </Typography>

</div>


<div className='col-span-12 sm:col-span-4 flex flex-col justify-center  items-center sm:items-end '>
  
  <img className='h-256' src="assets/images/cards/guru4.jpg" alt="" />

</div>

</div>

    
    </Container>
    </div>
  )
}

export default Gurus