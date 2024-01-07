import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import * as React from 'react';

function BankDetails(props) {
    const methods = useFormContext();
    const { control, formState } = methods;
    const { errors } = formState;

    return (
        <div>
            <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        className="mt-8 mb-16"
                        error={!!errors.bankName}
                        required
                        helperText={errors?.bankName?.message}
                        label="Bank Name"
                        autoFocus
                        id="bankName"
                        variant="outlined"
                        fullWidth
                    />
                )}
            />


            <Controller
                name="accountNumber"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        className="mt-8 mb-16"
                        error={!!errors.accountNumber}
                        required
                        helperText={errors?.accountNumber?.message}
                        label="Account Number"
                        autoFocus
                        id="accountNumber"
                        variant="outlined"
                        fullWidth
                    />
                )}
            />


            <Controller
                name="IFSC"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        className="mt-8 mb-16"
                        error={!!errors.IFSC}
                        required
                        helperText={errors?.IFSC?.message}
                        label="IFSC"
                        autoFocus
                        id="IFSC"
                        variant="outlined"
                        fullWidth
                    />
                )}
            />

            <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        className="mt-8 mb-16"
                        error={!!errors.branch}
                        required
                        type="branch"
                        helperText={errors?.branch?.message}
                        label="Branch"
                        id="branch"
                        variant="outlined"
                        fullWidth
                    />
                )}
            />
        </div >
    );
}

export default BankDetails;  