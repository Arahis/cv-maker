// dom-attributes-to-react-props.ts
import type React from "react";

/** Convert inline CSS from HTML/SVG into React-friendly style object */
export function parseStyleString(style: string): React.CSSProperties {
  const result: React.CSSProperties = {};
  const el = document.createElement("div");
  // Native browser parsing
  el.style.cssText = style;

  for (let i = 0; i < el.style.length; i++) {
    const propName = el.style[i];
    const value = el.style.getPropertyValue(propName);

    // Convert hyphen-case to camelCase for React
    const camelKey = propName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    (result as any)[camelKey] = value;
  }
  return result;
}

/** HTML → JSX attribute name mapping */
const HTML_ATTR_NAME_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  readonly: "readOnly",
  tabindex: "tabIndex",
  colspan: "colSpan",
  rowspan: "rowSpan",
};

/** SVG → JSX attribute name mapping (React requires camelCase) */
const SVG_ATTR_NAME_MAP: Record<string, string> = {
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "fill-opacity": "fillOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  viewBox: "viewBox", // already correct
};

/** Boolean HTML attributes */
const BOOLEAN_ATTRS = new Set([
  "hidden",
  "disabled",
  "checked",
  "selected",
  "readonly",
  "multiple",
  "autoplay",
  "controls",
  "loop",
  "muted",
  "required",
]);

/** Attributes that must stay strings */
const FORCE_STRING_ATTRS = new Set(["class", "className", "id", "role"]);

/** Convert DOM attributes -> React-compatible props */
export function convertDomAttributesToProps(
  el: HTMLElement | SVGElement,
): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  for (const { name: rawName, value } of el.attributes) {
    const lower = rawName.toLowerCase();

    // boolean
    if (BOOLEAN_ATTRS.has(lower)) {
      props[lower] = true;
      continue;
    }

    // style
    if (lower === "style") {
      props.style = parseStyleString(value);
      continue;
    }

    // data-* / aria-* always strings
    if (lower.startsWith("data-") || lower.startsWith("aria-")) {
      props[rawName] = value;
      continue;
    }

    // Skip HTML event handlers ("onclick")
    if (lower.startsWith("on")) {
      continue;
    }

    let reactName =
      HTML_ATTR_NAME_MAP[lower] || SVG_ATTR_NAME_MAP[lower] || rawName;

    // Normalize SVG attributes: stroke-width -> strokeWidth
    if (lower.includes("-") && !(lower in SVG_ATTR_NAME_MAP)) {
      reactName = lower.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    }

    // Numeric conversion (tabIndex, width, height, etc.)
    if (!FORCE_STRING_ATTRS.has(lower)) {
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        props[reactName] = Number(value);
        continue;
      }
    }

    // Default string value
    props[reactName] = value;
  }
  return props;
}
