
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { Input, Paper, Typography, TextField, Autocomplete } from '@mui/material';
import { Button } from '@mui/material';

import { motion } from 'framer-motion';

import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import { useState } from 'react';

import { PARTNERSTATUS } from '../../Static/filterLists';
import { selectPartnersSearchText, setPartnersSearchText } from '../../../store/reduxSlice/partnersSlice';

function ClinicHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectPartnersSearchText);
  const [filterData, setFilterData] = useState({
    fromDate: '',
    toDate: '',
    status: null
  });

  const filterPartnerData = () => {
    props.setFilterValue(filterData);
  }

  const clearFilters = () => {
    setFilterData({
      fromDate: '',
      toDate: '',
      status: null
    });
    props.setFilterValue(null);
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-10">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="text-24 md:text-32 font-extrabold tracking-tight"
        >
          Clinics
        </Typography>

        <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
          >
            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

            <Input
              placeholder="Search Clinic"
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => dispatch(setPartnersSearchText(ev))}
            />
            {searchText && <FuseSvgIcon
              color="disabled"
              size={16}
              style={{ cursor: "pointer" }}
              onClick={() => dispatch(setPartnersSearchText(null))
              }>
              heroicons-solid:x
            </FuseSvgIcon>
            }
          </Paper>
          
          {props?.permission?.create_data && <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <Button
              className=""
              component={Link}
              to="/app/manage/partner/new"
              variant="contained"
              color="secondary"
              startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
            >
              Add
            </Button>
          </motion.div>}
        </div>
      </div>

      <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16'>
        <div className="flex sm:flex-row flex-wrap flex-col justify-start">
          <TextField
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
          />
          <TextField
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
          />
          {_.size(PARTNERSTATUS) > 0 && <Autocomplete
            disablePortal
            value={filterData.status}
            id="status"
            options={PARTNERSTATUS}
            getOptionLabel={option => option.name}
            sx={{ my: 1, minWidth: 140, mx: 1 }}
            onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue })}
            renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
          />}
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
  );
}


export default ClinicHeader;