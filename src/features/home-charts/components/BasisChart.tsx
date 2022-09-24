import { css } from "@emotion/react";
import { useTheme } from "@mui/material";
import { PinkSpan } from "09/glow09";

export const BasisChart = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <PinkSpan
        css={css`
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 24%;
          font-family: "Euclid Circular B";
          font-size: 12px;
        `}
      >
        LONG BASIS YIELD
      </PinkSpan>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="430"
        height="150"
        fill="none"
        viewBox="0 0 430 150"
        css={css`
          width: 100%;
        `}
        {...props}
      >
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeDasharray="4 4"
          strokeOpacity={isDarkMode ? "0.35" : "0.75"}
          strokeWidth="0.5"
          d="M40.508 0.509L392.508 0.509"
        ></path>
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeOpacity={isDarkMode ? "0.5" : "0.75"}
          strokeWidth="0.5"
          d="M40.508 25.479h352M40.508 124.479h352"
        ></path>
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeDasharray="4 4"
          strokeOpacity={isDarkMode ? "0.35" : "0.75"}
          strokeWidth="0.5"
          d="M40.508 148.992L392.508 148.992"
        ></path>
        <path
          stroke="url(#paint0_linear_3_141_basis)"
          strokeDasharray="12 8"
          strokeWidth="2"
          d="M39.492 3S89 68 111.5 68c22.5 0 52.5-26.5 76-26.5s33.5 44 62 44S289 68 320.5 68s68 79 68 79"
        ></path>
        <path
          fill={isDarkMode ? "#fff" : "#000000"}
          fillOpacity="0.3"
          d="M56 95.968l5.773-10H50.227l5.774 10zm-1-68v1.889h2v-1.89h-2zm0 5.666v3.778h2v-3.778h-2zm0 7.556v3.778h2V41.19h-2zm0 7.556v3.777h2v-3.777h-2zm0 7.555v3.778h2V56.3h-2zm0 7.556v3.777h2v-3.777h-2zm0 7.555v3.778h2v-3.778h-2zm0 7.556v3.778h2v-3.778h-2zm0 7.555v3.778h2v-3.778h-2z"
        ></path>
        <path
          fill={isDarkMode ? "#fff" : "#000000"}
          fillOpacity="0.3"
          d="M375.293 48.293a1 1 0 011.414 0l6.364 6.364a1 1 0 11-1.414 1.414L376 50.414l-5.657 5.657a1 1 0 11-1.414-1.414l6.364-6.364zM375 117v-1.889h2V117h-2zm0-5.667v-3.777h2v3.777h-2zm0-7.555V100h2v3.778h-2zm0-7.556v-3.778h2v3.778h-2zm0-7.555v-3.778h2v3.778h-2zm0-7.556v-3.778h2v3.778h-2zm0-7.556v-3.777h2v3.777h-2zM375 66v-3.778h2V66h-2zm0-7.556v-3.777h2v3.777h-2zm0-7.555V49h2v1.889h-2z"
        ></path>
        <g filter="url(#filter3_d_3_141_basis)">
          <rect
            width="98"
            height="32"
            x="328"
            y="9"
            fill={isDarkMode ? theme.palette.grey[900] : "#FFFFFF"}
            rx="4"
            shapeRendering="crispEdges"
          ></rect>
          <path
            fill={isDarkMode ? "#CECED8" : "#74747D"}
            d="M345.128 29v-8.52h1.116v7.464h4.116V29h-5.232zm9.886-.912c.936 0 1.716-.324 2.34-.972.632-.648.948-1.44.948-2.376 0-.936-.316-1.728-.948-2.376-.624-.648-1.404-.972-2.34-.972-.928 0-1.708.324-2.34.972-.624.648-.936 1.44-.936 2.376 0 .936.312 1.728.936 2.376.632.648 1.412.972 2.34.972zm0 1.056c-1.224 0-2.264-.424-3.12-1.272-.856-.856-1.284-1.9-1.284-3.132 0-1.232.428-2.272 1.284-3.12.856-.856 1.896-1.284 3.12-1.284 1.232 0 2.272.428 3.12 1.284.856.848 1.284 1.888 1.284 3.12 0 1.232-.428 2.276-1.284 3.132-.848.848-1.888 1.272-3.12 1.272zM368.361 29h-.96l-5.184-6.636V29h-1.116v-8.52h.972l5.184 6.636V20.48h1.104V29zm6.275.144c-1.336 0-2.436-.42-3.3-1.26-.856-.84-1.284-1.888-1.284-3.144 0-1.24.424-2.284 1.272-3.132.848-.848 1.904-1.272 3.168-1.272 1.304 0 2.372.396 3.204 1.188l-.744.804c-.68-.624-1.5-.936-2.46-.936s-1.756.324-2.388.972c-.624.64-.936 1.432-.936 2.376 0 .96.316 1.76.948 2.4.64.632 1.48.948 2.52.948.976 0 1.732-.212 2.268-.636v-2.28h-2.412v-1.044h3.492v3.816c-.376.392-.86.692-1.452.9-.592.2-1.224.3-1.896.3zm12.778-7.896c.544.512.816 1.16.816 1.944s-.272 1.432-.816 1.944c-.536.504-1.24.756-2.112.756h-1.488V29h-1.116v-8.52h2.604c.872 0 1.576.256 2.112.768zm-.78 3.144c.328-.312.492-.712.492-1.2s-.164-.888-.492-1.2c-.32-.312-.764-.468-1.332-.468h-1.488v3.336h1.488c.568 0 1.012-.156 1.332-.468zM389.73 29v-8.52h4.968v1.056h-3.852v2.58h3.132v1.056h-3.132v2.772h3.852V29h-4.968zm6.679 0v-8.52h2.904c.784 0 1.404.216 1.86.648.456.424.684.992.684 1.704 0 .624-.188 1.136-.564 1.536-.368.4-.884.648-1.548.744L403.033 29h-1.404l-3.276-3.876h-.828V29h-1.116zm1.116-4.872h1.656c.496 0 .88-.108 1.152-.324.272-.224.408-.548.408-.972 0-.424-.136-.748-.408-.972-.272-.232-.656-.348-1.152-.348h-1.656v2.616zm11.217-2.88c.544.512.816 1.16.816 1.944s-.272 1.432-.816 1.944c-.536.504-1.24.756-2.112.756h-1.488V29h-1.116v-8.52h2.604c.872 0 1.576.256 2.112.768zm-.78 3.144c.328-.312.492-.712.492-1.2s-.164-.888-.492-1.2c-.32-.312-.764-.468-1.332-.468h-1.488v3.336h1.488c.568 0 1.012-.156 1.332-.468z"
          ></path>
        </g>
        <g filter="url(#filter1_d_3_141_basis)">
          <rect
            width="105"
            height="32"
            x="4"
            y="104"
            fill={isDarkMode ? theme.palette.grey[900] : "#FFFFFF"}
            rx="4"
            shapeRendering="crispEdges"
          ></rect>
          <path
            fill={isDarkMode ? "#CECED8" : "#74747D"}
            d="M23.42 124.144c-.68 0-1.292-.144-1.836-.432-.536-.288-.92-.656-1.152-1.104l.9-.672c.504.776 1.208 1.164 2.112 1.164.456 0 .832-.112 1.128-.336.296-.232.444-.544.444-.936 0-.656-.408-1.136-1.224-1.44l-1.128-.432c-.672-.248-1.164-.556-1.476-.924-.304-.376-.456-.852-.456-1.428 0-.688.248-1.236.744-1.644.504-.416 1.144-.624 1.92-.624.52 0 .996.108 1.428.324.432.208.784.488 1.056.84l-.816.72c-.472-.56-1.036-.84-1.692-.84-.432 0-.796.112-1.092.336-.296.216-.444.496-.444.84s.1.616.3.816c.2.2.528.384.984.552l1.032.396c.656.248 1.148.568 1.476.96.336.392.504.892.504 1.5 0 .712-.256 1.284-.768 1.716-.504.432-1.152.648-1.944.648zm4.352-.144v-8.52h1.117v3.636h4.668v-3.636h1.115V124h-1.115v-3.84h-4.669V124h-1.116zm12.969-.912c.936 0 1.716-.324 2.34-.972.632-.648.948-1.44.948-2.376 0-.936-.316-1.728-.948-2.376-.624-.648-1.404-.972-2.34-.972-.928 0-1.708.324-2.34.972-.624.648-.936 1.44-.936 2.376 0 .936.312 1.728.936 2.376.632.648 1.412.972 2.34.972zm0 1.056c-1.224 0-2.264-.424-3.12-1.272-.856-.856-1.284-1.9-1.284-3.132 0-1.232.428-2.272 1.284-3.12.856-.856 1.896-1.284 3.12-1.284 1.232 0 2.272.428 3.12 1.284.856.848 1.284 1.888 1.284 3.12 0 1.232-.428 2.276-1.284 3.132-.848.848-1.888 1.272-3.12 1.272zm6.086-.144v-8.52h2.904c.784 0 1.404.216 1.86.648.456.424.684.992.684 1.704 0 .624-.188 1.136-.564 1.536-.368.4-.884.648-1.548.744L53.451 124h-1.404l-3.276-3.876h-.828V124h-1.116zm1.116-4.872H49.6c.496 0 .88-.108 1.152-.324.272-.224.408-.548.408-.972 0-.424-.136-.748-.408-.972-.272-.232-.656-.348-1.152-.348h-1.656v2.616zM55.962 124v-7.464h-2.653v-1.056h6.397v1.056h-2.653V124h-1.091zm9.868.144c-.68 0-1.292-.144-1.836-.432-.536-.288-.92-.656-1.152-1.104l.9-.672c.504.776 1.208 1.164 2.112 1.164.456 0 .832-.112 1.128-.336.296-.232.444-.544.444-.936 0-.656-.408-1.136-1.224-1.44l-1.128-.432c-.672-.248-1.164-.556-1.476-.924-.304-.376-.456-.852-.456-1.428 0-.688.248-1.236.744-1.644.504-.416 1.144-.624 1.92-.624.52 0 .996.108 1.428.324.432.208.784.488 1.056.84l-.816.72c-.472-.56-1.036-.84-1.692-.84-.432 0-.796.112-1.092.336-.296.216-.444.496-.444.84s.1.616.3.816c.2.2.528.384.984.552l1.032.396c.656.248 1.148.568 1.476.96.336.392.504.892.504 1.5 0 .712-.256 1.284-.768 1.716-.504.432-1.152.648-1.944.648zm9.069-7.896c.544.512.816 1.16.816 1.944s-.272 1.432-.816 1.944c-.536.504-1.24.756-2.112.756h-1.488V124h-1.116v-8.52h2.604c.872 0 1.576.256 2.112.768zm-.78 3.144c.328-.312.492-.712.492-1.2s-.164-.888-.492-1.2c-.32-.312-.764-.468-1.332-.468h-1.488v3.336h1.488c.568 0 1.012-.156 1.332-.468zm6.91 3.696c.937 0 1.717-.324 2.34-.972.633-.648.949-1.44.949-2.376 0-.936-.316-1.728-.948-2.376-.624-.648-1.404-.972-2.34-.972-.928 0-1.708.324-2.34.972-.624.648-.936 1.44-.936 2.376 0 .936.312 1.728.936 2.376.632.648 1.412.972 2.34.972zm0 1.056c-1.223 0-2.263-.424-3.12-1.272-.855-.856-1.283-1.9-1.283-3.132 0-1.232.428-2.272 1.284-3.12.856-.856 1.896-1.284 3.12-1.284 1.232 0 2.272.428 3.12 1.284.856.848 1.284 1.888 1.284 3.12 0 1.232-.428 2.276-1.284 3.132-.848.848-1.888 1.272-3.12 1.272zm7.382-.144v-7.464h-2.652v-1.056h6.396v1.056h-2.652V124H88.41z"
          ></path>
        </g>
        <g filter="url(#filter0_d_3_141_basis)">
          <circle cx="57" cy="23" r="4" fill="#CE56C2"></circle>
          <circle cx="57" cy="23" r="3" stroke="#fff" strokeWidth="2"></circle>
        </g>
        <g filter="url(#filter2_d_3_141_basis)">
          <circle cx="376" cy="123.968" r="4" fill="#CE56C2"></circle>
          <circle
            cx="376"
            cy="123.968"
            r="3"
            stroke="#fff"
            strokeWidth="2"
          ></circle>
        </g>
        <defs>
          <filter
            id="filter0_d_3_141_basis"
            width="16"
            height="16"
            x="49"
            y="19"
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
            id="filter1_d_3_141_basis"
            width="113"
            height="40"
            x="0"
            y="104"
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
          <filter
            id="filter2_d_3_141_basis"
            width="16"
            height="16"
            x="369"
            y="117.968"
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
            id="filter3_d_3_141_basis"
            width="106"
            height="40"
            x="324"
            y="9"
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
            id="paint0_linear_3_141_basis"
            x1="31.492"
            x2="380.5"
            y1="75"
            y2="75"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="25%" stopColor="#a695fc"></stop>
            <stop offset="50%" stopColor="#f27ee3"></stop>
            <stop offset="75%" stopColor="#a695fc"></stop>
            <stop offset="100%" stopColor="#f27ee3"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
