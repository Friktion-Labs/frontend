import { css } from "@emotion/react";
import { useTheme } from "@mui/material";
import { AlanGreenSpan } from "../../../09/glow09";

export const CashSecuredPutChart = ({
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <div
      css={css`
        display: flex;
        margin: auto;
        width: 407px;
      `}
    >
      <div
        css={css`
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: end;
        `}
      >
        <AlanGreenSpan
          css={css`
            display: flex;
            width: 116px;
            font-family: "Euclid Circular B";
            font-size: 12px;
          `}
        >
          CASH SECURED PUT
        </AlanGreenSpan>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="407"
          height="159"
          fill="none"
          viewBox="0 0 407 159"
          {...props}
        >
          <path
            stroke="url(#paint0_linear_3_141_put)"
            strokeWidth="2"
            strokeDasharray="12 8"
            d="M56.308 158.056L213.8 12.123a8.2 8.2 0 015.573-2.166h186.935"
          ></path>
          <path
            stroke={isDarkMode ? "#fff" : "#545B81"}
            strokeDasharray="4 4"
            strokeOpacity={isDarkMode ? "0.35" : "0.75"}
            strokeWidth="0.5"
            d="M54.805 9.598L406.805 9.598"
          ></path>
          <path
            stroke={isDarkMode ? "#fff" : "#545B81"}
            strokeOpacity={isDarkMode ? "0.5" : "0.75"}
            strokeWidth="0.5"
            d="M54.805 84.081L406.805 84.081"
          ></path>
          <path
            stroke={isDarkMode ? "#fff" : "#545B81"}
            strokeDasharray="4 4"
            strokeOpacity={isDarkMode ? "0.35" : "0.75"}
            strokeWidth="0.5"
            d="M54.805 158.081L406.805 158.081"
          ></path>
          <path
            stroke={
              isDarkMode ? theme.palette.grey[600] : theme.palette.grey[400]
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M27 1v8M23 5h8M23 155h8"
          ></path>
          <path
            fill="#74747D"
            d="M2.732 76.48H0.128V85H1.244V81.892H2.732C4.508 81.892 5.66 80.728 5.66 79.192C5.66 77.656 4.508 76.48 2.732 76.48ZM2.732 80.86H1.244V77.524H2.732C3.908 77.524 4.556 78.244 4.556 79.192C4.556 80.14 3.908 80.86 2.732 80.86ZM7.15925 85H8.27525V81.124H9.10325L12.3793 85H13.7833L10.5073 81.112C11.8153 80.92 12.6073 80.08 12.6073 78.832C12.6073 77.428 11.6353 76.48 10.0633 76.48H7.15925V85ZM8.27525 80.128V77.512H9.93125C10.9033 77.512 11.4913 77.968 11.4913 78.832C11.4913 79.684 10.9033 80.128 9.93125 80.128H8.27525ZM22.8441 80.74C22.8441 78.268 20.9001 76.336 18.4401 76.336C15.9921 76.336 14.0361 78.268 14.0361 80.74C14.0361 83.212 15.9921 85.144 18.4401 85.144C20.9001 85.144 22.8441 83.212 22.8441 80.74ZM15.1641 80.74C15.1641 78.868 16.5801 77.392 18.4401 77.392C20.3121 77.392 21.7281 78.868 21.7281 80.74C21.7281 82.612 20.3121 84.088 18.4401 84.088C16.5801 84.088 15.1641 82.612 15.1641 80.74ZM24.5264 85H25.6424V81.172H28.6784V80.116H25.6424V77.536H29.4824V76.48H24.5264V85ZM30.9014 85H32.0174V76.48H30.9014V85ZM36.0044 85H37.0964V77.536H39.7484V76.48H33.3524V77.536H36.0044V85Z"
          ></path>
          <path
            stroke={isDarkMode ? "#fff" : "#000000"}
            strokeDasharray="4 4"
            strokeOpacity="0.3"
            strokeWidth="2"
            d="M216 13.968L216 81.968"
          ></path>
          <g filter="url(#filter0_d_3_141_put)">
            <circle cx="216" cy="9" r="4" fill="#CE56C2"></circle>
            <circle
              cx="216"
              cy="9"
              r="3"
              stroke="#fff"
              strokeWidth="2"
            ></circle>
          </g>
          <g filter="url(#filter1_d_3_141)">
            <rect
              width="72"
              height="32"
              x="180"
              y="90"
              fill={isDarkMode ? theme.palette.grey[900] : "#FFFFFF"}
              rx="4"
              shapeRendering="crispEdges"
            ></rect>
            <path
              fill={isDarkMode ? "#CECED8" : "#74747D"}
              d="M199.42 110.144c-.352 0-.684-.04-.996-.12a3.69 3.69 0 01-.864-.312 3.31 3.31 0 01-.672-.492 2.486 2.486 0 01-.456-.612l.9-.672c.232.36.52.644.864.852.352.208.768.312 1.248.312.44 0 .812-.112 1.116-.336.304-.224.456-.536.456-.936 0-.344-.104-.632-.312-.864-.208-.232-.512-.424-.912-.576l-1.128-.432c-.672-.248-1.164-.556-1.476-.924-.304-.368-.456-.844-.456-1.428 0-.344.068-.656.204-.936.136-.28.32-.52.552-.72.24-.2.52-.352.84-.456a3.516 3.516 0 011.068-.156c.536 0 1.016.108 1.44.324.432.216.78.496 1.044.84l-.816.72a2.643 2.643 0 00-.732-.612 1.936 1.936 0 00-.96-.228c-.208 0-.408.028-.6.084a1.657 1.657 0 00-.492.24 1.197 1.197 0 00-.324.372.972.972 0 00-.12.48c0 .36.104.64.312.84.216.192.54.368.972.528l1.032.396c.632.24 1.12.552 1.464.936.344.384.516.892.516 1.524 0 .36-.068.688-.204.984a2.239 2.239 0 01-.564.744c-.24.2-.528.356-.864.468a3.324 3.324 0 01-1.08.168zm5.987-7.608h-2.652v-1.056h6.396v1.056h-2.652V110h-1.092v-7.464zm5.08-1.056h2.904c.392 0 .744.056 1.056.168.32.112.588.272.804.48.224.208.392.456.504.744.12.288.18.608.18.96 0 .624-.188 1.136-.564 1.536-.368.4-.884.648-1.548.744l3.288 3.888h-1.404l-3.276-3.876h-.828V110h-1.116v-8.52zm2.772 3.648c.488 0 .868-.108 1.14-.324.28-.216.42-.54.42-.972 0-.432-.14-.76-.42-.984-.272-.224-.652-.336-1.14-.336h-1.656v2.616h1.656zm4.846-3.648h1.116V110h-1.116v-8.52zm4.479 4.464V110h-1.104v-8.52h1.104v3.696l3.72-3.696h1.452l-4.056 4.056 4.98 4.464h-1.572l-4.524-4.056zm6.946-4.464h4.968v1.056h-3.852v2.58h3.132v1.056h-3.132v2.772h3.852V110h-4.968v-8.52z"
            ></path>
          </g>
          <path
            fill={isDarkMode ? "#CECED8" : "#74747D"}
            d="M309.844 60.248c.544.512.816 1.16.816 1.944s-.272 1.432-.816 1.944c-.536.504-1.24.756-2.112.756h-1.488V68h-1.116v-8.52h2.604c.872 0 1.576.256 2.112.768zm-.78 3.144c.328-.312.492-.712.492-1.2s-.164-.888-.492-1.2c-.32-.312-.764-.468-1.332-.468h-1.488v3.336h1.488c.568 0 1.012-.156 1.332-.468zM312.159 68v-8.52h2.904c.784 0 1.404.216 1.86.648.456.424.684.992.684 1.704 0 .624-.188 1.136-.564 1.536-.368.4-.884.648-1.548.744L318.783 68h-1.404l-3.276-3.876h-.828V68h-1.116zm1.116-4.872h1.656c.496 0 .88-.108 1.152-.324.272-.224.408-.548.408-.972 0-.424-.136-.748-.408-.972-.272-.232-.656-.348-1.152-.348h-1.656v2.616zM319.776 68v-8.52h4.968v1.056h-3.852v2.58h3.132v1.056h-3.132v2.772h3.852V68h-4.968zm6.68-8.52h1.02l3.156 4.248 3.18-4.248h1.008V68h-1.104v-6.624l-3.072 4.128-3.072-4.128V68h-1.116v-8.52zM337.085 68v-8.52h1.116V68h-1.116zm9.015-.792c-.616.624-1.42.936-2.412.936s-1.796-.312-2.412-.936c-.616-.632-.924-1.472-.924-2.52V59.48h1.116v5.232c0 .76.2 1.348.6 1.764.4.408.94.612 1.62.612.68 0 1.22-.204 1.62-.612.4-.416.6-1.004.6-1.764V59.48h1.116v5.208c0 1.048-.308 1.888-.924 2.52zm3.067-7.728h1.02l3.156 4.248 3.18-4.248h1.008V68h-1.104v-6.624l-3.072 4.128-3.072-4.128V68h-1.116v-8.52zm17.532 8.664c-1.336 0-2.436-.42-3.3-1.26-.856-.84-1.284-1.888-1.284-3.144 0-1.24.424-2.284 1.272-3.132.848-.848 1.904-1.272 3.168-1.272 1.304 0 2.372.396 3.204 1.188l-.744.804c-.68-.624-1.5-.936-2.46-.936s-1.756.324-2.388.972c-.624.64-.936 1.432-.936 2.376 0 .96.316 1.76.948 2.4.64.632 1.48.948 2.52.948.976 0 1.732-.212 2.268-.636v-2.28h-2.412v-1.044h3.492v3.816c-.376.392-.86.692-1.452.9-.592.2-1.224.3-1.896.3zm4.006-.144l3.768-8.52h.924l3.78 8.52h-1.164l-1.104-2.484h-3.972L371.857 68h-1.152zm4.212-7.008l-1.536 3.516h3.084l-1.548-3.516zM380.374 68v-8.52h1.116V68h-1.116zm10.635 0h-.96l-5.184-6.636V68h-1.116v-8.52h.972l5.184 6.636V59.48h1.104V68zm2.267 0v-8.52h4.968v1.056h-3.852v2.58h3.132v1.056h-3.132v2.772h3.852V68h-4.968zm6.68 0v-8.52h2.448c1.304 0 2.384.404 3.24 1.212.864.808 1.296 1.824 1.296 3.048s-.432 2.24-1.296 3.048c-.856.808-1.936 1.212-3.24 1.212h-2.448zm1.116-1.044h1.332c1.016 0 1.836-.3 2.46-.9.632-.608.948-1.38.948-2.316 0-.936-.316-1.704-.948-2.304-.624-.608-1.444-.912-2.46-.912h-1.332v6.432z"
          ></path>
          <defs>
            <filter
              id="filter0_d_3_141_put"
              width="16"
              height="16"
              x="208"
              y="5"
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
                result="effect1_dropShadow_3_141"
              ></feBlend>
              <feBlend
                in="SourceGraphic"
                in2="effect1_dropShadow_3_141"
                result="shape"
              ></feBlend>
            </filter>
            <filter
              id="filter1_d_3_141"
              width="80"
              height="40"
              x="176"
              y="90"
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
                result="effect1_dropShadow_3_141"
              ></feMorphology>
              <feOffset dy="4"></feOffset>
              <feGaussianBlur stdDeviation="4"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
              <feBlend
                in2="BackgroundImageFix"
                result="effect1_dropShadow_3_141"
              ></feBlend>
              <feBlend
                in="SourceGraphic"
                in2="effect1_dropShadow_3_141"
                result="shape"
              ></feBlend>
            </filter>
            <linearGradient
              id="paint0_linear_3_141_put"
              x1="89.793"
              x2="359"
              y1="195.762"
              y2="-43.313"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#28EDBF" />
              <stop offset="0" stopColor="#5DED39" />
              <stop offset="1" stopColor="#28EDBF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export const MobileCashSecuredPutChart = ({
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <AlanGreenSpan
        css={css`
          position: absolute;
          right: 0;
          top: -10%;
          font-family: "Euclid Circular B";
          font-size: 12px;
        `}
      >
        CASH SECURED PUT
      </AlanGreenSpan>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="407"
        height="159"
        fill="none"
        viewBox="0 0 407 159"
        css={css`
          width: 100%;
        `}
        {...props}
      >
        <path
          stroke="url(#paint0_linear_3_141_put)"
          strokeWidth="2"
          strokeDasharray="12 8"
          d="M56.308 158.056L213.8 12.123a8.2 8.2 0 015.573-2.166h186.935"
        ></path>
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeDasharray="4 4"
          strokeOpacity={isDarkMode ? "0.35" : "0.75"}
          strokeWidth="0.5"
          d="M54.805 9.598L406.805 9.598"
        ></path>
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeOpacity={isDarkMode ? "0.5" : "0.75"}
          strokeWidth="0.5"
          d="M54.805 84.081L406.805 84.081"
        ></path>
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeDasharray="4 4"
          strokeOpacity={isDarkMode ? "0.35" : "0.75"}
          strokeWidth="0.5"
          d="M54.805 158.081L406.805 158.081"
        ></path>
        <path
          stroke={
            isDarkMode ? theme.palette.grey[600] : theme.palette.grey[400]
          }
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M27 1v8M23 5h8M23 155h8"
        ></path>
        <path
          fill="#74747D"
          d="M2.732 76.48H0.128V85H1.244V81.892H2.732C4.508 81.892 5.66 80.728 5.66 79.192C5.66 77.656 4.508 76.48 2.732 76.48ZM2.732 80.86H1.244V77.524H2.732C3.908 77.524 4.556 78.244 4.556 79.192C4.556 80.14 3.908 80.86 2.732 80.86ZM7.15925 85H8.27525V81.124H9.10325L12.3793 85H13.7833L10.5073 81.112C11.8153 80.92 12.6073 80.08 12.6073 78.832C12.6073 77.428 11.6353 76.48 10.0633 76.48H7.15925V85ZM8.27525 80.128V77.512H9.93125C10.9033 77.512 11.4913 77.968 11.4913 78.832C11.4913 79.684 10.9033 80.128 9.93125 80.128H8.27525ZM22.8441 80.74C22.8441 78.268 20.9001 76.336 18.4401 76.336C15.9921 76.336 14.0361 78.268 14.0361 80.74C14.0361 83.212 15.9921 85.144 18.4401 85.144C20.9001 85.144 22.8441 83.212 22.8441 80.74ZM15.1641 80.74C15.1641 78.868 16.5801 77.392 18.4401 77.392C20.3121 77.392 21.7281 78.868 21.7281 80.74C21.7281 82.612 20.3121 84.088 18.4401 84.088C16.5801 84.088 15.1641 82.612 15.1641 80.74ZM24.5264 85H25.6424V81.172H28.6784V80.116H25.6424V77.536H29.4824V76.48H24.5264V85ZM30.9014 85H32.0174V76.48H30.9014V85ZM36.0044 85H37.0964V77.536H39.7484V76.48H33.3524V77.536H36.0044V85Z"
        ></path>
        <path
          stroke={isDarkMode ? "#fff" : "#000000"}
          strokeDasharray="4 4"
          strokeOpacity="0.3"
          strokeWidth="2"
          d="M216 13.968L216 81.968"
        ></path>
        <g filter="url(#filter0_d_3_141_put)">
          <circle cx="216" cy="9" r="4" fill="#CE56C2"></circle>
          <circle cx="216" cy="9" r="3" stroke="#fff" strokeWidth="2"></circle>
        </g>
        <g filter="url(#filter1_d_3_141)">
          <rect
            width="72"
            height="32"
            x="180"
            y="90"
            fill={isDarkMode ? theme.palette.grey[900] : "#FFFFFF"}
            rx="4"
            shapeRendering="crispEdges"
          ></rect>
          <path
            fill={isDarkMode ? "#CECED8" : "#74747D"}
            d="M199.42 110.144c-.352 0-.684-.04-.996-.12a3.69 3.69 0 01-.864-.312 3.31 3.31 0 01-.672-.492 2.486 2.486 0 01-.456-.612l.9-.672c.232.36.52.644.864.852.352.208.768.312 1.248.312.44 0 .812-.112 1.116-.336.304-.224.456-.536.456-.936 0-.344-.104-.632-.312-.864-.208-.232-.512-.424-.912-.576l-1.128-.432c-.672-.248-1.164-.556-1.476-.924-.304-.368-.456-.844-.456-1.428 0-.344.068-.656.204-.936.136-.28.32-.52.552-.72.24-.2.52-.352.84-.456a3.516 3.516 0 011.068-.156c.536 0 1.016.108 1.44.324.432.216.78.496 1.044.84l-.816.72a2.643 2.643 0 00-.732-.612 1.936 1.936 0 00-.96-.228c-.208 0-.408.028-.6.084a1.657 1.657 0 00-.492.24 1.197 1.197 0 00-.324.372.972.972 0 00-.12.48c0 .36.104.64.312.84.216.192.54.368.972.528l1.032.396c.632.24 1.12.552 1.464.936.344.384.516.892.516 1.524 0 .36-.068.688-.204.984a2.239 2.239 0 01-.564.744c-.24.2-.528.356-.864.468a3.324 3.324 0 01-1.08.168zm5.987-7.608h-2.652v-1.056h6.396v1.056h-2.652V110h-1.092v-7.464zm5.08-1.056h2.904c.392 0 .744.056 1.056.168.32.112.588.272.804.48.224.208.392.456.504.744.12.288.18.608.18.96 0 .624-.188 1.136-.564 1.536-.368.4-.884.648-1.548.744l3.288 3.888h-1.404l-3.276-3.876h-.828V110h-1.116v-8.52zm2.772 3.648c.488 0 .868-.108 1.14-.324.28-.216.42-.54.42-.972 0-.432-.14-.76-.42-.984-.272-.224-.652-.336-1.14-.336h-1.656v2.616h1.656zm4.846-3.648h1.116V110h-1.116v-8.52zm4.479 4.464V110h-1.104v-8.52h1.104v3.696l3.72-3.696h1.452l-4.056 4.056 4.98 4.464h-1.572l-4.524-4.056zm6.946-4.464h4.968v1.056h-3.852v2.58h3.132v1.056h-3.132v2.772h3.852V110h-4.968v-8.52z"
          ></path>
        </g>
        <path
          fill={isDarkMode ? "#CECED8" : "#74747D"}
          d="M309.844 60.248c.544.512.816 1.16.816 1.944s-.272 1.432-.816 1.944c-.536.504-1.24.756-2.112.756h-1.488V68h-1.116v-8.52h2.604c.872 0 1.576.256 2.112.768zm-.78 3.144c.328-.312.492-.712.492-1.2s-.164-.888-.492-1.2c-.32-.312-.764-.468-1.332-.468h-1.488v3.336h1.488c.568 0 1.012-.156 1.332-.468zM312.159 68v-8.52h2.904c.784 0 1.404.216 1.86.648.456.424.684.992.684 1.704 0 .624-.188 1.136-.564 1.536-.368.4-.884.648-1.548.744L318.783 68h-1.404l-3.276-3.876h-.828V68h-1.116zm1.116-4.872h1.656c.496 0 .88-.108 1.152-.324.272-.224.408-.548.408-.972 0-.424-.136-.748-.408-.972-.272-.232-.656-.348-1.152-.348h-1.656v2.616zM319.776 68v-8.52h4.968v1.056h-3.852v2.58h3.132v1.056h-3.132v2.772h3.852V68h-4.968zm6.68-8.52h1.02l3.156 4.248 3.18-4.248h1.008V68h-1.104v-6.624l-3.072 4.128-3.072-4.128V68h-1.116v-8.52zM337.085 68v-8.52h1.116V68h-1.116zm9.015-.792c-.616.624-1.42.936-2.412.936s-1.796-.312-2.412-.936c-.616-.632-.924-1.472-.924-2.52V59.48h1.116v5.232c0 .76.2 1.348.6 1.764.4.408.94.612 1.62.612.68 0 1.22-.204 1.62-.612.4-.416.6-1.004.6-1.764V59.48h1.116v5.208c0 1.048-.308 1.888-.924 2.52zm3.067-7.728h1.02l3.156 4.248 3.18-4.248h1.008V68h-1.104v-6.624l-3.072 4.128-3.072-4.128V68h-1.116v-8.52zm17.532 8.664c-1.336 0-2.436-.42-3.3-1.26-.856-.84-1.284-1.888-1.284-3.144 0-1.24.424-2.284 1.272-3.132.848-.848 1.904-1.272 3.168-1.272 1.304 0 2.372.396 3.204 1.188l-.744.804c-.68-.624-1.5-.936-2.46-.936s-1.756.324-2.388.972c-.624.64-.936 1.432-.936 2.376 0 .96.316 1.76.948 2.4.64.632 1.48.948 2.52.948.976 0 1.732-.212 2.268-.636v-2.28h-2.412v-1.044h3.492v3.816c-.376.392-.86.692-1.452.9-.592.2-1.224.3-1.896.3zm4.006-.144l3.768-8.52h.924l3.78 8.52h-1.164l-1.104-2.484h-3.972L371.857 68h-1.152zm4.212-7.008l-1.536 3.516h3.084l-1.548-3.516zM380.374 68v-8.52h1.116V68h-1.116zm10.635 0h-.96l-5.184-6.636V68h-1.116v-8.52h.972l5.184 6.636V59.48h1.104V68zm2.267 0v-8.52h4.968v1.056h-3.852v2.58h3.132v1.056h-3.132v2.772h3.852V68h-4.968zm6.68 0v-8.52h2.448c1.304 0 2.384.404 3.24 1.212.864.808 1.296 1.824 1.296 3.048s-.432 2.24-1.296 3.048c-.856.808-1.936 1.212-3.24 1.212h-2.448zm1.116-1.044h1.332c1.016 0 1.836-.3 2.46-.9.632-.608.948-1.38.948-2.316 0-.936-.316-1.704-.948-2.304-.624-.608-1.444-.912-2.46-.912h-1.332v6.432z"
        ></path>
        <defs>
          <filter
            id="filter0_d_3_141_put"
            width="16"
            height="16"
            x="208"
            y="5"
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
              result="effect1_dropShadow_3_141"
            ></feBlend>
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_3_141"
              result="shape"
            ></feBlend>
          </filter>
          <filter
            id="filter1_d_3_141"
            width="80"
            height="40"
            x="176"
            y="90"
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
              result="effect1_dropShadow_3_141"
            ></feMorphology>
            <feOffset dy="4"></feOffset>
            <feGaussianBlur stdDeviation="4"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="out"></feComposite>
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_3_141"
            ></feBlend>
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_3_141"
              result="shape"
            ></feBlend>
          </filter>
          <linearGradient
            id="paint0_linear_3_141_put"
            x1="89.793"
            x2="359"
            y1="195.762"
            y2="-43.313"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#28EDBF" />
            <stop offset="0" stopColor="#5DED39" />
            <stop offset="1" stopColor="#28EDBF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
