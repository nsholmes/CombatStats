import Box from "@mui/material/Box";
import { IKFParticipant } from "@nsholmes/combat-stats-types/fighter.model";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  SelectAllParticipants,
  updateParticipantWeight,
} from "../../Features/combatEvent.slice";
import { sortParticipantsForMatching } from "../../utils/participants";
import CheckInParticipant from "./CheckInParticipant";

type CheckinProps = {
  eventParticipants: IKFParticipant[];
  updateParticipantWeight: (weight: number, participantId: number) => void;
};

function mapStateToProps(state: any) {
  return {
    eventParticipants: SelectAllParticipants(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    updateParticipantWeight: (weight: number, participantId: number) => {
      dispatch(updateParticipantWeight({ weight, participantId }));
    },
  };
}

function EventCheckIn(props: CheckinProps) {
  const [filteredParticipants, setFilteredParticipants] = useState<
    IKFParticipant[]
  >(props.eventParticipants);
  const [searchValue, setSearchValue] = useState<string>("");
  useEffect(() => {
    if (!searchValue) {
      setFilteredParticipants(props.eventParticipants);
      sortParticipantsForMatching(props.eventParticipants);
    } else {
      const lower = searchValue.toLowerCase();
      setFilteredParticipants(
        props.eventParticipants.filter(
          (p) =>
            p.firstName.toLowerCase().includes(lower) ||
            p.lastName.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchValue, props.eventParticipants]);

  const weightUpdateFunction = (weight: number, participantId: number) => {
    props.updateParticipantWeight(weight, participantId);
  };
  return (
    <>
      <h4 className='text-4xl text-center mt-5'>[Event Check In]</h4>
      <div className='w-full max-w-sm min-w-[200px] relative mt-4 mb-4'>
        <div>{`Participants (${filteredParticipants.length})`}</div>
        <label className='block mb-2 text-sm text-white-600'>
          Search by Name
        </label>
        <div className='relative'>
          <input
            type='search'
            className='w-full bg-transparent placeholder:text-white text-white text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
            placeholder='Enter your text'
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            className='absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            type='button'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='w-4 h-4'>
              <path
                fill-rule='evenodd'
                d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                clip-rule='evenodd'
              />
            </svg>
          </button>
        </div>
      </div>
      <Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100vw",
            flexWrap: "wrap",
            fontSize: "18px",
            backgroundColor: "#2D3E40",
            padding: 3,
          }}>
          {filteredParticipants.map((participant) => {
            return participant.profileName === "Competitor" ? (
              <CheckInParticipant
                participant={participant}
                updateWeightFunc={weightUpdateFunction}
              />
            ) : (
              <></>
            );
          })}
        </Box>
      </Box>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCheckIn);
