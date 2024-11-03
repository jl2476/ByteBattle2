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
    }
  }
});

export { darkTheme };