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
import { adminAPIConfig, eventAPIConfig } from 'src/app/main/API/apiConfig';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import EventPermissionTableHead from './EventPermissionTableHead';
import EventLevelPermissionForm from './EventLevelPermissionForm';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

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
  // {
  //   key: 1,
  //   label: 'View',
  //   status: 'view',
  //   // visibleIf: ['complete', 'active', 'inactive'],
  //   loadIf: true
  // },
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


function EventPermissionTable(props) {
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
  const [openView, setOpenView] = useState(false);
  const [permissionId, setPermissionId] = useState('')

  //for showing event Name in table
  const [eventNamefromId, setEventNameFromId] = useState([])

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
    axios.get(adminAPIConfig.EventLevelPermissionList, {
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
    }).catch(() => {
      setLoading(false)
      dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
    })
  };

  //for Getting event Name
  useEffect(()=>{
    axios.get(eventAPIConfig.allEventList, {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setEventNameFromId(response.data.data)
        
        } else {
          dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
        }
      }).catch((error) => {
        dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
    });
},[])


  const handleEditClose = () => {
    setOpenEdit(false);
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

  function getStatus(id, selectedValue, email, eventId) {

    if (selectedValue === 'edit') {
      setOpenEdit(true)
      setPermissionId({ id, email, eventId })
    }
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
          There are no Event Level Permission!
        </Typography>
      </motion.div>
    );
  }


  const nameofevent = (eventId) => {
    const event = eventNamefromId.find((name) => name.eventId === eventId);
    return event ? event.eventName : '';
  };


  return (
    <div className="w-full flex flex-col min-h-full" style={{ overflow: 'auto' }}>
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <EventPermissionTableHead
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
              const event_name = nameofevent(n.eventId);
              
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
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {n.email || ''}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {event_name || ''}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {n.cancreateFood ? <DoneIcon color='success'/> : <CloseIcon color='error'/> || ''}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {n.canreadAttendance ? <DoneIcon color='success'/> : <CloseIcon color='error'/> || ''}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {n.canreadEventRegistration ? <DoneIcon color='success'/> : <CloseIcon color='error'/> || ''}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {n.canreadFood ? <DoneIcon color='success'/> : <CloseIcon color='error'/> || ''}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {n.canreadReport ? <DoneIcon color='success'/> : <CloseIcon color='error'/> || ''}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {n.cansendSMS ? <DoneIcon color='success'/> : <CloseIcon color='error'/> || ''}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {n.canupdateAttendance ? <DoneIcon color='success'/> : <CloseIcon color='error'/> || ''}
                  </TableCell>

        
                  
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
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
                                  getStatus(n.id, value.status, n.email, n.eventId);
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

      {/* <TablePagination
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
      /> */}
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
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          ...style,
          '@media (max-width: 600px)': { // Apply media query for mobile devices
            width: '70%', // Set width to 100% for smaller screens
          },
          '@media (max-width: 280px)': { // Additional media query for smaller screens
            width: '93%', // Set width to 82% for screens up to 280px
          },
        }}>
          <EventLevelPermissionForm handleModalClose={handleEditClose} change={props.change} setChange={props.setChange} permissionId={permissionId} />
        </Box>
      </Modal>

    </div>
  );
}

export default withRouter(EventPermissionTable);