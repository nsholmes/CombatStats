import { Fragment, useState } from 'react';
import { connect } from 'react-redux';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography
} from '@mui/material';

import { SelectAllEvents } from '../Features/CSEvents.slice';
import { CSEvent } from '../Models/csEvent.model';

function EventRow(props: { row: CSEvent }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}> {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.overview.date}</TableCell>
        <TableCell>{row.overview.eventName}</TableCell>
        <TableCell>{row.overview.promoter}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Box>
                <Typography>{row.overview.address}</Typography>
                <Typography>{row.overview.city} {row.overview.state} {row.overview.zip}</Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}


function mapStateToProps(state: any) {
  return {
    getCSEvents: SelectAllEvents(state),
  }
}

type EventsProps = {
  getCSEvents: CSEvent[]
}



function Events(props: EventsProps) {
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: '20px' }}>
        Events
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell> - </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Promoter</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.getCSEvents.length > 0 ?
                props.getCSEvents.map((row, idx) => {
                  return (
                    <EventRow key={`evtRow${idx}`} row={row} />
                  )
                }) : <></>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default connect(mapStateToProps, null)(Events);