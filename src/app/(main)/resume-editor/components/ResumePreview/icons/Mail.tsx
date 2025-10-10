export function MailIcon({ size = 24, color = "black", className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill={color}
      className={className}
    >
      <path d="M200 165a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V73.055l99.5 56.991L200 72.481V165Zm-8-138a8 8 0 0 1 8 8v17.89L99.5 110.455 0 53.463V35a8 8 0 0 1 8-8h184Z" />
    </svg>
  );
}
