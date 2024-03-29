
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Modal, Table, TableBody, TableCell, TablePagination, TableRow, Typography, IconButton, Box, Button, MenuItem, Menu, Dialog, DialogTitle, DialogActions, Slide, Switch, FormControlLabel, Checkbox, TextField, Tooltip } from '@mui/material';
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
  const [loading, setLoading] = useState(true)
  const [pageData, setPageData] = useState('')
  //userList based on registrations
  const [usersList, setUsers] = useState([])
  const eventId = props.eventList?.find((event) => event.eventName === props.filterValue.eventName)?.eventId

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
      eventId: props.eventList?.find((event) => event.eventName === props.filterValue.eventName)?.eventId || '',
    };
    axios.get(`${eventAPIConfig.fetchRegisterUserByEvent}/${eventId}`, { params }, {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setPageData(response?.data)
        setUsers(response?.data?.users)
        setLoading(false)
      } else {
        setPageData('')
        setUsers([])
        setLoading(false)
        dispatch(showMessage({ message: "Please select an event", variant: 'error' }));
      }
    }).catch(()=>{
      setLoading(false)
      dispatch(showMessage({ message: "something went wrong", variant: 'error' }));

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

  if (_.isEmpty(usersList)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There is no data !
        </Typography>
      </motion.div>
    );
  }


  //CheckBox click
  const handleToggle = (userId, attendance) => {
    setLoading(true)
    const updatedUserData = usersList.map((item) => {
      if (item.user.id === userId) {
        return { ...item, present: !attendance };
      }
      return item;
    });
    setUsers(updatedUserData);


    const user = usersList.find((item) => item.user.id === userId);
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('eventId', eventId);
    formData.append('hallNo', user.hallNo);
    formData.append('present', !attendance);

    axios.post(eventAPIConfig.saveOneAttendance, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${window.localStorage.getItem('jwt_access_token')}`
      }
    })
      .then((response) => {
        if (response.status === 200) {
          fetchData()
          setLoading(false)
          dispatch(showMessage({ message: response.data.message, variant: 'success' }));
        } else {
          setLoading(false)
          dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
        }
      })
      .catch((error) => {
        setLoading(false)
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
      });
  };

  //Change in HallNo (textField)
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

  //Click on bell icon !!
  const handleAttendance = (userid, hallNo, present) => {
   
    const user = usersList.find(item => item.user.id === userid);

    if (user) {
      setLoading(true)
      const formattedData = new FormData();
      formattedData.append('id', userid);
      formattedData.append('eventId', eventId);
      formattedData.append('hallNo', hallNo);
      formattedData.append('present', present);

      axios.post(`${eventAPIConfig.sendRoomBookingStatus}`, formattedData, {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          fetchData()
          setLoading(false)
          dispatch(showMessage({ message: `Jai Guru. Your room/hall number for ${props?.filterValue?.eventName} is ${hallNo}. Please visit reception desk once you reach Ashram.`, variant: 'success' }));
        } else {
          setLoading(false)
          dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
        }
      }).catch((error) => {
        setLoading(false)
        dispatch(showMessage({ message: "Something went wrong", variant: 'error' }));
      });

    }
  };



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

              const isSelected = selected.indexOf(user.user.eventId) !== -1;

              return (
                <TableRow
                  className="h-72 cursor-pointer "
                  hover
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={user.user._id}
                  selected={isSelected}
                  style={{
                    cursor: 'default',
                    backgroundColor: user.specificRequirements ? '#ffeeba' : 'inherit',

                  }}
                >
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.familyId}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.name}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.gender}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.email === '' ? 'N/A' : user?.user?.email}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.dob}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {user?.user?.mobileNumber === '' ? 'N/A' : user?.user?.mobileNumber}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    <Tooltip arrow placement="top" title={user?.specificRequirements || 'N/A'}>
                      <span>
                        {user?.specificRequirements && user?.specificRequirements.length > 30
                          ? `${user?.specificRequirements.substring(0, 30)}...`
                          : user?.specificRequirements || 'N/A'}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="p-4 md:p-16" align="center">
                    <Checkbox checked={user.present} onChange={() => handleToggle(user?.user?.id, user.present)} />
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>

                    <TextField
                      defaultValue={user.hallNo}
                      variant="outlined"
                      fullWidth
                      onChange={(event) => handleHallNoChange(event, user?.user?.id)}
                    />
                  </TableCell>
                  <TableCell className="p-4 md:p-16" style={{ cursor: 'pointer' }}
                    component="th" scope="row" align='center' onClick={() => handleAttendance(user.user.id, user.hallNo, user.present)}>
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
        count={pageData.totalElement}
        rowsPerPage={pageData.rowPerPage}
        page={pageData.pageNumber - 1}
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