import './EventStyles.css';

import { useState } from 'react';
import { connect } from 'react-redux';

import { Box, Button, TextField, Typography } from '@mui/material';

import { addNewEvent } from '../../Features/CSEvents.slice';
// import { addNewEvent } from '../../Features/CSEvents.actions';
import { CSEvent, EventOverview } from '../../Models/csEvent.model';
import { AddNewEventProps } from '../../Models/Props/CSEvent.props';

function mapDispatchToProps(dispatch: any) {
    return {
        addNewEvent: (event: CSEvent) => dispatch(addNewEvent(event))
    }
}

function AddNewEvent(props: AddNewEventProps) {
    const [eventOverview, setEventOverview] = useState<EventOverview>({} as EventOverview);

    const textChanged = (fieldName: string, fieldValue: string) => {
        setEventOverview({ ...eventOverview, [fieldName]: fieldValue });
    }

    const saveEvent = () => {
        props.addNewEvent({ overview: eventOverview, bouts: [] });
    }
    return (
        <>
            <Typography variant='h3' sx={{ marginBottom: '20px' }}>
                Create New Event
            </Typography>
            <Box className="addEventWrapper">
                <TextField
                    onChange={(ev) => { textChanged('date', ev.target.value) }}
                    variant='standard'
                    className='addEventTextField'
                    label='Event Date' />
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
                <TextField
                    onChange={(ev) => { textChanged('state', ev.target.value) }}
                    variant='standard'
                    className='addEventTextField'
                    sx={{ width: '100px' }}
                    label='State' />
                <TextField
                    onChange={(ev) => { textChanged('zip', ev.target.value) }}
                    variant='standard'
                    className='addEventTextField'
                    sx={{ width: "100px" }}
                    label='Zip' />
                <Button onClick={saveEvent} variant='contained' size='small' >Add Event</Button>
            </Box>
        </>
    );
}
export default connect(null, mapDispatchToProps)(AddNewEvent);