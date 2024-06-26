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
import { Link, useNavigate } from "react-router-dom";
import { eventAPIConfig } from '../../API/apiConfig';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import AllEventRegistrationTableHead from './AllEventRegistraionTableHead';
import EventView from '../MyRegistration/EventView';
import UserViewEventRegistration from './UserViewEventRegistration';

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
]


function AllEventRegistrationTable(props) {
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
  const [openView, setOpenView] = useState(false);
  const [viewid, setViewId] = useState("");
  const [change, setChange] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [open, setOpen] = useState(false) //clickableNames
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
      rowsPerPage: rowsPerPage,
      eventId: props.eventList?.find((event) => event.eventName === props.filterValue.eventName)?.eventId || '',
      userName: props.searchText,
      ...(props.filterValue.isAttendingShivir !== 'All' && ({ isAttendingShivir: _.get(props, 'filterValue.isAttendingShivir') })),
      ...(props.filterValue.arrivalDate !== '' && ({ arrivalDate: _.get(props, 'filterValue.arrivalDate') })),
      ...(props.filterValue.departureDate !== '' && ({ departureDate: _.get(props, 'filterValue.departureDate') })),
      ...(props.filterValue.country !== 'All' && ({ fromCountry: _.get(props, 'filterValue.country') })),
      ...(props.filterValue.state !== 'All' && ({ fromState: _.get(props, 'filterValue.state') })),
      ...(props.filterValue.city !== 'All' && ({ fromCity: _.get(props, 'filterValue.city') })),


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
        setEventListData([])
        setLoading(false)
        dispatch(showMessage({ message: "Please select an event", variant: 'error' }));
      }
    }).catch(() => {
      setLoading(false)
      dispatch(showMessage({ message: "Something went wrong", variant: 'error' }));

    })
  };


  const handleViewClose = () => {
    setOpenView(false);
  };

  //clickable Names
  const handleClose = () => {
    setOpen(false);
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
          There are no Registrations!
        </Typography>
      </motion.div>
    );
  }

  if (props.Role === 'Admin' && !props.eventPermission.canreadEventRegistration) {
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

  const handleNameClick = (userId) => {
    setModalUserId(userId);
    setOpen(true);
  };

  const ClickableName = (userId, userName) => (
    <Link

      onClick={(e) => {
        e.preventDefault();
        handleNameClick(userId);
      }}
      style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
    >
      {userName}
    </Link>
  );

  return (
    <div className="w-full flex flex-col min-h-full" style={{ overflow: 'auto' }}>
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <AllEventRegistrationTableHead
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
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.familyId}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {ClickableName(n.userId, n.userName)}
                  </TableCell>
                  {/* <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.eventName}
                  </TableCell> */}
                  {/* <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {formatDate(n.eventDate)}
                  </TableCell> */}
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.fromCountry.split(':')[1]}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.fromState.split(':')[1]}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.fromCity.split(':')[1]}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.attendingShivir ? 'Yes' : 'No'}
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
                                  getStatus(n.registrationId, value.status);
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

      <Modal
        open={open}
        onClose={handleClose}
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
          <UserViewEventRegistration handleClose={handleClose} modalUserId={modalUserId} />
        </Box>
      </Modal>

    </div>
  );
}

export default withRouter(AllEventRegistrationTable);