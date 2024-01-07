import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Dialog, DialogActions, DialogTitle, Table, TableBody, TableCell, IconButton, TablePagination, TableRow, Menu, Typography, Button, Modal, Box, Slide, MenuItem } from '@mui/material';
import * as React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from "app/store/fuse/messageSlice";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { caseAPIConfig, labPartnerAPIConfig } from '../../API/apiConfig';
import { selectLabPartnerPlans, selectLabPartnerPlanSearchText } from '../../../store/reduxSlice/labPartnerSlice';
import { useNavigate } from "react-router-dom";

import { getUserRoles } from '../../../auth/services/utils/common';
// import ServicePublishedForm from './ServicePublishedForm';
import NewCaseTableHead from './NewCaseTableHead';

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

function NewCaseTable(props) {

    const navigate = useNavigate();
    const menuItemArray =
        [
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
                label: 'Send for Report Generation',
                status: 'send',
            },

        ];

    const statusDisplayMessage = {
        'true': 'activate',
        'false': 'in-activate',
        'Approved': 'approve',
        'Rejected': 'reject',
        'Blocked': 'block',
        'Published': 'publish'
    }

    const menuItemArrayPartner = [{
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

    // const menuItemArrayAdmin = [{
    //     key: 1,
    //     label: 'Approve',
    //     status: 'Approved',
    //     visibleIf: ['active', 'pending', 'rejected', 'blocked'],
    //     loadIf: props?.permission?.update_data
    // },
    // {
    //     key: 2,
    //     label: 'Reject',
    //     status: 'Rejected',
    //     visibleIf: ['active', 'pending'],
    //     loadIf: props?.permission?.update_data
    // },
    // {
    //     key: 3,
    //     label: 'Block',
    //     status: 'Blocked',
    //     visibleIf: ['approved', 'published'],
    //     loadIf: props?.permission?.update_data
    // },
    // {
    //     key: 4,
    //     label: 'Publish',
    //     status: 'Published',
    //     visibleIf: ['approved'],
    //     loadIf: props?.permission?.update_data
    // }];

    const dispatch = useDispatch();

    const partnerService = useSelector(selectLabPartnerPlans);
    const searchText = useSelector(selectLabPartnerPlanSearchText);

    const [selected, setSelected] = useState([]);
    const [data, setData] = useState(partnerService);
    const tableRef = useRef(null)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null,
    });
    const [openEdit, setOpenEdit] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [statusValue, setStatusValue] = useState({ id: '', value: '' });
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [labPartnerPlanId, setLabPartnerPlanId] = useState("");
    const [openView, setOpenView] = useState(false);
    const [viewid, setViewId] = useState("");
    const [loading, setLoading] = useState(true);
    const [change, setChange] = useState(false);
    const [publishOpen, setPublishOpen] = useState(false);

console.log(props.filterValue)
    useEffect(() => {
        fetchData();
    }, [rowsPerPage, page, props?.filterValue, change]);

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
            caseType:_.get(props, 'filterValue.caseType')
        };
