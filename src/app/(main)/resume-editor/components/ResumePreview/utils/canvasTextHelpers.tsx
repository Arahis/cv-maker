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

  const elements = textBlocks.map((text) => {
    const height = getTextHeight(text, textStyle);

    const konvaText = (
      <Text key={text} text={text} y={yOffset} {...textStyle} height={height} />
    );

    yOffset += height;

    return konvaText;
  });

  return {
    totalHeight: yOffset,
    elements,
  };
};
