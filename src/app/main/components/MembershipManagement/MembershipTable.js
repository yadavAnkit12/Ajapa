import withRouter from '@fuse/core/withRouter';

import _ from '@lodash';

import { Dialog, DialogActions, DialogTitle, Table, TableBody, TableCell, TablePagination, TableRow, Typography, Button, IconButton, Modal, Box, Slide, Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import * as React from 'react';

import axios from 'axios';

import { motion } from 'framer-motion';

import { useEffect, useState, forwardRef,useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { showMessage } from "app/store/fuse/messageSlice";

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { membershipAPIConfig } from '../../API/apiConfig';
import { selectMembershipPlans, selectMembershipPlanSearchText } from '../../../store/reduxSlice/membershipSlice';

import MembershipRegisterForm from './MembershipRegisterForm';
import MembershipTableHead from './MembershipTableHead';

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
  true: 'activate',
  false: 'in-activate'
}

const menuItemArray = [{
  key: 1,
  label: 'InActive',
  status: false,
  visibleIf: [true]
},
{
  key: 2,
  label: 'Active',
  status: true,
  visibleIf: [false]
}];

function MembershipTable(props) {

  const dispatch = useDispatch();

  const membershipPlans = useSelector(selectMembershipPlans);
  const searchText = useSelector(selectMembershipPlanSearchText);

  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(membershipPlans);
  const tableRef=useRef(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState({ id: '', value: '' });

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(

        _.filter(membershipPlans, (item) => {

          return (item.planName != "" && item.planName != undefined) ? item.planName.toLowerCase().includes(searchText.toLowerCase()) : []

        })
      );
      setPage(0);
    } else {
      setData(membershipPlans);
    }
  }, [membershipPlans, searchText]);

  useEffect(() => {
    if (props.filterValue) {
      let tempData = { ...membershipPlans };
      if (_.get(props, 'filterValue.status.id') !== 'all') {
        tempData = _.filter(tempData, (item) => item.isActive === props.filterValue.status.id);
      }
      setData(tempData);
      setPage(0);
    } else {
      setData(membershipPlans);
    }
  }, [props.filterValue]);

  const handleEditOpen = (empId) => {
    setEditId(empId)
    setOpenEdit(true);
  };

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
    setStatusOpen(true);
    setStatusValue({ id: id, value: selectedValue });
  }

  const changeStatus = () => {
    axios.put(`${membershipAPIConfig.changeStatus}/${statusValue.id}/${statusValue.value}`, {
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
    })
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no membership plans!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <MembershipTableHead
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

                  <TableCell className="p-4 md:p-12" component="th" scope="row">
                    {n.planName}
                  </TableCell>

                  <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                    {n.priceWithGst}
                  </TableCell>

                  <TableCell className="p-4 md:p-12" component="th" scope="row" style={{ textAlign: 'left', paddingLeft: '20px' }}>
                    {n.appointmentSlot}
                  </TableCell>

                  <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                    {n.offPercentMedicine + "%"}
                  </TableCell>

                  <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                    {n.offPercentTest + "%"}
                  </TableCell>


                  <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                    {n.expiryMonth}
                  </TableCell>


                  <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                    {n.isActive === true ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                    ) : (<span style={{ color: 'red', fontWeight: 'bold' }}>Inactive</span>)}

                  </TableCell>


                  {_.get(props, 'permission.update_data') && <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                    <IconButton aria-label="delete" color="success" onClick={() => { handleEditOpen(n.id) }}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>}

                  {_.get(props, 'permission.update_data') && <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">

                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                            Action
                          </Button>

                          <Menu {...bindMenu(popupState)}>
                            {menuItemArray.map((value) => (
                              value.visibleIf.indexOf(n.isActive) !== -1 && <MenuItem
                                onClick={() => {
                                  getStatus(n.id, value.status);
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
        count={data.length}
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
        open={statusOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setStatusOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Do you want to ${statusDisplayMessage[statusValue.value]} this membership plan?`}</DialogTitle>
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
          {openEdit && <MembershipRegisterForm membershipPlanId={editId} setOpen={setOpenEdit} open={openEdit} setChange={props.setChange} change={props.change} />}
        </Box>
      </Modal>
    </div>
  );
}

export default withRouter(MembershipTable);