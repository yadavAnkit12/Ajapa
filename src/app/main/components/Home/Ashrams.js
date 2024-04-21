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

function Ashrams() {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [userId, setUserId] = useState('')





    return (
        <div>

            <div className='flex flex-col  py-4 items-center justify-center  text-white h-128 sm:h-256' style={{ backgroundColor: "#792b00" }}>
                <Typography style={{ fontStyle: 'normal', fontSize: '28px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}>
                    Our Ashrams
                </Typography>
            </div>

            <div className="bg-cover bg-center" style={{ backgroundImage: "url('assets/images/cards/background.jpg')" }}>

                <Container style={{ paddingTop: '50px' }}  >

                    <div className='flex flex-col items-center justify-center my-8 pb-8'>
                        <img src="assets/images/cards/hr-design-1.png" alt="" />
                    </div>




                    <div className='grid grid-cols-12 gap-4 my-4 '>


                        <div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-start  items-center'>

                            <img className='h-256' src="assets/images/cards/Rishikesh-ashram-1.jpg" alt="" />

                        </div>
                        <div className='col-span-12 sm:col-span-8  text-justify'>
                            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                            Shri Purnananda Yogashram, Laxman Jhula, Pauri Garhwal – 249 302, (Uttarakhand)
                            </Typography>

                            <Typography variant="body2" color="text.primary" >
                                In 1966, Swami Janardan Paramhans found and adopted a baby boy from the banks of River Ganga near Laxman Jhula Ashram in Rishikesh, India. This baby boy is Ajapa Yog's present Guru Swami Guru Prasad Paramhans.
                            </Typography>

                            <Typography variant="body2" color="text.primary" >
                                Laxman Jhula Ashram, Rishikesh is the first Ajapa Yog Ashram established by Swami Janardan Paramhans
                            </Typography>

                        </div>

                    </div>

                    <div className='flex flex-col items-center justify-center my-8 pb-8'>
                        <img src="assets/images/cards/hr-design-1.png" alt="" />
                    </div>

                    <div className='grid grid-cols-12 gap-4 my-4 '>


                        <div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-start  items-center'>

                            <img className='h-256' src="assets/images/cards/ashram1.jpg" alt="" />

                        </div>
                        <div className='col-span-12 sm:col-span-8 text-justify'>
                            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                                Shri Purnananda Ajapa Yog Sansthan Jamshedpur, Jharkhand India
                            </Typography>
                            <Typography variant="body2" color="text.primary" >
                                The Ajapa Yog Ashram in Jamshedpur, India, has a Nine Rishi (sage) Temple built in the shape of an Inverted Lotus (like the Meru Parvat at the centre of Earth) guarded with Avatar on top, symbolizing the Golden Era of Truth and Enlightenment.
                            </Typography>

                            <Typography variant="body2" color="text.primary" >
                                This is the Ashram where Swami Janardan Paramhans left his material body, and a Samadhi (shrine) was built in one of the temples here.
                            </Typography>

                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center my-8 pb-8'>
                        <img src="assets/images/cards/hr-design-1.png" alt="" />
                    </div>

                    <div className='grid grid-cols-12 gap-4 my-4 '>
                        <div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-start  items-center'>

                            <img className='h-256' src="assets/images/cards/kanpur-ashram.jpg" alt="" />

                        </div>
                        <div className='col-span-12 sm:col-span-8 text-justify'>
                            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                                Shri Purnananda Ajapa Yog Sansthan Kanpur, Uttar Pradesh India
                            </Typography>

                            <Typography variant="body2" color="text.primary" >
                                Present Ajapa Master Swami Guruprasad Paramhans laid the foundation stone for Kanpur Ashram's renovation in 2018. The final renovation was completed & inaugurated in 2021, amid a heavenly Utsav filled with Art, Meditation, Blessings & Happiness all around
                            </Typography>

                            <Typography variant="body2" color="text.primary" >
                                Spread across a massive area of 30,000 square feet, the Kanpur ashram resembles an ark (as it will save humanity through the practice of Ajapa). It houses a temple, a gaushala (cowshed), a garden & a large meditation hall where meditation camps are organised every week.
                            </Typography>

                        </div>

                    </div>

                    <div className='flex flex-col items-center justify-center my-8 pb-8'>
                        <img src="assets/images/cards/hr-design-1.png" alt="" />
                    </div>

                    <div className='grid grid-cols-12 gap-4 my-4 '>


                        <div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-start  items-center'>

                            <img className='h-256' src="assets/images/cards/california-ashram.jpg" alt="" />

                        </div>
                        <div className='col-span-12 sm:col-span-8 text-justify'>
                            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                                Shri Janardan Ajapa Yogashram P.O. Box 1731, Placerville, California 95667
                            </Typography>

                            <Typography variant="body2" color="text.primary" >
                                When it was time to find a location for American Ashram, one American disciple brought some real estate pamphlets to India for Gurudev to look at.He picked one from the pile and said, "look here", and the Ashram was founded in the same city in California as the pamphlet Swami Janardan picked!
                            </Typography>
                            <Typography variant="body2" color="text.primary" >
                                Swami Janardan Paramhans never travelled personally to the Ashram in Placerville, California. However, Swami Guru Prasad first visited at the age of 15 after assuming the mantle of Guru, the worldwide Ajapa Master!
                            </Typography>

                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center my-8 pb-8'>
                        <img src="assets/images/cards/hr-design-1.png" alt="" />
                    </div>

                    <div className='grid grid-cols-12 gap-4 my-4 '>

                        <div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-start  items-center'>

                            <img className='h-256' src="assets/images/cards/guwahati-ashram.jpg" alt="" />

                        </div>
                        <div className='col-span-12 sm:col-span-8  text-justify'>
                            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                                Shri Purnanand Ajapa Yoga Sansthan, Kalipur Ashram, Nilachal Hill, Kamakhya, Guwahati, Kamrup(M)-781010
                            </Typography>

                            <Typography variant="body2" color="text.primary" >
                                When Swami Purnanand returned from Siddhashram, he meditated on the Nilachal hills located near Kamakhya station in Guwahati, Asssam. Little did anyone know that the land he did rigorous meditation on would soon be the second Ajapa Yog Ashram.
                            </Typography>

                        </div>


                    </div>

                    <div className='flex flex-col items-center justify-center my-8 pb-8'>
                        <img src="assets/images/cards/hr-design-1.png" alt="" />
                    </div>

                    <div className='grid grid-cols-12 gap-4 my-4 '>

                        <div className='col-span-12 sm:col-span-4 flex flex-col justify-center sm:items-start  items-center'>

                            <img className='h-256' src="assets/images/cards/poland-ashram.jpg" alt="" />

                        </div>
                        <div className='col-span-12 sm:col-span-8  text-justify'>
                            <Typography variant="body2" color="text.primary" className='font-bold my-4' >
                            Ajapa Yog Centre Lugi, Lodz Province Poland - Shri Janardan Ajapa Yogashram
                            </Typography>

                            <Typography variant="body2" color="text.primary" >
                            The construction of the Ashram building in Poland began in 1997 and was opened for disciples in 2000 . In 2001 Swami Guru Prasad Paramhans visited the Ashram for the first time . Since then Guruji has been visiting the ashram regularly .
                            </Typography>

                        </div>


                    </div>

                </Container>
            </div>
        </div>
    )
}

export default Ashrams