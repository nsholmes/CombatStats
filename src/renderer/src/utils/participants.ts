import {
  CheckInPariticipantSort,
  IKFParticipant,
  WeightRange,
} from "../Models/fighter.model";

const weightRangeStep = 20;

// Define weight ranges based on the step
export const createWeightRanges = (
  start: number,
  end: number
): WeightRange[] => {
  const ranges: WeightRange[] = [];
  for (let weightMin = start; weightMin < end; weightMin += weightRangeStep) {
    const weightMax = weightMin + weightRangeStep - 1;
    ranges.push({ weightMin, weightMax });
  }
  return ranges;
};
// Create weight ranges from 50 to 300 lbs with a step of 20 lbs
export const weightRanges: WeightRange[] = createWeightRanges(50, 301);

export const sortParticipantsForMatching = (
  participants: IKFParticipant[]
) => {
  const sortedParticipants: CheckInPariticipantSort[] = [];

  try {
    // null weight participants
    const nullWeightParticipants: IKFParticipant[] = participants.filter(
      (p) => p.weight === null || p.weight === undefined
    );
    console.log(`SORTED PARTICIPANTS: `, nullWeightParticipants);
    if (nullWeightParticipants.length > 0) {
      sortedParticipants.push({
        weightMax: 0,
        weightMin: 0,
        isWeightNull: true,
        participants: nullWeightParticipants,
      });
    }

    weightRanges.forEach((range) => {
      const filteredParticipants: IKFParticipant[] = participants.filter(
        (p) =>
          p.weight !== null &&
          p.weight >= range.weightMin &&
          p.weight <= range.weightMax
      );

      filteredParticipants.sort((a, b) => {
        // Sort by gender first
        if (a.gender.toLocaleLowerCase() < b.gender.toLocaleLowerCase())
          return -1;
        if (b.gender.toLocaleLowerCase() < a.gender.toLocaleLowerCase())
          return 1;
        return 0;
      });

      //   filteredParticipants.sort((a, b) => {
      //     const ageA = getAgeFromDOB(a.dob);
      //     const ageB = getAgeFromDOB(b.dob);
      //     return ageA - ageB; // Sort by age
      //   });

      //   // Sort by Last Name, then First Name
      //   filteredParticipants.sort((a, b) => {
      //     const lastNameA = a.lastName.toLowerCase();
      //     const lastNameB = b.lastName.toLowerCase();
      //     if (lastNameA < lastNameB) return -1;
      //     if (lastNameA > lastNameB) return 1;

      //     // If last names are the same, sort by first name
      //     const firstNameA = a.firstName.toLowerCase();
      //     const firstNameB = b.firstName.toLowerCase();
      //     if (firstNameA < firstNameB) return -1;
      //     if (firstNameA > firstNameB) return 1;

      //     return 0; // Names are equal
      //   });

      if (filteredParticipants.length > 0) {
        sortedParticipants.push({
          weightMax: range.weightMax,
          weightMin: range.weightMin,
          isWeightNull: false,
          participants: filteredParticipants,
        });
      }
    });

    return sortedParticipants.sort((a, b) => {
      // Sort by weightMin
      if (a.isWeightNull && !b.isWeightNull) return -1; // Null weight first
      if (!a.isWeightNull && b.isWeightNull) return 1; // Non-null weight after null
      return a.weightMin - b.weightMin; // Sort by weightMin
    });
  } catch (error) {
    console.log("Error sorting participants: ", error);
    // If sorting fails, return the original list
    return [] as CheckInPariticipantSort[];
  }
};

// get age from date of birth
export const getAgeFromDOB = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};
