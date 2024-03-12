import { Button, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

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
    setOpen(close)
  }

  const handleComplete = () => {
    navigate(`/app/useredit/${userId}`)
  }

  return (
    <div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      className="flex flex-1 items-center justify-center h-full"
    >
      <Typography color="text.secondary" variant="h5">
        Home page is under construction!
      </Typography>
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