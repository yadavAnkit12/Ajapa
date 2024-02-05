 import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Autocomplete from '@mui/material/Autocomplete';
import { Input, Paper, Typography, Modal, Box, Button, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { eventAPIConfig } from '../../API/apiConfig';
import axios from 'axios';

// import VehicleRegisterForm from './VehicleRegisterForm';

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
  overflow: 'auto'
};
function AllEventRegistrationHeader(props) {
  console.log(props)
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    eventName:''
  });

  const id='new';

  const filterPartnerData = () => {
    props.setFilterValue(filterData);
  }

  const clearFilters = () => {
    setFilterData({
        eventName:''
    });
    props.setFilterValue('');
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            Events
          </Typography>
          <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
            <Paper
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
              {props?.searchText && <FuseSvgIcon
                color="disabled"
                size={16}
                style={{ cursor: "pointer" }}
                onClick={() => props?.setSearchText('')}>
                heroicons-solid:x
              </FuseSvgIcon>
              }
            </Paper>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              className="ml-lg-5 mr-lg-5 ml-sm-2 mr-sm-2"
            >
              <Button
                className=""
                component={Link}
                to="/app/eventRegisteration/new"
                variant="contained"
                color="secondary"
                startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
              >
                Add
              </Button>
            </motion.div>
          </div>
        </div>
        <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16'>
          <div className="flex sm:flex-row flex-wrap flex-col justify-start">
            {/* <TextField
              id="fromDate"
              label="From Date"
              variant="standard"
              type='date'
              value={filterData.fromDate}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={e => setFilterData({ ...filterData, fromDate: e.target.value })}
            /> */}
            {/* <TextField
              id="toDate"
              label="To Date"
              variant="standard"
              type='date'
              value={filterData.toDate}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={e => setFilterData({ ...filterData, toDate: e.target.value })}
            /> */}

            <Autocomplete
              disablePortal
              value={filterData.eventName}
              id="eventName"
              options={props.eventList.length>0 ?props.eventList.map((event)=>event.eventName):[]}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={(e, newValue) => setFilterData({ ...filterData, eventName: newValue })}
              renderInput={(params) => <TextField {...params} label="Select Event" variant="standard" />}
            />
{/* 
            <Autocomplete
              disablePortal
              value={filterData.eventStatus}
              id="eventStatus"
              options={['Active', 'Inactive']}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={(e, newValue) => setFilterData({ ...filterData, eventStatus: newValue })}
              renderInput={(params) => <TextField {...params} label="Event Status" variant="standard" />}
            /> */}

            {/* {_.size(PATIENTSTATUS) > 0 && <Autocomplete
              disablePortal
              value={filterData.status}
              id="status"
              options={PATIENTSTATUS}
              getOptionLabel={option => option.name}
              sx={{ my: 1, minWidth: 140, mx: 1 }}
              onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue })}
              renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
            />}  */}
          </div>
          <div className="flex flex-row justify-end">
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
          </div>
        </div>
      </div>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>

          {/* <VehicleRegisterForm setChange={props.setChange} change={props.change} setOpen={setOpen} /> */}
        </Box>
      </Modal>
    </>
  );
}

export default AllEventRegistrationHeader;