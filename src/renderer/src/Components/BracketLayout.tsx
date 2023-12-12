import { Box, Typography } from "@mui/material";
import { SelectAllCSBrackets } from "../Features/cbBracket.slice";
import { connect } from "react-redux";
import { BracketLayoutProps, CSBracket } from "../Models";
import "./BracketLayout.css"

function mapStateToProps(state: any) {
  return {
    getAllCSBrackets: SelectAllCSBrackets(state)
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

function BracketLayout(props: BracketLayoutProps) {

  const dragBracket = (ev: any) => {
    console.log(ev);
  }

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
    return rings;
  }

  const layoutBracket = (competitors: any[]) => {
    const fightCount = competitors.length;
    if (fightCount === 3) {
      return (
        <Box className="bracket3">
          <Box className="round round1">
            <Box className="bout">
              <Box className="seat seat1">{competitors.find((comp) => comp.seed === 2).person.full_name}</Box>
              <Box className="seat seat2">{competitors.find((comp) => comp.seed === 3).person.full_name}</Box>
            </Box>
            <Box className="bout">
              <Box className="seat seatSpace">{" "}</Box>
              <Box className="seat seatSpace">{" "}</Box>
            </Box>
          </Box>
          <Box className="round round2">
            <Box className="bout">
              <Box className="seat seat5">Winner</Box>
              <Box className="seat seat6">{competitors.find((comp) => comp.seed === 1).person.full_name} (Bye)</Box>
            </Box>
          </Box>
          <Box className="round round3">
            <Box className="seat seat7">{competitors.find((comp) => comp.seed === 1).person.full_name}</Box>
          </Box>
        </Box>
      );
    }
    if (fightCount === 4) {
      return (
        <Box draggable={true} onDragStart={dragBracket} className="bracket4">
          <Box className="round round1">
            <Box className="bout">
              <Box className="seat seat1">{competitors.find((comp) => comp.seed === 1).person.full_name}</Box>
              <Box className="seat seat2">{competitors.find((comp) => comp.seed === 2).person.full_name}</Box>
            </Box>
            <Box className="bout">
              <Box className="seat seat3">{competitors.find((comp) => comp.seed === 3).person.full_name}</Box>
              <Box className="seat seat4">{competitors.find((comp) => comp.seed === 4).person.full_name}</Box>
            </Box>
          </Box>
          <Box className="round round2">
            <Box className="bout">
              <Box className="seat seat5">Winner</Box>
              <Box className="seat seat6">Winner</Box>
            </Box>
          </Box>
          <Box className="round round3">
            <Box className="seat seat7">{competitors.find((comp) => comp.seed === 1).person.full_name}</Box>
          </Box>
        </Box>
      )
    }
    return (
      <Box className="bracket2">
        <Box className="round round1">
          <Box className="bout">
            <Box className="seat seatSpace">{" "}</Box>
            <Box className="seat seatSpace">{" "}</Box>
          </Box>
          <Box className="bout">
            <Box className="seat seatSpace">{" "}</Box>
            <Box className="seat seatSpace">{" "}</Box>
          </Box>
        </Box>
        <Box className="round round2">
          <Box className="bout">
            <Box className="seat seat5">{competitors.find((comp) => comp.seed === 1).person.full_name}</Box>
            <Box className="seat seat6">{competitors.find((comp) => comp.seed === 2).person.full_name}</Box>
          </Box>
        </Box>
        <Box className="round round3">
          <Box className="seat seat7">{competitors.find((comp) => comp.seed === 1).person.full_name}</Box>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h4">
        Bracket Layout
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#111",
          gap: "30px"
        }}>

        {
          getRingGroupings().map((ring) => {
            return (
              <Box>
                <Typography sx={{ fontWeight: "bold" }} variant="h6">{`Ring ${ring}`}</Typography>
                {
                  props.getAllCSBrackets.map((bracket) => {
                    return bracket.ringNumber == ring ? (
                      <Box sx={{ margin: "10px 0px 20px" }}>
                        <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>{bracket.divisionName}</Typography>
                        {
                          layoutBracket(bracket.competitors)
                        }
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
export default connect(mapStateToProps, mapDispatchToProps)(BracketLayout);