import { connect } from 'react-redux';

import { Box } from '@mui/material';

import { SelectBracketCompetitors } from '../Features/cbBracket.slice';
import { EventWeighInProps } from '../Models';
import WeighInCompetitor from './WeighInCompetitor';

function mapStateToProps(state: any) {
    return {
        bracketCompetitors: SelectBracketCompetitors(state)
    }
}

function EventWeighIns(props: EventWeighInProps) {
    return (
        <Box sx={{ backgroundColor: "#333", height: "85vh", overflowY: "scroll" }}>
            {
                props.bracketCompetitors.map((competitor) => (
                    <WeighInCompetitor competitor={competitor} />
                    // <div>{`${idx + 1}. ${competitor.person.full_name}`}</div>
                ))
            }
        </Box>
    );
}
export default connect(mapStateToProps, null)(EventWeighIns);