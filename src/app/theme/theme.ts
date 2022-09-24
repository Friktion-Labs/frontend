import { PaletteMode, createTheme } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      background:
        mode === "dark"
          ? {
              default: "#000000",
              modal:
                "linear-gradient(180.27deg, #23242F 0.31%, #121317 99.84%)",
            }
          : {
              default: "#FFFFFF",
              modal: "#FFFFFF",
            },
      border: mode === "dark" ? "#32333D" : "#EBEBF2",
      solana:
        "linear-gradient(35deg, #7962e7 15%, hsl(202, 70%, 51%) 55%, #00d18c 85%)",
      friktion: {
        linear: "linear-gradient(91.62deg, #806EE8 8.82%, #C073DF 99.16%)",
        radial:
          "radial-gradient(100% 136.81% at 0% 0%,#383c8b 0%,#3067f4 28.12%,#f077d8 92.2%,#dbb4d3 147.66%)",
      },
      volt1:
        "linear-gradient(30deg, hsl(255, 76%, 58%) 5%, hsl(194, 75%, 52%) 100%)",
      volt2:
        "linear-gradient(30deg, hsl(166, 78%, 42%) 5%, hsl(108, 78%, 42%) 100%)",
      volt3:
        "linear-gradient(30deg, hsl(66, 100%, 38%) 5%, hsl(22, 100%, 52%) 100%)",
      volt4:
        "linear-gradient(30deg, hsl(272, 76%, 55%) 5%, hsl(312, 75%, 55%) 100%)",
      volt5:
        "linear-gradient(30deg, hsl(320, 100%, 64%) 5%, hsl(10, 100%, 78%) 100%)",
      darkBlue: {
        600: "#2A2A51",
        800: "#13122B",
      },
      blue: {
        50: "#EAF0FE",
        100: "#D5E5FE",
        200: "#ACCAFD",
        300: "#82ABFB",
        400: "#6291F8",
        500: "#3067F4",
        600: "#234FD1",
        700: "#1839AF",
        800: "#0F278D",
        900: "#091A75",
      },
      pink: {
        50: "#FDF1FB",
        100: "#FEE4EF",
        200: "#FDCAE4",
        300: "#FAAEDD",
        400: "#F698DA",
        500: "#F077D8",
        600: "#CE56C2",
        700: "#AC3BAB",
        800: "#82258B",
        900: "#621673",
        1000: "#491056",
      },
      electricity: {
        50: "#EAFDF9",
        100: "#D3FEE3",
        200: "#A9FDD1",
        300: "#7DF9C4",
        400: "#5BF4C2",
        500: "#28EDBF",
        600: "#1DCBB3",
        700: "#14AAA4",
        800: "#0C8289",
        900: "#076171",
      },
      sky: {
        50: "#E6FAFF",
        100: "#CCFFFB",
        200: "#9AFFFE",
        300: "#67F4FF",
        400: "#41E4FF",
        500: "#03C9FF",
        600: "#029CDB",
        700: "#0175B7",
        800: "#005493",
        900: "#003C7A",
      },
      neon: {
        50: "#FAFDE6",
        100: "#FAFDCB",
        200: "#F5FC97",
        300: "#EBF763",
        400: "#DFF03C",
        500: "#CFE600",
        600: "#AFC500",
        700: "#91A500",
        800: "#738500",
        900: "#5E6E00",
      },
      lavender: {
        50: "#F6F4FF",
        100: "#EEEAFE",
        200: "#DED5FE",
        300: "#CCBFFE",
        400: "#BDAFFD",
        500: "#A695FC",
        600: "#7C6CD8",
        700: "#584BB5",
        800: "#3A2F92",
        900: "#251C78",
      },
      grey: {
        0: "#FFFFFF",
        50: "#FDFDFE",
        100: "#F4F4F8",
        200: "#EBEBF2",
        300: "#CECED8",
        400: "#A7A7B1",
        500: "#74747D",
        600: "#5D5D64",
        700: "#404355",
        800: "#323441",
        900: "#1A1C22",
        950: "#0B090E",
        1000: "#000000",
      },
      success: {
        main: "#00C137",
        light: "#55DA7B",
        dark: "#007421",
      },
      warning: {
        main: "#F8CC3E",
        light: "#FBE08B",
        dark: "#A28526",
      },
      error: {
        main: "#FF4443",
        light: "#FF8F8E",
        dark: "#AC2928",
      },
    },
    typography: {
      h1: {
        fontFamily: "Recoleta",
        fontSize: "96px",
        color: mode === "dark" ? "#FFFFFF" : "#0B090E",
        lineHeight: "104px",
      },
      h2: {
        fontFamily: "Recoleta",
        fontSize: "56px",
        color: mode === "dark" ? "#FFFFFF" : "#0B090E",
        lineHeight: "68px",
      },
      h3: {
        fontFamily: "Recoleta",
        fontSize: "36px",
        color: mode === "dark" ? "#FFFFFF" : "#0B090E",
        lineHeight: "44px",
      },
      h4: {
        fontFamily: "Recoleta",
        fontSize: "30px",
        color: mode === "dark" ? "#FFFFFF" : "#0B090E",
        lineHeight: "40px",
      },
      h5: {
        fontFamily: "Euclid Circular B",
        fontSize: "24px",
        color: mode === "dark" ? "#FFFFFF" : "#0B090E",
        lineHeight: "30px",
      },
      bodyXl: {
        fontFamily: "Euclid Circular B",
        fontSize: "20px",
        color: mode === "dark" ? "#FFFFFF" : "#1A1C22;",
        lineHeight: "30px",
      },
      bodyL: {
        fontFamily: "Euclid Circular B",
        fontSize: "18px",
        color: mode === "dark" ? "#FFFFFF" : "#1A1C22;",
        lineHeight: "28px",
      },
      bodyM: {
        fontFamily: "Euclid Circular B",
        fontSize: "16px",
        color: mode === "dark" ? "#FFFFFF" : "#1A1C22;",
        lineHeight: "24px",
      },
      bodyS: {
        fontFamily: "Euclid Circular B",
        fontSize: "14px",
        color: mode === "dark" ? "#FFFFFF" : "#1A1C22;",
        lineHeight: "21px",
      },
      bodyXs: {
        fontFamily: "Euclid Circular B",
        fontSize: "12px",
        color: mode === "dark" ? "#FFFFFF" : "#1A1C22;",
        lineHeight: "18px",
      },
    },
  });
