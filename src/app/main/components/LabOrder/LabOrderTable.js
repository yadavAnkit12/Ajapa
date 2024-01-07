import withRouter from '@fuse/core/withRouter';
import _ from '@lodash';
import { Dialog, DialogActions, DialogTitle, Table, IconButton, TableBody, TableCell, Menu, MenuItem, TablePagination, TableRow, Typography, Button, Modal, Box, Slide } from '@mui/material';
import * as React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from "app/store/fuse/messageSlice";
import { LabOrderAPIConfig } from '../../API/apiConfig';
import { selectLabPartnerPlanSearchText } from '../../../store/reduxSlice/labPartnerSlice';
import LabOrderTableHead from './LabOrderTableHead';
import FuseLoading from '@fuse/core/FuseLoading';
import LabOrderView from './LabOrderView';
import PersonIcon from '@mui/icons-material/Person';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useNavigate } from 'react-router-dom';
import { getUserRoles } from '../../../auth/services/utils/common';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
    maxWidth: '70%',
    maxHeight: '600px',
    overflow: 'auto'
};

const statusDisplayMessage = {
    'Active': 'activate',
    'InActive': 'in-activate'
}

function LabOrderTable(props) {

    const dispatch = useDispatch();
    const searchText = useSelector(selectLabPartnerPlanSearchText);

    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState([]);
    const tableRef = useRef(null)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null,
    });
    const [statusOpen, setStatusOpen] = useState(false);
    const [statusValue, setStatusValue] = useState({ id: '', value: '' });
    const [openView, setOpenView] = useState(false);
    const [viewid, setViewId] = useState("");
    const [loading, setLoading] = useState(true);
    const [change, setChange] = useState(false);
    const [open, setOpen] = useState(false)
    const [orderID, setOrderID] = useState('')

    const statusDisplayMessage = {
        'InActive': 'in-activate',
        'Active': 'activate',
        'Complete': 'Complete',
        'Cancle': 'Cancle'
    }

    const menuItemArray = [
        // {
        //     key: 1,
        //     label: 'Cancel',
        //     status: 'cancel',
        //     visibleIf: ['complete', 'active', 'inactive'],
        //     loadIf: props?.permission?.update_data
        // },
        // {
        //     key: 2,
        //     label: 'Complete',
        //     status: 'complete',
        //     visibleIf: ['cancel', 'active', 'inactive'],
        //     loadIf: props?.permission?.update_data
        // },
        {
            key: 3,
            label: 'Upload Report',
            status: 'uploadreport',
            visibleIf: ['cancel', 'samplecollected', 'active', 'inactive'],
            loadIf: props?.permission?.update_data
        },
        {
            key: 4,
            label: 'Sample Collect',
            status: 'samplecollect',
            visibleIf: ['cancel', 'complete', 'samplecollected', 'uploadreport', 'active', 'inactive', 'booked'],
            loadIf: props?.permission?.update_data
        }
    ]
    useEffect(() => {
        fetchData();
    }, [rowsPerPage, page, props?.filterValue]);

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
            status: (_.get(props, 'filterValue.status.id') === 'all' || !_.get(props, 'filterValue.status.id')) ? '' : _.get(props, 'filterValue.status.id'),
        };

        axios.get(LabOrderAPIConfig.list, { params }, {
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
            setSelected(_.size(_.get(data, 'serviceOrderList')) > 0 ?
                _.get(data, 'serviceOrderList').map((n) => n._id) :
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


    const handleViewOpen = (empId) => {
        setViewId(empId)
        setOpenView(true);
    };

    const handleViewClose = () => {
        setOpenView(false);
    };


    function getStatus(id, selectedValue) {
        if (selectedValue == "uploadreport") {
            navigate(`/app/pathologyOrder/documentupload/${id}`);
        } else if (selectedValue == "samplecollect") {
            navigate(`/app/pathologyOrder/collectsample/${id}`);
        }
    }

    const changeStatus = () => {
        axios.put(`${LabOrderAPIConfig.changeStatus}/${statusValue.id}/${statusValue.value}`, {
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

    const getRoleStatus = (data) => {
        if (getUserRoles() === "admin") {
            return data.adminStatus;
        } else {
            return data.pathologyStatus;
        }
    }

    if (!_.size(_.get(data, 'serviceOrderList'))) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-1 items-center justify-center h-full"
            >
                <Typography color="text.secondary" variant="h5">
                    There are no Lab Order!
                </Typography>
            </motion.div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <FuseLoading />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col min-h-full">
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
                <LabOrderTableHead
                    selectedProductIds={selected}
                    order={order}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={data?.serviceOrderList?.length}
                    onMenuItemClick={handleDeselect}
                    permission={props.permission}
                />


                <TableBody>
                    {_.orderBy(data?.serviceOrderList, [(o) => {
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

                                    <TableCell className="p-4 md:p-12" component="th" scope="row">
                                        {n.orderNumber}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                        {n.patientName}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                        {n.patientMobile}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                                        {n.brandName}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                                        {n.totalPathologyAmount}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                        {n.totalLabTest}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                        <span style={{ color: (n.status == 'Complete') ? 'green' : (n.status == 'Cancle') ? 'red' : '', fontWeight: 'bold' }}>
                                            {/* {getUserRoles() === "admin" ? n.adminStatus : n.pathologyStatus} */}
                                            {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                                        </span>
                                    </TableCell>


                                    {_.get(props, 'permission.read_data') && <TableCell className="p-4 md:p-16" component="th" scope="row" >
                                        <IconButton aria-label="view" color="success" onClick={() => { handleViewOpen(n._id) }}>
                                            <PersonIcon />
                                        </IconButton>
                                    </TableCell>}
                                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">

                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                            {(popupState) => (
                                                <>
                                                    <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                                                        Action
                                                    </Button>
                                                    {(n.status === 'order_placed' || n.status==='rescheduled') && <Menu {...bindMenu(popupState)}>

                                                        {menuItemArray.map((value) => (
                                                            (value.loadIf ) && <MenuItem
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
                                                    </Menu>}

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
                open={statusOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setStatusOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{`Do you want to ${statusDisplayMessage[statusValue.value]} this Service plan?`}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setStatusOpen(false)}>No</Button>
                    <Button onClick={changeStatus} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Modal
                open={openView}
                onClose={handleViewClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {openView && <LabOrderView type="all" viewid={viewid} setChange={setChange} change={change} setOpen={setOpenView} open={openView} />}
                </Box>
            </Modal>
        </div>
    );
}

export default withRouter(LabOrderTable);