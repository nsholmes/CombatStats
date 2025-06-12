import { Box, Button, Typography } from "@mui/material";
import { connect } from "react-redux";
import {
  GET_FSI_EVENT_BRACKETS,
  GET_FSI_EVENT_PARTICIPANTS,
  GetEventsFromFSI,
} from "../Features/eventsAction";
import { useEffect, useState } from "react";
import { SelectAllEvents } from "../Features/events.slice";
import {
  SelectAllBrackets,
  SelectAllParticipants,
} from "../Features/combatEvent.slice";
import { IKFEvent } from "../Models";
import { EventBracket } from "../Models/bracket.model";
import { IKFParticipant } from "../Models/fighter.model";
import { setSelectedEvent } from "../Features/combatEvent.slice";
import { useNavigate } from "react-router-dom";

type EventsProps = {
  // Define any props you need here
  getFSIEvents: () => void;
  getFSIEventBrackets: (eventUID: string, eventID: number) => void;
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
    getFSIEvents: () => dispatch(GetEventsFromFSI()),
    getFSIEventBrackets: (eventUID: string, eventID: number) =>
      dispatch(GET_FSI_EVENT_BRACKETS({ eventUID, eventID })),
    getFSIEventParticipants: (eventUID: string, eventID: number) =>
      dispatch(GET_FSI_EVENT_PARTICIPANTS({ eventUID, eventID })),
  };
}

function Events(props: EventsProps) {
  const navigator = useNavigate();
  const [visibleEvents, setVisibleEvents] = useState<IKFEvent[]>([]);
  const [eventSort, setEventSort] = useState<string>("");
  const [selectedEventId, setSelectedEventID] = useState<number>(-1);
  const [viewIndex, setViewIndex] = useState<number>(0);

  //#region Use Effects
  useEffect(() => {
    props.getFSIEvents();
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
    props.getFSIEventParticipants(event.eventUid, event.id);
    props.getFSIEventBrackets(event.eventUid, event.id);
    navigator("selectedEvent");
  };
  //#endregion

  //#region rendered elements
  const eventSelectView = () => {
    const eventSelectView = visibleEvents.map((event: IKFEvent) => (
      <Box id={`eventID_${event.id}`} key={event.id}>
        <Box>{event.eventName}</Box>
        <Box>{event.eventDate}</Box>
        <Button
          variant='contained'
          onClick={() => {
            selectButtonClicked(event);
          }}>
          Select Event
        </Button>
      </Box>
    ));
    return eventSelectView;
  };

  const participantSelectView = () => {
    const participantSelectView = props.getEventParticipants.map(
      (participant: IKFParticipant) => {
        return <Box>{participant.firstName}</Box>;
      }
    );

    return participantSelectView;
  };
  const bracketsView = () => {
    const bracketView = props.getEventBrackets.map((bracket: EventBracket) => {
      return <Box>{bracket.name}</Box>;
    });
    return bracketView;
  };

  const renderByViewIndex = () => {
    if (viewIndex == 1) {
      return <Box>{bracketsView()}</Box>;
    } else if (viewIndex == 2) {
      return <Box>{participantSelectView()}</Box>;
    } else {
      return <Box>{eventSelectView()}</Box>;
    }
  };
  //#endregion
  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant='h2'>
        [IKF Midwest Events ]
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button variant='contained' onClick={() => setEventSort("upcoming")}>
          Upcoming Events
        </Button>
        <Button variant='contained' onClick={() => setEventSort("lastTen")}>
          Past 10 Events
        </Button>
      </Box>
      <Box>{/* <EventBrackets /> */}</Box>
      <Box>{renderByViewIndex()}</Box>
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Events);
