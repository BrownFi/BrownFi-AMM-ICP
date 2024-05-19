import { ReactNode, useMemo } from "react";
import {
  css,
  Global,
  ThemeProvider as StyledComponentsThemeProvider,
} from "@emotion/react";
import type * as CSS from 'csstype';

const white = "#FFFFFF";
const black = "#000000";

export function colors() {
  return {
    white,
    black,

    bg0: "rgba(19, 18, 22, 1)",
    bg1: "#000",
    bg3: "#CED0D9",
    bg4: "#888D9B",
    bg5: "#888D9B",

    colorContrast: "#ffffff",

    primary1: "rgba(19, 18, 22, 1)",
    primary2: "rgba(29, 28, 33, 1)",
    primary3: "rgba(115, 115, 115, 1)",
    primary4: "rgba(63, 61, 68, 1)",

    text1: "rgba(255, 255, 255, 1)",
    text2: "rgba(255, 255, 255, 0.5)",

    dark5: "transparent",

    red1: "#F82D3A",
    red2: "rgba(119, 48, 48, 1)",
    red3: "rgba(255, 59, 106, 1)",
    green1: "#27AE60",
    green2: "rgba(39, 227, 159, 1)",
    yellow1: "#e3a507",
    yellow2: "#ff8f00",
    yellow3: "#F3B71E",
    blue1: "#2172E5",

    error: "#FD4040",
    success: "#27AE60",
    warning: "#ff8f00",
  };
}

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
};

export function theme(darkMode: boolean) {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? "#000" : "#4ade80",

    // // media queries
    // mediaWidth: mediaWidthTemplates,

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

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  );
};

interface TextWrapperProps extends Omit<CSS.Properties, 'fontSize'> {
  children?: ReactNode; 
  fontSize?: number;
  className?: string;
}

const TextWrapper = ({ children, ...props }: TextWrapperProps) => {
  if (props.fontSize) {
    return <div className={props.className} style={{...props, fontSize: `${props.fontSize}px`}}> {children} </div>;
  }
  return <div className={props.className} style={props}> {children} </div>;
}


export const Text = {
  main(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} color={"primary1"} {...props} />;
  },
  link(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} color={"primary1"} {...props} />;
  },
  label(props: TextWrapperProps) {
    return <TextWrapper fontWeight={600} color={"primary1"} {...props} />;
  },
  black(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} color={"primary1"} {...props} />;
  },
  white(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} color={"white"} {...props} />;
  },
  body(props: TextWrapperProps) {
    return <TextWrapper fontWeight={400} fontSize={18} {...props} />;
  },
  largeHeader(props: TextWrapperProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />;
  },
  mediumHeader(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />;
  },
  subHeader(props: TextWrapperProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />;
  },
  small(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} fontSize={14} {...props} />;
  },
  blue(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} color={"blue1"} {...props} />;
  },
  yellow(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} color={"yellow3"} {...props} />;
  },
  darkGray(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} color={"primary1"} {...props} />;
  },
  gray(props: TextWrapperProps) {
    return <TextWrapper fontWeight={500} color={"bg3"} {...props} />;
  },
  italic(props: TextWrapperProps) {
    return (
      <TextWrapper
        fontWeight={500}
        fontSize={12}
        fontStyle={"italic"}
        color={"primary1"}
        {...props}
      />
    );
  },
  error({ error, ...props }: { error: boolean } & TextWrapperProps) {
    return (
      <TextWrapper
        fontWeight={500}
        color={error ? "red1" : "primary1"}
        {...props}
      />
    );
  },
};

export const FixedGlobalStyle = (props: CSS.Properties) => (
  <Global
    {...props}
    styles={css`
      html, input, textarea, button {
          font-family: 'Montserrat';
          font-display: fallback;
        }
        @supports (font-variation-settings: normal) {
          html, input, textarea, button {
            font-family: 'Montserrat';
          }
        }
        
        html,
        body {
          margin: 0;
          padding: 0;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        body::-webkit-scrollbar {
          display: none;
        }
        
        
         a {
           color: ${colors().blue1}; 
         }
        
        * {
          box-sizing: border-box;
        }
        
        button {
          user-select: none;
        }
        
        html {
          font-size: 16px;
          font-variant: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          font-feature-settings: 'ss01' on, 'ss02' on,  'cv01' on, 'cv03' on;
          
        }
    `}
  />
)

// export const FixedGlobalStyle = createGlobalStyle`
//   html, input, textarea, button {
//     font-family: 'Montserrat';
//     font-display: fallback;
//   }
//   @supports (font-variation-settings: normal) {
//     html, input, textarea, button {
//       font-family: 'Montserrat';
//     }
//   }
  
//   html,
//   body {
//     margin: 0;
//     padding: 0;
//     -ms-overflow-style: none; /* IE and Edge */
//     scrollbar-width: none; /* Firefox */
//   }
//   body::-webkit-scrollbar {
//     display: none;
//   }
  
  
//    a {
//      color: ${colors().blue1}; 
//    }
  
//   * {
//     box-sizing: border-box;
//   }
  
//   button {
//     user-select: none;
//   }
  
//   html {
//     font-size: 16px;
//     font-variant: none;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//     -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
//     font-feature-settings: 'ss01' on, 'ss02' on,  'cv01' on, 'cv03' on;
    
//   }
//   `;

// export const ThemedGlobalStyle = createGlobalStyle`
//   html {
//     color: ${({ theme }) => theme.primary1};
//     background-color: ${({ theme }) => theme.bg0};
//   }
  
//   body {
//     min-height: 100vh;
//     background-position: 0 -30vh;
//     background-repeat: no-repeat;
//   }
//   `;
