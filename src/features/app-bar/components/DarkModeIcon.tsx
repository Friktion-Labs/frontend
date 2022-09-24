export const DarkModeIcon: React.FC<React.SVGProps<SVGSVGElement>> & {
  color?: string;
} = ({ color, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="20"
    fill="none"
    viewBox="0 0 18 20"
    {...rest}
  >
    <path
      stroke={color ?? "#000000"}
      strokeWidth="1.5"
      d="M1.25 10c0-4.836 3.918-8.75 8.742-8.75.444 0 1.16.065 1.598.146a.41.41 0 01.128.76A6.852 6.852 0 008.25 8.117c0 4.285 3.895 7.54 8.137 6.73a.41.41 0 01.395.663 8.713 8.713 0 01-6.79 3.24C5.16 18.75 1.25 14.828 1.25 10z"
    ></path>
  </svg>
);
