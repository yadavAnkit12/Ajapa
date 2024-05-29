import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function RootLevelTableHead(props) {
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
      id: 'readUser',
      align: 'center',
      disablePadding: false,
      label: 'Read User',
      sort: true,
      visibleIf: true
    },
    {
      id: 'updateUser',
      align: 'center',
      disablePadding: false,
      label: 'Update User',
      sort: true,
      visibleIf: true
    },
    {
      id: 'actionUser',
      align: 'center',
      disablePadding: false,
      label: 'Action User',
      sort: true,
      visibleIf: true
    },
    {
      id: 'createEvent',
      align: 'center',
      disablePadding: false,
      label: 'Create Event',
      sort: true,
      visibleIf: true
    },
    {
      id: 'readEvent',
      align: 'center',
      disablePadding: false,
      label: 'Read Event',
      sort: true,
      visibleIf: true
    },
    {
      id: 'updateEvent',
      align: 'center',
      disablePadding: false,
      label: 'Update Event',
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

export default RootLevelTableHead;