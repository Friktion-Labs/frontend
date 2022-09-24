// Mostly copied from https://github.com/ycjcl868/theme-switcher
// This was rewritten as the theme specific css should have a lower precedence than App.less

interface Config {
  themeMap: { [key: string]: string };
  id?: string;
  attr?: string;
}

export interface SwitchConfig {
  theme: string;
}

interface Result {
  switcher: (config: SwitchConfig) => void;
}

export const themeSwitcher = (config: Config): Result => {
  const { id = "theme-style", attr = "data-theme", themeMap } = config || {};

  if (!themeMap) {
    throw new Error('ThemeSwitcher need themeMap like: { dark: "/dark.css" }');
  }

  const switcher: (config: SwitchConfig) => void = (switchConfig) => {
    const { theme } = switchConfig;

    if (themeMap[theme]) {
      const existingStyle = document.getElementById(id);

      if (!existingStyle) {
        const style = document.createElement("link");
        style.type = "text/css";
        style.id = id;
        style.href = themeMap[theme];
        style.rel = "stylesheet";

        // insert styles after bootstrap css to get higher precedence than _reboot.scss
        const bootstrap = document.getElementById("bootstrap-css");
        if (bootstrap?.parentNode) {
          bootstrap.parentNode.insertBefore(style, bootstrap.nextSibling);
        }
      } else {
        existingStyle.setAttribute("href", themeMap[theme]);
      }
    }

    document.body.setAttribute(attr, theme);
  };

  return {
    switcher,
  };
};
