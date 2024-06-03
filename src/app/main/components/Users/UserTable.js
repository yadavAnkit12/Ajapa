import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {
  Modal, Table, TableBody, TableCell, TablePagination, TableRow, Typography, IconButton, Box,
  Button, MenuItem, Menu, Dialog, DialogTitle, DialogActions, Slide
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef, forwardRef } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { eventAPIConfig, userAPIConfig } from '../../API/apiConfig';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import UserTableHead from './UserTableHead';
import UserView from './UserView';

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



function UserTable(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userListData, setUserListData] = useState([]);
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
  const [openView, setOpenView] = useState(false);
  const [viewid, setViewId] = useState("");
  const [open, setOpen] = useState(false)
  const [changeStatus, setChangeStatus] = useState('')

  const menuItemArray = (status) => {
    if (status === 'Approved') {
      return [
        {
          key: 1,
          label: 'View',
          status: 'View',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.readUser : true
        },
        {
          key: 2,
          label: 'Edit',
          status: 'Edit',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.updateUser : true
        },
        {
          key: 3,
          label: 'Reject',
          status: 'Rejected',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.statusUser : true
        },
      ];
    } else if (status === 'Rejected') {
      return [
        {
          key: 4,
          label: 'View',
          status: 'View',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.readUser : true
        },
        {
          key: 5,
          label: 'Edit',
          status: 'Edit',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.updateUser : true
        },
        {
          key: 6,
          label: 'Approve',
          status: 'Approved',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.statusUser : true
        }
      ];
    }
    else {
      return [
        {
          key: 7,
          label: 'View',
          status: 'View',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.readUser : true

        },
        {
          key: 8,
          label: 'Edit',
          status: 'Edit',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.updateUser : true
        },
        {
          key: 9,
          label: 'Approve',
          status: 'Approved',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.statusUser : true
        },
        {
          key: 10,
          label: 'Reject',
          status: 'Rejected',
          visibleIf: props.Role === 'Admin' ? props.rootPermission.statusUser : true
        },

      ];
    }
  };


  useEffect(() => {
    if (props.filterValue !== '') {
      fetchData();
    }
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
      rowsPerPage: rowsPerPage,
      searchText: searchText,
      ...(props.filterValue.status !== 'All' && ({ status: _.get(props, 'filterValue.status') })),
      ...(props.filterValue.country !== 'All' && props.filterValue.country !== null && ({ country: _.get(props, 'filterValue.country') })),
      ...(props.filterValue.state !== 'All' && props.filterValue.state !== null && ({ state: _.get(props, 'filterValue.state') })),
      ...(props.filterValue.city !== 'All' && props.filterValue.city !== null && ({ city: _.get(props, 'filterValue.city') })),
      ...(props.filterValue.isHead !== 'All' && ({ role: 'User' })),
      ...(props.filterValue.isDisciple !== 'All' && ({ isDisciple: _.get(props, 'filterValue.isDisciple') === 'Disciple' ? 'Yes' : 'No' })),
    };
    axios.get(userAPIConfig.list, { params }, {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setUserListData(response?.data);
        setLoading(false);
      } else {
        setLoading(false)
        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
      }
    }).catch((error) => {
      setLoading(false)
      dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
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
    if (selectedValue === 'View') {
      setOpenView(true)
      setViewId(id)

    }
    else if (selectedValue === 'Edit') {
      navigate(`/app/useredit/${id}`)
    }

    else if (selectedValue === 'Approved') {
      setChangeStatus('Approve')
      setViewId(id)
      setOpen(true)

    }
    else if (selectedValue === 'Pending') {
      setChangeStatus('Pending')
      setViewId(id)
      setOpen(true)

    }
    else if (selectedValue === 'Rejected') {
      setChangeStatus('Reject')
      setViewId(id)
      setOpen(true)

    }

  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChangeStatus = () => {
    const formData = new FormData()
    if (changeStatus === 'Approve') {

      formData.append('status', 'Approved')
    }
    else if (changeStatus === 'Reject') {
      formData.append('status', 'Rejected')
    }
    else {
      formData.append('status', 'Pending')
    }
    formData.append('id', viewid)
    axios.post(userAPIConfig.changeStatus, formData, {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`
      },
    }).then((response) => {
      if (response.status === 200) {
        dispatch(showMessage({ message: response.data.message, variant: 'success' }));
        handleClose()
        fetchData()

      }
      else {
        dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));

      }
    }).catch((error) => {
      setLoading(false)
      dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
    })
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(_.size(_.get(userListData, 'data')) > 0 ?
        _.get(userListData, 'data').map((n) => n.userId) :
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
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'pending':
        return '#FFC72C';
      case 'rejected':
        return 'red';
      default:
        return 'inherit'; // or any other default color
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (!_.size(_.get(userListData, 'data'))) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no User!
        </Typography>
      </motion.div>
    );
  }
  if (props.Role === 'Admin' && !props.rootPermission.readUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
        No data to show 
        </Typography> 
      </motion.div>
    );
  }

  // function to convert date from yyyy-mm-dd format to dd-mm-yyyy
  function formatDate(inputDate) {
    const parts = inputDate.split('-');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    return formattedDate;
  }

  return (
    <div className="w-full flex flex-col min-h-full" style={{ overflow: 'auto' }}>
      <Table className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <UserTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={userListData?.data?.length}
          onMenuItemClick={handleDeselect}
          rootPermission={props.rootPermission}
        />
        <TableBody>
          {
            userListData?.data?.map((n) => {
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
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.familyId}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.name}
                    {n.role === 'User' ? <span style={{ color: 'red', fontSize: '1.8rem' }}>*</span> : ""}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.email === '' ? 'N/A' : n.email}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" >
                    {n.mobileNumber === '' ? 'N/A' : n.mobileNumber}

                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.country.split(':')[1]}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.state.split(':')[1]}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.city.split(':')[1]}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {formatDate(n.dob)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <>
                          <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                            Action
                          </Button>
                          <Menu {...bindMenu(popupState)}>

                            {menuItemArray(n.status).map((value) => (
                              value.visibleIf && (
                                <MenuItem
                                  onClick={() => {
                                    getStatus(n.id, value.status);
                                    popupState.close();
                                  }}
                                  key={value.key}
                                >
                                  {value.label}
                                </MenuItem>
                              )
                            ))}

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
        count={userListData.totalElement}
        rowsPerPage={userListData.rowPerPage}
        page={userListData.pageNumber - 1}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Do you want to ${changeStatus} this User?`}</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleChangeStatus} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={openView}
        onClose={handleViewClose}
        aria-labelledby="modal-modaltitle-"
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
          <UserView data={viewid} handleViewClose={handleViewClose} />
        </Box>
      </Modal>





    </div>
  );
}

export default withRouter(UserTable);