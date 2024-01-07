import FuseLoading from '@fuse/core/FuseLoading';

import _ from '@lodash';

import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, Menu, MenuItem, Button, Slide, IconButton, Box, Modal, Dialog, DialogActions, DialogTitle } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

import axios from 'axios';

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { motion } from 'framer-motion';

import { useEffect, useState, forwardRef, useRef } from 'react';
import * as React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from "react-router-dom";

import { selectAppointmentsSearchText } from 'app/store/reduxSlice/appointmentSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

import { ConfigurationAPIConfig, appointmentAPIConfig } from '../../../API/apiConfig';

import AppointmentView from './AppointmentView';
import AppointmentsTableHead from './AppointmentsTableHead';


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxWidth: '70%',
  maxHeight: '700px',
  overflow: 'auto'
};

function AppointmentsTable(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const searchText = useSelector(selectAppointmentsSearchText);
  const [openView, setOpenView] = useState(false);
  const [viewid, setViewId] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusOpen, setStatusOpen] = useState(false);
  const [change, setChange] = useState(false);
  const [cancelData, setCancelData] = useState({});
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });


  useEffect(() => {
    fetchData();
  }, [change, rowsPerPage, page, props?.filterValue]);

  useEffect(() => {
    if (page !== 0) {
      setPage(0);
    }
  }, [props.filterValue])

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

    if (searchText !== 0) {
      debouncedTriggerAPI();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);


  //this will set the id of Kapeefit default doctor
  async function defaultDocterDirectAppointmentCheck() {
    try {
      const response = await axios.get(ConfigurationAPIConfig.fetchConfiguration);
      if (response.status === 200) {
        return response.data.data.defaultDocterDirectAppointment._id;
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        return  
      }
    } catch (error) {
      console.error(error);
      return
    }
  }
  
  async function fetchData() {
    try {
      let defaultDocterDirectAppointment = _.get(props, 'filterValue.defaultDocterDirectAppointment')==='Yes' ? await defaultDocterDirectAppointmentCheck() : null;
    
      const params = {
        page: page + 1,
        rowsPerPage: rowsPerPage,
        search: searchText,
        fromDate: _.get(props, 'filterValue.fromDate'),
        toDate: _.get(props, 'filterValue.toDate'),
        status: _.get(props, 'filterValue.status.id'),
        doctorId: defaultDocterDirectAppointment,
      };

      const response = await axios.get(appointmentAPIConfig.appointmentsList, {
        params,
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      });
  
      if (response.status === 200) {
        setData(response.data.data);
        setLoading(false);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    } catch (error) {
      console.error(error); 
    }
  }
  

  const handleViewOpen = (empId) => {
    setViewId(empId)
    setOpenView(true);

  };

  function redirectToBooKAppomint(appointmentNo) {
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

  const handleViewClose = () => {
    setOpenView(false);
  };


  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(_.size(_.get(data, 'appointmentsList')) > 0 ?
        _.get(data, 'appointmentsList').map((n) => n._id) :
        {}
      );
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleChangePage(event, value) {
    setPage(value);
    tableRef.current && tableRef.current.scrollIntoView();
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    tableRef.current && tableRef.current.scrollIntoView();
  };

  const cancelAppointment = () => {
    axios.put(`${appointmentAPIConfig.cancelAppointment}/${cancelData?._id}`, { patientId: cancelData?.patientId }, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setStatusOpen(false);
        setChange(!change);
        dispatch(showMessage({ message: "Appointment cancelled successfully", variant: 'success' }));
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        setStatusOpen(false);
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (!_.size(_.get(data, 'appointmentsList'))) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no appointments!
        </Typography>
      </motion.div>
    );
  }


  return (
    <div className="w-full flex flex-col min-h-full">

      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <AppointmentsTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data?.appointmentsList?.length}
          onMenuItemClick={handleDeselect}
          permission={props.permission}
        />
        <TableBody>
          {_.orderBy(data?.appointmentsList, [(o) => {
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


                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {n.reSchedule}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" >
                    <IconButton aria-label="view" color="success" onClick={() => { handleViewOpen(n._id) }}>
                      <PersonIcon />
                    </IconButton>
                  </TableCell>

                  {_.get(props, 'permission.update_data') && <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                            Action
                          </Button>
                          {(n.status==='confirmed' ||  n.status==='rescheduled') &&  <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={() => {
                              redirectToBooKAppomint(n._id)
                              popupState.close
                            }}>Reschedule</MenuItem>
                            <MenuItem onClick={() => { setCancelData(n); setStatusOpen(true); popupState.close(); }}>Cancel</MenuItem>
                          </Menu>}
                         
                        </React.Fragment>
                      )}
                    </PopupState>
                  </TableCell>}
                </TableRow>
              );
            })}
        </TableBody>

      </Table>

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

      <Modal
        open={openView}
        onClose={handleViewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AppointmentView type="all" viewid={viewid} setOpen={setOpenView} open={openView} />
        </Box>
      </Modal>


      <Dialog
        open={statusOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setStatusOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Do you want to cancel this appointment?`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>No</Button>
          <Button onClick={cancelAppointment} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default AppointmentsTable;