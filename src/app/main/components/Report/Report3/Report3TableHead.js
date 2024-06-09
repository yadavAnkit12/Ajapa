import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function Report3TableHead(props) {
  
  const rows = [
    {
      id: 'headName',
      align: 'center',
      disablePadding: false,
      label: 'Head Name',
      sort: true,
      visibleIf: true
    },
    {
      id: 'familyMemberName',
      align: 'center',
      disablePadding: false,
      label: 'Family Member Name',
      sort: true,
      visibleIf: true
    },
    {
      id: 'mobileNumber',
      align: 'center',
      disablePadding: false,
      label: 'Mobile Number',
      sort: true,
      visibleIf: true
    },
    {
      id: 'comingFrom',
      align: 'center',
      disablePadding: false,
      label: 'Coming From',
      sort: true,
      visibleIf: true
    },
    {
      id: 'arrivalDateTime',
      align: 'center',
      disablePadding: false,
      label: 'Arrival Date Time',
      sort: true,
      visibleIf: true
    },
  
    // {
    //   id: 'arrivalMode',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Arrival Mode',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'arrivalTrainDetails',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Arrival Train Details',
    //   sort: true,
    //   visibleIf: true
    // },
    {
      id: 'departureDateTime',
      align: 'center',
      disablePadding: false,
      label: 'Departure Date Time',
      sort: true,
      visibleIf: true
    },
    // {
    //   id: 'departureMode',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Departure Mode',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'departureTrainDetails',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Departure Train Details',
    //   sort: true,
    //   visibleIf: true
    // },
    {
      id: 'specialReq',
      align: 'center',
      disablePadding: false,
      label: 'Special Requirements',
      sort: true,
      visibleIf: true
    },
    {
      id: 'action',
      align: 'center',
      disablePadding: false,
      label: 'Action',
      sort: true,
      visibleIf: true
    }
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

export default Report3TableHead;