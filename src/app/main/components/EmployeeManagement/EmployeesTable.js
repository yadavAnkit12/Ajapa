import withRouter from '@fuse/core/withRouter';

import _ from '@lodash';

import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, Button, Modal, Box, Dialog, DialogActions, DialogTitle, Slide, Menu, MenuItem } from '@mui/material';

import axios from 'axios';

import { motion } from 'framer-motion';

import React, { useEffect, useState, forwardRef, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { showMessage } from "app/store/fuse/messageSlice";

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { useNavigate } from "react-router-dom";

import { employeeAPIConfig } from '../../API/apiConfig';
import { selectEmployees, selectEmployeesSearchText } from '../../../store/reduxSlice/employeesSlice';

import EmployeesTableHead from './EmployeesTableHead';
import RegisterForm from './RegisterForm';
import FuseLoading from '@fuse/core/FuseLoading';

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
  width: '450px',
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const statusDisplayMessage = {
  'InActive': 'in-activate',
  'Active': 'activate',
  'Approved': 'approve',
  'Rejected': 'reject'
}

function EmployeesTable(props) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const products = useSelector(selectEmployees);
  const searchText = useSelector(selectEmployeesSearchText);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("")
  const [blockOpen,setBlockOpen]=useState(false)
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState({ id: '', value: '' });
  const [loading,setLoading]=useState(true)
  const [blockStatus,setBlockStatus]=useState('')
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
    if (searchText.length !== 0) {
      setData(
        _.filter(products, (item) => {

          return (item.name != "" && item.name != undefined) ? item.name.toLowerCase().includes(searchText.toLowerCase()) : []

        })
      );
      setPage(0);
    } else {
      setData(products);
    }
  }, [products, searchText]);

  useEffect(()=>{
    axios.get(employeeAPIConfig.list, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    })
    .then((response)=>{
      setLoading(false)
        setData(response.data.data)
    })
  },[])

  useEffect(() => {
    let tempData = { ...products };
    if (_.get(props, 'filterValue.fromDate')) {
      let fromDate = new Date(props.filterValue.fromDate).getTime();
      tempData = _.filter(tempData, (item) => new Date(item.createdAt).getTime() >= fromDate);
    }
    if (_.get(props, 'filterValue.toDate')) {
      let fromDate = new Date(props.filterValue.toDate).getTime();
      tempData = _.filter(tempData, (item) => new Date(item.createdAt).getTime() <= fromDate);
    }
    if (_.get(props, 'filterValue.role._id') && _.get(props, 'filterValue.role._id') !== 'all') {
      tempData = _.filter(tempData, (item) => item.roleID._id === props.filterValue.role._id);
    }
    if (_.get(props, 'filterValue.status.id') && _.get(props, 'filterValue.status.id') !== 'all') {
      tempData = _.filter(tempData, (item) => item.status === props.filterValue.status.id);
    }
    setData(tempData);
    setPage(0);
  }, [props.filterValue]);

  const handleClickOpen = (empId) => {
    setOpen(true);
    setDeleteId(empId)
  };

  const handleEditOpen = (empId) => {
    setEditId(empId)
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const deleteEmployee = () => {
    axios.delete(`${employeeAPIConfig.delete}/${deleteId}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        dispatch(showMessage({ message: response.data.message, variant: 'error' }));
        setOpen(false);
        props.setChange(!props.change);
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
    tableRef.current && tableRef.current.scrollIntoView();
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    tableRef.current && tableRef.current.scrollIntoView();
  }

  function getStatus(id, selectedValue) {
    if (selectedValue == "Delete") {
      handleClickOpen(id);
    } else if (selectedValue == "View") {
      navigate(`/app/manage/user/view/${id}`);
    } else if (selectedValue === "Edit") {
      handleEditOpen(id);
    } else if (selectedValue === "Block" || selectedValue === "Unblock") {
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

  const handleBlockUserClose=()=>{
    setBlockOpen(false)
  }

  const BlockUser=()=>{
    axios.put(`${employeeAPIConfig.block}/${deleteId}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setBlockOpen(false);
        props.setChange(!props.change);
        dispatch(showMessage({ message: response.data.message}));

      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }

  const changeStatus = () => {
    axios.put(`${employeeAPIConfig.changeStatus}/${statusValue.id}/${statusValue.value}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        props.setChange(!props.change);
        dispatch(showMessage({ message: "Status change successfully", variant: 'success' }));
        setStatusOpen(false);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    });
  }

  if(loading){
    return <FuseLoading/>
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no employees!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <EmployeesTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
          onMenuItemClick={handleDeselect}
          permission={props.permission}
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
                    {n.name}
                  </TableCell>

                  <TableCell className="p-4 md:p-16 truncate" style={{ color: "Blue" }} component="th" scope="row">
                    {n.email}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.mobile}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n?.roleID?.role}
                  </TableCell>


                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {/* <span style={{ color: (n.status == 'Approved') ? 'green' : (n.status == 'Rejected') ? 'red' : (n.status === 'Pending') ? '#FF9800' : '', fontWeight: 'bold' }}> */}
                      {n.status || 'NA'}
                    {/* </span> */}
                  </TableCell>


                  {(_.get(props, 'permission.delete_data') || _.get(props, 'permission.update_data') || _.get(props, 'permission.read_data')) && <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">

                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <>
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
                        </>
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
        count={data.length || 0}
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

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Do you want to delete this employee?"}</DialogTitle>
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
        <DialogTitle>{`Do you want to ${statusDisplayMessage[statusValue.value]} this employee?`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>No</Button>
          <Button onClick={changeStatus} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {openEdit && <RegisterForm roleList={props.roleList} employeeId={editId} closeHandler={setOpenEdit} setChange={props.setChange} change={props.change} />}
        </Box>
      </Modal>
    </div>
  );
}

export default withRouter(EmployeesTable);



