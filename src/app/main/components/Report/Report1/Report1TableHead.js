import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function Report1TableHead(props) {
  
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
      id: 'families',
      align: 'center',
      disablePadding: false,
      label: 'Families',
      sort: true,
      visibleIf: true
    },
    {
      id: 'male',
      align: 'center',
      disablePadding: false,
      label: 'Male',
      sort: true,
      visibleIf: true
    },
    {
      id: 'female',
      align: 'center',
      disablePadding: false,
      label: 'Female',
      sort: true,
      visibleIf: true
    },
    {
      id: 'kids',
      align: 'center',
      disablePadding: false,
      label: 'Kids',
      sort: true,
      visibleIf: true
    },
  
    {
      id: 'seniors',
      align: 'center',
      disablePadding: false,
      label: 'Seniors',
      sort: true,
      visibleIf: true
    },
    {
      id: 'Total Users',
      align: 'center',
      disablePadding: false,
      label: 'Total Users',
      sort: true,
      visibleIf: true
    },
  ];
  

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  return (
    <TableHead >
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

export default Report1TableHead;