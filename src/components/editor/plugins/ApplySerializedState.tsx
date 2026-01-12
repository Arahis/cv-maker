import { useLayoutEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function ApplySerializedStatePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const lastAppliedRef = useRef<string>("");

  useLayoutEffect(() => {
    if (!value) return;
    if (lastAppliedRef.current === value) return;

    editor.update(
      () => {
        editor.setEditorState(editor.parseEditorState(value));
      },
      { discrete: true },
    );

    lastAppliedRef.current = value;
  }, [editor, value]);

  return null;
}

export default ApplySerializedStatePlugin;
