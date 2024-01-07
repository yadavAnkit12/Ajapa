import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveIcon from '@mui/icons-material/Remove';
import { red } from '@mui/material/colors';

import { Controller, useFormContext } from 'react-hook-form';

import { useState } from 'react';


function Scheduler(props) {
  const methods = useFormContext();
  const { control,formState } = methods;
  const {errors}=formState
  const [slotTime, setSlotTime] = useState(props?.slotTime);
  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

 

  const addRow = (day) => {
    let data = { ...props.schedular };
    data[day] = [...data[day], { start: null, end: null }];
    props.setSchedular(data);
  }

  const removeRow = (day) => {
    let data = { ...props.schedular };
    (data[day].length > 1) && data[day].pop();
    props.setSchedular(data);
  }

  const changeHandler = (day, value) => {
    let tempSchedularData = { ...props.schedular };
    if (value) {
      tempSchedularData[day] = [];
    } else {
      tempSchedularData[day] = [{ start: null, end: null }];
    }
    props.setSchedular(tempSchedularData);
  }

  const setDayTime = (day, type, index, time) => {
    if (time) {
      const hour = time.getHours();
      const minutes = time.getMinutes();
      const hour12 = (hour % 12) || 12; // Convert to 12-hour format
      const meridian = hour < 12 ? 'AM' : 'PM';   
      const timeString = `${hour12}:${minutes < 10 ? '0' : ''}${minutes} ${meridian}`;
      
      let data = { ...props.schedular };
      data[day][index][type] = timeString;
      props.setSchedular(data);
    }
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getTime = (day, key, type) => {
    if (props.schedular[day][key][type]) {
      const [time, meridian] = props.schedular[day][key][type].split(' ');
      let [hour, minutes, seconds] = time.split(':');
      let hourParsed = parseInt(hour, 10);
      if (meridian === 'PM' && hourParsed != 12) {
        hourParsed += 12;
      }
      return new Date().setHours(parseInt(hourParsed, 10), parseInt(minutes, 10), parseInt(seconds, 10));
    }
    return null;
  }

  return (
    <div>

      <Controller
        name="slotTime"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Time Slot"
            error={!!errors.slotTime}
            helperText={errors?.slotTime?.message}
            autoFocus
            id="slotTime"
            variant="outlined"
            fullWidth
          />
        )}
      />

      {weekDays.map((day, idx) => (
        <div className="-mx-6" key={idx}>
          <FormControlLabel control={<Checkbox onChange={(e) => changeHandler(day, e.target.checked)} checked={_.size(props.schedular[day]) === 0} />} label={`${capitalizeFirstLetter(day)} off`} />
          <IconButton color="success" disabled={_.size(props.schedular[day]) === 0} onClick={() => { addRow(day) }}>
            <AddBoxIcon />
          </IconButton>

          <IconButton sx={{ color: red[500] }} disabled={_.size(props.schedular[day]) === 0} onClick={() => { removeRow(day) }}>
            <RemoveIcon />
          </IconButton>
          {props.schedular[day].map((item, key) => (
            <div className="flex -mx-6" key={key}>
              <Controller
                name={`${day}_start_${key}`}
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    className="mt-8 mb-16 mx-4"
                    disabled={_.size(props.schedular[day]) === 0}
                    autoFocus
                    fullWidth
                    required
                    value={getTime(day, key, 'start')}
                    onChange={(time) => {
                      setDayTime(day, 'start', key, time);
                      field.onChange(time);
                    }}
                    label={`${capitalizeFirstLetter(day)} Start Time`}
                    inputFormat="hh:mm:ss"
                    ampm={true}
                    renderInput={(params) => <TextField {...params} />}
                  />
                )}
              />
              <Controller
                name={`${day}_end_${key}`}
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    className="mt-8 mb-16 mx-4"
                    disabled={_.size(props.schedular[day]) === 0}
                    fullWidth
                    label={`${capitalizeFirstLetter(day)} End Time`}
                    inputFormat="hh:mm:ss"
                    ampm={true}
                    value={getTime(day, key, 'end')}
                    required
                    onChange={(time) => {
                      setDayTime(day, 'end', key, time);
                      field.onChange(time);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />

                )}
              />
            </div>
          ))

          }

        </div>)
      )}
    </div>
  );
}

export default Scheduler;