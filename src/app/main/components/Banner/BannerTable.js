import withRouter from '@fuse/core/withRouter';

import _ from '@lodash';

import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, IconButton, Modal, Box, Dialog, DialogActions, DialogTitle, Slide, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';

import { motion } from 'framer-motion';

import React, { useEffect, useState, forwardRef,useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { showMessage } from "app/store/fuse/messageSlice";

import { bannerAPIConfig } from '../../API/apiConfig';
import { selectBanners, selectBannerSearchText } from '../../../store/reduxSlice/bannerSlice';

import BannerRegistrationForm from './BannerRegistrationForm';
import BannerTableHeader from './BannerTableHeader';

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

function BannerTable(props) {


    const dispatch = useDispatch();

    const products = useSelector(selectBanners);
    const searchText = useSelector(selectBannerSearchText);

    const [selected, setSelected] = useState([]);
    const [data, setData] = useState(products);
    const tableRef=useRef(null)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null,
    });

    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [deleteId, setDeleteId] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (searchText.length !== 0) {
            setData(

                _.filter(products, (item) => {

                    return (item.planName != "" && item.planName != undefined) ? item.planName.toLowerCase().includes(searchText.toLowerCase()) : []

                })
            );
            setPage(0);
        } else {
            setData(products);
        }
    }, [products, searchText]);


    const handleClickOpen = (symptomId) => {
        setOpen(true);
        setDeleteId(symptomId);
    };

    const handleEditOpen = (empId) => {
        setEditId(empId);
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
        axios.put(`${bannerAPIConfig.changeStatus}/${id}/${selectedValue}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                props.setChange(!props.change)
                dispatch(showMessage({ message: "Status change successfully", variant: 'success' }))
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }

    function deleteBanner() {
        axios.delete(`${bannerAPIConfig.delete}/${deleteId}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                dispatch(showMessage({ message: "Banner deleted successfully" }));
                setOpen(false);
                props.setChange(!props.change);
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
                    There are no Banner!
                </Typography>
            </motion.div>
        );
    }

    return (
        <div className="w-full flex flex-col min-h-full">
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
                <BannerTableHeader
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
                                        {n.couponCode}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-12" component="th" scope="row">
                                        <img src={n.image} alt={n.name} style={{ width: '100px', height: '100px' }} />
                                    </TableCell>

                                    {props?.permission?.update_data && <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                                        <IconButton aria-label="edit" color="success" onClick={() => { handleEditOpen(n.id) }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>}

                                    {props?.permission?.delete_data && <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                        <IconButton aria-label="delete" color="error" onClick={() => { handleClickOpen(n.id) }}>
                                            <DeleteIcon />
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
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Do you want to delete this banner?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>No</Button>
                    <Button onClick={deleteBanner} autoFocus>
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
                    <BannerRegistrationForm bannerId={editId} setOpen={setOpenEdit} open={openEdit} setChange={props.setChange} change={props.change} />
                </Box>
            </Modal>
        </div>
    );
}

export default withRouter(BannerTable);

