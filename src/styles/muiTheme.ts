import { createTheme } from '@mui/material';

const muiTheme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 'bold',
        },
      },
    },
  },
  palette: {
    common: {
      black: '#2D3047',
      white: '#FFFDFD',
    },
    primary: {
      main: '#1E96FC',
      dark: '#1878ca',
      light: '#4babfd',
    },
  },
});

export default muiTheme;
