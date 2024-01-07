import { useTheme } from '@mui/material/styles';
import _ from '@lodash';
import { Box } from '@mui/system';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';


function CalendarAppEventContent(props) {
  const { eventInfo } = props;

  const theme = useTheme();

  const labels = [
    {
      "id": "1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc",
      "title": "Free slots",
      "color": "#419388",
      "disabled": false
    },
    {
      "id": "5dab5f7b-757a-4467-ace1-305fe07b11fe",
      "title": "Total Slots",
      "color": "#4151B0",
      "disabled": false
    },
    {
      "id": "09887870-f85a-40eb-8171-1b13d7a7f529",
      "title": "Off Day",
      "color": "#D63E63",
      "disabled": false
    },
    {
      "id": "74785900-f85a-40eb-7647-2b24d8a8f630",
      "title": "Booked Slot",
      "color": "#9F9F9F",
      "disabled": true
    }
  ]

  const labelId = eventInfo.event.extendedProps.label;

  const label = _.find(labels, { id: labelId });

  return (
    <Box
      sx={{
        backgroundColor: label?.color,
        color: label && theme.palette.getContrastText(label?.color),
      }}
      disabled={label.disabled}
      className={clsx('flex items-center w-full rounded-4 px-8 py-2 h-22 text-white')}
    >
      <Typography className="text-12 px-4 truncate">{eventInfo.event.title}</Typography>
    </Box>
  );
}

export default CalendarAppEventContent;
