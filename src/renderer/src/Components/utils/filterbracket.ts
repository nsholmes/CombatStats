import { BracketFilterType, CSBracket } from '../../Models';

export const filterBrackets = (brackets: CSBracket[], filterType: BracketFilterType): CSBracket[] => {
    const retVal = brackets.filter(bracket => {
        return bracket.divisionName.toLocaleLowerCase().indexOf(filterType) == 0;
    });

    return retVal;
}