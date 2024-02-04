import { DragEvent, memo } from 'react';
import { connect } from 'react-redux';

import { Typography } from '@mui/material';

import { SelectAllCSBrackets } from '../Features/cbBracket.slice';
import { BracketListProps } from '../Models';

function mapStateToProps(state: any) {
  return {
    getAllCSBrackets: SelectAllCSBrackets(state)
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

const BracketList = memo(function BracketList(props: BracketListProps) {
  /**
   * 
   * @param ev DragEvent
   */
  const dragBracket = (ev: DragEvent<HTMLDivElement>) => {
    console.log(ev);
  }

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h4">
        Bracket List
      </Typography>
      {/* <BracketSetup /> */}
    </>
  );
})
export default connect(mapStateToProps, mapDispatchToProps)(BracketList);