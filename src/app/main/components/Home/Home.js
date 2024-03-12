import { Typography } from '@mui/material'
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'

function Home() {
  const [profileUpdate,setProfileUpdate]=useState(false)
  useEffect(() => {

    const userData = sessionStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      delete user.password
    const status=  Object.keys(user).every(key => user[key]==='' || user[key]===undefined  || user[key]==='undefined' || user[key]==='null' || user[key]===null);
    if(!status){

    } 
    }
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      className="flex flex-1 items-center justify-center h-full"
    >
      <Typography color="text.secondary" variant="h5">
        Home page is under construction!
      </Typography>
    </motion.div>
  )
}

export default Home