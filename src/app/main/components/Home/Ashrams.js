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

function Ashrams() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState('')





  return (
    <div>

<div className='flex flex-col mb-5 py-4 items-center justify-center  text-white h-128 sm:h-256'  style={{  backgroundColor: "#792b00" }}>
       <Typography  style={{ fontStyle: 'normal', fontSize: '28px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}>
        Our Ashrams
      </Typography>
</div>

      <div className='flex flex-col items-center justify-center my-8 pb-8'>
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

    <Container  >

 <div className='grid grid-cols-12 gap-4 my-4 '>
<div className='col-span-12  text-justify'>
    {/* <Typography variant="body2" color="text.primary" className='font-bold my-4' >
        SHRI SWAMI GURU PRASAD PARAMHANS (1966)
    </Typography> */}

    <Typography variant="body2" color="text.secondary" >
        When Swami Purnanand returned from Siddhashram, he meditated on the Nilachal hills located near Kamakhya station in Guwahati, Asssam. Little did anyone know that the land he did rigorous meditation on would soon be the second Ajapa Yog Ashram.    
    </Typography>

</div>
</div>

<div className='flex flex-col items-center justify-center my-8 pb-8'>
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

      <div className='grid grid-cols-12 gap-4 my-4 '>
<div className='col-span-12  text-justify'>
    {/* <Typography variant="body2" color="text.primary" className='font-bold my-4' >
        SHRI SWAMI GURU PRASAD PARAMHANS (1966)
    </Typography> */}

    <Typography variant="body2" color="text.secondary" >
    In 1966, Swami Janardan Paramhans found and adopted a baby boy from the banks of River Ganga near Laxman Jhula Ashram in Rishikesh, India. This baby boy is Ajapa Yog's present Guru Swami Guru Prasad Paramhans.    
    </Typography>

        <Typography variant="body2" color="text.secondary" >
    Laxman Jhula Ashram, Rishikesh is the first Ajapa Yog Ashram established by Swami Janardan Paramhans    
    </Typography>

</div>
</div>

<div className='flex flex-col items-center justify-center my-8 pb-8'>
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

      <div className='grid grid-cols-12 gap-4 my-4 '>
<div className='col-span-12  text-justify'>
    {/* <Typography variant="body2" color="text.primary" className='font-bold my-4' >
        SHRI SWAMI GURU PRASAD PARAMHANS (1966)
    </Typography> */}
        <Typography variant="body2" color="text.secondary" >
    The Ajapa Yog Ashram in Jamshedpur, India, has a Nine Rishi (sage) Temple built in the shape of an Inverted Lotus (like the Meru Parvat at the centre of Earth) guarded with Avatar on top, symbolizing the Golden Era of Truth and Enlightenment.   
    </Typography>

    <Typography variant="body2" color="text.secondary" >
    This is the Ashram where Swami Janardan Paramhans left his material body, and a Samadhi (shrine) was built in one of the temples here.   
    </Typography>

</div>
</div>

<div className='flex flex-col items-center justify-center my-8 pb-8'>
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

      <div className='grid grid-cols-12 gap-4 my-4 '>
<div className='col-span-12 text-justify'>
    {/* <Typography variant="body2" color="text.primary" className='font-bold my-4' >
        SHRI SWAMI GURU PRASAD PARAMHANS (1966)
    </Typography> */}

  <Typography variant="body2" color="text.secondary" >
        Present Ajapa Master Swami Guruprasad Paramhans laid the foundation stone for Kanpur Ashram's renovation in 2018. The final renovation was completed & inaugurated in 2021, amid a heavenly Utsav filled with Art, Meditation, Blessings & Happiness all around    
    </Typography>

    <Typography variant="body2" color="text.secondary" >
        Spread across a massive area of 30,000 square feet, the Kanpur ashram resembles an ark (as it will save humanity through the practice of Ajapa). It houses a temple, a gaushala (cowshed), a garden & a large meditation hall where meditation camps are organised every week.    
    </Typography>

</div>
</div>

<div className='flex flex-col items-center justify-center my-8 pb-8'>
         <img src ="assets/images/cards/hr-design-1.png" alt=""/>
      </div>

      <div className='grid grid-cols-12 gap-4 my-4 '>
<div className='col-span-12  text-justify'>
    <Typography variant="body2" color="text.primary" className='font-bold my-4' >
        CALIFORNIA ASHRAM
    </Typography>

    <Typography variant="body2" color="text.secondary" >
        When it was time to find a location for American Ashram, one American disciple brought some real estate pamphlets to India for Gurudev to look at.He picked one from the pile and said, "look here", and the Ashram was founded in the same city in California as the pamphlet Swami Janardan picked!    
    </Typography>
            <Typography variant="body2" color="text.secondary" >
        Swami Janardan Paramhans never travelled personally to the Ashram in Placerville, California. However, Swami Guru Prasad first visited at the age of 15 after assuming the mantle of Guru, the worldwide Ajapa Master!    
    </Typography>

</div>
</div>

    </Container>
    </div>
  )
}

export default Ashrams