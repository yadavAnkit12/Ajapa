import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import _ from '@lodash';
import { Table, TableBody, TableCell, TablePagination, TableRow, TableHead, Typography, Button, Slide, Paper, Input, TextField } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPatientsSearchText, setPatientsSearchText } from 'app/store/reduxSlice/patientsSlice';
import { patientAPIConfig } from 'src/app/main/API/apiConfig';
import { Link } from 'react-router-dom';
import { showMessage } from "app/store/fuse/messageSlice";
import { lighten } from '@mui/material/styles';

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
  maxWidth: '900px',
  maxHeight: '650px',
  overflow: 'auto'
};

function WalletTransaction(props) {
  console.log("waller",props)
  const dispatch = useDispatch();

  const searchText = useSelector(selectPatientsSearchText);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [filterData, setFilterData] = useState({
    fromDate: '',
    toDate: '',

  });

  const clearFilters = () => {
    setFilterData({
      fromDate: '',
      toDate: '',

    });
  }

  useEffect(() => {
    fetchData();
  }, [rowsPerPage, page, filterData]);


  useEffect(() => {
    if (page !== 0) {
      setPage(0);
    }
  }, [filterData])

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
      fromDate: _.get(filterData, 'fromDate'),
      toDate: _.get(filterData, 'toDate'),
    };

    axios.get(`${patientAPIConfig.fetchTransaction}/${props.patientID}`, { params }, {
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


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">

      <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="text-24 md:text-32 font-extrabold tracking-tight"
        >
          Wallet Transaction
        </Typography>

        <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
          >
            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

            <Input
              placeholder="Search Transaction"
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => dispatch(setPatientsSearchText(ev))}
            />
          </Paper>
        </div>

      </div>


      <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16'>
        <div className="flex sm:flex-row flex-wrap flex-col justify-start">
          <TextField
            id="fromDate"
            label="From Date"
            variant="standard"
            type='date'
            value={filterData.fromDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ my: 1, minWidth: 140, mx: 1 }}
            onChange={e => setFilterData({ ...filterData, fromDate: e.target.value })}
          />
          <TextField
            id="toDate"
            label="To Date"
            variant="standard"
            type='date'
            value={filterData.toDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ my: 1, minWidth: 140, mx: 1 }}
            onChange={e => setFilterData({ ...filterData, toDate: e.target.value })}
          />

        </div>
        <div className="flex flex-row justify-end">
          <Button
            component={Link}
            onClick={clearFilters}
            variant="outlined"
            color="secondary"
            startIcon={<FuseSvgIcon>heroicons-outline:refresh</FuseSvgIcon>}
            sx={{ my: 2, mx: 1 }}
            fullWidth
          >
            Reset
          </Button>
        </div>
      </div>


      <FuseScrollbars className="grow rounded-16 shadow-1">

        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <TableHead>
            <TableRow sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? lighten(theme.palette.background.default, 0.4)
                  : lighten(theme.palette.background.default, 0.02),
            }}>
              <TableCell>Patient Mobile</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Transaction Number</TableCell>
              <TableCell>Transaction Type Amount</TableCell>
              <TableCell>Trasaction Mode</TableCell>
            </TableRow>
          </TableHead>
          {_.size(data) == 0 &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              style={{ background: "#ffffff" }}
              className="flex flex-1 items-center justify-center absolute h-full w-full"
            >
              <Typography color="text.secondary" variant="h5">
                There are no wallet transactions!
              </Typography>
            </motion.div>}
          {_.size(data) > 0 && <TableBody style={{ background: '#ffffff' }}>
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
                    <TableCell className="p-16" component="th" scope="row">
                      {n.patientMobile}
                    </TableCell>

                    <TableCell className="p-16" component="th" scope="row">
                      {n.points}
                    </TableCell>

                    <TableCell className="p-16" component="th" scope="row">
                      {n.transactionNumber}
                    </TableCell>

                    <TableCell className="p-16" component="th" scope="row">
                      {n.transactionType}
                    </TableCell>

                    <TableCell className="p-16" component="th" scope="row">
                      {n.mode}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>}

        </Table>
      </FuseScrollbars>
    </div>
  );
}

export default WalletTransaction;