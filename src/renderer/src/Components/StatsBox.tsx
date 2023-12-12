import { Box, Typography } from "@mui/material";

function StatsBox() {
  return (
    <Box>
      <Box>
        <Typography variant="h5" sx={{ textDecoration: "underline", textAlign: "center" }}>Significant Strikes</Typography>
        <Box sx={{ fontSize: "1em", display: "flex" }}>
          <Typography sx={{ width: "200px", textAlign: "right", marginRight: "20px" }}>
            Punches Landed:
          </Typography>
          <Typography sx={{ width: "120px" }}>0</Typography>
        </Box>
        <Box sx={{ fontSize: "1em", display: "flex" }}>
          <Typography sx={{ width: "200px", textAlign: "right", marginRight: "20px" }}>
            Kicks Landed:
          </Typography>
          <Typography sx={{ width: "120px" }}>0</Typography>
        </Box>
        <Box sx={{ fontSize: "1em", display: "flex" }}>
          <Typography sx={{ width: "200px", textAlign: "right", marginRight: "20px" }}>
            Total Strikes Landed:
          </Typography>
          <Typography sx={{ width: "120px" }}>0</Typography>
        </Box>
      </Box>
    </Box>
  );
}
export default StatsBox;