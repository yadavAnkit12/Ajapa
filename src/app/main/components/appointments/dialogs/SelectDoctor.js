import FuseScrollbars from '@fuse/core/FuseScrollbars';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from '@lodash';
import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, Slide, Paper, Checkbox, Input, TextField, Autocomplete, IconButton } from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useEffect, useState, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { specializationAPIConfig, doctorAPIConfig } from '../../../API/apiConfig';
import SelectDoctorTableHead from './SelectDoctorTableHead';


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



function EmployeesTable(props) {

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [searchT, setSearchT] = useState("");
  const [specializationValue, setSpecializationValue] = useState('');
  const [symptomValue, setSymptomValue] = useState('')
  const [approveDoctor, setApproveDoctor] = useState([])
  const [specializationList, setSpecializationList] = useState([])
  const [symptomList, setSymptomList] = useState([])

  //this is for specialization list
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

  //this is for symptom list
  useEffect(() => {
    if (specializationValue === '' || !specializationValue) {
      axios.get(specializationAPIConfig.fetchSymptom, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setSymptomList(response.data.data);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    } else {
      const val = specializationValue.specialization
      axios.get(`${specializationAPIConfig.fetch}/${val}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setSymptomList(response.data.data);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  }, [specializationValue]);

  useEffect(() => {
    fetchData();
  }, [rowsPerPage, page, symptomValue, specializationValue]);

  useEffect(() => {
    if (page !== 0) {
      setPage(0);
    }
  }, [symptomValue, specializationValue])

  useEffect(() => {
    const delay = 500;
    let timeoutId;

    const triggerAPI = () => {
      fetchData();
    };

    const debouncedTriggerAPI = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(triggerAPI, delay);
    };

    if (searchT !== 0) {
      debouncedTriggerAPI();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchT]);

  const fetchData = () => {
    const params = {
      page: page + 1,
      rowsPerPage: rowsPerPage, // Example data to pass in req.query
      search: searchT,
      specialization: specializationValue?.specialization || '',
      symptom: symptomValue || '',
      status: 'Published'
    };

    axios.get(doctorAPIConfig.getDoctorList, { params }, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setData(response?.data?.data);
        setLoading(false);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    });
  };

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data?.doctorList?.map((n) => n._id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  function selectDoctorData(doctorData) {
    props.setDoctorData(doctorData)
    props.setOpen(false)
  }

  return (
    <div height="100px">
      <IconButton onClick={() => { props.setOpen(false) }} sx={{ position: 'absolute', top: '0', right: '0', justifyContent: 'flex-end', margin: '0 10px' }}>
        <CloseIcon />
      </IconButton>
      <div className="w-full flex flex-col min-h-full">
        <div className="flex flex-col w-full mb-10 mt-10 sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="text-24 md:text-32 font-extrabold tracking-tight float-left w-full"
          >
            Doctors
          </Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={specializationList}
            value={specializationValue}
            onChange={(event, newValue) => setSpecializationValue(newValue)}
            getOptionLabel={(option) => option ? option.specialization : ''}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Specialization" />}
          />

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={symptomList}
            value={symptomValue}
            onChange={(event, newValue) => setSymptomValue(newValue)}
            getOptionLabel={(option) => option ? option.symptom : ''}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Symptom" />}
          />
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
              value={searchT}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => setSearchT(ev.target.value)}
            />
          </Paper>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
          </motion.div>
        </div>
      </div>
      {data?.doctorList?.length > 0 && <div className="w-full flex flex-col min-h-full">
        <FuseScrollbars className="grow overflow-x-auto">
          <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
            <SelectDoctorTableHead
              selectedProductIds={selected}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data?.doctorList?.length}
              onMenuItemClick={handleDeselect}
            />
            <TableBody>
              {_.orderBy(data?.doctorList, [(o) => {
                switch (order.id) {
                  case 'categories': {
                    return o.categories[0];
                  }
                  default: {
                    return o[order.id];
                  }
                }
              },
              ],
                [order.direction]
              )
                .map((n) => {
                  const isSelected = selected.indexOf(n._id) !== -1;
                  return (
                    <TableRow
                      className="h-72 cursor-pointer"
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n._id}
                      selected={isSelected}
                      style={{ cursor: 'default' }}
                    >
                      <TableCell className="p-4 md:p-16" component="th" scope="row">
                        {n.name}
                      </TableCell>

                      <TableCell className="p-4 md:p-16 truncate" style={{ color: "Blue" }} component="th" scope="row">
                        {n.email}
                      </TableCell>

                      <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                        {n.mobile}
                      </TableCell>

                      <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                        {n.specialization}
                      </TableCell>

                      <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                        {n.doctorType}
                      </TableCell>
                      <TableCell className="p-4 md:p-16" style={{ width: '1' }} component="th" scope="row">
                        {n.category}
                      </TableCell>

                      <TableCell className="p-4 md:p-16 m-auto position-absolute" component="th" scope="row" align="center">
                        <Checkbox onChange={(e) => { e.target.checked ? selectDoctorData(n) : props.setDoctorData(null) }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </FuseScrollbars>

        <TablePagination
          className="shrink-0 border-t-1"
          component="div"
          count={data.totalElement}
          rowsPerPage={data.rowsPerPage}
          page={data.pageNumber - 1}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>}
      {!data?.doctorList?.length && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full mb-20 mt-20"
      >
        <Typography color="text.secondary" variant="h5">
          There are no doctors!
        </Typography>
      </motion.div>}
    </div>

  );
}

export default withRouter(EmployeesTable);