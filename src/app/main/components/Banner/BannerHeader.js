import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { Input, Paper, Typography, Button, Modal } from '@mui/material';
import { Box } from '@mui/system';

import { motion } from 'framer-motion';

import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import { useState } from 'react';

import { selectMembershipPlanSearchText, setMembershipPlanSearchText } from '../../../store/reduxSlice/membershipSlice';

import BannerRegistrationForm from './BannerRegistrationForm';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
    maxWidth: '1200px',
    maxHeight: '650px',
    minWidth: '450px',
    overflow: 'auto'
};

function BannerHeader(props) {
    const dispatch = useDispatch();
    const searchText = useSelector(selectMembershipPlanSearchText);

    const [open, setOpen] = useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
            <Typography
                component={motion.span}
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 0.2 } }}
                delay={300}
                className="text-24 md:text-32 font-extrabold tracking-tight"
            >
                Banner Plans
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
                        placeholder="Search Banner"
                        className="flex flex-1"
                        disableUnderline
                        fullWidth
                        value={searchText}
                        inputProps={{
                            'aria-label': 'Search',
                        }}
                        onChange={(ev) => dispatch(setMembershipPlanSearchText(ev))}
                    />
                    {searchText && <FuseSvgIcon
                        color="disabled"
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => dispatch(setMembershipPlanSearchText(null))
                        }>
                        heroicons-solid:x
                    </FuseSvgIcon>
                    }
                </Paper>
                {props?.permission?.create_data && <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                >
                    <Button
                        className=""
                        component={Link}
                        onClick={handleClickOpen}
                        variant="contained"
                        color="secondary"
                        startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                    >
                        Add
                    </Button>
                </motion.div>}
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <BannerRegistrationForm setOpen={setOpen} open={open} setChange={props.setChange} change={props.change} />

                </Box>
            </Modal>

        </div>
    );
}

export default BannerHeader;