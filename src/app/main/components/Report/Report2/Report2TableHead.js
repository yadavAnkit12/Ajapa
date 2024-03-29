import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function Report2TableHead(props) {
  
  const rows = [
    {
      id: 'date',
      align: 'center',
      disablePadding: false,
      label: 'Date',
      sort: true,
      visibleIf: true
    },
    {
      id: 'timeslot',
      align: 'center',
      disablePadding: false,
      label: 'Time Slot',
      sort: true,
      visibleIf: true
    },
    {
      id: 'modeOfTransport',
      align: 'center',
      disablePadding: false,
      label: 'Mode Of Transport',
      sort: true,
      visibleIf: true
    },
    {
      id: 'trainDetails',
      align: 'center',
      disablePadding: false,
      label: 'Train Details',
      sort: true,
      visibleIf: true
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

export default Report2TableHead;