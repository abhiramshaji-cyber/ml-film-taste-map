import { useEffect, useState } from "react";

const scheme = matchMedia("(prefers-color-scheme: dark)");

function read(tokens: readonly string[]): string[] {
  const style = getComputedStyle(document.documentElement);
  return tokens.map((token) => style.getPropertyValue(token).trim());
}

export function usePaletteColors(tokens: readonly string[]): string[] {
  const key = tokens.join(",");
  const [values, setValues] = useState(() => read(tokens));

  useEffect(() => {
    const update = () => setValues(read(key.split(",")));
    update();
    scheme.addEventListener("change", update);
    return () => scheme.removeEventListener("change", update);
  }, [key]);

  return values;
}
