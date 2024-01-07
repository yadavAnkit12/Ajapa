import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Input, Paper, Typography, Button, TextField, Autocomplete } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DOCTORSTATUS, DOCTORTYPE, DOCTORCATEGORY } from '../../Static/filterLists';
import { selectDoctorsSearchText, setDoctorsSearchText } from '../../../store/reduxSlice/doctorsSlice';
import { specializationAPIConfig } from '../../API/apiConfig';
import { showMessage } from "app/store/fuse/messageSlice";


function DoctorHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectDoctorsSearchText);
  const [specializationList, setSpecializationList] = useState([]);
  const [filterData, setFilterData] = useState({
    fromDate: '',
    toDate: '',
    specialization: null,
    doctorType: null,
    category: null,
    status: null
  });

  useEffect(() => {
    axios.get(specializationAPIConfig.fetchSpecialization, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setSpecializationList(response.data.data);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }, []);

  const filterDoctorData = () => {
    props.setFilterValue(filterData);
  }

  const clearFilters = () => {
    setFilterData({
      fromDate: '',
      toDate: '',
      specialization: null,
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
          Doctors
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
              placeholder="Search Doctors"
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => dispatch(setDoctorsSearchText(ev))}
            />
            {searchText && <FuseSvgIcon
              color="disabled"
              size={16}
              style={{ cursor: "pointer" }}
              onClick={() => dispatch(setDoctorsSearchText(null))
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
              to="/app/manage/doctor/new"
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
        <TextField
          id="fromDate"
          label="From Date"
          variant="standard"
          type='date'
          value={filterData.fromDate}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ my: 1, minWidth: 140 }}
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
          sx={{ my: 1, minWidth: 140 }}
          onChange={e => setFilterData({ ...filterData, toDate: e.target.value })}
        />
        {specializationList?.length && <Autocomplete
          disablePortal
          value={filterData.specialization}
          id="specialization"
          name="specializationFilter"
          options={[{ specialization: 'All' }, ...specializationList]}
          getOptionLabel={option => option.specialization}
          sx={{ my: 1, minWidth: 140 }}
          onChange={(e, newValue) => setFilterData({ ...filterData, specialization: newValue })}
          renderInput={(params) => <TextField {...params} label="Specialization" variant="standard" />}

        />}
        {/* <Autocomplete
          disablePortal
          value={filterData.doctorType}
          id="doctorType"
          name="doctorTypeFilter"
          options={DOCTORTYPE}
          getOptionLabel={option => option.name}
          sx={{ my: 1, minWidth: 140, mx: 1 }}
          onChange={(e, newValue) => setFilterData({ ...filterData, doctorType: newValue })}
          renderInput={(params) => <TextField {...params} label="Doctor Type" variant="standard" />}

        /> */}
        {/* <Autocomplete
          disablePortal
          value={filterData.category}
          id="category"
          name="categoryFilter"
          options={DOCTORCATEGORY}
          getOptionLabel={option => option.name}
          sx={{ my: 1, minWidth: 140, mx: 1 }}
          onChange={(e, newValue) => setFilterData({ ...filterData, category: newValue })}
          renderInput={(params) => <TextField {...params} label="Category" variant="standard" />}

        /> */}

        {/* {_.size(DOCTORSTATUS) > 0 && <Autocomplete
          disablePortal
          value={filterData.status}
          id="status"
          options={DOCTORSTATUS}
          getOptionLabel={option => option.name}
          sx={{ my: 1, minWidth: 140, mx: 1 }}
          onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue })}
          renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
        />} */}
        <div className="flex flex-row justify-end">
          <Button
            component={Link}
            onClick={filterDoctorData}
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
    </div >
  );
}

export default DoctorHeader;