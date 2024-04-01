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
import { eventAPIConfig } from 'src/app/main/API/apiConfig';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import Report1TableHead from './Report1TableHead';
import { reportAPIConfig } from '../../../API/apiConfig';

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





function Report1Table(props) {
  // console.log(props)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [eventListData, setEventListData] = useState([]);
  const [reportData, setReportData] = useState([]);
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

    // if (searchText.length !== 0) {
    //   debouncedTriggerAPI();
    // }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);


  const fetchData = () => {
    
    if(props.filterValue.eventName ==='' ||props.filterValue.eventName === null)
    {
      dispatch(showMessage({ message: "Please select an event", variant: 'error' }));
      return
    }

    if(props.filterValue.selectDate === '' || props.filterValue.selectDate === null)
    {
      dispatch(showMessage({ message: "Please select the Arrival/Departure mode", variant: 'error' }));
      return
    }  

    const eventId = props.eventList?.find((event) => event.eventName === props.filterValue.eventName)?.eventId || '';



    if(props.filterValue.selectDate !=='' && props.filterValue.selectDate === 'Arrival' )
    {
      if( props.filterValue.attendingShivir === '' || props.filterValue.attendingShivir === 'All')
      {

        axios.get(`${reportAPIConfig.report1arrival}/${eventId}` ,{
          headers: {
            'Content-type': 'multipart/form-data',
            Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            console.log("report", response)
            setReportData(response?.data);
            setLoading(false);
          } else {
            dispatch(showMessage({ message: "Please select an event", variant: 'error' }));
            setReportData([]);
            setLoading(false);
          }
        });
      }

      else if(props.filterValue.attendingShivir === 'No' || props.filterValue.attendingShivir === 'Yes')
      {
        const attendingShivir =  props.filterValue.attendingShivir === "Yes" ? true : false; 
        axios.get(`${reportAPIConfig.report1arrival}/${eventId}/${attendingShivir}` ,{
          headers: {
            'Content-type': 'multipart/form-data',
            Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            console.log("report", response)
            setReportData(response?.data);
            setLoading(false);
          } else {
            dispatch(showMessage({ message: "Please select an event", variant: 'error' }));
            setReportData([]);
            setLoading(false);
          }
        });

      }
  }

 else if(props.filterValue.selectDate !=='' && props.filterValue.selectDate === 'Departure' )
    {
      if( props.filterValue.attendingShivir === '' || props.filterValue.attendingShivir === 'All')
      {
        console.log("case 1")
        axios.get(`${reportAPIConfig.report1departure}/${eventId}` ,{
          headers: {
            'Content-type': 'multipart/form-data',
            Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            console.log("report", response)
            setReportData(response?.data);
            setLoading(false);
          } else {
            dispatch(showMessage({ message: "Please select an event", variant: 'error' }));
            setReportData([]);
            setLoading(false);
          }
        });
      }

      else if(props.filterValue.attendingShivir === 'No' || props.filterValue.attendingShivir === 'Yes')
      {
        console.log("case 2")
        const attendingShivir =  props.filterValue.attendingShivir === "Yes" ? true : false; 
        axios.get(`${reportAPIConfig.report1departure}/${eventId}/${attendingShivir}` ,{
          headers: {
            'Content-type': 'multipart/form-data',
            Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            console.log("report", response)
            setReportData(response?.data);
            setLoading(false);
          } else {
            dispatch(showMessage({ message: "Please select an event", variant: 'error' }));
            setReportData([]);
            setLoading(false);
          }
        });

      }
  }

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
    // else if (selectedValue === 'delete') {
    //   setDeleteId(id)
    //   setOpen(true)

    // }

  }

  const handleClose = () => {
    setOpen(false)
  }


  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(_.size(_.get(reportData, 'data')) > 0 ?
        _.get(reportData, 'data').map((n) => n.eventId) :
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

  if (!_.size(_.get(reportData, 'data'))) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There is no Data.
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full" style={{ overflow: 'auto' }}>
      <Table stickyHeader className="min-w-xl"  aria-labelledby="tableTitle" ref={tableRef}>
        <Report1TableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={reportData?.length}
          onMenuItemClick={handleDeselect}
        />
        <TableBody>
          {
            reportData?.data?.map((n) => {
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
                    {n.date}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.familyCount}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.maleCount}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.femaleCount}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.kidsCount}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.seniorCount}
                  </TableCell>
                  {/* <TableCell className="p-4 md:p-16" component="th" scope="row" align='center'>
                    {n.shivirAvailable ? 'Yes' : 'No'}
                  </TableCell> */}
              
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
          {/* <EventView handleViewClose={handleViewClose} registrationId={viewid} /> */}
        </Box>
      </Modal>

    </div>
  );
}

export default withRouter(Report1Table);