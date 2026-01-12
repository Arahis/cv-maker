import React, { useEffect, useLayoutEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import "./editor.css";

type RichTextEditorProps = {
  placeholder?: string;
  onChange: (json: string) => void;
  value: string;
};

const theme = {};

function onError(error: Error): void {
  console.error(error);
}

const GetEditorState = ({
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

function ApplySerializedStatePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const lastAppliedRef = React.useRef<string>("");

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

export function TextReader({ value }: { value: string }) {
  const initialConfig = {
    namespace: "EditorPreview",
    editable: false,
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ApplySerializedStatePlugin value={value} />
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none" />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}

export function TextEditor({
  placeholder = "Type your text right here...",
  onChange,
  value,
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "Editor",
    theme,
    onError,
    editorState: value,
  };

  const onEditorChange = (lexicalJson: string) => {
    onChange(lexicalJson);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="contenteditable"
              aria-placeholder={"Enter some text..."}
              placeholder={
                <div className="editorPlaceholder">{placeholder}</div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <GetEditorState onChange={onEditorChange} />
    </LexicalComposer>
  );
}
