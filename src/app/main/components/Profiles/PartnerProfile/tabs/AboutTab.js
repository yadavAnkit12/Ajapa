import FuseLoading from '@fuse/core/FuseLoading';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';

function AboutTab(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (props.partnerData) {
      setData(props.partnerData)
    }
  }, [props.partnerData]);

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
                Clinic Information
              </Typography>
            </div>

            <CardContent className="px-32 py-24">
              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Name</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.name || 'NA'}</Typography>
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Email</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.email || 'NA'}</Typography>
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Mobile</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.mobile || 'NA'}</Typography>
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">license No.</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.licenseNo || 'NA'}</Typography>
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">GST No.</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.gstNo || 'NA'}</Typography>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default AboutTab;