import withRouter from '@fuse/core/withRouter';
import _ from '@lodash';
import { Dialog, DialogActions, DialogTitle, Table, TableBody, TableCell, IconButton, TablePagination, TableRow, Typography, Button, Modal, Box, Slide } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import * as React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from "app/store/fuse/messageSlice";
import { OrderAPIConfig } from '../../API/apiConfig';
import { selectLabPartnerPlanSearchText } from '../../../store/reduxSlice/labPartnerSlice';
import OrderView from './OrderView';
import OrderTableHead from './OrderTableHead';
import FuseLoading from '@fuse/core/FuseLoading';
import { ORDERSTATUS } from '../../Static/filterLists';

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
    maxHeight: '650px',
    overflow: 'auto'
};

const statusDisplayMessage = {
    'Active': 'activate',
    'InActive': 'in-activate'
}

function OrderTable(props) {

    const dispatch = useDispatch();
    const searchText = useSelector(selectLabPartnerPlanSearchText);

    const [selected, setSelected] = useState([]);
    const [data, setData] = useState([]);
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

        axios.get(OrderAPIConfig.list, { params }, {
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

    const handleViewOpen = (empId) => {
        setViewId(empId)
        setOpenView(true);
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

    function handleSelectAllClick(event) {
        if (event.target.checked) {
            setSelected(_.size(_.get(data, 'productOrderList')) > 0 ?
                _.get(data, 'productOrderList').map((n) => n._id) :
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
    }

    function handleChangeRowsPerPage(event) {
        setRowsPerPage(event.target.value);
    }

    const changeStatus = () => {
        axios.put(`${labPartnerAPIConfig.changeStatus}/${statusValue.id}/${statusValue.value}`, {
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


    if (!_.size(_.get(data, 'productOrderList'))) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-1 items-center justify-center h-full"
            >
                <Typography color="text.secondary" variant="h5">
                    There are no Service plans!
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
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                <OrderTableHead
                    selectedProductIds={selected}
                    order={order}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={data?.productOrderList?.length}
                    onMenuItemClick={handleDeselect}
                    permission={props.permission}
                />


                <TableBody>
                    {_.orderBy(data?.productOrderList, [(o) => {
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
                                        {n.orderId}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                        {n.patientId?.name}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                        {n.patientMobile}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                                        {n.totalAmount}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        <span style={{ color: (n.status == 'completed') ? 'green' : (n.status == 'on-hold') ? 'red' : (n.status == 'cancelled') ? 'red' : (n.status === 'processing') ? '#FF9800' : '', fontWeight: 'bold' }}>
                                            {ORDERSTATUS.find(order => order.id === n.status).name}
                                        </span>
                                    </TableCell>



                                    {_.get(props, 'permission.read_data') && <TableCell className="p-4 md:p-16" component="th" scope="row" >
                                        <IconButton aria-label="view" color="success" onClick={() => { handleViewOpen(n.orderId) }}>
                                            <PersonIcon />
                                        </IconButton>
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
                    {openView && <OrderView type="all" viewid={viewid} setChange={setChange} change={change} setOpen={setOpenView} open={openView} />}
                </Box>
            </Modal>
        </div>
    );
}

export default withRouter(OrderTable);