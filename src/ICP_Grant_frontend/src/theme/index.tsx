import { ReactNode, useMemo } from "react";
import {
    css,
    DefaultTheme,
    ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components';
import { Colors } from "./styled";

const white = '#FFFFFF';
const black = '#000000';

export function colors(): Colors {
    return {
        white,
        black,

        bg0: 'rgba(19, 18, 22, 1)',
        bg1: '#000',
        bg3: '#CED0D9',
        bg4: '#888D9B',
        bg5: '#888D9B',

        colorContrast: '#ffffff',

        primary1: 'rgba(19, 18, 22, 1)',
        primary2: 'rgba(29, 28, 33, 1)',
        primary3: 'rgba(115, 115, 115, 1)',
        primary4: 'rgba(63, 61, 68, 1)',

        text1: 'rgba(255, 255, 255, 1)',
        text2: 'rgba(255, 255, 255, 0.5)',

        dark5: 'transparent',

        red1: '#F82D3A',
        red2: 'rgba(119, 48, 48, 1)',
        red3: 'rgba(255, 59, 106, 1)',
        green1: '#27AE60',
        green2: 'rgba(39, 227, 159, 1)',
        yellow1: '#e3a507',
        yellow2: '#ff8f00',
        yellow3: '#F3B71E',
        blue1: '#2172E5',

        error: '#FD4040',
        success: '#27AE60',
        warning: '#ff8f00',
    };
}

export const MEDIA_WIDTHS = {
    upToExtraSmall: 500,
    upToSmall: 720,
    upToMedium: 960,
    upToLarge: 1280,
};

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
    (accumulator, size) => {
        (accumulator as any)[size] = (a: any, b: any, c: any) => css`
        @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
          ${css(a, b, c)}
        }
      `;
        return accumulator;
    },
    {},
) as any;


export function theme(darkMode: boolean): DefaultTheme {
    return {
        ...colors(),

        grids: {
            sm: 8,
            md: 12,
            lg: 24,
        },

        //shadows
        shadow1: darkMode ? '#000' : '#4ade80',

        // media queries
        mediaWidth: mediaWidthTemplates,

        // css snippets
        flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
        flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
    };
}


export function useIsDarkMode(): boolean {
    return true;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const darkMode = useIsDarkMode();

    const themeObject = useMemo(() => theme(darkMode), [darkMode]);

    return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>;
}