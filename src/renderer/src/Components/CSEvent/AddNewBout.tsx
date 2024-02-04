import { useState } from 'react';
import { connect } from 'react-redux';

import { Box, Button, TextField } from '@mui/material';

import { addBoutToEvent } from '../../Features/CSEvents.slice';
import { Bout, Fighter } from '../../Models/csEvent.model';

type NewBoutProps = {
    addBoutToEvent: (csBout: Bout) => void;
}

const initFighter: Fighter = {
    firstName: "",
    lastName: "",
    dob: "",
    weight: 0,
    city: "",
    state: "",
    gym: "",
    record: { wins: 0, loses: 0 }
}


function mapStateToProps(state: any) {
    return {}
}
function mapDispatchToProps(dispatch: any) {
    return {
        addBoutToEvent: (csBout: Bout) => dispatch(addBoutToEvent(csBout))
    }
}
function AddNewBout(props: NewBoutProps) {
    const [redFighter, setRedFighter] = useState<Fighter>(initFighter);
    const [blueFighter, setBlueFighter] = useState<Fighter>(initFighter);
    const [roundCount, setRoundCount] = useState<number>(0);
    const [maxWeight, setMaxWeight] = useState<number>(0);
    const [boutType, setBoutType] = useState<string>("");
    const updateRedFighter = (propName: string, propValue: string) => {
    }

    const addBoutClicked = () => {
        console.log('redFighter: ', redFighter);
        console.log('blueFighter: ', blueFighter);
        props.addBoutToEvent({ redCorner: redFighter, blueCorner: blueFighter, roundCount, maxWeight, boutType })
        setBlueFighter(initFighter);
        setRedFighter(initFighter);
        setRoundCount(0);
        setMaxWeight(0);
        setBoutType("");
    }

    const updateFirstName = (corner: string, val: string) => {
        console.log(`First Name: ${corner} ${val}`);
        if (corner === 'red') {
            setRedFighter({ ...redFighter, firstName: val })
        } else if (corner === 'blue') {
            setBlueFighter({ ...blueFighter, firstName: val })
        }
    }
    const updateLastName = (corner: string, val: string) => {
        console.log(`Last Name: ${corner} ${val}`);
        if (corner === 'red') {
            setRedFighter({ ...redFighter, lastName: val })
        } else if (corner === 'blue') {
            setBlueFighter({ ...blueFighter, lastName: val })
        }
    }
    const updateDOB = (corner: string, val: string) => {
        console.log(`DOB: ${corner} ${val}`);
        if (corner === 'red') {
            setRedFighter({ ...redFighter, dob: val });
        } else if (corner === 'blue') {
            setBlueFighter({ ...blueFighter, dob: val })
        }
    }


    const updateRecord = (corner: string, section: 'wins' | 'loses', val: string) => {
        if (corner === 'red') {
            section === 'wins' ?
                setRedFighter({ ...redFighter, record: { ...redFighter.record, wins: parseInt(val) } }) :
                setRedFighter({ ...redFighter, record: { ...redFighter.record, loses: parseInt(val) } });
        } else if (corner === 'blue') {
            section === 'wins' ?
                setBlueFighter({ ...blueFighter, record: { ...blueFighter.record, wins: parseInt(val) } }) :
                setBlueFighter({ ...blueFighter, record: { ...blueFighter.record, loses: parseInt(val) } });
        }
    }
    const updateCity = (corner: string, val: string) => {
        console.log(`City: ${corner} ${val}`);
        if (corner === 'red') {
            setRedFighter({ ...redFighter, city: val })
        } else if (corner === 'blue') {
            setBlueFighter({ ...blueFighter, city: val })
        }
    }
    const updateState = (corner: string, val: string) => {
        console.log(`State: ${corner} ${val}`);
        if (corner === 'red') {
            setRedFighter({ ...redFighter, state: val });
        } else if (corner === 'blue') {
            setBlueFighter({ ...blueFighter, state: val });
        }
    }
    const updateWeight = (corner: string, val: number) => {
        console.log(`Weight: ${corner} ${val}`);
        if (corner === 'red') {
            setRedFighter({ ...redFighter, weight: val })
        } else if (corner === 'blue') {
            setBlueFighter({ ...blueFighter, weight: val })
        }
    }


    return (
        <>
            <Box sx={{ backgroundColor: '#ddd', padding: '5px' }}>
                <Box sx={{ color: "#be0000", textAlign: "left", display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    <TextField
                        sx={{ backgroundColor: '#fff', }}
                        value={redFighter.firstName}
                        label='First Name'
                        InputLabelProps={{ style: { color: '#be0000', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#be0000' } }}
                        onChange={(ev) => updateFirstName("red", ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', }}
                        value={redFighter.lastName}
                        label='Last Name'
                        InputLabelProps={{ style: { color: '#be0000', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#be0000' } }}
                        onChange={(ev) => updateLastName("red", ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', }}
                        value={redFighter.dob} type='date'
                        InputLabelProps={{ style: { color: '#be0000', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#be0000' } }}
                        onChange={(ev) => updateDOB('red', ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', width: '100px' }}
                        value={`${redFighter.record.wins}`}
                        type='number'
                        label='Wins'
                        InputLabelProps={{ style: { color: '#be0000', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#be0000' } }}
                        onChange={(ev) => updateRecord('red', 'wins', ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', width: '100px' }}
                        value={`${redFighter.record.loses}`}
                        type='number'
                        label='Loses'
                        InputLabelProps={{ style: { color: '#be0000', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#be0000' } }}
                        onChange={(ev) => updateRecord('red', 'loses', ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', }}
                        value={redFighter.city}
                        label='City'
                        InputLabelProps={{ style: { color: '#be0000', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#be0000' } }}
                        onChange={(ev) => { updateCity('red', ev.target.value) }} />
                    <TextField
                        sx={{ backgroundColor: '#fff', width: '100px' }}
                        value={redFighter.state}
                        label='State'
                        InputLabelProps={{ style: { color: '#be0000', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#be0000' } }}
                        onChange={(ev) => { updateState('red', ev.target.value) }} />
                    <TextField
                        sx={{ backgroundColor: '#fff', width: '115px' }}
                        value={redFighter.weight}
                        type='number'
                        label='Weight'
                        InputLabelProps={{ style: { color: '#be0000', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#be0000' } }}
                        onChange={(ev) => { updateWeight('red', parseFloat(ev.target.value)) }} />
                </Box>
                <Box sx={{ marginTop: '10px', color: "#be0000", textAlign: "left", display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    <TextField
                        sx={{ backgroundColor: '#fff', }}
                        value={blueFighter.firstName}
                        label='First Name'
                        InputLabelProps={{ style: { color: '#00468b', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#00468b' } }}
                        onChange={(ev) => updateFirstName("blue", ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', }}
                        value={blueFighter.lastName}
                        label='Last Name'
                        InputLabelProps={{ style: { color: '#00468b', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#00468b' } }}
                        onChange={(ev) => updateLastName("blue", ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', }}
                        value={blueFighter.dob} type='date'
                        InputLabelProps={{ style: { color: '#00468b', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#00468b' } }}
                        onChange={(ev) => updateDOB('blue', ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', width: '100px' }}
                        value={`${blueFighter.record.wins}`}
                        type='number'
                        label='Wins'
                        InputLabelProps={{ style: { color: '#00468b', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#00468b' } }}
                        onChange={(ev) => updateRecord('blue', 'wins', ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', width: '100px' }}
                        value={`${blueFighter.record.loses}`}
                        type='number'
                        label='Loses'
                        InputLabelProps={{ style: { color: '#00468b', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#00468b' } }}
                        onChange={(ev) => updateRecord('blue', 'loses', ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', }}
                        value={blueFighter.city}
                        label='City'
                        InputLabelProps={{ style: { color: '#00468b', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#00468b' } }}
                        onChange={(ev) => updateCity('blue', ev.target.value)} />
                    <TextField
                        sx={{ backgroundColor: '#fff', width: '100px' }}
                        value={blueFighter.state}
                        label='State'
                        InputLabelProps={{ style: { color: '#00468b', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#00468b' } }}
                        onChange={(ev) => updateState('blue', ev.target.value)} />
                    <TextField
                        type='number'
                        sx={{ backgroundColor: '#fff', width: '115px' }}
                        value={blueFighter.weight}
                        label='Weight'
                        InputLabelProps={{ style: { color: '#00468b', fontSize: '16px' } }}
                        InputProps={{ style: { fontSize: '16px', color: '#00468b' } }}
                        onChange={(ev) => updateWeight('blue', parseFloat(ev.target.value))} />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px', gap: '5px' }}>
                    <TextField label='Rounds' type='number' sx={{ width: '100px' }}
                        value={roundCount.toString()}
                        onChange={(ev) => { setRoundCount(parseInt(ev.target.value)) }} />
                    <TextField label="Max Weight" type='number' sx={{ width: '120px' }}
                        value={maxWeight.toString()}
                        onChange={(ev) => { setMaxWeight(parseInt(ev.target.value)) }} />
                    <TextField label="Bout Type"
                        value={boutType}
                        onChange={(ev) => { setBoutType(ev.target.value) }} />
                </Box>
                <Box sx={{ marginTop: '10px' }}>
                    <Button onClick={() => { addBoutClicked() }}>Add Bout</Button>
                </Box>
            </Box>
        </>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(AddNewBout);