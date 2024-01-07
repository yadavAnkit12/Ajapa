import { Card, CardContent, Typography } from '@mui/material';

import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { employeeAPIConfig } from 'src/app/main/API/apiConfig';
import FuseLoading from '@fuse/core/FuseLoading';

function AboutTab(props) {
  const [data, setData] = useState(null);
  const [roleList, setRoleList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(employeeAPIConfig.fetch, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setRoleList(response.data.data);
      } else {
        setRoleList([]);
      }
    });
  }, []);

  useEffect(() => {
    if (props.employeeData) {
      setData(props.employeeData)
    }
  }, [props.employeeData]);

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

  const getRole = (roleId) => {
    if (roleId) {
      return roleList.find((role) => role._id === roleId).role;
    }
    return '';
  }

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
                <Typography className="font-semibold mb-4 text-15">Gender</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.gender || 'NA'}</Typography>
              </div>
              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Age</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{data?.age || 'NA'}</Typography>
              </div>
              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Role</Typography>
                <Typography className='font-semibold mb-4 text-12 text-muted'>{getRole(data?.roleID) || 'NA'}</Typography>     
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:w-320">
          <Card component={motion.div} variants={item} className="w-full mb-32">
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
        </div>
      </div>
    </motion.div>
  );
}

export default AboutTab;