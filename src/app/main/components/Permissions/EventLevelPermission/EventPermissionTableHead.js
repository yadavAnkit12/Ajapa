import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function EventPermissionTableHead(props) {
  const rows = [

    {
      id: 'email',
      align: 'center',
      disablePadding: false,
      label: 'Email',
      sort: true,
      visibleIf: true
    },
    {
      id: 'eventName',
      align: 'center',
      disablePadding: false,
      label: 'Event Name',
      sort: true,
      visibleIf: true
    },
    {
      id: 'cancreateFood',
      align: 'center',
      disablePadding: false,
      label: 'Create Food',
      sort: true,
      visibleIf: true
    },
    {
      id: 'canreadAttendance',
      align: 'center',
      disablePadding: false,
      label: 'Read Attendance',
      sort: true,
      visibleIf: true
    },
    {
      id: 'canreadEventRegistration',
      align: 'center',
      disablePadding: false,
      label: 'Read Event Registration',
      sort: true,
      visibleIf: true
    },
    {
      id: 'canreadFood',
      align: 'center',
      disablePadding: false,
      label: 'Read Food',
      sort: true,
      visibleIf: true
    },
    {
      id: 'canreadReport',
      align: 'center',
      disablePadding: false,
      label: 'Read Report',
      sort: true,
      visibleIf: true
    },
    {
      id: 'cansendSMS',
      align: 'center',
      disablePadding: false,
      label: 'Send SMS',
      sort: true,
      visibleIf: true
    },
    {
      id: 'canupdateAttendance',
      align: 'center',
      disablePadding: false,
      label: 'Update Attendance',
      sort: true,
      visibleIf: true
    },
 
    {
      id: 'action',
      align: 'center',
      disablePadding: false,
      label: 'Action',
      sort: true,
      visibleIf:true
    },
 
  ];

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row) => {
          if (row.visibleIf)
            return (
              <TableCell
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? lighten(theme.palette.background.default, 0.4)
                      : lighten(theme.palette.background.default, 0.02),
                }}
                className="p-4 md:p-16"
                key={row.id}
                align={row.align}
                padding={row.disablePadding ? 'none' : 'normal'}
                sortDirection={props.order.id === row.id ? props.order.direction : false}
              >
                {row.sort && (
                  <Tooltip
                    title="Sort"
                    placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={props.order.id === row.id}
                      direction={props.order.direction}
                      onClick={createSortHandler(row.id)}
                      className="font-semibold"
                    >
                      {row.label}
                    </TableSortLabel>
                  </Tooltip>
                )}
              </TableCell>
            );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default EventPermissionTableHead;