// const networks = {
//   "Passage": {
//     primary: {
//       light: "#b7abcf",
//       main: "#58467d",
//       dark: "#312941",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#1de9b6",
//       main: "#1de9b6",
//       dark: "#14a37f",
//       contrastText: "#000",
//     },
//   },
//   "Cosmos Hub": {
//     primary: {
//       light: "#C5CAE9",
//       main: "#3F51B5",
//       dark: "#303F9F",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#b6a9db",
//       main: "#7c4dff",
//       dark: "#4a2d9c",
//       contrastText: "#000",
//     },
//   },
//   Regen: {
//     primary: {
//       light: "#80bf98",
//       main: "#43ad6b",
//       dark: "#2c7849",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#8fc9c4",
//       main: "#009688",
//       dark: "#01786d",
//       contrastText: "#000",
//     },
//   },
//   Akash: {
//     primary: {
//       light: "#c26859",
//       main: "#cc3f33",
//       dark: "#ad352b",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#8fc9c4",
//       main: "#009688",
//       dark: "#01786d",
//       contrastText: "#000",
//     },
//   },
//   Osmosis: {
//     primary: {
//       light: "#D1C4E9",
//       main: "#673AB7",
//       dark: "#512DA8",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#8fc9c4",
//       main: "#009688",
//       dark: "#01786d",
//       contrastText: "#000",
//     },
//   },
//   Juno: {
//     primary: {
//       light: "#5e4749",
//       main: "#523d3f",
//       dark: "#312526",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#eb3d89",
//       main: "#c9226b",
//       dark: "#6e2444",
//       contrastText: "#000",
//     },
//   },
//   Stargaze: {
//     primary: {
//       light: "#b7abcf",
//       main: "#58467d",
//       dark: "#312941",
//       contrastText: "#fff",
//     },
//     secondary: {
//       light: "#e73986",
//       main: "#db2777",
//       dark: "#8f174c",
//       contrastText: "#000",
//     },
//   }
// };

export const defaultPallet = {
  primary: {
    main: '#009688',
    light: '#52c7b8',
    dark: '#00675b',
    contrastText: '#fff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#d05ce3',
    dark: '#6a0080',
    contrastText: '#fff',
  },
  error: {
    main: '#e91e63',
    light: '#ff6090',
    dark: '#b0003a',
    contrastText: '#fff',
  },
  warning: {
    main: '#ffc107',
    light: '#ffe054',
    dark: '#c79100',
    contrastText: '#fff',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#fff',
  },
  success: {
    main: '#4caf50',
    light: '#80e27e',
    dark: '#087f23',
    contrastText: '#fff',
  },
};

export function getPalletByNetwork(networkName) {
  return defaultPallet;
}
