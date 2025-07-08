import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { READ_SELECTED_COMBAT_EVENT_FROM_FB } from "../Features/combatEvent.actions";
import {
  SelectAllBrackets,
  SelectAllParticipants,
  setSelectedEvent,
} from "../Features/combatEvent.slice";
import { SelectAllEvents } from "../Features/events.slice";
import {
  GET_BRACKETS_FROM_FB,
  GET_EVENTS_FROM_FB,
  GET_FSI_EVENT_BRACKETS,
  GET_FSI_EVENT_PARTICIPANTS,
  GET_PARTICIPANTS_FROM_FB,
  GetEventsFromFSI,
} from "../Features/eventsAction";
import { IKFEvent } from "../Models";
import { EventBracket } from "../Models/bracket.model";
import { IKFParticipant } from "../Models/fighter.model";

type EventsProps = {
  // Define any props you need here
  getEventsFromFB: () => void;
  getFSIEvents: () => void;
  readSelectedCombatEventFromFB: () => void;
  getBracketsFromFB: (eventUID: string, eventID: number) => void;
  getFSIEventBrackets: (eventUID: string, eventID: number) => void;
  getParticipantsFromFB: (eventUID: string, eventID: number) => void;
  getFSIEventParticipants: (eventUID: string, eventID: number) => void;
  setSelectedEvent: (event: IKFEvent) => void;
  getAllFSIEvents: IKFEvent[];
  getEventBrackets: EventBracket[];
  getEventParticipants: IKFParticipant[];
};

function mapStateToProps(state: any) {
  return {
    getAllFSIEvents: SelectAllEvents(state),
    getEventBrackets: SelectAllBrackets(state),
    getEventParticipants: SelectAllParticipants(state),
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    setSelectedEvent: (event: IKFEvent) => dispatch(setSelectedEvent(event)),
    readSelectedCombatEventFromFB: () =>
      dispatch(READ_SELECTED_COMBAT_EVENT_FROM_FB()),
    getEventsFromFB: () => dispatch(GET_EVENTS_FROM_FB()),
    getFSIEvents: () => dispatch(GetEventsFromFSI()),
    getBracketsFromFB: (eventUID: string, eventID: number) =>
      dispatch(GET_BRACKETS_FROM_FB({ eventUID, eventID })),
    getFSIEventBrackets: (eventUID: string, eventID: number) =>
      dispatch(GET_FSI_EVENT_BRACKETS({ eventUID, eventID })),
    getParticipantsFromFB: (eventUID: string, eventID: number) =>
      dispatch(GET_PARTICIPANTS_FROM_FB({ eventUID, eventID })),
    getFSIEventParticipants: (eventUID: string, eventID: number) =>
      dispatch(GET_FSI_EVENT_PARTICIPANTS({ eventUID, eventID })),
  };
}

function Events(props: EventsProps) {
  const navigator = useNavigate();
  const [visibleEvents, setVisibleEvents] = useState<IKFEvent[]>([]);
  const [eventSort, setEventSort] = useState<string>("");
  const [viewIndex, setViewIndex] = useState<number>(0);

  //#region Use Effects
  useEffect(() => {
    setViewIndex(0);
    // Load events from Firebase
    props.getEventsFromFB();
    // Load selected combatEvent from Firebase
    props.readSelectedCombatEventFromFB();
    setVisibleEvents(upcomingEvents());
  }, []);
  useEffect(() => {}, [props.getAllFSIEvents]);
  useEffect(() => {
    if (eventSort === "upcoming") {
      setVisibleEvents(upcomingEvents());
    } else if (eventSort === "lastTen") {
      setVisibleEvents(lastTenEvents());
    }
  }, [eventSort]);
  //#endregion

  //#region Event Handlers
  const lastTenEvents = (): IKFEvent[] => {
    const today = new Date();
    const lastTen = props.getAllFSIEvents.filter((event: IKFEvent) => {
      const eventDate = new Date(event.eventDate);
      return eventDate < today;
    });
    lastTen.sort((a: IKFEvent, b: IKFEvent) => {
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    });
    return lastTen.slice(0, 10);
  };

  const upcomingEvents = (): IKFEvent[] => {
    const today = new Date();
    const upcoming = props.getAllFSIEvents.filter((event: IKFEvent) => {
      const eventDate = new Date(event.eventDate);
      return eventDate > today;
    });
    return upcoming;
  };
  const selectButtonClicked = (event: IKFEvent) => {
    props.setSelectedEvent(event);
    props.getParticipantsFromFB(event.eventUid, event.id);
    // props.getFSIEventParticipants(event.eventUid, event.id);
    // props.getBracketsFromFB(event.eventUid, event.id);
    // props.getFSIEventBrackets(event.eventUid, event.id);
    navigator("selectedEvent");
  };
  //#endregion

  //#region rendered elements
  const eventSelectView = () => {
    const eventSelectView = visibleEvents.map((event: IKFEvent) => (
      <div id={`eventID_${event.id}`} key={event.id} className='p-1.5'>
        <div>{`${event.id} - ${event.eventName}`}</div>
        <div>{event.eventDate}</div>
        <Button
          variant='contained'
          onClick={() => {
            selectButtonClicked(event);
          }}>
          Select Event
        </Button>
      </div>
    ));
    return eventSelectView;
  };

  const participantSelectView = () => {
    const participantSelectView = props.getEventParticipants.map(
      (participant: IKFParticipant) => {
        return <div>{participant.firstName}</div>;
      }
    );

    return participantSelectView;
  };
  const bracketsView = () => {
    const bracketView = props.getEventBrackets.map((bracket: EventBracket) => {
      return <div>{bracket.name}</div>;
    });
    return bracketView;
  };

  const renderByViewIndex = () => {
    if (viewIndex == 1) {
      return <Box>{bracketsView()}</Box>;
    } else if (viewIndex == 2) {
      return <div>{participantSelectView()}</div>;
    } else {
      return <div>{eventSelectView()}</div>;
    }
  };
  //#endregion
  return (
    <>
      <h2>[IKF Midwest Events ]</h2>
      <div className='flex justify-around'>
        <Button variant='contained' onClick={() => setEventSort("upcoming")}>
          Upcoming Events
        </Button>
        <Button variant='contained' onClick={() => setEventSort("lastTen")}>
          Past 10 Events
        </Button>
      </div>
      <div>{renderByViewIndex()}</div>
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Events);
