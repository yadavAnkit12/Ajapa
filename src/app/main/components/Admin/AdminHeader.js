import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Autocomplete from '@mui/material/Autocomplete';
import { Input, Paper, Typography, Button, TextField , Modal,Box} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminForm from './AdminForm';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxWidth: '1200px',
  maxHeight: '650px',
  overflow: 'auto',
};

function AdminHeader(props) {
  
  const routeParams = useParams()
  const [filterData, setFilterData] = useState({
    bookingStatus: 'On',
    eventStatus: 'On'
  });

  //form open
  const[open, setOpen] = useState(false)

  useEffect(() => {
    const { eventStatus, bookingStatus } = routeParams
    setFilterData({ eventStatus: eventStatus, bookingStatus: bookingStatus })
    props.setFilterValue({ eventStatus: eventStatus, bookingStatus: bookingStatus })
  }, [])

  const filterPartnerData = () => {
    props.setFilterValue(filterData);
  }

  const clearFilters = () => {
    setFilterData({
      bookingStatus: 'On',
      eventStatus: 'On'
    });
    props.setFilterValue('');
  }

  const handleModalOpen = () => {
    setOpen(true)
  }

  const handleModalClose = () => {
    setOpen(false)
  }



  return (
    <>
      <div className="w-full flex flex-col min-h-full">
        <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-10">
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            style={{ fontStyle: 'normal', fontSize: '24px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}
          >
            Admin
          </Typography>
          <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
            {/* <Paper
              component={motion.div}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              className="flex items-center w-full sm:max-w-256 space-x-8 px-16 ml-5 mr-5 rounded-full border-1 shadow-0"
            >
              <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
              <Input
                placeholder="Search Event"
                className="flex flex-1"
                disableUnderline
                fullWidth
                value={props?.searchText}
                inputProps={{
                  'aria-label': 'Search',
                }}
                onChange={(ev) => props?.setSearchText(ev.target.value)}
              />
            </Paper> */}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              className="ml-lg-5 mr-lg-5 ml-sm-2 mr-sm-2"
            >
              <Button
                className=""
                component={Link}
                // to="/app/addAdmin"
                variant="contained"
                color="secondary"
                onClick={handleModalOpen}
                startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
              >
                Add
              </Button>
            </motion.div>
          </div>
        </div>
        <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16'>
          {/* <div className="flex sm:flex-row flex-wrap flex-col justify-start">
            <Autocomplete
              disablePortal
              value={filterData.eventStatus}
              id="eventStatus"
              options={['On', 'Off', "All"]}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={(e, newValue) => setFilterData({ ...filterData, eventStatus: newValue })}
              renderInput={(params) => <TextField {...params} label="Event Status" variant="standard" />}
            />

            <Autocomplete
              disablePortal
              value={filterData.bookingStatus}
              id="bookingStatus"
              options={['On', 'Off', "All"]}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={(e, newValue) => setFilterData({ ...filterData, bookingStatus: newValue })}
              renderInput={(params) => <TextField {...params} label="Registration Status" variant="standard" />}
            />
          </div> */}
          {/* <div className="flex flex-row justify-end">
            <Button
              component={Link}
              onClick={filterPartnerData}
              variant="contained"
              color="secondary"
              startIcon={<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>}
              sx={{ my: 2, mx: 1 }}
              fullWidth
            >
              Search
            </Button>
            <Button
              component={Link}
              onClick={clearFilters}
              variant="outlined"
              color="secondary"
              startIcon={<FuseSvgIcon>heroicons-outline:refresh</FuseSvgIcon>}
              sx={{ my: 2, mx: 1 }}
              fullWidth
            >
              Reset
            </Button>
          </div> */}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          ...style,
          '@media (max-width: 600px)': { 
            width: '70%', 
          },
          '@media (max-width: 280px)': { 
            width: '93%', 
          },
        }}>
          <AdminForm handleModalClose={handleModalClose} open={open} setOpen={setOpen} 
          setChange={props.setChange} change={props.change}/>
        </Box>
      </Modal>
    </>
  );
}

export default AdminHeader;