console.log(params)
        axios.get(caseAPIConfig.list, { params }, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data.data)
                setData(response?.data?.data);
                setLoading(false);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        });
    };

    // const handleEditOpen = (empId) => {
    //     // setLabPartnerPlanId(empId)
    //     // setOpenEdit(true);
    //     navigate(`/app/manage/case/${empId}`);


    // };


    const handleClickOpen = (empId) => {
        setOpen(true);
        setDeleteId(empId)
    };


    const handleViewOpen = (empId) => {
        setViewId(empId)
        setOpenView(true);
    };


    const handleViewClose = () => {
        setOpenView(false);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleEditClose = () => {
        setOpenEdit(false);
    };

    function deleteCase() {
        axios.delete(`${caseAPIConfig.delete}/${deleteId}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setOpen(false);
                setChange(!change);
                dispatch(showMessage({ message: "Case Deleted Successfully", variant: 'success' }))
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
            setSelected(_.size(_.get(data, 'serviceList')) > 0 ?
                _.get(data, 'serviceList').map((n) => n._id) :
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
            navigate(`/app/manage/case/${id}`);

        }
        else if (selectedValue == "Delete") {
            handleClickOpen(id)

        }
        else if (selectedValue == "View") {

            handleViewOpen(id)

        }
    }

    const changeStatus = () => {
        let params = new FormData();
        params.append('serviceId', statusValue.id);
        if (getUserRoles() === 'admin') {
            params.append('status', statusValue.value);
        } else {
            params.append('isActive', statusValue.value);
        }
        axios.put(labPartnerAPIConfig.changeStatus, params, {
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


    // if (!_.size(_.get(data, 'caseList'))) {
    //     return (
    //         <motion.div
    //             initial={{ opacity: 0 }}
    //             animate={{ opacity: 1, transition: { delay: 0.1 } }}
    //             className="flex flex-1 items-center justify-center h-full"
    //         >
    //             <Typography color="text.secondary" variant="h5">
    //                 There are no Cases !
    //             </Typography>
    //         </motion.div>
    //     );
    // }

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center h-full">
    //             <FuseLoading />
    //         </div>
    //     );
    // }

    return (
        <div className="w-full flex flex-col min-h-full">
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
                <NewCaseTableHead
                    selectedProductIds={selected}
                    order={order}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={data?.serviceList?.length}
                    onMenuItemClick={handleDeselect}
                    permission={props.permission}
                />


                <TableBody>
                    {_.orderBy(data?.caseList, [(o) => {
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
                                        {n.ReferenceNo}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                                        {n.Date}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                        {n.ExpectedDispatchDate}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                                        {n?.CaseTypes?.map((caseItem, index) => (
                                            <React.Fragment key={index}>
                                                {caseItem.subSpecialization}
                                                {index < n.CaseTypes.length - 1 && ','}
                                            </React.Fragment>
                                        ))}</TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                                        {n.PatientRefID.name}
                                    </TableCell>
                                    <TableCell className="p-4 md:p-12 truncate font-semibold" style={{ color: "green" }} component="th" scope="row">
                                        {n.status}
                                    </TableCell>
                                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                            {(popupState) => (
                                                <React.Fragment>
                                                    <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                                                        Action
                                                    </Button>

                                                    <Menu {...bindMenu(popupState)}>

                                                        {menuItemArray.map((value) => (
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
                                    {/* 
                                    {props?.permission?.update_data && <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        <IconButton aria-label="edit" color="success" onClick={() => { handleEditOpen(n._id) }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>}

                                    {props?.permission?.delete_data && <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                        <IconButton aria-label="delete" color="error" onClick={() => { handleClickOpen(n._id) }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>}

                                    {props?.permission?.read_data && <TableCell className="p-4 md:p-16" component="th" scope="row" >
                                        <IconButton aria-label="view" color="success" onClick={() => { handleViewOpen(n._id) }}>
                                            <PersonIcon />
                                        </IconButton>
                                    </TableCell>} */}

                                    {/* <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.isActive ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                                        ) : (<span style={{ color: 'red', fontWeight: 'bold' }}>Inactive</span>)}
                                    </TableCell> */}

                                    {/* {getUserRoles() === 'admin' && <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.status.toLowerCase()}
                                    </TableCell>} */}

                                    {/* {props?.permission?.update_data && <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">

                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                            {(popupState) => (
                                                <React.Fragment>
                                                    <Button variant="contained" style={{ borderRadius: 0 }}{...bindTrigger(popupState)}>
                                                        Action
                                                    </Button>

                                                    <Menu {...bindMenu(popupState)}>
                                                        {getUserRoles() === "partner" && menuItemArrayPartner.map((value) => (
                                                            value.visibleIf.indexOf(n.isActive) !== -1 && <MenuItem
                                                                onClick={() => {
                                                                    getStatus(n._id, n.serviceName, value.status);
                                                                    popupState.close();
                                                                }}
                                                                key={value.key}
                                                            >
                                                                {value.label}
                                                            </MenuItem>
                                                        )
                                                        )}

                                                        {getUserRoles() === "admin" && menuItemArrayAdmin.map((value) => (
                                                            value.visibleIf.indexOf(n.status.toLowerCase()) !== -1 && <MenuItem
                                                                onClick={() => {
                                                                    getStatus(n._id, n.serviceName, value.status);
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
                                    </TableCell>} */}


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
                <DialogTitle>{"Do you want to delete this Service plan?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={deleteCase} autoFocus>
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
                <DialogTitle>{`Do you want to ${statusDisplayMessage[statusValue.value]} this Service plan?`}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setStatusOpen(false)}>No</Button>
                    <Button onClick={changeStatus} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


            {/* <Modal
                open={openView}
                onClose={handleViewClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <ServiceView viewid={viewid} setChange={setChange} change={change} setOpen={setOpenView} open={openView} />
                </Box>
            </Modal> */}


            {/* <Modal
                open={openEdit}
                onClose={handleEditClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <ServiceRegisterForm CaseID={labPartnerPlanId} setOpen={setOpenEdit} open={openEdit} setChange={setChange} change={change} />
                </Box>
            </Modal> */}


            <Modal
                open={publishOpen}
                onClose={() => setPublishOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* <ServicePublishedForm labPartnerData={statusValue} setPublishOpen={setPublishOpen} publishOpen={publishOpen} setChange={setChange} change={change} /> */}
                </Box>
            </Modal>
        </div>
    );
}

export default withRouter(NewCaseTable);