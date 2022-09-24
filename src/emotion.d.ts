import "@emotion/react";
import {
  Theme as MuiTheme,
  TypographyStyleOptions,
  Color,
} from "@mui/material";

interface PinkColor extends Color {
  1000: string;
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bodyXl: true;
    bodyL: true;
    bodyM: true;
    bodyS: true;
    bodyXs: true;
  }
}

declare module "@mui/material" {
  interface Color {
    0: string;
    950: string;
    1000: string;
  }
}

declare module "@mui/material/styles" {
  interface TypeBackground {
    modal: string;
  }

  interface Palette {
    border: string;
    friktion: { linear: string; radial: string };
    solana: string;
    volt1: string;
    volt2: string;
    volt3: string;
    volt4: string;
    volt5: string;
    darkBlue: Color;
    blue: Color;
    pink: Color;
    electricity: Color;
    sky: Color;
    neon: Color;
    lavender: Color;
    grey: Color;
  }

  interface TypographyVariants {
    h1: TypographyStyleOptions;
    h2: TypographyStyleOptions;
    h3: TypographyStyleOptions;
    h4: TypographyStyleOptions;
    h5: TypographyStyleOptions;
    bodyXl: TypographyStyleOptions;
    bodyL: TypographyStyleOptions;
    bodyM: TypographyStyleOptions;
    bodyS: TypographyStyleOptions;
    bodyXs: TypographyStyleOptions;
  }

  // allow configuration using `createTheme`
  interface TypeBackgroundOptions {
    modal: string;
  }

  interface PaletteOptions {
    border?: string;
    friktion?: Partial<{ linear: string; radial: string }>;
    solana?: string;
    volt1?: string;
    volt2?: string;
    volt3?: string;
    volt4?: string;
    volt5?: string;
    darkBlue?: Partial<Color>;
    blue?: Partial<Color>;
    pink?: Partial<Color>;
    electricity?: Partial<Color>;
    sky?: Partial<Color>;
    neon?: Partial<Color>;
    lavender?: Partial<Color>;
    grey?: Partial<Color>;
  }

  interface TypographyVariantsOptions {
    h1?: Partial<TypographyStyleOptions>;
    h2?: Partial<TypographyStyleOptions>;
    h3?: Partial<TypographyStyleOptions>;
    h4?: Partial<TypographyStyleOptions>;
    h5?: Partial<TypographyStyleOptions>;
    bodyXl?: Partial<TypographyStyleOptions>;
    bodyL?: Partial<TypographyStyleOptions>;
    bodyM?: Partial<TypographyStyleOptions>;
    bodyS?: Partial<TypographyStyleOptions>;
    bodyXs?: Partial<TypographyStyleOptions>;
  }
}

declare module "@emotion/react" {
  export interface Theme extends MuiTheme {}
}
