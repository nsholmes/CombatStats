export type InitialFighter = {
  competitor: {
    full_name: string;
    height: number;
    height_units: {
      id: number;
      name: string;
    };
    id: number;
    is_final_weight: boolean;
    weight: number;
    weight_units: {
      id: number;
      name: string;
    };
  };
  create_date: string;
  id: number;
  person: {
    calculated_age: number;
    dob: string;
    email: string;
    first_name: string;
    full_name: string;
    gender: {
      id: number;
      name: string;
    };
    contactinfo_list: {
      phones: ContactPhone[];
    };
    id: number;
    last_name: string;
  };
  profile_name: string;
};

export type ContactPhone = {
  contact_information: {
    id: number;
  };
  create_date: string;
  id: number;
  is_primary: boolean;
  name: string;
  phone_number: string;
  phone_type: {
    id: number;
    name: string;
  };
};

export type IKFParticipant = {
  competitorId: number;
  participantId: number;
  personId: number;
  createDate: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  gender: string;
  weight: number;
  height: number;
  profileName: string;
  phoneNumber?: string;
  bracketCount: number;
};

export type CheckInPariticipantSort = {
  weightMax: number;
  weightMin: number;
  isWeightNull: boolean;
  participants: IKFParticipant[];
};

export type WeightRange = {
  weightMin: number;
  weightMax: number;
};
