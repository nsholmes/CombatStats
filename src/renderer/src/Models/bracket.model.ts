export type EventBracket = {
  belt: boolean;
  bracketrule: {
    description: string;
    friendly_name: string;
    id: number;
    name: string;
  };
  bracketstatus: {
    friendly_name: string;
    id: number;
    name: string;
  };
  compete_class_weight: {
    id: number;
    max: number;
    min: number;
    name: string;
  };
  criteria: string;
  discipline: {
    id: number;
    name: string;
  };
  group: number;
  id: number;
  name: string;
  number: number;
  result_summary: string;
  ring_name: string | null;
  ring_number: number;
  fighterIds: number[];
};
