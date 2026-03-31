import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const GetEditorStatePlugin = ({
  onChange,
}: {
  onChange: (lexicalJson: string) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const lexicalJson = JSON.stringify(editorState.toJSON());

      editorState.read(() => {
        onChange(lexicalJson);
      });
    });
  }, [editor, onChange]);
  return null;
};

export default GetEditorStatePlugin;
