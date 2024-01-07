import { Typography } from '@mui/material'
import { motion } from 'framer-motion';
import React from 'react'

function Home() {
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