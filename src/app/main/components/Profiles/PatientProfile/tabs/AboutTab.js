import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { lighten } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import './AboutTab.css';
import FuseLoading from '@fuse/core/FuseLoading';

function AboutTab(props) {

  const [data, setData] = useState(null);


  useEffect(() => {
    if (props.patientData) {
      setData(props.patientData)
    }
  }, [props.patientData]);

  if (!data) {
    return <FuseLoading/>;
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };




  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full">
      <div className="flex sm:flex-row flex-col flex-wrap">
        <Card component={motion.div} variants={item} className="mb-32 mr-12 w-full sm:w-3/4">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">
              Personal  Information
            </Typography>
          </div>

          <CardContent className="px-32 py-24">
            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Name</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.name || 'NA'}</Typography>
            </div>

            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Gender</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.gender || 'NA'}</Typography>
            </div>

            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Age</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.age || 'NA'}</Typography>
            </div>

            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Status</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.status || 'NA'}</Typography>
            </div>
            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Reason of report</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.reasonOfReport || 'NA'}</Typography>
            </div>


            {/* <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Free Appointment</Typography>
              {data?.patient?.freeAppointment || 'NA'}
            </div> */}

            {/* <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Wallet Points</Typography>
              {data?.points || 'NA'}
            </div> */}


          </CardContent>
        </Card>

        <Card component={motion.div} variants={item} className="mb-32 mr-14 w-auto">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">Contact</Typography>
          </div>

          <CardContent className="px-32 py-24">
            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Mobile</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.mobile || 'NA'}</Typography>
            </div>

            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Emails</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.email || 'NA'}</Typography>
            </div>
          </CardContent>
        </Card>

        <Card component={motion.div} variants={item} className="w-full  mr-24 mb-32">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">Clinic Details</Typography>
          </div>

          <CardContent className=" flex sm:flex-row flex-col flex-wrap px-32 py-24 justify-between">
            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Clinic Name</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.clinicId.name || 'NA'}</Typography>
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Clinic Mobile no.</Typography>
              <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.clinicId.mobile || 'NA'}</Typography>
            </div>
          </CardContent>
        </Card>

        {/* {_.get(data, 'patient.membershipPlanId') && <Card component={motion.div} variants={item} className="w-full  mr-24 mb-32">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">Subscribed Plan</Typography>
          </div>

          <CardContent className=" flex sm:flex-row flex-col flex-wrap px-32 py-24 justify-between">
            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Plan Name</Typography>
              {data?.patient?.membershipPlanId?.planName || 'NA'}
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Price including Gst</Typography>
              {data?.patient?.membershipPlanId?.priceWithGst || 'NA'}
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Free Appointment Slots</Typography>
              {data?.patient?.membershipPlanId?.appointmentSlot || 'NA'}
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Expiry Month</Typography>
              {data?.patient?.membershipPlanId?.expiryMonth || 'NA'}
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Maximum % off on medicine</Typography>
              {data?.patient?.membershipPlanId?.offPercentMedicine || 'NA'}
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Maximum off amount on medicine</Typography>
              {data?.patient?.membershipPlanId?.maxOffAmountMedicine || 'NA'}
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Maximum % off on test</Typography>
              {data?.patient?.membershipPlanId?.offPercentTest || 'NA'}
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Maximum off amount on test</Typography>
              {data?.patient?.membershipPlanId?.maxOffAmountTest || 'NA'}
            </div>

            <div className="grid-items">
              <Typography className="font-semibold mb-4 text-15">Description</Typography>
              {data?.patient?.membershipPlanId?.description?.replace(/<\/?[^>]+>/gi, '') || "NA"}
            </div>
          </CardContent>
        </Card>} */}
      </div>
      {/* {_.size(data?.family) > 0 && <> */}
        {/* <div className="flex justify-start pt-24 mb-12 ml-10">
          <Typography className="text-2xl font-semibold leading-tight">
            Family Details
          </Typography>
        </div> */}
        {/* <TableContainer component={Paper} className="mb-24 w-auto"> */}
          {/* <Table sx={{ minWidth: 650 }} aria-label="simple table"> */}
            {/* <TableHead>
              <TableRow sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}>
                <TableCell>Name</TableCell>
                {/* <TableCell>Gender</TableCell> */}
                {/* <TableCell>Age</TableCell> */}
                {/* <TableCell>Status</TableCell> */}
                {/* <TableCell>Mobile</TableCell> */}
                {/* <TableCell>Email</TableCell> */}
                {/* <TableCell>Relation</TableCell> */}
              {/* </TableRow> */}
            {/* </TableHead> } */}
            {/* <TableBody>
              {data?.family?.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.name || 'NA'}</TableCell>
                  {/* <TableCell>{row.gender}</TableCell> */}
                  {/* <TableCell>{row.age}</TableCell> */}
                  {/* <TableCell>{row.status}</TableCell> */}
                  {/* <TableCell>{row.mobile || 'NA'}</TableCell> */}
                  {/* <TableCell>{row.email}</TableCell> */}
                  {/* <TableCell>{row.relation || 'NA'}</TableCell> */}
                {/* </TableRow> */}
              {/* ))} */}
            {/* </TableBody> } */}
          {/* </Table>
        </TableContainer> */}
      {/* </>} */}
    </motion.div>
  );
}

export default AboutTab;       