import FuseLoading from '@fuse/core/FuseLoading';
import { Card, CardContent, Typography } from '@mui/material';

import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';

function AboutTab(props) {

  const [data, setData] = useState(null);
  
  useEffect(() => {

    if (props.doctorData) {
      setData(props.doctorData)
    }
  }, [props.doctorData]);

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
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Card component={motion.div} variants={item} className="w-full mb-32">
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
                <Typography className="font-semibold mb-4 text-15">Mobile</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.mobile || 'NA'}</Typography>
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Emails</Typography>

                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.email || 'NA'}</Typography>
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Birthday</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.dob || 'NA'}</Typography>
              </div>


              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Gender</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.gender || 'NA'}</Typography>
              </div>

              {/* <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Fees</Typography>
                {data?.doctor?.fee || 'NA'}
              </div> */}

              {/* <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Commission {data?.doctor?.commissionType === 'Percentage' ? '%' : 'Fee'}</Typography>
                {data?.doctor?.commission || 'NA'}
              </div> */}

              {/* <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Published Fees</Typography>
                {data?.doctor?.publishedFee || 'NA'}
              </div> */}

              {/* <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">About</Typography>
                {data?.doctor?.about || 'NA'}
              </div> */}

            </CardContent>
          </Card>



          <Card component={motion.div} variants={item} className="w-full mb-32">
            <div className="px-32 pt-24">
              <Typography className="text-2xl font-semibold leading-tight">Specilization</Typography>
            </div>

            <CardContent className="px-32 py-24">
              <div className="mb-24">
                {_.get(data, 'subSpecialization') && data.subSpecialization[0].split(",").map((item, idx) => (
                  <Typography key={idx} className="font-semibold mb-4 text-12 text-muted">{item || "NA"}</Typography>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:w-320">
          <Card component={motion.div} variants={item} className="w-full mb-32">
            <div className="px-32 pt-24">
              <Typography className="text-2xl font-semibold leading-tight">
                Professional  Information
              </Typography>
            </div>


            <CardContent className="px-32 py-24">

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Qualifications</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.qualifications || 'NA'}</Typography>
              </div>
              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Specilization</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.specialization || 'NA'}</Typography>
              </div>

              {/* <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Doctor Type</Typography>
                {data?.doctor?.doctorType || 'NA'}
              </div> */}

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">LicenseNo</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.licenseNo || 'NA'}</Typography>
              </div>
              {/* <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Category</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.category || 'NA'}</Typography>
              </div> */}

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Experience</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.experience || 'NA'}</Typography>
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Status</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.status || 'NA'}</Typography>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default AboutTab;