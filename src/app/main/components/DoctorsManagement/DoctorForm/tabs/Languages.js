import { Select, FormControl, InputLabel, MenuItem, OutlinedInput, Chip, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { doctorAPIConfig } from 'src/app/main/API/apiConfig';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Languages(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [languageList, setLanguageList] = useState([]);

  useEffect(() => {
    axios.get(doctorAPIConfig.fetchLanguages, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setLanguageList(response.data.data);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    });
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    props.setSelectedLanguages(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  function getStyles(name, theme) {
    return {
      fontWeight:
        _.size(props.selectedLanguages) > 0 && props.selectedLanguages.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  return (
    <div>
      <FormControl sx={{ m: 0 }} fullWidth variant="outlined" color="secondary">
        <InputLabel id="language" style={{ backgroundColor: 'white', paddingRight: "6px" }}>Select Languages</InputLabel>
        {_.size(languageList) > 0 && <Select
          labelId="language"
          id="language"
          multiple
          value={props.selectedLanguages}
          onChange={handleChange}
          name="language"
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((chip) => (
                <Chip key={chip} label={chip} />
              ))}
            </Box>
          )}
          required
          MenuProps={MenuProps}
        >
          {languageList.map((name) => (
            <MenuItem
              key={name.key}
              value={name.value}
              style={getStyles(name, theme)}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>}
      </FormControl>
    </div>
  );
}

export default Languages;
