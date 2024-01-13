import { CSEvent } from '../csEvent.model';

export type AddNewEventProps = {
    addNewEvent: (csEvent: CSEvent) => void;
}