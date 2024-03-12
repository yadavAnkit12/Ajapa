import { Typography } from '@mui/material'
import { motion } from 'framer-motion';
import React, { useEffect } from 'react'

function Home() {
  useEffect(() => {
    const userData = sessionStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      console.log(delete user.password)
      console.log(user)
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