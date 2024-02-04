import './EventStyles.css';

import { useState } from 'react';
import { connect } from 'react-redux';

import {
    Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { addBoutToEvent, addNewEvent, SelectEventBouts } from '../../Features/CSEvents.slice';
// import { addNewEvent } from '../../Features/CSEvents.actions';
import { Bout, CSEvent, EventOverview } from '../../Models/csEvent.model';
import { AddNewEventProps } from '../../Models/Props/CSEvent.props';
import { USStates } from '../utils/USStates';
import AddNewBout from './AddNewBout';
import BoutListItem from './BoutListItem';

function mapStateToProps(state: any) {
    return {
        getEventBouts: SelectEventBouts(state)
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
        addNewEvent: (event: CSEvent) => dispatch(addNewEvent(event)),
        addNewBoutToBout: (bout: Bout) => dispatch(addBoutToEvent(bout))
    }
}

function AddNewEvent(props: AddNewEventProps) {
    const [eventOverview, setEventOverview] = useState<EventOverview>({} as EventOverview);
    const [eventBouts, setEventBouts] = useState<Bout[]>([]);
    const [eventSaved, setEventSaved] = useState<boolean>(false);

    const dateChanged = (dateValue: any) => {
        const dVal = new Date(dateValue.toString());
        console.log('dateValue: ', dVal.toString());
        setEventOverview({ ...eventOverview, date: dVal.toString() });
    }

    const textChanged = (fieldName: string, fieldValue: string) => {
        setEventOverview({ ...eventOverview, [fieldName]: fieldValue });
    }
    const usStateChenaged = (ev: SelectChangeEvent) => {
        console.log(ev.target.value);
    }

    const saveEvent = () => {
        console.log('DATE: ', eventOverview.date);
        console.log('EVENT NAME: ', eventOverview.eventName);
        console.log('PROMOTER: ', eventOverview.promoter);
        console.log('PROMOTER: ', eventOverview.location);
        if ((eventOverview.date !== '' && eventOverview.eventName !== '' && eventOverview.promoter !== '' && eventOverview.location !== '') &&
            (eventOverview.date !== undefined && eventOverview.eventName !== undefined && eventOverview.promoter !== undefined && eventOverview.location !== undefined)) {
            setEventSaved(true);
        }
        props.addNewEvent({ overview: eventOverview, bouts: [] });
    }

    return (
        <>
            <Typography variant='h4' sx={{ marginBottom: '20px' }}>
                {eventSaved ? eventOverview.eventName : 'Create New Event'}
            </Typography>
            <>
                {
                    eventSaved ?
                        <Box>
                            <Box>
                                <Typography variant="body1"><strong>Promoter: </strong> {eventOverview.promoter}</Typography>
                                <Typography variant="body1"><strong>Location: </strong> {eventOverview.location}</Typography>
                            </Box>
                        </Box> :
                        <Box>
                            <Box className="addEventWrapper">
                                <DatePicker
                                    label='Event Date'
                                    onChange={(ev) => { dateChanged(ev) }} />
                                <TextField
                                    onChange={(ev) => { textChanged('eventName', ev.target.value) }}
                                    variant='standard'
                                    className='addEventTextField'
                                    label='EventName' />
                                <TextField
                                    onChange={(ev) => { textChanged('promoter', ev.target.value) }}
                                    variant='standard'
                                    className='addEventTextField'
                                    label='Promoter' />
                                <TextField
                                    onChange={(ev) => { textChanged('location', ev.target.value) }}
                                    variant='standard'
                                    className='addEventTextField'
                                    label='Event Location' />
                            </Box>
                            <Box className="addEventWrapper">
                                <TextField
                                    onChange={(ev) => { textChanged('address', ev.target.value) }}
                                    variant='standard'
                                    className='addEventTextField'
                                    label='Event Address' />
                                <TextField
                                    onChange={(ev) => { textChanged('city', ev.target.value) }}
                                    variant='standard'
                                    className='addEventTextField'
                                    label='City' />
                                <Box sx={{ width: 180 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id='usStates-select-label'>State</InputLabel>
                                        <Select labelId='usStates-select-label'
                                            variant='standard'
                                            id='usStateSelector'
                                            label="State"
                                            onChange={usStateChenaged}>
                                            {USStates.map((usState) => (<MenuItem value={usState.value}>{usState.name}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <TextField
                                    onChange={(ev) => { textChanged('zip', ev.target.value) }}
                                    variant='standard'
                                    className='addEventTextField'
                                    sx={{ width: "160px" }}
                                    label='Zip' />
                                <Button onClick={saveEvent} variant='contained' size='small' >Save</Button>
                            </Box>
                        </Box>
                }
            </>
            {/* ADD BOUT*/}
            {

                eventSaved ? <>
                    <AddNewBout />
                    <Typography variant='h4' sx={{ textAlign: 'center' }}>Bouts</Typography>
                    {
                        props.getEventBouts.map((bout) => (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '5px', margin: '5px 0px', borderBottom: '1px solid #ddf' }}>
                                <BoutListItem {...bout.redCorner} />
                                <Box>
                                    <Typography variant='h6'>VS.</Typography>
                                    <Typography variant='body2'>{`${bout.roundCount} RDS`}</Typography>
                                    <Typography variant='body2'>{`${bout.maxWeight} LBS`}</Typography>
                                    <Typography variant='body2'>{`${bout.boutType}`}</Typography>
                                </Box>
                                <BoutListItem {...bout.blueCorner} />
                            </Box>
                        ))
                    }
                </> : <></>
            }
            <Button variant='contained' color='success' onClick={() => { }}>Finish</Button>
            {/* <Box className="currentBoutWrapper">
                <TotalStrikes />
            </Box> */}
        </>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(AddNewEvent);