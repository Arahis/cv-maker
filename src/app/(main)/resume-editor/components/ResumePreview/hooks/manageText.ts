/**
 * Splits a Text node into multiple chunks so that each chunk
 * fits into a single page by height.
 *
 * IMPORTANT:
 * - Works by real rendered lines (Range.getClientRects)
 * - Can return 1, 2 or N chunks
 * - No recursion
 */

function getLineHeightPx(el: Element): number {
  const cs = getComputedStyle(el);
  const lh = cs.lineHeight;

  if (lh === "normal") {
    return parseFloat(cs.fontSize) * 1.2;
  }

  if (lh.endsWith("px")) {
    return parseFloat(lh);
  }

  const multiplier = Number(lh);
  if (!Number.isNaN(multiplier)) {
    return parseFloat(cs.fontSize) * multiplier;
  }

  return parseFloat(cs.fontSize);
}

function findLineEndOffset(
  textNode: Text,
  startOffset: number,
  lineBottom: number,
): number {
  const text = textNode.textContent ?? "";

  let left = startOffset;
  let right = text.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    const range = document.createRange();
    range.setStart(textNode, startOffset);
    range.setEnd(textNode, mid);

    const rects = range.getClientRects();
    const lastRect = rects[rects.length - 1];

    if (lastRect && lastRect.bottom <= lineBottom) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left - 1;
}

export function divideTextNode(
  textNode: Text,
  blockHeight: number,
  pageHeight: number,
): string[] {
  let fittingHeight = blockHeight;

  const text = textNode.textContent;
  if (!text) return [];

  // Get all rendered line rectangles at once
  const fullRange = document.createRange();
  fullRange.selectNodeContents(textNode);
  const lineRects = Array.from(fullRange.getClientRects());

  const lineHeight = getLineHeightPx(textNode.parentElement!);

  const chunks: string[] = [];

  let chunkStartOffset = 0;
  let charCursor = 0;
  let chunkHeight = 0;

  for (let i = 0; i < lineRects.length; i++) {
    // If adding this line would overflow the page → close current chunk
    if (chunkHeight + lineHeight > fittingHeight && chunkHeight > 0) {
      chunks.push(text.slice(chunkStartOffset, charCursor));

      fittingHeight = pageHeight;
      chunkStartOffset = charCursor;
      chunkHeight = 0;
    }

    // Advance cursor to the end of the current line
    charCursor = findLineEndOffset(textNode, charCursor, lineRects[i].bottom);
    chunkHeight += lineHeight;
  }

  // Push the final chunk
  if (chunkStartOffset < text.length) {
    chunks.push(text.slice(chunkStartOffset));
  }

  return chunks;
}
