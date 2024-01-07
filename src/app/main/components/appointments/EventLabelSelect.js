import { InputLabel, FormControl, Select } from '@mui/material';
import { forwardRef } from 'react';

const EventLabelSelect = forwardRef((props, ref) => {
  const { value, onChange, className } = props;

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth className={className}>
      <InputLabel id="select-label">Label</InputLabel>
      <Select
        labelId="select-label"
        id="label-select"
        value={value}
        label="Label"
        onChange={handleChange}
        ref={ref}
        classes={{ select: 'flex items-center space-x-12' }}
      >
      </Select>
    </FormControl>
  );
});

export default EventLabelSelect;
