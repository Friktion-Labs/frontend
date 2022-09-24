import { css } from "@emotion/react";
import { useTheme } from "@mui/material";

export const RiskChart = (props: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();

  if (theme.palette.mode === "dark") {
    return (
      <>
        <ChartDarkMobile {...props} />
        <ChartDark {...props} />
      </>
    );
  } else {
    return (
      <>
        <ChartDarkMobile {...props} />
        <ChartDark {...props} />
      </>
    );
  }
};

const ChartDark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="856"
    height="265"
    fill="none"
    viewBox="0 0 856 265"
    css={(theme) => css`
      ${theme.breakpoints.down("md")} {
        display: none;
      }
    `}
    {...props}
  >
    <path
      stroke="#74747D"
      strokeWidth="3"
      d="M23.969 262.831L823.969 262.831"
    ></path>
    <path
      fill="#74747D"
      d="M434.032 0l-8.66 15h17.32l-8.66-15zm-1.5 13.5V264h3V13.5h-3z"
    ></path>
    <path
      fill="url(#paint0_radial_3754_8319)"
      fillRule="evenodd"
      d="M619.999 240.5c43.779 19.09 161.973 20.151 211.973 20.151l-287.917.846c-33.553-5.952-51.006-63.615-66.687-115.423C464.001 101.91 451.921 62 432.253 62c-18.954 0-29.099 37.066-40.654 79.285-14.21 51.914-30.551 111.62-68.026 119.775l-226.48-1.6c69.009-3.388 135.226-11.233 155.406-17.96 44.909-14.97 80.921-67.128 111.592-111.551C389.764 92.765 411.695 61 431.972 61c20.83 0 44.516 31.115 72.64 68.062 31.956 41.982 69.644 91.492 115.387 111.438zM97.092 259.46c-21.886 1.075-44.052 1.701-65.12 1.701L31.968 259l65.124.46zm324.796 2.294l-98.315-.694a40.973 40.973 0 01-4.934.76L32.003 262H314.68a43.25 43.25 0 003.959-.18l103.249-.066zm43.718-.027l78.449-.23c.375.066.752.126 1.132.18l-79.581.05zm79.581-.05l286.816-.181S617.369 262 549.827 262c-1.58 0-3.127-.109-4.64-.323zm-79.581.05l-33.636.099-10.082-.072 43.718-.027z"
      clipRule="evenodd"
    ></path>
    <path
      stroke="#74747D"
      strokeWidth="3"
      d="M831.999 260s-214.967.5-282.467.5c-67.5 0-73.5-198.5-117.5-198.5s-40.5 198.5-117.5 198.5h-282.5"
    ></path>
    <path
      stroke="url(#paint1_radial_3754_8319)"
      strokeWidth="3"
      d="M832.032 257c-50 0-158 8.484-212.5-17.5-85.121-40.583-143-178.5-187.5-178.5s-90.264 142.687-177.5 178.5c-47.5 19.5-135 18-222.5 18"
    ></path>
    <g filter="url(#filter0_d_3754_8319)">
      <rect
        width="30.888"
        height="32.001"
        x="417.032"
        y="45"
        fill="#fff"
        rx="15.444"
        shapeRendering="crispEdges"
      ></rect>
      <path
        fill="url(#paint2_linear_3754_8319)"
        d="M425.032 64.585L439.92 51l-4.056 10.48-10.832 3.105z"
      ></path>
      <path
        fill="url(#paint3_linear_3754_8319)"
        d="M437.322 62.16L427.634 71l2.632-6.813 7.056-2.027z"
      ></path>
      <rect
        width="28.888"
        height="30.001"
        x="418.032"
        y="46"
        stroke="url(#paint4_linear_3754_8319)"
        strokeWidth="2"
        rx="14.444"
        shapeRendering="crispEdges"
      ></rect>
    </g>
    <defs>
      <filter
        id="filter0_d_3754_8319"
        width="54.889"
        height="56.001"
        x="405.032"
        y="35"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="2"></feOffset>
        <feGaussianBlur stdDeviation="6"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0.938167 0 0 0 0 0.558333 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3754_8319"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3754_8319"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter1_d_3754_8319"
        width="16"
        height="16"
        x="457"
        y="194"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3754_8319"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3754_8319"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter2_d_3754_8319"
        width="216"
        height="118"
        x="640"
        y="117"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feMorphology
          in="SourceAlpha"
          radius="4"
          result="effect1_dropShadow_3754_8319"
        ></feMorphology>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="4"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3754_8319"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3754_8319"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter3_d_3754_8319"
        width="16"
        height="16"
        x="382"
        y="117"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3754_8319"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3754_8319"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter4_d_3754_8319"
        width="216"
        height="118"
        x="0"
        y="37"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feMorphology
          in="SourceAlpha"
          radius="4"
          result="effect1_dropShadow_3754_8319"
        ></feMorphology>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="4"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3754_8319"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3754_8319"
          result="shape"
        ></feBlend>
      </filter>
      <radialGradient
        id="paint0_radial_3754_8319"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="rotate(122.76 445.499 111.698) scale(905.529 447.859)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#383C8B"></stop>
        <stop offset="0.281" stopColor="#3067F4"></stop>
        <stop offset="0.781" stopColor="#F077D8" stopOpacity="0"></stop>
        <stop offset="1" stopColor="#DBB4D3" stopOpacity="0"></stop>
      </radialGradient>
      <radialGradient
        id="paint1_radial_3754_8319"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="rotate(166.144 412.31 81.05) scale(823.976 387.206)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#383C8B"></stop>
        <stop offset="0.281" stopColor="#3067F4"></stop>
        <stop offset="0.822" stopColor="#F077D8"></stop>
        <stop offset="0.977" stopColor="#DBB4D3"></stop>
      </radialGradient>
      <linearGradient
        id="paint2_linear_3754_8319"
        x1="425.032"
        x2="440.199"
        y1="51"
        y2="51.47"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.089" stopColor="#806EE8"></stop>
        <stop offset="1" stopColor="#C073DF"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_3754_8319"
        x1="427.634"
        x2="437.503"
        y1="62.16"
        y2="62.466"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.089" stopColor="#806EE8"></stop>
        <stop offset="1" stopColor="#C073DF"></stop>
      </linearGradient>
      <linearGradient
        id="paint4_linear_3754_8319"
        x1="417.032"
        x2="448.504"
        y1="45"
        y2="45.858"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.089" stopColor="#806EE8"></stop>
        <stop offset="1" stopColor="#C073DF"></stop>
      </linearGradient>
    </defs>
  </svg>
);

