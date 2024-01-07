import * as React from 'react';
import _ from '@lodash';
import axios from 'axios';
import { Modal, Table, TableBody, TableCell, TablePagination, TableRow, Typography, IconButton, Box, Button } from '@mui/material';
;
import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef,useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Dialog, DialogActions, DialogTitle, Slide } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import { selectSymptoms, selectSymptomsSearchText } from '../../../store/reduxSlice/symptomSlice';
import SymptomTableHead from './SympotmTableHead';
import SymptomForm from './SymptomForm';

import { symptomAPIConfig } from '../../API/apiConfig';
import SymptomConfig from './SymptomConfig';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxWidth: '1200px',
  maxHeight: '650px',
  overflow: 'auto'
};


function SymptomTable(props) {

  const dispatch = useDispatch();

  const products = useSelector(selectSymptoms);
  const searchText = useSelector(selectSymptomsSearchText);

  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(products);
  const tableRef=useRef(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [symptomId, setSymptomId] = useState("");
  const [deleteId, setDeleteId] = useState("")

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(

        _.filter(products, (item) => {

          return (item.name != "" && item.name != undefined) ? item.name.toLowerCase().includes(searchText.toLowerCase()) : []

        })
      );
      setPage(0);
    } else {
      setData(products);
    }
  }, [products, searchText]);

  const handleEditOpen = (symptomId) => {
    setSymptomId(symptomId);
    setOpenEdit(true);
  };

  const handleClickOpen = (symptomId) => {
    setOpen(true);
    setDeleteId(symptomId);
  };

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleChangePage(event, value) {
    setPage(value);
    tableRef.current && tableRef.current.scrollIntoView();

  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    tableRef.current && tableRef.current.scrollIntoView();

  }

  function deleteSymptom() {
    axios.delete(`${symptomAPIConfig.delete}/${deleteId}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setOpen(false);
        props.setChange(!props.change);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no symptoms!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <SymptomTableHead
          selectedProductIds={selected}
          order={order}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
          permission={props.permission}
        />

        <TableBody>
          {_.orderBy(data, [(o) => {
            switch (order.id) {
              case 'categories': {
                return o.categories[0];
              }
              default: {
                return o[order.id];
              }
            }
          },
          ],
            [order.direction]
          )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((n) => {
              const isSelected = selected.indexOf(n.id) !== -1;
              return (
                <TableRow
                  className="h-72 cursor-pointer"
                  hover
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={n.id}
                  selected={isSelected}
                  style={{ cursor: 'default' }}
                >

                  <TableCell className="p-4 md:p-12" component="th" scope="row">
                    {n.name}
                  </TableCell>

                  <TableCell className="p-4 md:p-12" component="th" scope="row">
                    <img src={n.image} alt={n.name} style={{ width: '100px', height: '100px' }} />

                  </TableCell>
                  {props?.permission?.update_data && <TableCell className="p-4 md:p-12" component="th" scope="row" align="left">
                    <IconButton aria-label="edit" color="success" onClick={() => { handleEditOpen(n.id) }}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>}

                  {props?.permission?.delete_data && <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    <IconButton aria-label="delete" color="error" onClick={() => { handleClickOpen(n.id) }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>}
                </TableRow>
              );
            })}
        </TableBody>

      </Table>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Do you want to delete this symptom?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>No</Button>
          <Button onClick={deleteSymptom} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {openEdit && <SymptomForm symptomId={symptomId} setChange={props.setChange} change={props.change} setOpen={setOpenEdit} />}
        </Box>
      </Modal>

    </div >
  );
}

export default withRouter(SymptomTable);







