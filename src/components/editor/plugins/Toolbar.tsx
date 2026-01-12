import { useCallback, useEffect, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";

import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";

import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Bold } from "lucide-react";
import { Italic } from "lucide-react";
import { Underline } from "lucide-react";
import { Strikethrough } from "lucide-react";
import { List } from "lucide-react";
import { ListOrdered } from "lucide-react";
import { Link } from "lucide-react";

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState<string>("paragraph");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = $getNearestNodeOfType(anchorNode, ListNode);

      if ($isListNode(element)) {
        const tag = element.getTag();
        setBlockType(tag);
      } else {
        setBlockType("paragraph");
      }

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor },
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  const formatText = (formatType: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  const formatUlList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatOlList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className="flex">
      <ButtonGroup className="mr-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => formatText("bold")}
          className={"toolbar-item spaced " + (isBold ? "bg-accent" : "")}
          aria-label="Format Bold"
        >
          <Bold />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => formatText("italic")}
          className={"toolbar-item spaced " + (isItalic ? "bg-accent" : "")}
          aria-label="Format Italic"
        >
          <Italic />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => formatText("underline")}
          className={"toolbar-item spaced " + (isUnderline ? "bg-accent" : "")}
          aria-label="Format Underline"
        >
          <Underline />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => formatText("strikethrough")}
          className={
            "toolbar-item spaced " + (isStrikethrough ? "bg-accent" : "")
          }
          aria-label="Format Strikethrough"
        >
          <Strikethrough />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="mr-2">
        <Button variant="outline" size="icon" onClick={formatUlList}>
          <List />
        </Button>
        <Button variant="outline" size="icon" onClick={formatOlList}>
          <ListOrdered />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <Link />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default ToolbarPlugin;
