import Konva from "konva";
import { TextConfig } from "konva/lib/shapes/Text";
import { Text } from "react-konva";

const getTextHeight = (text: string, textStyle?: TextConfig) => {
  const temp = new Konva.Text({
    text,
    ...textStyle,
  });

  return temp.getHeight();
};

export const konvaTextContainers = (
  textBlocks: string[],
  textStyle?: TextConfig,
) => {
  let yOffset = 0;

  return textBlocks.map((text: string) => {
    const height = getTextHeight(text, textStyle);
    const y = yOffset;
    yOffset += height + 12; // Add some spacing between text blocks

    return (
      <Text key={text} text={text} x={0} y={y} {...textStyle} fill="black" />
    );
  });
};
