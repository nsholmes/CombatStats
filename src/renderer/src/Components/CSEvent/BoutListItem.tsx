import { Box, Typography } from '@mui/material';

import { Fighter } from '../../Models/csEvent.model';

function BoutListItem(fighter: Fighter) {
    const { firstName, lastName, dob, record, city, state, weight } = fighter
    return (
        <Box sx={{}}>
            <Typography variant='h6'>{`${firstName} ${lastName}`}</Typography>
            <Typography variant='body1'>{`${dob}, ${record.wins}-${record.loses}`}</Typography>
            <Typography variant='body1'>{`${city}, ${state}`}</Typography>
            <Typography variant='body1'>{`Weight: ${weight}`}</Typography>
        </Box>
    );
}
export default BoutListItem;