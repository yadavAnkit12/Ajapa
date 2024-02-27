import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function FoodDetailsTableHead(props) {
  
  const rows = [
    {
      id: 'entryDate',
      align: 'center',
      disablePadding: false,
      label: 'Entry Date',
      sort: true,
      visibleIf: true
    },
    {
      id: 'timming',
      align: 'center',
      disablePadding: false,
      label: 'Timming',
      sort: true,
      visibleIf: true
    },
    {
      id: 'present',
      align: 'center',
      disablePadding: false,
      label: 'Present',
      sort: true,
      visibleIf: true
    },
    {
      id: 'foodTakenCount',
      align: 'center',
      disablePadding: false,
      label: 'Food Taken Count',
      sort: true,
      visibleIf: true
    },
    {
      id: 'totalCount',
      align: 'center',
      disablePadding: false,
      label: 'Total Count',
      sort: true,
      visibleIf: true
    }
  
    // {
    //   id: 'fromCity',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'From City',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'attendingShivir',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Attending Shivir',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'action',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Action',
    //   sort: true,
    //   visibleIf: true
    // }
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

export default FoodDetailsTableHead;