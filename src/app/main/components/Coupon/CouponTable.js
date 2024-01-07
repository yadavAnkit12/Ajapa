import withRouter from '@fuse/core/withRouter';

import _ from '@lodash';

import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, Button, Box, Modal, Slide, Menu, MenuItem, Dialog, DialogActions, DialogTitle } from '@mui/material';

import * as React from 'react';

import axios from 'axios';

import { motion } from 'framer-motion';

import { useEffect, useState, forwardRef,useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { showMessage } from "app/store/fuse/messageSlice";

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { couponAPIConfig } from '../../API/apiConfig';
import { selectCoupons, selectCouponSearchText } from '../../../store/reduxSlice/couponSlice';

import CouponRegisterForm from './CouponRegisterForm';
import CouponTableHead from './CouponTableHead';

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

function CouponTable(props) {

    const dispatch = useDispatch();

    const coupons = useSelector(selectCoupons);
    const searchText = useSelector(selectCouponSearchText);

    const [selected, setSelected] = useState([]);
    const [data, setData] = useState(coupons);
    const [page, setPage] = useState(0);
    const tableRef=useRef(null)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null,
    });

    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [statusOpen, setStatusOpen] = useState(false);
    const [statusValue, setStatusValue] = useState({ id: '', value: '' });
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("")

    const statusDisplayMessage = {
        'Inactive': 'in-activate',
        'Active': 'activate',
        'Approved': 'approve',
        'Rejected': 'reject'
    }

    const menuItemArray = [{
        key: 1,
        label: 'Approve',
        status: 'Approved',
        visibleIf: ['pending', 'rejected'],
        loadIf: props?.permission?.update_data
    },
    {
        key: 2,
        label: 'Reject',
        status: 'Rejected',
        visibleIf: ['pending'],
        loadIf: props?.permission?.update_data
    },
    {
        key: 3,
        label: 'Active',
        status: 'Active',
        visibleIf: ['inactive'],
        loadIf: props?.permission?.update_data
    },
    {
        key: 4,
        label: 'InActive',
        status: 'Inactive',
        visibleIf: ['approved', 'active'],
        loadIf: props?.permission?.update_data
    },

    {
        key: 5,
        label: 'Edit',
        status: 'Edit',
        visibleIf: ['approved', 'active', 'pending', 'inactive', 'rejected'],
        loadIf: props?.permission?.update_data
    },


    {
        key: 6,
        label: 'Delete',
        status: 'Delete',
        visibleIf: ['approved', 'active', 'pending', 'inactive', 'rejected'],
        loadIf: props?.permission?.update_data
    }]

    useEffect(() => {
        if (searchText.length !== 0) {
            setData(

                _.filter(coupons, (item) => {
                    return (item.name != "" && item.name != undefined) ? item.name.toLowerCase().includes(searchText.toLowerCase()) : []
                })
            );
            setPage(0);
        } else {
            setData(coupons);
        }
    }, [coupons, searchText]);

    useEffect(() => {
        if (props.filterValue) {
            let tempData = { ...coupons };
            if (_.get(props, 'filterValue.fromDate')) {
                let fromDate = new Date(props.filterValue.fromDate).getTime();
                tempData = _.filter(tempData, (item) => new Date(item.createdAt).getTime() >= fromDate);
            }
            if (_.get(props, 'filterValue.toDate')) {
                let fromDate = new Date(props.filterValue.toDate).getTime();
                tempData = _.filter(tempData, (item) => new Date(item.createdAt).getTime() <= fromDate);
            }
            if (_.get(props, 'filterValue.offType.id') && _.get(props, 'filterValue.offType.id') !== 'all') {
                tempData = _.filter(tempData, (item) => item.offType === props.filterValue.offType.id);
            }
            if (_.get(props, 'filterValue.couponType.id') && _.get(props, 'filterValue.couponType.id') !== 'all') {
                tempData = _.filter(tempData, (item) => item.couponType[0] === props.filterValue.couponType.id);
            }
            if (_.get(props, 'filterValue.status.id') && _.get(props, 'filterValue.status.id') !== 'all') {
                tempData = _.filter(tempData, (item) => item.status === props.filterValue.status.id);
            }
            setData(tempData);
            setPage(0);
        } else {
            setData(coupons);
        }
    }, [props.filterValue]);

    const handleEditOpen = (empId) => {
        setEditId(empId)
        setOpenEdit(true);
    };

    const handleEditClose = () => {
        setOpenEdit(false);
    };


    const handleClickOpen = (empId) => {
        setDeleteId(empId)
        setOpen(true);
    };

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
        if (selectedValue === "Edit") {
            handleEditOpen(id);

        } else if (selectedValue == "Delete") {
            handleClickOpen(id);
        }
        else {
            setStatusOpen(true);
            setStatusValue({ id: id, value: selectedValue });
        }
    }


    const deleteCoupon = () => {
        axios.delete(`${couponAPIConfig.delete}/${deleteId}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setOpen(false);
                props.setChange(!props.change);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }


    const changeStatus = () => {
        axios.put(`${couponAPIConfig.changeStatus}/${statusValue.id}/${statusValue.value}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setStatusOpen(false);
                props.setChange(!props.change);
                dispatch(showMessage({ message: "Status change successfully", variant: 'success' }))
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
                    There are no coupon!
                </Typography>
            </motion.div>
        );
    }

    return (
        <div className="w-full flex flex-col min-h-full">
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
                <CouponTableHead
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
                                        {n.name}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                                        {n.code}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" style={{ textAlign: 'left', paddingLeft: '20px' }}>
                                        {n.offType}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="center">
                                        {n.minimumOffPrice}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.price}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.maxOffPercent + "%"}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.status.toLowerCase() === 'active' ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                                        ) : (<span style={{ color: 'red', fontWeight: 'bold' }}>Inactive</span>)}

                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.startDate}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.endDate}

                                    </TableCell>

                                    {_.get(props, 'permission.update_data') && <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                            {(popupState) => (
                                                <React.Fragment>
                                                    <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                                                        Action
                                                    </Button>

                                                    <Menu {...bindMenu(popupState)}>
                                                        {menuItemArray.map((value) => (
                                                            (value.loadIf && value.visibleIf.indexOf(n.status.toLowerCase()) !== -1) && <MenuItem
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
                <DialogTitle>{`Do you want to ${statusDisplayMessage[statusValue.value]} this coupon?`}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setStatusOpen(false)}>No</Button>
                    <Button onClick={changeStatus} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Do you want to delete this coupon?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={deleteCoupon} autoFocus>
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
                    <CouponRegisterForm couponId={editId} setOpen={setOpenEdit} open={openEdit} setChange={props.setChange} change={props.change} />
                </Box>
            </Modal>



        </div>
    );
}

export default withRouter(CouponTable);