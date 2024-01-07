import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';

import _ from '@lodash';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import Slide from '@mui/material/Slide';
import { Paper } from '@mui/material';
import Input from '@mui/material/Input';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Modal, Box, IconButton } from '@mui/material';

import axios from 'axios';

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { motion } from 'framer-motion';

import { useEffect, useState, forwardRef } from 'react';
import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from "react-router-dom";

import { selectAppointmentsSearchText } from 'app/store/reduxSlice/appointmentSlice';

import { patientAPIConfig } from 'src/app/main/API/apiConfig';

import AppointmentView from '../../../appointments/appointmentList/AppointmentView';
import AppointmentsTableHead from '../../../appointments/appointmentList/AppointmentsTableHead';


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxWidth: '900px',
  maxHeight: '650px',
  overflow: 'auto'
};

function AppointmentDetail(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const searchText = useSelector(selectAppointmentsSearchText);
  const routeParams = useParams();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(appointments);
  const [page, setPage] = useState(0);
  const [openView, setOpenView] = useState(false);
  const [viewid, setViewId] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [patientID, setPatientID] = useState("")
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    const { patientId } = routeParams;
    setPatientID(patientId);

  }, [])


  useEffect(() => {
    const fetchData = () => {
      const { patientId } = routeParams;

      const params = {
        page: page, // Example data to pass in req.query
      };
      if (patientId) {
        axios.get(`${patientAPIConfig.patientAppointment}/${patientId}`, {
          headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            const data = response.data.data;
            const patientList = data.map((item) => {
              return { id: item._id, ...item };
            });
            setAppointments(patientList);
            setLoading(false);
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        })
      }
    }
    if (!patientID) {
      fetchData();
    }

  }, [patientID]);


  useEffect(() => {
    if (searchText.length !== 0) {

      setData(

        _.filter(appointments, (item) => {
          return (item.patientMobile.toLowerCase().includes(searchText.toLowerCase()) || item.appointmentNo.toLowerCase().includes(searchText.toLowerCase()))
        })
      );
      setPage(0);
    } else {
      setData(appointments);
    }
  }, [appointments, searchText]);


  function redirectToBookAppointment(appointmentNo) {
    navigate(`/apps/book/appointment/${appointmentNo}/edit`)

  }

  function redirectToProfile(appointmentNo) {
    navigate(`/app/book/appointment/view/${appointmentNo}`);
  }


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
  const handleViewOpen = (empId) => {
    setViewId(empId)
    setOpenView(true);

  };


  const handleViewClose = () => {
    setOpenView(false);
  };

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no Patients!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">

      <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="text-24 md:text-32 font-extrabold tracking-tight"
        >
          Appointments
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
              placeholder="Search Appointment"
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => dispatch(setAppointmentsSearchText(ev))}
            />
          </Paper>
        </div>

      </div>


      <div className='flex'>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          // options={ORDERTYPE}
          value={props?.orderType}
          onChange={(event, newValue) => props?.setOrderType(newValue)}
          getOptionLabel={(option) => option ? option.name : ''}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Order Type" />}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          // options={ORDERTYPE}
          value={props?.orderType}
          onChange={(event, newValue) => props?.setOrderType(newValue)}
          getOptionLabel={(option) => option ? option.name : ''}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Order Type" />}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          // options={ORDERTYPE}
          value={props?.orderType}
          onChange={(event, newValue) => props?.setOrderType(newValue)}
          getOptionLabel={(option) => option ? option.name : ''}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Order Type" />}
        />

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          // options={ORDERTYPE}
          value={props?.orderType}
          onChange={(event, newValue) => props?.setOrderType(newValue)}
          getOptionLabel={(option) => option ? option.name : ''}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Order Type" />}
        />

      </div>




      <FuseScrollbars className="grow overflow-x-auto">

        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <AppointmentsTableHead
            selectedProductIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />
          <TableBody>
            {_.orderBy(data, [(o) => {
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
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                const isSelected = selected.indexOf(n.id) !== -1;
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                    style={{ cursor: 'default' }}
                  >
                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.appointmentNo}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.patientMobile}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.doctorName}
                    </TableCell>
                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.date}
                    </TableCell>
                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.slot}
                    </TableCell>


                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                      {n.status}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" >
                      <IconButton aria-label="view" color="success" onClick={() => { handleViewOpen(n.id) }}>
                        <PersonIcon />
                      </IconButton>
                    </TableCell>


                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                              Action
                            </Button>
                            <Menu {...bindMenu(popupState)}>
                              <MenuItem onClick={() => {
                                redirectToBookAppointment(n.id)
                                popupState.close
                              }}>Reschedule</MenuItem>
                              <MenuItem onClick={popupState.close}>Cancelled</MenuItem>
                            </Menu>
                          </React.Fragment>
                        )}
                      </PopupState>
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal
        open={openView}
        onClose={handleViewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AppointmentView viewid={viewid} setChange={props.setChange} change={props.change} setOpen={setOpenView} open={openView} />
        </Box>
      </Modal>
    </div>
  );
}

export default AppointmentDetail;