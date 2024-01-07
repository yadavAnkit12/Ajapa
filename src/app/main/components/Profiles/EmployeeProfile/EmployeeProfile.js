import FusePageSimple from '@fuse/core/FusePageSimple';
import { useThemeMediaQuery } from '@fuse/hooks';

import { styled } from '@mui/material/styles';
import { Avatar, Tab, Tabs, Typography, Box } from '@mui/material';

import axios from 'axios';

import { motion } from 'framer-motion';

import { useState, useEffect } from 'react'; 

import { useParams, useNavigate } from 'react-router-dom';

import { employeeAPIConfig } from 'src/app/main/API/apiConfig';
import AboutTab from './tabs/AboutTab';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    '& > .container': {
      maxWidth: '100%',
    },
  },
}));

function EmployeeProfile(props) {
  const routeParams = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [employeeID, setEmployeeID] = useState(null);
  const [employeeData, setEmployeeData] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const { employeeId } = routeParams;
    setEmployeeID(employeeId);
  }, [])

  useEffect(() => {
    if (employeeID) {

      axios.get(`${employeeAPIConfig.getUser}/${employeeID}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setEmployeeData(response.data.data);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  }, [employeeID])

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  const handleHomeClick = () => {
    navigate('/app/user')
  }

  return (
    <Root
      header={
        <div className="flex flex-col">
          <img
            className="h-160 lg:h-320 object-cover w-full"
            src="assets/images/pages/profile/employ.jpg"
            alt="Profile Cover"
          />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col lg:flex-row items-center max-w-5xl w-full mx-auto px-16 lg:h-72">
              <div className="-mt-96 lg:-mt-88 rounded-full">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1 } }}>
                  <Avatar
                    sx={{ borderColor: 'background.paper' }}
                    className="w-128 h-128 border-4"
                    src={employeeData?.image}
                    alt="User avatar"
                  />
                </motion.div>
              </div>

              <div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
                <Typography className="text-lg font-bold leading-none">{employeeData?.name}</Typography>
                <Typography color="text.secondary">{employeeData?.status}</Typography>
              </div>


              <div className="hidden lg:flex h-32 mx-32 border-l-2" />

              <div className="flex items-center mt-24 lg:mt-0 space-x-24">

                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="inherit"
                  variant="scrollable"
                  scrollButtons={false}
                  className="mx-4 my-8 min-h-40"
                  classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                  TabIndicatorProps={{
                    children: (
                      <Box
                        sx={{ bgcolor: 'text.disabled' }}
                        className="w-full h-full rounded-full opacity-20"
                      />
                    ),
                  }}
                >
                  <Tab
                    className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                    disableRipple
                    label="ABOUT"
                  />
                </Tabs>
              </div>
            </div>
            <div className="flex sm:mt-16 mx-24 lg:mt-0 space-x-24">
              <FuseSvgIcon size={32} style={{ color: "rgb(149, 156, 169)", cursor: 'pointer' }} onClick={handleHomeClick}>
                heroicons-outline:home
              </FuseSvgIcon>
            </div>
          </div>
        </div>
      }
      content={
        <div className="flex flex-auto justify-center w-full max-w-5xl mx-auto p-24 sm:p-32">
          {selectedTab === 0 && <AboutTab employeeData={employeeData} />}
        </div>
      }
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}

export default EmployeeProfile;        