const ChartDarkMobile = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="335"
    height="311"
    fill="none"
    viewBox="0 0 335 311"
    css={(theme) => css`
      ${theme.breakpoints.up("md")} {
        display: none;
      }
    `}
    {...props}
  >
    <path
      stroke="#74747D"
      strokeWidth="3"
      d="M4 301.988L330.997 301.988"
    ></path>
    <path
      fill="#74747D"
      d="M167.189 101.488l-8.66 15h17.321l-8.661-15zm-1.5 13.5v188.5h3v-188.5h-3z"
    ></path>
    <path
      fill="url(#paint0_radial_3761_15697)"
      fillRule="evenodd"
      d="M322.934 300.011c2.449.042 4.896.03 7.336-.023l-7.336.023zm-6.137.018l6.137-.018c-18.247-.318-36.581-3.7-52.357-16.523-13.961-11.346-25.691-35.211-37.699-59.641-18.226-37.083-37.093-75.469-65.376-73.359-27.259 2.034-45.535 39.53-62.678 74.703-12.363 25.364-24.136 49.519-38.265 58.297-10.864 6.75-26.79 15.494-62.555 15.494v1.506H4h.003v.848l163.498-.848 100.747-.309 62.749-.074s-5.743.007-14.2-.076zm-48.549.15l48.549-.15c-19.14-.186-52.179-.829-64.011-3.041-43.303-4.71-56.514-60.886-66.191-102.03-5.732-24.372-10.223-43.47-18.994-43.47-9.034 0-15.232 21.212-22.92 47.523-12.379 42.36-28.618 97.935-66.768 99.477-26.861.108-73.454 1.982-73.91 2l264.245-.309z"
      clipRule="evenodd"
    ></path>
    <path
      stroke="#74747D"
      strokeWidth="3"
      d="M330.999 299.488h-59.93c-94.39 0-72.415-142-103.313-145-30.897-3-13.051 145-103.445 145H4.38"
    ></path>
    <path
      stroke="url(#paint1_radial_3761_15697)"
      strokeWidth="3"
      d="M330.999 296.488h-29.965c-66.922 0-75.41-145-133.278-145-57.868 0-65.989 145-133.41 145H4.38"
    ></path>
    <g filter="url(#filter0_d_3761_15697)">
      <rect
        width="31.863"
        height="32.001"
        x="152"
        y="138.488"
        fill="#fff"
        rx="15.931"
        shapeRendering="crispEdges"
      ></rect>
      <path
        fill="url(#paint2_linear_3761_15697)"
        d="M160.487 158.073l14.889-13.585-4.057 10.48-10.832 3.105z"
      ></path>
      <path
        fill="url(#paint3_linear_3761_15697)"
        d="M172.777 155.648l-9.688 8.841 2.632-6.814 7.056-2.027z"
      ></path>
      <rect
        width="29.863"
        height="30.001"
        x="153"
        y="139.488"
        stroke="url(#paint4_linear_3761_15697)"
        strokeWidth="2"
        rx="14.931"
        shapeRendering="crispEdges"
      ></rect>
    </g>
    <defs>
      <filter
        id="filter0_d_3761_15697"
        width="55.862"
        height="56.001"
        x="140"
        y="128.488"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="2"></feOffset>
        <feGaussianBlur stdDeviation="6"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0.938167 0 0 0 0 0.558333 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3761_15697"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3761_15697"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter1_d_3761_15697"
        width="140"
        height="156"
        x="0"
        y="8.488"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feMorphology
          in="SourceAlpha"
          radius="4"
          result="effect1_dropShadow_3761_15697"
        ></feMorphology>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="4"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3761_15697"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3761_15697"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter2_d_3761_15697"
        width="140"
        height="156"
        x="195"
        y="8.488"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feMorphology
          in="SourceAlpha"
          radius="4"
          result="effect1_dropShadow_3761_15697"
        ></feMorphology>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="4"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3761_15697"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3761_15697"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter3_d_3761_15697"
        width="16"
        height="16"
        x="64"
        y="272.488"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3761_15697"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3761_15697"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter4_d_3761_15697"
        width="16"
        height="16"
        x="255"
        y="294.488"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3761_15697"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3761_15697"
          result="shape"
        ></feBlend>
      </filter>
      <radialGradient
        id="paint0_radial_3761_15697"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="rotate(121.033 278.183 125.97) scale(667.321 320.392)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#383C8B"></stop>
        <stop offset="0.281" stopColor="#3067F4"></stop>
        <stop offset="0.781" stopColor="#F077D8" stopOpacity="0"></stop>
        <stop offset="1" stopColor="#DBB4D3" stopOpacity="0"></stop>
      </radialGradient>
      <radialGradient
        id="paint1_radial_3761_15697"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(-326.61987 144.99724 -108.67997 -244.81181 330.999 151.488)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#383C8B"></stop>
        <stop offset="0.281" stopColor="#3067F4"></stop>
        <stop offset="0.822" stopColor="#F077D8"></stop>
        <stop offset="0.977" stopColor="#DBB4D3"></stop>
      </radialGradient>
      <linearGradient
        id="paint2_linear_3761_15697"
        x1="160.487"
        x2="175.654"
        y1="144.488"
        y2="144.958"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.089" stopColor="#806EE8"></stop>
        <stop offset="1" stopColor="#C073DF"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_3761_15697"
        x1="163.089"
        x2="172.958"
        y1="155.648"
        y2="155.954"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.089" stopColor="#806EE8"></stop>
        <stop offset="1" stopColor="#C073DF"></stop>
      </linearGradient>
      <linearGradient
        id="paint4_linear_3761_15697"
        x1="152"
        x2="184.463"
        y1="138.488"
        y2="139.401"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.089" stopColor="#806EE8"></stop>
        <stop offset="1" stopColor="#C073DF"></stop>
      </linearGradient>
    </defs>
  </svg>
);
