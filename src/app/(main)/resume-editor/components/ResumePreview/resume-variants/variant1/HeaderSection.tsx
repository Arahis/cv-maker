import React from "react";
import { Group, Path, Rect } from "react-konva";
import { commonValues } from "../../utils/commonValues";
import { konvaTextContainers } from "../../utils/textHelpers";

const { initialWidth, initialHeight, padding } = commonValues;

const greetingT = konvaTextContainers(["Hello I'm"], {
  fontSize: 38,
  lineHeight: 1,
});

const nameT = konvaTextContainers(["John Doe"], {
  fontSize: 42,
  fontStyle: "600",
  lineHeight: 1,
});

const positionT = konvaTextContainers(["Web Developer"], {
  fontSize: 18,
  fontStyle: "600",
  lineHeight: 1.2,
});

const locationT = konvaTextContainers(["San Francisco, CA"], {});

const LocationSVG = ({ size = 16 }: { size?: number }) => {
  const scale = size / 200; // Assuming the original SVG is 100x100
  return (
    <Path
      scaleX={scale}
      scaleY={scale}
      data="M100 0c41.974 0 76 34.026 76 76 0 56.974-76 124-76 124S24 132.974 24 76c0-41.974 34.026-76 76-76Zm0 32c-20.434 0-37 16.566-37 37s16.566 37 37 37c20.435 0 37-16.566 37-37s-16.565-37-37-37Z"
      fill="#000"
    />
  );
};

const MailSVG = ({ size = 16 }: { size?: number }) => {
  const scale = size / 200; // Assuming the original SVG is 100x100
  return (
    <Path
      scaleX={scale}
      scaleY={scale}
      data="M200 165a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V73.055l99.5 56.991L200 72.481V165Zm-8-138a8 8 0 0 1 8 8v17.89L99.5 110.455 0 53.463V35a8 8 0 0 1 8-8h184Z"
      fill="#000"
    />
  );
};

const WebSVG = ({ size = 16 }: { size?: number }) => {
  const scale = size / 200; // Assuming the original SVG is 100x100
  return (
    <Path
      scaleX={scale}
      scaleY={scale}
      data="M100 0c55.228 0 100 44.772 100 100s-44.772 100-100 100c-41.006 0-76.248-24.682-91.679-60H8v-.747C2.851 127.201 0 113.934 0 100 0 44.772 44.772 0 100 0ZM77.907 140c1.899 9.134 4.4 17.239 7.305 23.995 3.347 7.785 6.896 13.001 9.972 16.026 3 2.952 4.608 2.979 4.816 2.979.208 0 1.816-.027 4.816-2.979 3.076-3.025 6.625-8.241 9.972-16.026 2.905-6.756 5.406-14.861 7.305-23.995H77.907Zm-50.65 0c9.94 18.036 26.393 31.98 46.188 38.66-5.552-10.152-10.002-23.415-12.866-38.66H27.258Zm112.164 0c-2.864 15.245-7.315 28.508-12.867 38.66 19.796-6.68 36.249-20.623 46.188-38.66h-33.321ZM19.426 80A83.185 83.185 0 0 0 17 100a83.04 83.04 0 0 0 3.229 23h37.915A228.826 228.826 0 0 1 57 100c0-6.85.297-13.538.861-20H19.426Zm55.507 0A212.47 212.47 0 0 0 74 100c0 8.018.437 15.722 1.237 23h49.526c.8-7.278 1.237-14.982 1.237-23a212.3 212.3 0 0 0-.933-20H74.933Zm67.206 0c.564 6.462.861 13.15.861 20 0 7.915-.396 15.615-1.144 23h37.915A83.002 83.002 0 0 0 183 100a83.18 83.18 0 0 0-2.426-20h-38.435ZM73.445 21.339C52.565 28.385 35.405 43.512 25.684 63H60.04c2.828-16.507 7.491-30.849 13.405-41.661ZM100 17c-.209 0-1.816.027-4.816 2.979-3.076 3.025-6.625 8.241-9.972 16.026-3.22 7.487-5.941 16.63-7.898 26.995h45.372c-1.957-10.365-4.678-19.508-7.898-26.995-3.347-7.785-6.896-13.001-9.972-16.027-3-2.951-4.608-2.978-4.816-2.978Zm26.554 4.339C132.468 32.15 137.132 46.493 139.96 63h34.355c-9.721-19.488-26.881-34.615-47.761-41.661Z"
      fill="#000"
    />
  );
};

const PhoneSVG = ({ size = 16 }: { size?: number }) => {
  const scale = size / 200; // Assuming the original SVG is 100x100
  return (
    <Path
      scaleX={scale}
      scaleY={scale}
      data="M89.437 42.437c4.296 4.296 4.296 11.26 0 15.557l-13.34 13.34c-3.76 6.007 2.895 14.884 18.079 32.29 17.406 15.184 26.282 21.838 32.289 18.08l13.341-13.341c4.296-4.296 11.261-4.296 15.556 0l23.524 23.523c4.296 4.296 4.296 11.261 0 15.557l-16.575 16.575a10.97 10.97 0 0 1-8.028 3.216c-24.456 5.471-67.674-21.675-84.858-38.859-17.184-17.184-44.33-60.401-38.859-84.858a10.965 10.965 0 0 1 3.216-8.028l16.575-16.575c4.296-4.296 11.26-4.296 15.556 0l23.524 23.523Z"
      fill="#000"
    />
  );
};

const HeaderSection = () => {
  return (
    <Group name="cv-header">
      <Rect
        width={initialWidth - padding * 2}
        height={initialHeight * 0.21 - padding}
        fill="#f0f0f0"
      />
      <Rect
        width={200}
        height={initialHeight * 0.21}
        y={-padding}
        fill="#464c69"
      />
      <Group
        name="name"
        x={200 + padding}
        y={padding * 1.5}
        height={initialHeight * 0.2 - padding}
      >
        <Group>{greetingT.elements}</Group>
        <Group y={greetingT.totalHeight}>{nameT.elements}</Group>
        <Group y={nameT.totalHeight + greetingT.totalHeight + padding / 2}>
          {positionT.elements}
        </Group>
        <Rect
          name="divider"
          width={500}
          height={1}
          fill="#464c69"
          y={
            nameT.totalHeight +
            greetingT.totalHeight +
            positionT.totalHeight +
            padding
          }
        />
        <Group
          y={
            nameT.totalHeight +
            greetingT.totalHeight +
            positionT.totalHeight +
            padding * 1.5
          }
        >
          <Group>
            <LocationSVG />
            {locationT.elements}
          </Group>
          <MailSVG />
          <WebSVG />
          <PhoneSVG />
        </Group>
      </Group>
    </Group>
  );
};

export default HeaderSection;
