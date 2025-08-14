export function LocationIcon({ size = 24, color = "black", className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill={color}
      className={className}
    >
      <path d="M100 0c41.974 0 76 34.026 76 76 0 56.974-76 124-76 124S24 132.974 24 76c0-41.974 34.026-76 76-76Zm0 32c-20.434 0-37 16.566-37 37s16.566 37 37 37c20.435 0 37-16.566 37-37s-16.565-37-37-37Z" />
    </svg>
  );
}
