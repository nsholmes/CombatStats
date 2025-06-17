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
  bouts?: Bout[];
};

export type FSIWeightClasses = {
  age_class_id: number;
  create_date: string;
  deleted_date: string;
  gender: FSIGender;
  id: number;
  max: number;
  min: number;
  name: string;
  pro_classification: FSI_Pro_classification;
  sport: FSISport;
  units: string | null;
  units_id: string | null;
};

export type FSIGender = { id: number; name: "M" | "F" };
export type FSI_Pro_classification = { id: number; name: string };
export type FSISport = {
  abbreviation: string;
  create_date: string;
  gender: FSIGender;
  has_positions: false;
  id: number;
  name: string;
};

export type Bout = {
  age_class: String;
  bracket: {
    id: number;
  };
  bracket_id: number;
  bracket_round: number;
  competitor_ids: {
    competitors_ids: {
      id: number;
      corner_color: "red" | "blue";
    }[];
  };
  has_started: boolean;
  id: number;
  notes: String | null;
  summary: BoutSummary;
  sport: Sport;
};

export type BoutSummary = {
  bout_id: number;
  result_method_string: String;
  winner_corner: String;
};

export type Sport = {
  abbreviation: String;
  name: String;
  id: number;
};
