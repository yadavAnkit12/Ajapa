import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { Input, Paper, Typography, TextField, Button, Autocomplete } from '@mui/material';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { TRANSACTIONSTATUS, TRANSACTIONORDERTYPE } from '../../Static/filterLists';

function TransactionHeader(props) {

  const [open, setOpen] = React.useState(false);
  const [filterData, setFilterData] = useState({
    orderType: null,
    paymentMode: null,
    status: null
  });

  const filterTransactionData = () => {
    props.setFilterValue(filterData);
  }

  const clearFilters = () => {
    setFilterData({
      orderType: null,
      paymentMode: null,
      status: null
    });
    props.setFilterValue('');
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-10">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="text-24 md:text-32 font-extrabold tracking-tight"
        >
          Transactions
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
              placeholder="Search Transactions"
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={props?.name}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => { props?.setName(ev.target.value) }}
            />
            {props?.setName && <FuseSvgIcon
              color="disabled"
              size={16}
              style={{ cursor: "pointer" }}
              onClick={() => props?.setName('')}
            >
              heroicons-solid:x
            </FuseSvgIcon>
            }
          </Paper>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <Button
              className=""
              onClick={handleClickOpen}
              variant="contained"
              color="secondary"
            >
              Find
            </Button>
          </motion.div>
        </div>

      </div>

      <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16'>
        <div className="flex sm:flex-row flex-wrap flex-col justify-start">
          <Autocomplete
            disablePortal
            value={filterData.orderType}
            id="orderType"
            options={TRANSACTIONORDERTYPE}
            getOptionLabel={option => option.name}
            sx={{ my: 1, minWidth: 140, mx: 1 }}
            onChange={(e, newValue) => setFilterData({ ...filterData, orderType: newValue })}
            renderInput={(params) => <TextField {...params} label="Order Type" variant="standard" />}
          />
          <Autocomplete
            disablePortal
            value={filterData.paymentMode}
            id="paymentMode"
            options={props.paymentList}
            getOptionLabel={option => option.name}
            sx={{ my: 1, minWidth: 140, mx: 1 }}
            onChange={(e, newValue) => setFilterData({ ...filterData, paymentMode: newValue })}
            renderInput={(params) => <TextField {...params} label="Payment Mode" variant="standard" />}
          />
          {_.size(TRANSACTIONSTATUS) > 0 && <Autocomplete
            disablePortal
            value={filterData.status}
            id="status"
            options={TRANSACTIONSTATUS}
            getOptionLabel={option => option.name}
            sx={{ my: 1, minWidth: 140, mx: 1 }}
            onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue })}
            renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
          />}
        </div>
        <div className="flex flex-row justify-end">
          <Button
            component={Link}
            onClick={filterTransactionData}
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>}
            sx={{ my: 2, mx: 1 }}
            fullWidth
          >
            Search
          </Button>
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
    </div >
  );

}


export default TransactionHeader;