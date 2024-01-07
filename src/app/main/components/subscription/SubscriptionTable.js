import withRouter from '@fuse/core/withRouter';
import _ from '@lodash';
import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, Modal, Box, Slide } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState, forwardRef,useRef } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDispatch, useSelector } from 'react-redux';
import { selectSubscriptionPlanSearchText } from '../../../store/reduxSlice/subscriptionSlice';
import SubscriptionRegisterForm from './SubscriptionRegistrationForm';
import SubscriptionTableHead from './SubscriptionTableHeader';
import axios from 'axios';
import { subscriptionAPIConfig } from '../../API/apiConfig';

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


const statusDisplayMessage = {
    true: 'activate',
    false: 'in-activate'
}

function SubscriptionTable(props) {

    const searchText = useSelector(selectSubscriptionPlanSearchText);
    const dispatch = useDispatch();
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState([]);
    const tableRef=useRef(null)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null,
    });

    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(true);

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
            expiryDay: (_.get(props, 'filterValue.expiryDay.id') === 'all' || !_.get(props, 'filterValue.expiryDay.id')) ? '' : _.get(props, 'filterValue.expiryDay.id'),
            isExpire: (_.get(props, 'filterValue.status.id') === 'all' || !_.get(props, 'filterValue.status.id')) ? '' : _.get(props, 'filterValue.status.id'),
        };

        axios.get(subscriptionAPIConfig.list, { params }, {
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
            setSelected(_.size(_.get(data, 'subscriptionList')) > 0 ?
                _.get(data, 'subscriptionList').map((n) => n._id) :
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

    if (!_.size(_.get(data, 'subscriptionList'))) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-1 items-center justify-center h-full"
            >
                <Typography color="text.secondary" variant="h5">
                    There are no subscription plans!
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
                <SubscriptionTableHead
                    selectedProductIds={selected}
                    order={order}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={data?.subscriptionList?.length}
                    onMenuItemClick={handleDeselect}
                />
                <TableBody>
                    {_.orderBy(data?.subscriptionList, [(o) => {
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
                                        {n.membershipPlanId.planName}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row">
                                        {n.patientMobile}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12 truncate" style={{ color: "Blue" }} component="th" scope="row">
                                        {n.membershipPlanId.priceWithGst}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" style={{ textAlign: 'left', paddingLeft: '20px' }}>
                                        {n.membershipPlanId.appointmentSlot}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.membershipPlanId.offPercentMedicine + "%"}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.membershipPlanId.offPercentTest + "%"}
                                    </TableCell>


                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.expireDate}
                                    </TableCell>


                                    <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        {n.isExpire === true ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>Expired</span>
                                        ) : (<span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>)}

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

            <Modal
                open={openEdit}
                onClose={handleEditClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <SubscriptionRegisterForm setOpen={setOpenEdit} open={openEdit} />
                </Box>
            </Modal>
        </div>
    );
}

export default withRouter(SubscriptionTable);