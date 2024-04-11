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

function ContactUs() {
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

    Contact us Page
    </div>
  )
}

export default ContactUs