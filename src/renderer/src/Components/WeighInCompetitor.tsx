import './WeighIn.css';

import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { Box, TextField } from '@mui/material';

import { updateCompetitor } from '../Features/cbBracket.slice';
import { BracketCompetitor, WeighInCompetitorProps } from '../Models';

function mapStateToProps(state: any) { return {} }
function mapDispatchToProps(dispatch: any) {
    return {
        updateCompetitor: (competitor: BracketCompetitor) => { dispatch(updateCompetitor(competitor)) }
    }
}

function WeighInCompetitor(props: WeighInCompetitorProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [competitorExprience, setCompetitorExprience] = useState(props.competitor.competitiveexperienceString);
    const [competitorFullName, setCompetitorFullName] = useState(props.competitor.person.full_name);
    const [competitorFirstName, setCompetitorFirstName] = useState(props.competitor.person.first_name);
    const [competitorLastName, setCompetitorLastName] = useState(props.competitor.person.last_name);
    const [competitorWeight, setCompetitorWeight] = useState(props.competitor.competitor.weight);


    useEffect(() => {
        setCompetitorExprience(!competitorExprience ? "" : competitorExprience)
    }, [competitorExprience]);

    const checkmarkClicked = () => {
        setIsEditMode(false);
        props.updateCompetitor({
            ...props.competitor,
            person: {
                ...props.competitor.person,
                first_name: competitorFirstName,
                last_name: competitorLastName,
            },
            competitor: {
                full_name: `${competitorFirstName} ${competitorLastName}`,
                weight: competitorWeight,
                id: props.competitor.competitor.id,
                is_final_weight: props.competitor.competitor.is_final_weight
            }
        });
    }

    return (
        <Box className="weighInCompetitorWrapper" sx={{}}>
            <Box className='weighInFighterName' sx={{}}>
                <strong><u>Fighter</u>: </strong>
                {
                    <>{`${competitorFullName}`}</>
                }
            </Box>
            <Box className='weighInWeight'>
                <strong><u>Weight</u>: </strong>
                {
                    isEditMode ? <>
                        <TextField
                            sx={{ width: '30px' }}
                            variant='standard'
                            defaultValue={props.competitor.competitor.weight}
                            onChange={(ev) => { setCompetitorWeight(parseFloat(ev.target.value)) }} />
                    </> : <>{`${props.competitor.competitor.weight} lbs.`}</>
                }
            </Box>
            <Box className='weighInExperience' sx={{}}>
                <strong><u>Experience</u>: </strong>
                {
                    isEditMode ?
                        <>
                            <TextField
                                sx={{ width: '30px' }}
                                variant='standard'
                                defaultValue={competitorExprience}
                                onChange={(ev) => { setCompetitorExprience(ev.target.value) }} />
                        </> :
                        <>
                            {`${competitorExprience}`}
                        </>
                }
            </Box>
            <Box className='weighInIcons'>
                {
                    isEditMode ?
                        <Box className='weighInIconWrapper'>
                            <Box>
                                <CheckSharpIcon onClick={() => checkmarkClicked()} />
                            </Box>
                            <Box>
                                <DeleteSharpIcon />
                            </Box>
                        </Box> :
                        <Box className='weighInIconWrapper'>
                            <Box>
                                <EditSharpIcon onClick={() => setIsEditMode(true)} />
                            </Box>
                            <Box>
                                <DeleteSharpIcon />
                            </Box>
                        </Box>
                }
            </Box>
        </Box>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(WeighInCompetitor);