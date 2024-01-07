import { useState } from 'react';
import { Menu, MenuItem, ListItemText, Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const viewNamesObj = {
  dayGridMonth: {
    title: 'Month',
    icon: 'view_module',
    value: 'monthly'
  },
  timeGridWeek: {
    title: 'Week',
    icon: 'view_week',
    value: 'weekly'
  },
  timeGridDay: {
    title: 'Day',
    icon: 'view_agenda',
    value: 'daily'
  },
};

function CalendarViewMenu(props) {
  const { className, calendarApi, currentDate } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={className}>
      <Button
        sx={{ minWidth: 120 }}
        className="rounded-6 justify-between"
        id="view-select-button"
        aria-controls="view-select-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        endIcon={<FuseSvgIcon size={16}>heroicons-outline:chevron-down</FuseSvgIcon>}
      >
        {viewNamesObj[currentDate?.view.type]?.title}
      </Button>
      <Menu
        id="view-select-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'view-select-button',
        }}
      >
        {Object.entries(viewNamesObj).map(([name, view]) => (
          <MenuItem
            key={name}
            onClick={() => {
              calendarApi().changeView(name);
              props.setGetEvents(view.value)
              handleClose();
            }}
          >
            <ListItemText primary={view.title} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default CalendarViewMenu;