import withRouter from '@fuse/core/withRouter';
import _ from '@lodash';
import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, Button, Dialog, DialogActions, DialogTitle, Slide, Menu, MenuItem } from '@mui/material';
import * as React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { clinicAPIConfig, partnerAPIConfig } from 'src/app/main/API/apiConfig';
import { showMessage } from 'app/store/fuse/messageSlice';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { selectPartnersSearchText } from '../../../store/reduxSlice/partnersSlice';
import PartnerTableHead from './ClinicTableHead';
import FuseLoading from '@fuse/core/FuseLoading';
import ClinicTableHead from './ClinicTableHead';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const statusDisplayMessage = {
  'Blocked': 'block',
  'Approved': 'approve',
  'Rejected': 'reject',
  'Published': 'publish'
}

function ClinicTable(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchText = useSelector(selectPartnersSearchText);

  const [selected, setSelected] = useState([]);
  const tableRef = useRef(null)
  const [data, setData] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState({ id: '', value: '' });
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blockOpen,setBlockOpen]=useState(false)
  const [blockStatus,setBlockStatus]=useState('')



  // const menuItemArray = [{
  //   key: 1,
  //   label: 'Approve',
  //   status: 'Approved',
  //   visibleIf: ['pending', 'rejected'],
  //   loadIf: props?.permission?.update_data
  // },
  // {
  //   key: 2,
  //   label: 'Reject',
  //   status: 'Rejected',
  //   visibleIf: ['pending'],
  //   loadIf: props?.permission?.update_data
  // },
  // {
  //   key: 3,
  //   label: 'Publish',
  //   status: 'Published',
  //   visibleIf: ['approved', 'rejected', 'blocked'],
  //   loadIf: props?.permission?.update_data
  // },
  // {
  //   key: 4,
  //   label: 'Block',
  //   status: 'Blocked',
  //   visibleIf: ['approved', 'published'],
  //   loadIf: props?.permission?.update_data
  // },
  // {
  //   key: 5,
  //   label: 'View',
  //   status: 'View',
  //   visibleIf: ['approved', 'rejected', 'pending', 'blocked', 'published'],
  //   loadIf: props?.permission?.read_data
  // },
  // {
  //   key: 6,
  //   label: 'Edit',
  //   status: 'Edit',
  //   visibleIf: ['approved', 'rejected', 'pending', 'blocked', 'published'],
  //   loadIf: props?.permission?.update_data
  // },
  // {
  //   key: 7,
  //   label: 'Delete',
  //   status: 'Delete',
  //   visibleIf: ['approved', 'rejected', 'pending', 'blocked', 'published'],
  //   loadIf: props?.permission?.delete_data
  // }]

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
      status: (_.get(props, 'filterValue.status.id') === 'all' || !_.get(props, 'filterValue.status.id')) ? '' : _.get(props, 'filterValue.status.id'),
      fromDate: _.get(props, 'filterValue.fromDate'),
      toDate: _.get(props, 'filterValue.toDate')
    };

    axios.get(clinicAPIConfig.list, { params }, {
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

  const handleClose = () => {
    setOpen(false);
  };


  function deleteEmployee() {
    axios.delete(`${clinicAPIConfig.delete}/${deleteId}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setOpen(false);
        setChange(!change);
        dispatch(showMessage({ message: "Clinic deleted successfully" }))
        navigate(`/app/clinic/`);

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
      setSelected(_.size(_.get(data, 'PartnerList')) > 0 ?
        _.get(data, 'PartnerList').map((n) => n._id) :
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

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    tableRef.current && tableRef.current.scrollIntoView();

  }

  function getStatus(id, selectedValue) {
    if (selectedValue == "Edit") {
      navigate(`/app/manage/partner/${id}`);

    } else if (selectedValue == "Delete") {
      handleClickOpen(id)

    } else if (selectedValue == "View") {

      navigate(`/app/manage/partner/view/${id}`);

    } 
    else if (selectedValue === "Block" || selectedValue === "Unblock") {
      setBlockStatus(selectedValue)
      handleBlockUser(id);
    } else {
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
    axios.put(`${clinicAPIConfig.block}/${deleteId}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setBlockOpen(false);
        // props.setChange(!props.change);
        dispatch(showMessage({ message: response.data.message}));
        fetchData()

      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }

  // const changeStatus = () => {
  //   axios.put(`${partnerAPIConfig.changeStatus}/${statusValue.id}/${statusValue.value}`, {
  //     headers: {
  //       'Content-type': 'multipart/form-data',
  //       authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
  //     },
  //   }).then((response) => {
  //     if (response.status === 200) {
  //       setChange(!change);
  //       dispatch(showMessage({ message: "Status change successfully", variant: 'success' }));
  //       setStatusOpen(false);
  //     } else {
  //       dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
  //     }
  //   })
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }
  
  if (!_.size(_.get(data, 'PartnerList'))) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no Clinic!
        </Typography>
      </motion.div>
    );
  }

 

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <ClinicTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data?.PartnerList?.length}
          onMenuItemClick={handleDeselect}
          permission={props.permission}
        />

        <TableBody>
          {_.orderBy(data?.PartnerList, [(o) => {
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
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.name}
                  </TableCell>

                  <TableCell className="p-4 md:p-12" component="th" scope="row">
                    {n.email}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.mobile}
                  </TableCell>

                  <TableCell className="p-4 md:p-16 truncate" style={{ color: "Blue" }} component="th" scope="row">
                    {n.licenseNo}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.gstNo}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {/* {
                      <span style={{ color: (n.status == 'Approved') ? 'green' : (n.status == 'Rejected') ? 'red' : (n.status === 'Pending') ? '#FF9800' : '', fontWeight: 'bold' }}> */}
                        {n.status || 'NA'}
                      {/* </span>

                    } */}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
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
                  </TableCell>
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
        <DialogTitle>{"Do you want to delete this partner?"}</DialogTitle>
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
      {/* <Dialog
        open={statusOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setStatusOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Do you want to ${statusDisplayMessage[statusValue.value]} this clinic ?`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>No</Button>
          <Button onClick={changeStatus} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}

    </div>
  );
}

export default withRouter(ClinicTable);

