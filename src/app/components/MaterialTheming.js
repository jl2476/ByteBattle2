import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2196F3"
    },
    typography: {
      fontFamily: '"Poppins", sans-serif',
      color: "white"
    },
    text: {
      primary: "#fff",
      hint: "#fff"
    },
    background: {
      paper: "#19202b"
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  }
});

export { darkTheme };