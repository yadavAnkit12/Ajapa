
const key = process.env.REACT_APP_URL;
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { Button } from "@mui/material";
import { eventAPIConfig } from "../../API/apiConfig";
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';


const UserEventCard = () => {

  const [allEventsData, setAllEventsData] = useState([]);
  const dispatch = useDispatch();
    
    useEffect(()=> {
        const params = {
          page: 1,
          rowsPerPage: 200, // Example data to pass in req.query
          eventName: '',
          eventStatus: true,
          bookingStatus: true 
        };
        axios.get(eventAPIConfig.list, { params }, {
          headers: {
            'Content-type': 'multipart/form-data',
             Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            // console.log(response.data.data)
            setAllEventsData(response.data.data)
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        });
      },[])
      
      const handleEventRegister = () =>{
        dispatch(showMessage({ message: "We are working on it !" }));
      }
     
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {allEventsData.map((data, idx) => (
            <div key={idx} className="max-w-sm bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
              {/* Event image */}
              <img 
               
              style={{ width: '100%', height: '200px' }}
              src={`${key}/events/${data.eventId}.jpg`} alt="Event Image" />
              <div className="p-5">
                <h5 
                className="mb-2 
                text-2xl font-bold tracking-tight text-gray-900 
                dark:text-white text-center">{data.eventName}</h5>
                <div className="flex items-center gap-2 mb-2 my-3" >
                  <EventIcon />
                  <span className="text-lg 
                  text-center
                  " style={{
                    fontStyle: 'normal', fontSize: '16px',
                    lineHeight: '28px', letterSpacing: '0px',
                    textAlign: 'center', fontWeight: 600,
                    marginTop: '5px'
                  }}>Event Date: {data.eventDate}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <EventIcon />
                  <span className="text-lg 
                  "style={{
                    fontStyle: 'normal', fontSize: '16px',
                    lineHeight: '28px', letterSpacing: '0px',
                    textAlign: 'center', fontWeight: 600,
                    marginTop: '5px'
                  }}>Shivir Date: {data.shivirStartDate === "" ? "N/A" : data.shivirStartDate}</span>
                </div>
                <div className="flex items-center gap-2 mb-2" >
                  <LocationOnIcon />
                  <span className="text-lg 
                  "style={{
                    fontStyle: 'normal', fontSize: '16px',
                    lineHeight: '28px', letterSpacing: '0px',
                    textAlign: 'center', fontWeight: 600,
                    marginTop: '5px'
                  }}>Event Location: {data.eventLocation}</span>
                </div>
                <Button className="my-4 text-white bg-gradient-to-r 
                from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
                focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
                shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium 
                rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 " onClick={handleEventRegister}>
                  Register
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
}

export default UserEventCard

