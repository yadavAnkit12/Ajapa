import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function AdminTableHead(props) {
  const rows = [
    {
      id: 'name',
      align: 'center',
      disablePadding: false,
      label: 'Name',
      sort: true,
      visibleIf: true
    },
    {
      id: 'email',
      align: 'center',
      disablePadding: false,
      label: 'Email',
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
    // {
    //   id: 'role',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Role',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'eventDate',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Event Date',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'shivirAvailable',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Shivir Available',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'eventstatus',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Event Status',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'registrationstatus',
    //   align: 'center',
    //   disablePadding: false,
    //   label: 'Registration Status',
    //   sort: true,
    //   visibleIf: true
    // },

    {
      id: 'action',
      align: 'center',
      disablePadding: false,
      label: 'Action',
      sort: true,
      // visibleIf: _.get(props, 'permission.read_data')
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

export default AdminTableHead;