
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Input, Paper, Typography, TextField, Button, Autocomplete } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectLabPartnerPlanSearchText, setLabPartnerPlanSearchText } from '../../../store/reduxSlice/labPartnerSlice';
import { PRODUCTFEATURED, PRODUCTSTATUS } from '../../Static/filterLists';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ProductHeader(props) {
    const dispatch = useDispatch();
    const searchText = useSelector(selectLabPartnerPlanSearchText);
    const [filterData, setFilterData] = useState({
        fromDate: '',
        toDate: '',
        status: null,
        featured: null
    });

    const filterProductData = () => {
        props.setFilterValue(filterData);
    }

    const clearFilters = () => {
        setFilterData({
            fromDate: '',
            toDate: '',
            status: null,
            featured: null
        });
        props.setFilterValue(null);
    }


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
                    Product

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
                            placeholder="Search Product"
                            className="flex flex-1"
                            disableUnderline
                            fullWidth
                            value={searchText}
                            inputProps={{
                                'aria-label': 'Search',
                            }}
                            onChange={(ev) => dispatch(setLabPartnerPlanSearchText(ev))}
                        />
                        {searchText && <FuseSvgIcon
                            color="disabled"
                            size={16}
                            style={{ cursor: "pointer" }}
                            onClick={() => dispatch(setLabPartnerPlanSearchText(null))
                            }>
                            heroicons-solid:x
                        </FuseSvgIcon>
                        }
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
                    {_.size(PRODUCTFEATURED) > 0 && <Autocomplete
                        disablePortal
                        value={filterData.featured}
                        id="featured"
                        name="featuredFilter"
                        options={PRODUCTFEATURED}
                        getOptionLabel={option => option.name}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={(e, newValue) => setFilterData({ ...filterData, featured: newValue })}
                        renderInput={(params) => <TextField {...params} label="Featured" variant="standard" />}

                    />}
                    {_.size(PRODUCTSTATUS) > 0 && <Autocomplete
                        disablePortal
                        value={filterData.status}
                        id="status"
                        options={PRODUCTSTATUS}
                        getOptionLabel={option => option.name}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue })}
                        renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
                    />}
                </div>
                <div className="flex flex-row justify-end"></div>
                <div className="flex flex-row justify-end">
                    <Button
                        component={Link}
                        onClick={filterProductData}
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

        </div>
    );
}

export default ProductHeader;