import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function AppointmentsTableHead(props) {

  const rows = [
    {
      id: 'appointmentNo',
      align: 'left',
      disablePadding: false,
      label: 'Appointment No .',
      sort: true,
      visibleIf: true
    },
    {
      id: 'patientMobile',
      align: 'left',
      disablePadding: false,
      label: ' Patient Mobile',
      sort: true,
      visibleIf: true
    },

    {
      id: 'doctorName',
      align: 'left',
      disablePadding: false,
      label: 'Doctor Name',
      sort: true,
      visibleIf: true
    },
    {
      id: 'appointmentdate',
      align: 'left',
      disablePadding: false,
      label: 'Appointment Date',
      sort: true,
      visibleIf: true
    },
    {
      id: 'slot',
      align: 'left',
      disablePadding: false,
      label: 'Slot',
      sort: true,
      visibleIf: true
    },
    {
      id: 'status',
      align: 'left',
      disablePadding: false,
      label: 'Status',
      sort: true,
      visibleIf: true
    },
    {
      id: 'reschedule',
      align: 'left',
      disablePadding: false,
      label: 'Re-Schedule',
      sort: true,
      visibleIf: true
    },
    {
      id: 'view',
      align: 'left',
      disablePadding: false,
      label: 'View',
      sort: true,
      visibleIf: _.get(props, 'permission.read_data')
    },
    {
      id: 'action',
      align: 'left',
      disablePadding: false,
      label: 'Action',
      sort: true,
      visibleIf: _.get(props, 'permission.update_data')
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

export default AppointmentsTableHead;