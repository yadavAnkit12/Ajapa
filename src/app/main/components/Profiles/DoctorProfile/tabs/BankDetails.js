import { Card, CardContent, Typography } from '@mui/material';

import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';

function BankDetails(props) {

    const [data, setData] = useState(null);

    useEffect(() => {
        if (props.doctorData && props.doctorData.doctor.bankDetails) {
            setData(props.doctorData.doctor.bankDetails);
        }
    }, [props.doctorData]);

    if (!data) {
        return null;
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
                                Bank Details
                            </Typography>
                        </div>

                        <CardContent className="px-32 py-24">

                            <div className="mb-24">
                                <Typography className="font-semibold mb-4 text-15">Account Number</Typography>
                                {data?.accountNumber || 'NA'}
                            </div>

                            <div className="mb-24">
                                <Typography className="font-semibold mb-4 text-15">Bank Name</Typography>
                                {data?.bankName || 'NA'}
                            </div>

                            <div className="mb-24">
                                <Typography className="font-semibold mb-4 text-15">Branch Name</Typography>
                                {data?.branch || 'NA'}

                            </div>

                            <div className="mb-24">
                                <Typography className="font-semibold mb-4 text-15">IFSC</Typography>
                                {data?.IFSC || 'NA'}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}

export default BankDetails;