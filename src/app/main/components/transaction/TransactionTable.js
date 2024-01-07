import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';

import _ from '@lodash';

import PersonIcon from '@mui/icons-material/Person';
import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, IconButton, Slide, Dialog, DialogActions, Container, Button } from '@mui/material';

import axios from 'axios';

import { motion } from 'framer-motion';

import { useEffect, useState, forwardRef, useRef } from 'react';

import { useDispatch } from 'react-redux';

import { showMessage } from 'app/store/fuse/messageSlice';

import { transactionAPIConfig } from '../../API/apiConfig';

import PatientTableHead from './TransactionTableHead';
import TransationView from './TransationView';
import TransactionTableHead from './TransactionTableHead';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



function PatientTable(props) {
  const dispatch = useDispatch();
  const [openView, setOpenView] = useState(false);
  const [viewid, setViewId] = useState("");
  const tableRef = useRef(null)
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });


  useEffect(() => {
    
      const params = {
        page: page + 1, // Example data to pass in req.query
        rowsPerPage: rowsPerPage,
        search:props.name,
        orderType: (_.get(props, 'filterValue.orderType.id') === 'all' || !_.get(props, 'filterValue.orderType.id')) ? '' : props.filterValue.orderType.id,
        status: (_.get(props, 'filterValue.status.id') === 'all' || !_.get(props, 'filterValue.status.id')) ? '' : props.filterValue.status.id,
        paymentMode: (_.get(props, 'filterValue.paymentMode.name') === 'All' || !_.get(props, 'filterValue.paymentMode.name')) ? '' : props.filterValue.paymentMode.name
      };
      axios.get(transactionAPIConfig.transactionList, { params }, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 201) {
          console.log(response.data.data.transactionList)
          setData(response.data.data)
          setLoading(false);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    

    
  }, [rowsPerPage, page, props]);

  const handleViewOpen = (empId) => {
    console.log(empId)
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

  const
    handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value));
      setPage(0);
      tableRef.current && tableRef.current.scrollIntoView();

    };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no Transactions!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <TransactionTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
          onMenuItemClick={handleDeselect}
          permission={props.permission}
        />
        <TableBody>
          {_.orderBy(data?.transactionList, [(o) => {
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
                    {n.transactionNumber}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.patientMobile}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.orderType}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.price}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.paymentMode}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.createdAt.split("T")[0]}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.status}
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
        open={openView}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleViewClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogActions>
          <Container maxWidth="md" sx={{ paddingTop: 5, paddingBottom: 5 }}>
            <TransationView viewid={viewid} setChange={props.setChange} change={props.change} setOpen={setOpenView} open={openView} />
          </Container>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default withRouter(PatientTable);

