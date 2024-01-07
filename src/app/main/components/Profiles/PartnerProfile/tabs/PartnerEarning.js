import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import _ from '@lodash';
import { Table, TableBody, TableCell, TablePagination, TableRow, Typography, Button, Slide, Paper, Input, TableHead, TextField } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef } from 'react';
import * as React from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectPartnersSearchText, setPartnersSearchText } from 'app/store/reduxSlice/partnersSlice';
import { partnerAPIConfig } from 'src/app/main/API/apiConfig';
import { Link } from 'react-router-dom';
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

function PartnerEarning(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const searchText = useSelector(selectPartnersSearchText);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });
  const [filterData, setFilterData] = useState({
    fromDate: '',
    toDate: ''
  });

  const clearFilters = () => {
    setFilterData({
      fromDate: '',
      toDate: ''
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
      appointmentNo: searchText,
      fromDate: _.get(filterData, 'fromDate'),
      toDate: _.get(filterData, 'toDate')
    };
    axios.get(`${partnerAPIConfig.partnerEarning}/${props.partnerID}`, { params }, {
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

  function handleChangePage(event, value) {
    setPage(value);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (_.size(_.get(data, 'partnerEarningList')) == 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no Earning!
        </Typography>
      </motion.div>
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
          Earning
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
              placeholder="Search Appointment"
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => dispatch(setPartnersSearchText(ev))}
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
              <TableCell>Order Number</TableCell>
              <TableCell>Patient Mobile</TableCell>
              <TableCell>Total Lab Test</TableCell>
              <TableCell>Total Amount</TableCell>
            </TableRow>
          </TableHead>
          {_.size(_.get(data, 'partnerEarningList')) == 0 &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              className="flex flex-1 items-center justify-center h-full"
            >
              <Typography color="text.secondary" variant="h5">
                There are no Earning!
              </Typography>
            </motion.div>}
          {_.size(_.get(data, 'partnerEarningList')) > 0 && <TableBody style={{ background: "#ffffff" }}>
            {_.orderBy(data?.partnerEarningList, [(o) => {
              switch (order._id) {
                case 'categories': {
                  return o.categories[0];
                }
                default: {
                  return o[order._id];
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
                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.orderNumber}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.patientMobile}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.totalLabTest}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.totalAmount}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>}

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

    </div>
  );
}

export default PartnerEarning;