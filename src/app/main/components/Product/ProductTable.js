import FuseScrollbars from '@fuse/core/FuseScrollbars';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Table, TableBody, TableCell, IconButton, TablePagination, TableRow, Typography, Modal, Box, Slide } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import * as React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef,useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showMessage } from "app/store/fuse/messageSlice";
import { ProductAPIConfig } from '../../API/apiConfig';
import ProductTableHead from './ProductTableHead';
import ProductView from './ProductView';
import { selectLabPartnerPlanSearchText } from '../../../store/reduxSlice/productSlice';
import { PRODUCTSTATUS } from '../../Static/filterLists';

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

function ProductTable(props) {

    const dispatch = useDispatch();
    const searchText = useSelector(selectLabPartnerPlanSearchText);
    const [selected, setSelected] = useState([]);
    const tableRef=useRef(null)
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null,
    });

    const [loading, setLoading] = useState(true);

    const [openView, setOpenView] = useState(false);
    const [viewid, setViewId] = useState("");

    useEffect(() => {
        fetchData();
    }, [props?.change, rowsPerPage, page, props?.filterValue]);

    useEffect(() => {
        if (page !== 0) {
            setPage(0);
        }
    }, [props.filterValue])

    useEffect(() => {
        // if (searchText.length === 0) {
        //     fetchData();
        // }
        // if (searchText.length !== 10) {
        //     return;
        // }
        // axios.get(`${patientAPIConfig.getPatientByMobile}/${searchText}`, {
        //     headers: {
        //         'Content-type': 'multipart/form-data',
        //         authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        //     },
        // }).then((response) => {
        //     if (response.status === 200) {
        //         setPatientListData({ patientList: response.data.data });
        //     } else {
        //         dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        //         setPatientListData(null);
        //     }
        // });
        fetchData()
  
    }, [searchText]);

    const fetchData = () => {
        const params = {
            page: page + 1,
            rowsPerPage: rowsPerPage,
            search:searchText,
            fromDate: _.get(props, 'filterValue.fromDate'),
            toDate: _.get(props, 'filterValue.toDate'),
            status: (_.get(props, 'filterValue.status.id') === 'all' || !_.get(props, 'filterValue.status.id')) ? '' : _.get(props, 'filterValue.status.id'),
            featured: _.get(props, 'filterValue.featured.id'),
        };
        axios.get(ProductAPIConfig.productList, { params }, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setData(response.data.data);
                setLoading(false);
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
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
            setSelected(_.size(_.get(data, 'productList')) > 0 ?
                _.get(data, 'productList').map((n) => n._id) :
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


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <FuseLoading />
            </div>
        );
    }

    if (!_.size(_.get(data, 'productList'))) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-1 items-center justify-center h-full"
            >
                <Typography color="text.secondary" variant="h5">
                    There are no Product!
                </Typography>
            </motion.div>
        );
    }

    return (
        <div className="w-full flex flex-col min-h-full">
            <FuseScrollbars className="grow overflow-x-auto">
                <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
                    <ProductTableHead
                        selectedProductIds={selected}
                        order={order}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={data?.productList?.length}
                        onMenuItemClick={handleDeselect}
                        permission={props.permission}
                    />

                    <TableBody>
                        {_.orderBy(data?.productList, [(o) => {
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
                                            {n.name}
                                        </TableCell>
                                        <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                            {n.id}
                                        </TableCell>

                                        <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                            {n.price}
                                        </TableCell>


                                        <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                            {n.regular_price}
                                        </TableCell>

                                        <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                            {n.sale_price}
                                        </TableCell>


                                        <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                            {n.on_sale ? 'Yes' : 'No'}
                                        </TableCell>

                                        <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                            <span style={{ color: (n.status == 'Published') ? 'green' : (n.status == 'Pending Review') ? 'FF9800':  '', fontWeight: 'bold' }}>
                                                {_.get(PRODUCTSTATUS.find(product => product.id === n.status), 'name')}
                                                
                                            </span>
                                        </TableCell>
                                        

                                        <TableCell className="p-4 md:p-12 truncate" component="th" scope="row">
                                            {n.featured === "true" ? 'Yes' : 'No'}
                                        </TableCell>

                                        {props?.permission?.read_data && <TableCell className="p-4 md:p-16" component="th" scope="row" >
                                            <IconButton aria-label="view" color="success" onClick={() => { handleViewOpen(n._id) }}>
                                                <PersonIcon />
                                            </IconButton>
                                        </TableCell>}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </FuseScrollbars>

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
                open={openView}
                onClose={handleViewClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <ProductView type="all" viewid={viewid} setChange={props.setChange} change={props.change} setOpen={setOpenView} open={openView} />
                </Box>
            </Modal>
        </div>
    );
}

export default withRouter(ProductTable);  