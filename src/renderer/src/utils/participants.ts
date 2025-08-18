import {
  CheckInPariticipantSort,
  IKFParticipant,
  WeightRange,
} from "@nsholmes/combat-stats-types/fighter.model";

const weightRangeStep = 20;

// Define weight ranges based on the step
export const createWeightRanges = (
  start: number,
  end: number
): WeightRange[] => {
  const ranges: WeightRange[] = [];
  for (let weightMin = start; weightMin < end; weightMin += weightRangeStep) {
    const weightMax = weightMin + weightRangeStep - 0.1;
    ranges.push({ weightMin, weightMax });
  }
  return ranges;
};
// Create weight ranges from 50 to 300 lbs with a step of 20 lbs
export const weightRanges: WeightRange[] = createWeightRanges(50, 301);

export const sortParticipantsForMatching = (
  participants: IKFParticipant[],
  filterMode: "Juniors" | "Boys" | "Girls" | "F" | "M" | "All" = "All"
) => {
  const sortedParticipants: CheckInPariticipantSort[] = [];

  try {
    // null weight participants
    const nullWeightParticipants: IKFParticipant[] = participants.filter(
      (p) => {
        if (filterMode === "All") {
          return p.weight === null || p.weight === undefined;
        } else if (filterMode === "Juniors") {
          return (
            (p.weight === null || p.weight === undefined) &&
            getAgeFromDOB(p.dob) < 18
          );
        } else if (filterMode === "Boys") {
          return (
            (p.weight === null || p.weight === undefined) &&
            getAgeFromDOB(p.dob) < 18 &&
            p.gender === "M"
          );
        } else if (filterMode === "Girls") {
          return (
            (p.weight === null || p.weight === undefined) &&
            getAgeFromDOB(p.dob) < 18 &&
            p.gender === "F"
          );
        } else if (filterMode === "F") {
          return (
            (p.weight === null || p.weight === undefined) &&
            p.gender === "F" &&
            getAgeFromDOB(p.dob) >= 18
          );
        } else if (filterMode === "M") {
          return (
            (p.weight === null || p.weight === undefined) &&
            p.gender === "M" &&
            getAgeFromDOB(p.dob) >= 18
          );
        }
        return [];
      }
    );

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
        (p) => {
          if (filterMode === "All") {
            return (
              p.weight !== null &&
              p.weight !== undefined &&
              p.weight >= range.weightMin &&
              p.weight <= range.weightMax
            );
          } else if (filterMode === "Juniors") {
            return (
              p.weight !== null &&
              p.weight !== undefined &&
              p.weight >= range.weightMin &&
              p.weight <= range.weightMax &&
              getAgeFromDOB(p.dob) < 18
            );
          } else if (filterMode === "Boys") {
            return (
              p.weight !== null &&
              p.weight !== undefined &&
              p.weight >= range.weightMin &&
              p.weight <= range.weightMax &&
              getAgeFromDOB(p.dob) < 18 &&
              p.gender === "M"
            );
          } else if (filterMode === "Girls") {
            return (
              p.weight !== null &&
              p.weight !== undefined &&
              p.weight >= range.weightMin &&
              p.weight <= range.weightMax &&
              getAgeFromDOB(p.dob) < 18 &&
              p.gender === "F"
            );
          } else if (filterMode === "F") {
            return (
              p.weight !== null &&
              p.weight !== undefined &&
              p.weight >= range.weightMin &&
              p.weight <= range.weightMax &&
              p.gender === "F" &&
              getAgeFromDOB(p.dob) >= 18
            );
          } else if (filterMode === "M") {
            return (
              p.weight !== null &&
              p.weight !== undefined &&
              p.weight >= range.weightMin &&
              p.weight <= range.weightMax &&
              p.gender === "M" &&
              getAgeFromDOB(p.dob) >= 18
            );
          }
        }
      );

      filteredParticipants.sort((a, b) => {
        // Sort by gender first
        if (a.gender.toLocaleLowerCase() < b.gender.toLocaleLowerCase())
          return -1;
        if (b.gender.toLocaleLowerCase() < a.gender.toLocaleLowerCase())
          return 1;
        return 0;
      });

      // Sort filteredParticipants by Age (ascending)
      filteredParticipants.sort((a, b) => {
        const ageA = getAgeFromDOB(a.dob);
        const ageB = getAgeFromDOB(b.dob);
        return ageA - ageB;
      });

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
