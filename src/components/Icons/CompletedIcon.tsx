export const CompletedIcon = () => {
  return (
    <svg
      width="91"
      height="83"
      viewBox="0 0 91 83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_1614_27063)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15 39.519L41.14 67.9999L47.7914 57.8672L38.4024 52.3903L15 39.519ZM41.4525 49.3578L50.0754 54.3878L76 14.894L41.4525 49.3578Z"
          fill="url(#paint0_linear_1614_27063)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1614_27063"
          x="0.872606"
          y="0.766649"
          width="89.2548"
          height="81.3607"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1.08672"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_1614_27063"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="6.52034" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 0.439216 0 0 0 0 0.588235 0 0 0 0.6 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1614_27063"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1614_27063"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1614_27063"
          x1="15"
          y1="41.447"
          x2="76"
          y2="41.447"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF47C2" />
          <stop offset="1" stop-color="#FFA18F" />
        </linearGradient>
      </defs>
    </svg>
  );
};
