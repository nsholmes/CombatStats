import './WeighIn.css';

import { useEffect, useState } from 'react';

import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { Box, TextField } from '@mui/material';

import { WeighInCompetitorProps } from '../Models';

function WeighInCompetitor(props: WeighInCompetitorProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [competitorExprience, setCompetitorExprience] = useState(props.competitor.competitiveexperienceString);

    useEffect(() => {
        setCompetitorExprience(!competitorExprience ? "" : competitorExprience)
    }, [competitorExprience]);
    return (
        <Box className="weighInCompetitorWrapper" sx={{}}>
            <Box className='weighInFighterName' sx={{}}>
                <strong><u>Fighter</u>: </strong>
                {
                    isEditMode ? <>
                        <TextField variant='standard' defaultValue={props.competitor.person.full_name}></TextField>
                    </> : <>{`${props.competitor.person.full_name}`}</>
                }
            </Box>
            <Box className='weighInWeight'>
                <strong><u>Weight</u>: </strong>
                {
                    isEditMode ? <>
                        <TextField sx={{ width: '30px' }} variant='standard' defaultValue={props.competitor.competitor.weight} />
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
                                defaultValue={competitorExprience} />
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
                                <CheckSharpIcon onClick={() => setIsEditMode(false)} />
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
export default WeighInCompetitor;