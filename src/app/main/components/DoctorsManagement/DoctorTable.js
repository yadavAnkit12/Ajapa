import withRouter from '@fuse/core/withRouter';
import _ from '@lodash';
import { Button, Modal, Box, Table, TableBody, TableCell, TablePagination, TableRow, Typography, Dialog, DialogActions, DialogTitle, Slide, Menu, MenuItem } from '@mui/material';
import * as React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { doctorAPIConfig } from '../../API/apiConfig';
import { selectDoctorsSearchText } from '../../../store/reduxSlice/doctorsSlice';
import DoctorPublishedForm from './DoctorPublishedForm';
import DoctorTableHead from './DoctorTableHead';
import FuseLoading from '@fuse/core/FuseLoading';

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
  overflow: 'auto'
};

const statusDisplayMessage = {
  'Blocked': 'block',
  'Approved': 'approve',
  'Rejected': 'reject'
}

function EmployeesTable(props) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchText = useSelector(selectDoctorsSearchText);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [blockOpen, setBlockOpen] = useState(false)
  const [blockStatus, setBlockStatus] = useState('')
  const tableRef = useRef(null);
  const [editOpen, setEditOpen] = useState(false);
  const [docId, setDocId] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState({ id: '', value: '' });
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);
  const menuItemArray = (isBlocked) => {
    // Define the menu items based on the isBlocked field
    if (isBlocked) {
      return [
        {
          key: 5,
          label: 'View',
          status: 'View',
        },
        {
          key: 6,
          label: 'Edit',
          status: 'Edit',
        },
        {
          key: 7,
          label: 'Delete',
          status: 'Delete',
        },
        {
          key: 8,
          label: 'Unblock', // Show "Unblock" when isBlocked is true
          status: 'Unblock', // You can define the status value here
        },
      ];
    } else {
      return [
        {
          key: 5,
          label: 'View',
          status: 'View',
        },
        {
          key: 6,
          label: 'Edit',
          status: 'Edit',
        },
        {
          key: 7,
          label: 'Delete',
          status: 'Delete',
        },
        {
          key: 8,
          label: 'Block', // Show "Block" when isBlocked is false
          status: 'Block', // You can define the status value here
        },
      ];
    }
  };

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

  const fetchData = () => {
    const params = {
      page: page + 1,
      rowsPerPage: rowsPerPage, // Example data to pass in req.query
      search: searchText,
      fromDate: _.get(props, 'filterValue.fromDate'),
      toDate: _.get(props, 'filterValue.toDate'),
      specialization: _.get(props, 'filterValue.specialization.specialization'),
      doctorType: _.get(props, 'filterValue.doctorType.id'),
      category: _.get(props, 'filterValue.category.id'),
      status: (_.get(props, 'filterValue.status.id') === 'all' || !_.get(props, 'filterValue.status.id')) ? '' : _.get(props, 'filterValue.status.id'),
    };
    setLoading(true)
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

  const handleClickOpen = (empId) => {
    setOpen(true);
    setDeleteId(empId)
  };

  const handleClickPublishedOpen = (empId) => {
    setEditOpen(true);
    setDocId(empId);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
  };


  function deleteEmployee() {
    axios.delete(`${doctorAPIConfig.deleteDoctorById}/${deleteId}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setOpen(false);
        setChange(!change);
        dispatch(showMessage({ message: "Doctor Deleted successfully", variant: 'error' }))
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
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

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(_.size(_.get(data, 'doctorList')) > 0 ?
        _.get(data, 'doctorList').map((n) => n._id) :
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
    setPage(value)
    tableRef.current && tableRef.current.scrollIntoView();

  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    tableRef.current && tableRef.current.scrollIntoView();

  }

  function getStatus(id, selectedValue) {
    if (selectedValue == "Edit") {
      navigate(`/app/manage/doctor/${id}`);
    } else if (selectedValue == "Delete") {
      handleClickOpen(id)
    } else if (selectedValue == "View") {
      navigate(`/app/manage/doctor/view/${id}`);

    } else if (selectedValue == "Published") {
      handleClickPublishedOpen(id)
    }
    else if (selectedValue === "Block" || selectedValue === "Unblock") {
      setBlockStatus(selectedValue)
      handleBlockUser(id);
    }
    else {
      setStatusOpen(true);
      setStatusValue({ id: id, value: selectedValue });
    }

  }

  const handleBlockUser = (empId) => {
    setBlockOpen(true);
    setDeleteId(empId)
  };

  const handleBlockUserClose = () => {
    setBlockOpen(false)
  }

  const BlockUser = () => {
    axios.put(`${doctorAPIConfig.block}/${deleteId}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setBlockOpen(false);
        dispatch(showMessage({ message: response.data.message }));
        fetchData()

      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }

  const changeStatus = () => {
    axios.put(`${doctorAPIConfig.changeStatus}/${statusValue.id}/${statusValue.value}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setChange(!change);
        dispatch(showMessage({ message: "Status change successfully", variant: 'success' }));
        setStatusOpen(false);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
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

  if (!_.size(_.get(data, 'doctorList'))) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no doctors!
        </Typography>
      </motion.div>
    );
  }


  

  return (

    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <DoctorTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data?.doctorList?.length}
          onMenuItemClick={handleDeselect}
          permission={props.permission}
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

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.mobile}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.specialization}
                  </TableCell>
                  {/* 
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.doctorType}
                  </TableCell> */}

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.createdAt && n.createdAt.split('T')[0]}
                  </TableCell>

                  {/* 
                  <TableCell className="p-4 md:p-16" style={{ width: '1' }} component="th" scope="row" align="center">
                    {n.category}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" style={{ width: '1' }} component="th" scope="row" align="center">
                    {n.fee}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" style={{ width: '1' }} component="th" scope="row" align="center">
                    {n.publishedFee}
                  </TableCell> */}

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">

                    {/* { */}
                      {/* // <span style={{ color: (n.status == 'Approved') ? 'green' : (n.status == 'Rejected') ? 'red' : (n.status === 'Pending') ? '#FF9800' : '', fontWeight: 'bold' }}> */}
                        {n.status || 'NA'}
                      {/* </span>
                    } */}
                  </TableCell>

                  {(_.get(props, 'permission.delete_data') || _.get(props, 'permission.update_data') || _.get(props, 'permission.read_data')) && <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                            Action
                          </Button>
                          <Menu {...bindMenu(popupState)}>
                            {menuItemArray(n.isBlocked).map((value) => (
                              <MenuItem
                                onClick={() => {
                                  getStatus(n._id, value.status);
                                  popupState.close();
                                }}
                                key={value.key}
                              >
                                {value.label}
                              </MenuItem>
                            )
                            )}
                          </Menu>
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

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Do you want to delete this doctor?"}</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={deleteEmployee} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={blockOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleBlockUserClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Do you want to ${blockStatus} this employee?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleBlockUserClose}>No</Button>
          <Button onClick={BlockUser} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={statusOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setStatusOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Do you want to ${statusDisplayMessage[statusValue.value]} this doctor?`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>No</Button>
          <Button onClick={changeStatus} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={editOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
          <DoctorPublishedForm docId={docId} setDocId={setDocId} setEditOpen={setEditOpen} setChange={setChange} change={change} />
        </Box>

      </Modal>

    </div>
  );
}

export default withRouter(EmployeesTable);