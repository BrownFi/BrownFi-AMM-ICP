import { useContext } from "react";

import { ThemeContext } from "styled-components";

export default function useTheme() {
	const theme = useContext(ThemeContext);
	if (!theme) throw new Error("useTheme must be used within a ThemeProvider");
	return theme;
}
