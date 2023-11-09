import { Box, Typography } from "@mui/material";
import { EventBracketsProps } from "../Models";
import { connect } from "react-redux";
import { SelectAllCSBrackets } from "../Features/cbBracket.slice";

function mapStateToProps(state: any) {
  return {
    getAllCSBrackets: SelectAllCSBrackets(state)
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

function EventBrackets(props: EventBracketsProps) {

  const getRingGroupings = () => {
    const rings: number[] = [];
    // const bracketGroupings: CSBracket[][] = [];
    // let tempBracketArr: CSBracket[] = [];

    props.getAllCSBrackets.map((bracket) => {
      const tempRing = bracket.ringNumber;
      if (rings.length === 0) {
        rings.push(tempRing);
      } else {
        if (tempRing !== rings[rings.length - 1] && tempRing > rings[rings.length - 1]) {
          rings.push(tempRing);
        }
      }
    });
    // console.log("bracketGroupings: ", bracketGroupings);
    return rings;
  }

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h4">[ Brackets ]</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", backgroundColor: "#111", gap: "30px" }}>
        {
          getRingGroupings().map((ring) => {
            return (
              <Box>
                <Typography sx={{ fontWeight: "bold" }} variant="h6">{`Ring ${ring}`}</Typography>
                {
                  props.getAllCSBrackets.map((bracket) => {
                    return bracket.ringNumber == ring ? (
                      <Box sx={{ margin: "5px 0px" }}>
                        <Typography sx={{ width: "100%", color: "#1976d2", textDecoration: "underline", fontWeight: "bold" }} variant="subtitle1">{bracket.divisionName}</Typography>
                        <Typography sx={{ backgroundColor: "#000", color: "#D68113", padding: "5px", borderRadius: "10px 10px 0px 0px" }} variant="body1">
                          {`${bracket.discipline}`}
                        </Typography>
                        <Box sx={{ backgroundColor: "#333", padding: "1px 10px", borderRadius: "0px 0px 10px 10px" }}>
                          {
                            bracket.competitors.map((fighter) => {
                              return (
                                <Box>
                                  <Typography variant="body2" component="span" sx={{ fontWeight: "bold" }}>
                                    {`${fighter.person.full_name}(${fighter.competitor.weight} lbs):`}
                                  </Typography>{" "}
                                  <Typography variant="body2" component="span">
                                    {`${fighter.gym_name}`}
                                  </Typography>
                                </Box>
                              )
                            })
                          }
                        </Box>
                      </Box>
                    ) : <></>
                  })
                }
              </Box>
            )
          })
        }
      </Box>
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(EventBrackets);