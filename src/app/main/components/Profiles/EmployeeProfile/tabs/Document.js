import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { ImageListItem, ImageListItemBar, IconButton, ListSubheader, Typography } from '@mui/material/Typography';

import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';

function Document(props) {
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
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">

          <div className="mb-48">
            <ListSubheader
              component={motion.div}
              variants={item}
              className="flex items-center px-0 mb-24 bg-transparent"
            >
              <Typography className="text-2xl font-semibold leading-tight">
                {data.patient.name}
              </Typography>
              <Typography className="mx-12 font-medium leading-tight" color="text.secondary">
                {data.ehr.length}
              </Typography>
            </ListSubheader>

            <div className="overflow-hidden flex flex-wrap -m-8">
              {data.ehr.map((media) => (
                <div className="w-full sm:w-1/2 md:w-1/4 p-8" key={media.preview}>
                  <ImageListItem
                    component={motion.div}
                    variants={item}
                    className="w-full rounded-16 shadow overflow-hidden"
                  >
                    <img src={media.report} alt={media.tag} width={200} height={200} />
                    <ImageListItemBar
                      title={media.report}
                      actionIcon={
                        <IconButton size="large">
                          <FuseSvgIcon className="text-white opacity-75">
                            heroicons-outline:information-circle
                          </FuseSvgIcon>
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Document;