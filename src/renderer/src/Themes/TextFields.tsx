import { createTheme, Theme } from "@mui/material";

export const RedCornerFighterNameTextFieldTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "##be0000",
            "--TextField-brandBorderHoverColor": "##be0000",
            "--TextField-brandBorderFocusedColor": "##be0000",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "30px",
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            fontSize: "30px",
          },
        },
      },
    },
  });
