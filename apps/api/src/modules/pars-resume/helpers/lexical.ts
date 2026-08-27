export const EMPTY_LEXICAL_STATE =
  '{"root":{"type":"root","version":1,"children":[{"type":"paragraph","version":1,"direction":"ltr","format":"","indent":0,"children":[]} ]}}';

export type LexicalTextNode = {
  type: "text";
  version: 1;
  text: string;
  format: number;
  style: string;
  mode: "normal" | "token" | "segmented";
  detail: number;
};

export type LexicalParagraphNode = {
  type: "paragraph";
  version: 1;
  direction: "ltr" | "rtl" | null;
  format: number;
  indent: number;
  children: LexicalTextNode[];
};

export type LexicalListItemNode = {
  type: "listitem";
  version: 1;
  direction: "ltr" | "rtl" | null;
  format: number;
  indent: number;
  value: number;
  children: (LexicalTextNode | LexicalListNode)[];
};

export type LexicalListNode = {
  type: "list";
  version: 1;
  direction: "ltr" | "rtl" | null;
  format: number;
  indent: number;
  listType: "bullet" | "number";
  start: number;
  tag: "ul" | "ol";
  children: LexicalListItemNode[];
};

export function createTextNode(text: string): LexicalTextNode {
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

export function createParagraphNode(text: string): LexicalParagraphNode {
  return {
    type: "paragraph",
    version: 1,
    direction: "ltr",
    format: 0,
    indent: 0,
    children: [createTextNode(text)],
  };
}

export function createBulletListNode(items: string[]): LexicalListNode {
  return {
    type: "list",
    version: 1,
    direction: "ltr",
    format: 0,
    indent: 0,
    listType: "bullet",
    start: 1,
    tag: "ul",
    children: items.map((item, index) => ({
      type: "listitem",
      version: 1,
      direction: "ltr",
      format: 0,
      indent: 0,
      value: index + 1,
      children: [createTextNode(item)],
    })),
  };
}

export function plainTextToLexicalState(text: string): string {
  if (!text || !text.trim()) {
    return EMPTY_LEXICAL_STATE;
  }

  const lines = text.split(/\r?\n/);

  const children: Array<LexicalParagraphNode | LexicalListNode> = [];
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length === 0) return;
    children.push(createBulletListNode(currentListItems));
    currentListItems = [];
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushList();
      continue;
    }

    const bulletMatch = line.match(/^\s*[-•*]\s+(.+)$/);

    if (bulletMatch) {
      const [, item] = bulletMatch;
      if (item) {
        currentListItems.push(item.trim());
      }
      continue;
    }

    flushList();
    children.push(createParagraphNode(trimmedLine));
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
      format: 0,
      indent: 0,
      children,
    },
  });
}
