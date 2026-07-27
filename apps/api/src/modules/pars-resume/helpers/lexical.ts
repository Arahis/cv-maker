import { CreateResumeBody } from "../../resumes/resume.schema.js";
import { ImportedResume } from "../pars.schema.js";

export const EMPTY_LEXICAL_STATE =
  '{"root":{"type":"root","version":1,"children":[{"type":"paragraph","version":1,"direction":"ltr","format":"","indent":0,"children":[]} ]}}';

type LexicalTextNode = {
  type: "text";
  version: 1;
  text: string;
  format: 0;
  style: "";
  mode: "normal";
  detail: 0;
};

type LexicalParagraphNode = {
  type: "paragraph";
  version: 1;
  direction: "ltr";
  format: "";
  indent: 0;
  children: LexicalTextNode[];
};

type LexicalListItemNode = {
  type: "listitem";
  version: 1;
  value: number;
  children: LexicalParagraphNode[];
};

type LexicalListNode = {
  type: "list";
  version: 1;
  listType: "bullet";
  start: 1;
  tag: "ul";
  children: LexicalListItemNode[];
};

function createTextNode(text: string): LexicalTextNode {
  return {
    type: "text",
    version: 1,
    text,
    format: 0,
    style: "",
    mode: "normal",
    detail: 0,
  };
}

function createParagraphNode(text: string): LexicalParagraphNode {
  return {
    type: "paragraph",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    children: [createTextNode(text)],
  };
}

function createBulletListNode(items: string[]): LexicalListNode {
  return {
    type: "list",
    version: 1,
    listType: "bullet",
    start: 1,
    tag: "ul",
    children: items.map((item, index) => ({
      type: "listitem",
      version: 1,
      value: index + 1,
      children: [createParagraphNode(item)],
    })),
  };
}

export function plainTextToLexicalState(text: string): string {
  const lines = text.split(/\r?\n/).map((line) => line.trim());

  const children: Array<LexicalParagraphNode | LexicalListNode> = [];
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length === 0) return;

    children.push(createBulletListNode(currentListItems));
    currentListItems = [];
  };

  for (const line of lines) {
    if (!line) {
      flushList();
      continue;
    }

    const bulletMatch = line.match(/^[-•*]\s+(.+)$/);

    if (bulletMatch) {
      const [, item] = bulletMatch;
      if (item) {
        currentListItems.push(item.trim());
      }
      continue;
    }

    flushList();
    children.push(createParagraphNode(line));
  }

  flushList();

  if (children.length === 0) {
    return EMPTY_LEXICAL_STATE;
  }

  return JSON.stringify({
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children,
    },
  });
}
