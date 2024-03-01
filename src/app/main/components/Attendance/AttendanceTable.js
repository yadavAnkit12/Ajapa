
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Modal, Table, TableBody, TableCell, TablePagination, TableRow, Typography, IconButton, Box, Button, MenuItem, Menu, Dialog, DialogTitle, DialogActions, Slide, Switch, FormControlLabel, Checkbox, TextField } from '@mui/material';
import axios from 'axios';
import { color, motion } from 'framer-motion';
import { useEffect, useState, useRef, forwardRef } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { eventAPIConfig } from '../../API/apiConfig';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import EventView from '../MyRegistration/EventView';
import AttendanceTableHead from './AttendanceTableHead';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { values } from 'lodash';


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



function AttendanceTable(props) {
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

  //Registered UserList
  const { usersList } = props
  
  const { setUsers } = props
    
  

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
    
    const params = {
      page: page + 1,
      rowsPerPage: rowsPerPage, // Example data to pass in req.query
      eventId: props.eventList?.find((event) => event.eventName === props.filterValue.eventName)?.eventId || '',
    };
    axios.get(eventAPIConfig.allEventRegistrationList, { params }, {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setEventListData(response?.data);
        setLoading(false);
      } else {
        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
      }
    });
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

  // function getStatus(id, selectedValue) {

  //   if (selectedValue === 'view') {
  //     setOpenView(true)
  //     setViewId(id)
  //   }
  //   else if (selectedValue === 'edit') {
  //     navigate(`/app/eventRegisteration/${id}`)
  //   }
  //   // else if (selectedValue === 'delete') {
  //   //   setDeleteId(id)
  //   //   setOpen(true)

  //   // }

  // }

  const handleClose = () => {
    setOpen(false)
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
          There are no Data!
        </Typography>
      </motion.div>
    );
  }

//   useEffect(() => {
//     // Initialize attendanceData based on props.usersList when component mounts
//     setUsers(
//         props.usersList.map((user) => ({
//             user,
//             present: false,
//             hallNo: '',
//         }))
//     );
// }, [props.usersList]);

  //CheckBox click
  const handleToggle = (userId) => {
    console.log('userId',userId)
    const updatedUserData = usersList.map((item) => {
        if (item.user.id === userId) {
            return { ...item, present: !item.present };
        }
        return item;
    });
    setUsers(updatedUserData);
};

  //Change in HallNo
  const handleHallNoChange = (event, userId) => {
    const { value } = event.target;
    const updatedUserData = usersList.map((item) => {
        if (item.user.id === userId) {
            return { ...item, hallNo: value };
        }
        return item;
    });
    setUsers(updatedUserData);
};


const handleSave = () => {
  const savedData = usersList.map((item) => ({
      name: item.user.name,
      email: item.user.email,
      mobileNumber: item.user.mobileNumber,
      dob: item.user.dob,
      attendance: item.present,
      accomodation: item.hallNo,
  }));

  console.log(savedData);
}


  return (
    <div className="w-full flex flex-col min-h-full" style={{ overflow: 'auto' }}>
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <AttendanceTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={props.usersList?.length}
          // onMenuItemClick={handleDeselect}
        />
        <TableBody>
          {
            usersList.map((user) => {
              console.log("vv",user)
              const isSelected = selected.indexOf(user.user.eventId) !== -1;
              // const labelId = `enhanced-table-checkbox-${user.user.userId}`;
              return (
                <TableRow
                  className="h-72 cursor-pointer"
                  hover
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={user.user._id}
                  selected={isSelected}
                  style={{ cursor: 'default' }}
                >
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.name}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.email === '' ? 'N/A' : user?.user?.email }
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.dob}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.mobileNumber === '' ? 'N/A' : user?.user?.mobileNumber }
                  </TableCell>
                  <TableCell className="p-4 md:p-16" align="center">
                    {/* <Checkbox
                       checked={user.present}
                       onChange={() => handleToggle(user.user.userId)}
                       inputProps={{ 'aria-labelledby': labelId }}
                      /> */}
                      <Checkbox checked={user.present} onChange={() => handleToggle(user?.user?.id)} />
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                  {/* <TextField
                      id={`${user.user._id}`}
                      defaultValue={user.hallNo}
                      // value={hallNo} 
                      variant="outlined"
                      fullWidth
                      onChange={(event) => event.target.value} 
                  /> */}
                    <TextField
                        defaultValue={user.hallNo}
                        variant="outlined"
                        fullWidth
                        onChange={(event) => handleHallNoChange(event, user?.user?.id)}
                    />
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    <NotificationsIcon />
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
        <Box sx={{
          ...style,
          '@media (max-width: 600px)': { // Apply media query for mobile devices
            width: '70%', // Set width to 100% for smaller screens
          },
          '@media (max-width: 280px)': { // Additional media query for smaller screens
            width: '93%', // Set width to 82% for screens up to 280px
          },
        }}>
          <EventView handleViewClose={handleViewClose} registrationId={viewid} />
        </Box>
      </Modal>

    </div>
  );
}

export default withRouter(AttendanceTable);