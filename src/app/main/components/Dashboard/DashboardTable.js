import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Modal, Table, TableBody, TableCell, TablePagination, TableRow, Typography, IconButton, Box, Button, MenuItem, Menu, Dialog, DialogTitle, DialogActions, Slide, Switch } from '@mui/material';
import axios from 'axios';
import { color, motion } from 'framer-motion';
import { useEffect, useState, useRef, forwardRef } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { eventAPIConfig } from '../../API/apiConfig';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
// import EventTableHead from './EventTableHead';
// import { tuple } from 'yup';
// import EventView from './EventView';
import DashboardTableHead from './DashboardTableHead';
import EventView from '../Event/EventView';

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
  maxWidth: '1200px',
  maxHeight: '650px',
  overflow: 'auto',
};

const menuItemArray = [
  {
    key: 1,
    label: 'View',
    status: 'view',
    // visibleIf: ['complete', 'active', 'inactive'],
    loadIf: true
  },
  {
    key: 1,
    label: 'Edit',
    status: 'edit',
    // visibleIf: ['complete', 'active', 'inactive'],
    loadIf: true
  },
  // {
  //   key: 1,
  //   label: 'Delete',
  //   status: 'delete',
  //   // visibleIf: ['complete', 'active', 'inactive'],
  //   loadIf: true
  // },
]


function DashboardTable(props) {
  // console.log(props)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [eventListData, setEventListData] = useState([]);
  const searchText = props.searchText;

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const tableRef = useRef(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [openView, setOpenView] = useState(false);
  const [viewid, setViewId] = useState("");
  const [change, setChange] = useState(false);
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState('')

  useEffect(() => {
    fetchData();
  }, [props?.change, rowsPerPage, page, props?.filterValue, searchText]);

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

    if (searchText.length !== 0) {
      debouncedTriggerAPI();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);


  const fetchData = () => {
    setLoading(true)
    const params = {
      page: page + 1,
      rowsPerPage: rowsPerPage, // Example data to pass in req.query
      eventName: searchText,
      eventStatus: (_.get(props, 'filterValue.eventStatus') === 'On' || _.get(props, 'filterValue') === '' || _.get(props, 'filterValue.eventStatus') === null) ? true : false,
      bookingStatus: (_.get(props, 'filterValue.bookingStatus') === 'On' || _.get(props, 'filterValue') === '' || _.get(props, 'filterValue.bookingStatus') === null) ? true : false,
    };
    const flag1=props.filterValue==='' || props.filterValue.eventStatus===null ?'On':props.filterValue.eventStatus
    const flag2=props.filterValue==='' || props.filterValue.bookingStatus===null ?'On':props.filterValue.bookingStatus
    axios.get(`${eventAPIConfig.list}/${flag1}/${flag2}`, { params }, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setEventListData(response?.data);
        setLoading(false);
      } else {
        setLoading(false)
        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
      }
    }).catch((error) => {
      setLoading(false)
      dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
    })
  };


  const handleViewClose = () => {
    setOpenView(false);
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

  function getStatus(id, selectedValue) {

    if (selectedValue === 'view') {
      setOpenView(true)
      setViewId(id)
    }
    else if (selectedValue === 'edit') {
      navigate(`/app/eventRegisteration/${id}`)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }


  //chnaging the booking status
  const handleChnangeBookingStatus = (id, status) => {
    setLoading(true)
    axios.post(`${eventAPIConfig.changeBookingStatus}/${id}/${!status}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        fetchData()
        setLoading(false)
        dispatch(showMessage({ message: response.data.message, variant: 'success' }));

      } else {
        setLoading(false)
        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
      }
    }).catch((error) => {
      setLoading(false)
      dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }))
    })

  }
  //chnaging the event status
  const handleChangeEventStatus = (id, status) => {
    setLoading(true)
    axios.post(`${eventAPIConfig.changeEventStatus}/${id}/${!status}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        fetchData()
        setLoading(false)
        dispatch(showMessage({ message: response.data.message, variant: 'success' }));
      } else {
        setLoading(false)
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    }).catch((error) => {
      setLoading(false)
      dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }))
    })

  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(_.size(_.get(eventListData, 'data')) > 0 ?
        _.get(eventListData, 'data').map((n) => n.eventId) :
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
    event.preventDefault();
    setPage(value);
    tableRef.current && tableRef.current.scrollIntoView();

  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    tableRef.current && tableRef.current.scrollIntoView();

  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (!_.size(_.get(eventListData, 'data'))) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no Events!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full" style={{ overflow: 'auto' }}>
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <DashboardTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={eventListData?.length}
          onMenuItemClick={handleDeselect}
        />
        <TableBody>
          {
            eventListData?.data?.map((n) => {
              const isSelected = selected.indexOf(n.eventId) !== -1;
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
                    {n.eventName}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.eventType}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" >
                    {n.eventLocation}

                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.eventDate}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.shivirAvailable ? 'Yes' : 'No'}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    <Switch
                      checked={n.eventStatus}
                      color="success"
                      inputProps={{ 'aria-label': 'toggle event status' }}
                      onChange={() => handleChangeEventStatus(n.eventId, n.eventStatus)}
                    />
                    {n.eventStatus ? 'On' : 'Off'}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    <Switch
                      checked={n.bookingStatus}
                      color="success"
                      inputProps={{ 'aria-label': 'toggle booking status' }}
                      onChange={() => handleChnangeBookingStatus(n.eventId, n.bookingStatus)}
                    />
                    {n.bookingStatus ? 'On' : 'Off'}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" >
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <>
                          <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                            Action
                          </Button>
                          <Menu {...bindMenu(popupState)}>

                            {menuItemArray.map((value) => (
                              (value.loadIf) && <MenuItem
                                onClick={() => {
                                  getStatus(n.eventId, value.status, n.eventStatus);
                                  popupState.close();
                                }}
                                key={value.key}
                              >
                                {value.label}
                              </MenuItem>
                            )
                            )}
                          </Menu>

                        </>
                      )}
                    </PopupState>
                  </TableCell>
                </TableRow>
              );

            })}
        </TableBody>

      </Table>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={eventListData.totalElement}
        rowsPerPage={eventListData.rowPerPage}
        page={eventListData.pageNumber - 1}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Do you want to delete this Event?"}</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={deleteEvent} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}
      <Modal
        open={openView}
        onClose={handleViewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <EventView handleViewClose={handleViewClose} viewid={viewid} />
        </Box>
      </Modal>

    </div>
  );
}

export default withRouter(DashboardTable);