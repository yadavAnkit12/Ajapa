import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';




const getUserDetails=createAsyncThunk("getUserDetails",async (data)=>{
 const userData=  await axios.get('http://54.198.229.134:8080/ajapa_yog-0.0.1-SNAPSHOT/doctor/fetch',{
        headers: {
            'authorization': `Brrrare ${data}`
          }
    })
     return userData
})





export const userDetail =async (token) => {
    const userData= await axios.get('http://54.198.229.134:8080/ajapa_yog-0.0.1-SNAPSHOT/user/fetch',{
        headers: {
          "Content-Type":"application-json",
            'authorization': `Brrrare ${token}`
          }
    })
     return userData
  };


export default getUserDetails;