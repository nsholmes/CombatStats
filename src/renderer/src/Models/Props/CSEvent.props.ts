import { Bout, CSEvent } from '../csEvent.model';

export type AddNewEventProps = {
    addNewEvent: (csEvent: CSEvent) => void;
    addBoutToEvent: (csBout: Bout) => void;
    getEventBouts: Bout[];
}