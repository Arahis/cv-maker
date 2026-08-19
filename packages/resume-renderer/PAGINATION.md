# Pagination

Resume pagination is implemented in `src/pagination` and is intended for rendering an HTML resume preview split into A4 pages.

## Main components

### `PaginationDocument`

The root pagination component. It measures the document flow, detects intersections with page boundaries, calculates `FlowBreak` objects, and renders layout breaks inside the corresponding flows.

```tsx
<PaginationDocument
  pagePaddingX={40}
  revision={data}
  breakBackground="white"
>
  {children}
</PaginationDocument>
```

Properties:

| Property | Description |
| --- | --- |
| `revision` | A value that triggers pagination recalculation when it changes. Resume data is typically used here. |
| `pagePaddingX` | Horizontal page padding. |
| `headerFooterHeight` | Header and footer height. |
| `pageGap` | Height of the visual gap between pages. |
| `breakBackground` | Default layout-break background color. |

`breakBackground` applies to breaks that do not have a color configured at the `ColumnsRegion` level.

### `FullWidthRegion`

An ordinary block flow spanning the full document width:

```tsx
<FullWidthRegion>
  <Summary />
</FullWidthRegion>
```

### `ColumnsRegion`

A region with two independent pagination flows: left and right.

```tsx
<ColumnsRegion
  gridTemplateColumns="minmax(0, 60fr) minmax(0, 40fr)"
  leftColumn={<LeftSection />}
  rightColumn={<RightSection />}
/>
```

Main properties:

| Property | Description |
| --- | --- |
| `leftColumn` | Content of the left flow. |
| `rightColumn` | Content of the right flow. |
| `gridTemplateColumns` | CSS grid column definition. |
| `gap` | Gap between columns in pixels. Defaults to `24`. |
| `divider` | Adds `border-left`, left padding, and `h-full` to the right column. |
| `breakBackground` | One break color for both columns in the region. |
| `leftBreakBackground` | Break color for the left column only. |
| `rightBreakBackground` | Break color for the right column only. |
| `leftColumnClassName` | Additional classes for the left column container. |
| `rightColumnClassName` | Additional classes for the right column container. |

Break color precedence:

```text
leftBreakBackground / rightBreakBackground
        ↓
region breakBackground
        ↓
PaginationDocument breakBackground
        ↓
white
```

Example: setting a color for a nested region:

```tsx
<NestedColumnsRegion
  breakBackground="#f3f4f6"
  leftColumn={<Company />}
  rightColumn={<Position />}
/>
```

Different colors for each flow:

```tsx
<ColumnsRegion
  leftBreakBackground="#f3f4f6"
  rightBreakBackground="#e5e7eb"
  leftColumn={<Company />}
  rightColumn={<Position />}
/>
```

### `NestedColumnsRegion`

A wrapper around `ColumnsRegion` for columns placed inside an existing column. It automatically adds the `nested-columns-region w-full` classes.

```tsx
<NestedColumnsRegion
  className="items-start"
  divider
  breakBackground="#f3f4f6"
  leftColumn={<Company />}
  rightColumn={<Position />}
/>
```

A nested region retains two child flows of its own. As a result, breaks may appear inside the nested region's child flows independently of the parent flow.

### `KeepTogether`

`KeepTogether` wraps a logical block in its own pagination flow and keeps the
block together when it reaches a page boundary. If the block intersects the
break zone, the paginator moves the entire block to the next page instead of
splitting its children.

Use it around the complete logical item, including its heading and body:

```tsx
<KeepTogether className="not-last:pb-8">
  <div>
    <NestedColumnsRegion
      leftColumn={<Company />}
      rightColumn={<Position />}
    />
    <Dates />
    <Description />
  </div>
</KeepTogether>
```

The `className` is applied to the pagination flow itself, so sibling variants
such as `not-last:pb-8` continue to work between adjacent blocks. Wrapping only
the heading does not keep the following content together.

## How breaks work

A break consists of two parts:

1. `page-anchor` — a float anchor with the calculated `marginTop`.
2. `flow-breaker` — a float with `clear: both`, the flow width, and the `--page-break-height` height.

Simplified structure:

```html
<div class="pagination-widget">
  <div class="page-break">
    <div class="page-anchor"></div>
    <div class="flow-breaker"></div>
  </div>
</div>
```

`flow-breaker` participates in layout and has the height of a page. Its background acts as a visual mask for content that may overlap the break area:

```css
.flow-breaker {
  background: var(--flow-break-background, white);
}
```

`z-index` and the background only fix visual overlap. They do not change flow geometry and do not replace pagination recalculation.

## Divider

When `divider={true}`, the right column receives:

```text
border-left: 2px solid rgb(107 114 128)
padding-left: 24px
height: 100%
```

The divider height is determined by the normal height of the grid container and its column content. The current implementation does not use additional `ResizeObserver` measurement.

Important: `h-full` stretches relative to the grid row height. If a `flow-breaker` is inserted into the flow, the row height may include the break height. As a result, the divider may visually cross the page gap. This is a consequence of the current float-based model, not an error in `border-left` itself.

## Limitations and usage rules

- Pagination uses custom float breaks rather than the CSS Fragmentation API.
- `break-inside: avoid` is not the primary pagination mechanism.
- `clear: both` affects float placement but does not remove the `flow-breaker` height from grid geometry.
- `h-full` inside a region may stretch to the height of a row that includes a break.
- Avoid adding `margin-top`, `padding-top`, or spacer hacks without checking layout geometry; they may change the next page boundary.
- Use `NestedColumnsRegion` for nested regions instead of copying its classes manually.
- To change the break color for a specific region, use `breakBackground` on `ColumnsRegion` or `NestedColumnsRegion` instead of globally overriding `.flow-breaker` in CSS.

## Verifying changes

Run the package type check with:

```bash
./node_modules/.bin/tsc -p packages/resume-renderer/tsconfig.json --noEmit
```

Build the package only when the `dist` output needs to be updated. HMR is sufficient during development.
