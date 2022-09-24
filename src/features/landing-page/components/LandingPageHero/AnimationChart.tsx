import { css } from "@emotion/react";
import { useEffect } from "react";
import { gsap } from "gsap";

export const AnimationChart = () => {
  useEffect(function animateYouRectangle() {
    gsap.to("#you-rectangle", {
      repeat: -1,
      duration: 1.3,
      scale: 1.2,
      yoyo: true,
      ease: "power2.inOut",
      transformOrigin: "50% 50%",
    });
  }, []);

  useEffect(function animatePointShadow() {
    gsap.to("#point-shadow", {
      repeat: -1,
      duration: 1,
      scale: 1.4,
      yoyo: true,
      opacity: 0.5,
      ease: "power2.inOut",
      transformOrigin: "50% 50%",
    });
  }, []);

  return (
    <>
      {/* Chart top */}
      <svg
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
        `}
        viewBox="0 0 700 610"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g mask="url(#chart-top)" clipPath="url(#a)">
          <g id="rectangle">
            <rect
              x={165}
              y={160}
              width={396}
              height={296}
              rx={12}
              fill="#18132b"
            />
            <path
              opacity={0.8}
              d="M306.475 412v-6.578h-2.266v-1.232h5.83v1.232h-2.277V412h-1.287Zm5.163 0v-7.81h1.287V412h-1.287Zm3.641-7.81h1.177l2.728 3.696 2.739-3.696h1.177V412h-1.298v-5.599l-2.607 3.542-2.629-3.553V412h-1.287v-7.81Zm10.173 7.81v-7.81h4.697v1.232h-3.41v2.002h2.75v1.232h-2.75v2.112h3.41V412h-4.697Zm15.514 0-1.815-4.774-1.815 4.774h-1.188l-2.013-7.81h1.353l1.419 5.676 2.244-5.808 2.233 5.808 1.43-5.676h1.364l-2.024 7.81h-1.188Zm4.819 0v-7.81h1.287V412h-1.287Zm5.16 0v-6.578h-2.266v-1.232h5.83v1.232h-2.277V412h-1.287Zm5.163 0v-7.81h1.287v3.234h3.861v-3.234h1.287V412h-1.287v-3.355h-3.861V412h-1.287Zm11.826 0v-7.81h4.642v1.232h-3.355v2.013h2.64v1.221h-2.64V412h-1.287Zm6.338 0v-7.81h2.816c.718 0 1.29.209 1.716.627.432.411.649.942.649 1.595 0 .55-.154 1.005-.462 1.364-.301.352-.737.59-1.309.715l2.904 3.509h-1.584l-2.86-3.432h-.583V412h-1.287Zm1.287-4.554h1.375c.381 0 .682-.088.902-.264.22-.183.33-.44.33-.77s-.11-.583-.33-.759c-.22-.183-.521-.275-.902-.275h-1.375v2.068Zm6.242 4.554v-7.81h1.287V412h-1.287Zm8.713 0-3.795-3.652V412h-1.276v-7.81h1.276v3.366l3.135-3.366h1.628l-3.476 3.74 4.246 4.07h-1.738Zm4.385 0v-6.578h-2.266v-1.232h5.83v1.232h-2.277V412h-1.287Zm5.163 0v-7.81h1.287V412h-1.287Zm7.183-1.111c.763 0 1.408-.271 1.936-.814.528-.543.792-1.203.792-1.98 0-.777-.264-1.437-.792-1.98a2.596 2.596 0 0 0-1.936-.814c-.77 0-1.419.271-1.947.814-.528.543-.792 1.203-.792 1.98 0 .777.264 1.437.792 1.98.528.543 1.177.814 1.947.814Zm2.86.066c-.785.785-1.738 1.177-2.86 1.177-1.122 0-2.075-.389-2.86-1.166-.785-.785-1.177-1.742-1.177-2.871s.392-2.083 1.177-2.86c.785-.785 1.738-1.177 2.86-1.177 1.122 0 2.075.392 2.86 1.177.785.785 1.177 1.738 1.177 2.86 0 1.122-.392 2.075-1.177 2.86Zm9.838 1.045h-1.122l-4.4-5.621V412h-1.287v-7.81h1.122l4.389 5.61v-5.61h1.298V412Z"
              fill="#A7A7B1"
            />
            <rect
              x={165.5}
              y={160.5}
              width={395}
              height={295}
              rx={12}
              stroke="#33285b"
              shapeRendering="crispEdges"
            />
            <path
              d="m203.148 372.322 29.093-112 33.397 71.089 25.689-26.172 17.667 26.172 24.091-14.44 16.061-38.806 20.879 38.806 32.122 33.446 20.879-60.52 30.515 21.66 30.516-49.636 24.091 79.417"
              stroke="#6291F8"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <path
              d="M358.057 325.737 199 373h316V245l-156.943 80.737Z"
              fill="url(#j)"
            />
            <g filter="url(#k)">
              <path
                d="m200.148 373.322 157.044-47.263 154.956-80.737"
                stroke="#F077D8"
                strokeWidth={2.5}
                strokeLinecap="square"
              />
            </g>
            <path
              d="M199 245.322h316M199 277.322h316M199 309.322h316M199 341.322h316M199 373.322h316"
              stroke="#fff"
              strokeOpacity={0.2}
              strokeDasharray="4 4"
            />
            <circle
              opacity={0.3}
              cx={514}
              cy={244}
              r={9.5}
              fill="#CE56C2"
              stroke="#AC3BAB"
              id="point-shadow"
            />
            <g filter="url(#l)">
              <circle cx={514} cy={244} r={5} fill="#F077D8" />
            </g>
            <g filter="url(#m)">
              <rect
                x={199}
                y={192}
                width={66}
                height={26}
                rx={4}
                fill="#6291F8"
                shapeRendering="crispEdges"
              />
              <path
                d="M207.9 200.48h1.74l2.652 3.672 2.676-3.672h1.74V209h-1.92v-5.244l-2.484 3.432-2.496-3.444V209H207.9v-8.52Zm9.693 8.52 3.648-8.52h1.728l3.648 8.52h-1.992l-.756-1.8h-3.528l-.756 1.8h-1.992Zm4.512-6.012-1.08 2.556h2.148l-1.068-2.556Zm5.4 6.012v-8.52h3.36c.784 0 1.42.248 1.908.744s.732 1.104.732 1.824c0 1.072-.556 1.804-1.668 2.196l3.012 3.756h-2.292l-2.844-3.516h-.3V209h-1.908Zm1.908-5.136h1.224c.288 0 .52-.076.696-.228a.728.728 0 0 0 .276-.588.72.72 0 0 0-.276-.6c-.176-.144-.408-.216-.696-.216h-1.224v1.632ZM240.815 209l-3.468-3.816V209h-1.896v-8.52h1.896v3.564l2.892-3.564h2.34l-3.36 4.092 4.044 4.428h-2.448Zm3.038 0v-8.52h5.4v1.824h-3.492v1.524h2.772v1.824h-2.772v1.524h3.492V209h-5.4Zm8.392 0v-6.696h-2.172v-1.824h6.288v1.824h-2.196V209h-1.92Z"
                fill="#000"
              />
            </g>
            <g filter="url(#n)" id="you-rectangle">
              <rect
                x={493}
                y={192}
                width={42}
                height={26}
                rx={4}
                fill="url(#o)"
                shapeRendering="crispEdges"
              />
              <path
                d="M504.204 209v-3.588l-3.108-4.932h2.22l1.836 3.072 1.86-3.072h2.22l-3.108 4.944V209h-1.92Zm7.461-2.46a2.367 2.367 0 0 0 1.764.756c.688 0 1.272-.252 1.752-.756a2.52 2.52 0 0 0 .72-1.8 2.52 2.52 0 0 0-.72-1.8 2.328 2.328 0 0 0-1.752-.756c-.688 0-1.276.252-1.764.756a2.52 2.52 0 0 0-.72 1.8c0 .696.24 1.296.72 1.8Zm4.872 1.308c-.856.864-1.892 1.296-3.108 1.296-1.216 0-2.256-.428-3.12-1.284-.856-.864-1.284-1.904-1.284-3.12 0-1.216.428-2.252 1.284-3.108.864-.864 1.904-1.296 3.12-1.296 1.216 0 2.252.432 3.108 1.296.864.864 1.296 1.9 1.296 3.108 0 1.208-.432 2.244-1.296 3.108Zm8.541.336c-.648.64-1.488.96-2.52.96s-1.876-.32-2.532-.96c-.648-.648-.972-1.5-.972-2.556v-5.148h1.908v5.172c0 .504.144.904.432 1.2.296.296.684.444 1.164.444.48 0 .864-.148 1.152-.444.296-.296.444-.696.444-1.2v-5.172h1.908v5.148c0 1.056-.328 1.908-.984 2.556Z"
                fill="#000"
              />
            </g>
          </g>
        </g>
        <defs>
          <mask id="chart-top">
            <polygon points="700,0 0,0 700,610" fill="white" />
          </mask>
          <linearGradient
            id="d"
            x1={589.108}
            y1={464.699}
            x2={123.031}
            y2={174.035}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <linearGradient
            id="j"
            x1={323.429}
            y1={245}
            x2={357.648}
            y2={351.885}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AC3BAB" stopOpacity={0.8} />
            <stop offset={1} stopColor="#AC3BAB" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="o"
            x1={493}
            y1={205}
            x2={535}
            y2={205}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <linearGradient
            id="p"
            x1={536.05}
            y1={529.639}
            x2={79.035}
            y2={244.624}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <linearGradient
            id="q"
            x1={0}
            y1={11.397}
            x2={22.798}
            y2={11.397}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <linearGradient
            id="t"
            x1={427.527}
            y1={530.174}
            x2={475.792}
            y2={517.117}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <filter
            id="i"
            x={-15}
            y={-20}
            width={756}
            height={656}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImage" stdDeviation={90} />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_4782_19260"
            />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={3} dy={4} />
            <feGaussianBlur stdDeviation={8} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
            <feBlend
              mode="multiply"
              in2="effect1_backgroundBlur_4782_19260"
              result="effect2_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect2_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <filter
            id="k"
            x={190.591}
            y={239.636}
            width={331.244}
            height={147.243}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={4} />
            <feGaussianBlur stdDeviation={4} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.67451 0 0 0 0 0.231373 0 0 0 0 0.670588 0 0 0 0.4 0" />
            <feBlend
              mode="multiply"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <filter
            id="l"
            x={501}
            y={235}
            width={26}
            height={26}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={4} />
            <feGaussianBlur stdDeviation={4} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.67451 0 0 0 0 0.231373 0 0 0 0 0.670588 0 0 0 0.4 0" />
            <feBlend
              mode="multiply"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <filter
            id="m"
            x={198}
            y={192}
            width={68}
            height={28}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={1} />
            <feGaussianBlur stdDeviation={0.5} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.508333 0 0 0 0 0.508333 0 0 0 0 0.508333 0 0 0 0.2 0" />
            <feBlend
              mode="multiply"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <filter
            id="n"
            x={492}
            y={192}
            width={44}
            height={28}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={1} />
            <feGaussianBlur stdDeviation={0.5} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.508333 0 0 0 0 0.508333 0 0 0 0 0.508333 0 0 0 0.2 0" />
            <feBlend
              mode="multiply"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h700v610H0z" />
          </clipPath>
        </defs>
      </svg>
      {/* Chart bottom */}
      <svg
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        `}
        viewBox="0 0 700 610"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g mask="url(#chart-bottom)" clipPath="url(#a)">
          <g id="rectangle">
            <rect
              x={165}
              y={160}
              width={396}
              height={296}
              rx={12}
              fill="#18132b"
            />
            <path
              opacity={0.8}
              d="M306.475 412v-6.578h-2.266v-1.232h5.83v1.232h-2.277V412h-1.287Zm5.163 0v-7.81h1.287V412h-1.287Zm3.641-7.81h1.177l2.728 3.696 2.739-3.696h1.177V412h-1.298v-5.599l-2.607 3.542-2.629-3.553V412h-1.287v-7.81Zm10.173 7.81v-7.81h4.697v1.232h-3.41v2.002h2.75v1.232h-2.75v2.112h3.41V412h-4.697Zm15.514 0-1.815-4.774-1.815 4.774h-1.188l-2.013-7.81h1.353l1.419 5.676 2.244-5.808 2.233 5.808 1.43-5.676h1.364l-2.024 7.81h-1.188Zm4.819 0v-7.81h1.287V412h-1.287Zm5.16 0v-6.578h-2.266v-1.232h5.83v1.232h-2.277V412h-1.287Zm5.163 0v-7.81h1.287v3.234h3.861v-3.234h1.287V412h-1.287v-3.355h-3.861V412h-1.287Zm11.826 0v-7.81h4.642v1.232h-3.355v2.013h2.64v1.221h-2.64V412h-1.287Zm6.338 0v-7.81h2.816c.718 0 1.29.209 1.716.627.432.411.649.942.649 1.595 0 .55-.154 1.005-.462 1.364-.301.352-.737.59-1.309.715l2.904 3.509h-1.584l-2.86-3.432h-.583V412h-1.287Zm1.287-4.554h1.375c.381 0 .682-.088.902-.264.22-.183.33-.44.33-.77s-.11-.583-.33-.759c-.22-.183-.521-.275-.902-.275h-1.375v2.068Zm6.242 4.554v-7.81h1.287V412h-1.287Zm8.713 0-3.795-3.652V412h-1.276v-7.81h1.276v3.366l3.135-3.366h1.628l-3.476 3.74 4.246 4.07h-1.738Zm4.385 0v-6.578h-2.266v-1.232h5.83v1.232h-2.277V412h-1.287Zm5.163 0v-7.81h1.287V412h-1.287Zm7.183-1.111c.763 0 1.408-.271 1.936-.814.528-.543.792-1.203.792-1.98 0-.777-.264-1.437-.792-1.98a2.596 2.596 0 0 0-1.936-.814c-.77 0-1.419.271-1.947.814-.528.543-.792 1.203-.792 1.98 0 .777.264 1.437.792 1.98.528.543 1.177.814 1.947.814Zm2.86.066c-.785.785-1.738 1.177-2.86 1.177-1.122 0-2.075-.389-2.86-1.166-.785-.785-1.177-1.742-1.177-2.871s.392-2.083 1.177-2.86c.785-.785 1.738-1.177 2.86-1.177 1.122 0 2.075.392 2.86 1.177.785.785 1.177 1.738 1.177 2.86 0 1.122-.392 2.075-1.177 2.86Zm9.838 1.045h-1.122l-4.4-5.621V412h-1.287v-7.81h1.122l4.389 5.61v-5.61h1.298V412Z"
              fill="#A7A7B1"
            />
            <rect
              x={165.5}
              y={160.5}
              width={395}
              height={295}
              rx={12}
              stroke="#33285b"
              shapeRendering="crispEdges"
            />
            <path
              d="m203.148 372.322 29.093-112 33.397 71.089 25.689-26.172 17.667 26.172 24.091-14.44 16.061-38.806 20.879 38.806 32.122 33.446 20.879-60.52 30.515 21.66 30.516-49.636 24.091 79.417"
              stroke="#6291F8"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <path
              d="M358.057 325.737 199 373h316V245l-156.943 80.737Z"
              fill="url(#j)"
            />
            <g filter="url(#k)">
              <path
                d="m200.148 373.322 157.044-47.263 154.956-80.737"
                stroke="#F077D8"
                strokeWidth={2.5}
                strokeLinecap="square"
              />
            </g>
            <path
              d="M199 245.322h316M199 277.322h316M199 309.322h316M199 341.322h316M199 373.322h316"
              stroke="#fff"
              strokeOpacity={0.2}
              strokeDasharray="4 4"
            />
            <circle
              opacity={0.3}
              cx={514}
              cy={244}
              r={9.5}
              fill="#CE56C2"
              stroke="#AC3BAB"
              id="point-shadow"
            />
            <g filter="url(#l)">
              <circle cx={514} cy={244} r={5} fill="#F077D8" />
            </g>
            <g filter="url(#m)">
              <rect
                x={199}
                y={192}
                width={66}
                height={26}
                rx={4}
                fill="#6291F8"
                shapeRendering="crispEdges"
              />
              <path
                d="M207.9 200.48h1.74l2.652 3.672 2.676-3.672h1.74V209h-1.92v-5.244l-2.484 3.432-2.496-3.444V209H207.9v-8.52Zm9.693 8.52 3.648-8.52h1.728l3.648 8.52h-1.992l-.756-1.8h-3.528l-.756 1.8h-1.992Zm4.512-6.012-1.08 2.556h2.148l-1.068-2.556Zm5.4 6.012v-8.52h3.36c.784 0 1.42.248 1.908.744s.732 1.104.732 1.824c0 1.072-.556 1.804-1.668 2.196l3.012 3.756h-2.292l-2.844-3.516h-.3V209h-1.908Zm1.908-5.136h1.224c.288 0 .52-.076.696-.228a.728.728 0 0 0 .276-.588.72.72 0 0 0-.276-.6c-.176-.144-.408-.216-.696-.216h-1.224v1.632ZM240.815 209l-3.468-3.816V209h-1.896v-8.52h1.896v3.564l2.892-3.564h2.34l-3.36 4.092 4.044 4.428h-2.448Zm3.038 0v-8.52h5.4v1.824h-3.492v1.524h2.772v1.824h-2.772v1.524h3.492V209h-5.4Zm8.392 0v-6.696h-2.172v-1.824h6.288v1.824h-2.196V209h-1.92Z"
                fill="#000"
              />
            </g>
            <g filter="url(#n)" id="you-rectangle">
              <rect
                x={493}
                y={192}
                width={42}
                height={26}
                rx={4}
                fill="url(#o)"
                shapeRendering="crispEdges"
              />
              <path
                d="M504.204 209v-3.588l-3.108-4.932h2.22l1.836 3.072 1.86-3.072h2.22l-3.108 4.944V209h-1.92Zm7.461-2.46a2.367 2.367 0 0 0 1.764.756c.688 0 1.272-.252 1.752-.756a2.52 2.52 0 0 0 .72-1.8 2.52 2.52 0 0 0-.72-1.8 2.328 2.328 0 0 0-1.752-.756c-.688 0-1.276.252-1.764.756a2.52 2.52 0 0 0-.72 1.8c0 .696.24 1.296.72 1.8Zm4.872 1.308c-.856.864-1.892 1.296-3.108 1.296-1.216 0-2.256-.428-3.12-1.284-.856-.864-1.284-1.904-1.284-3.12 0-1.216.428-2.252 1.284-3.108.864-.864 1.904-1.296 3.12-1.296 1.216 0 2.252.432 3.108 1.296.864.864 1.296 1.9 1.296 3.108 0 1.208-.432 2.244-1.296 3.108Zm8.541.336c-.648.64-1.488.96-2.52.96s-1.876-.32-2.532-.96c-.648-.648-.972-1.5-.972-2.556v-5.148h1.908v5.172c0 .504.144.904.432 1.2.296.296.684.444 1.164.444.48 0 .864-.148 1.152-.444.296-.296.444-.696.444-1.2v-5.172h1.908v5.148c0 1.056-.328 1.908-.984 2.556Z"
                fill="#000"
              />
            </g>
          </g>
        </g>
        <defs>
          <mask id="chart-bottom">
            <polygon points="0,0 700,610 0,610" fill="white" />
          </mask>
          <linearGradient
            id="d"
            x1={589.108}
            y1={464.699}
            x2={123.031}
            y2={174.035}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <linearGradient
            id="j"
            x1={323.429}
            y1={245}
            x2={357.648}
            y2={351.885}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AC3BAB" stopOpacity={0.8} />
            <stop offset={1} stopColor="#AC3BAB" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="o"
            x1={493}
            y1={205}
            x2={535}
            y2={205}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <linearGradient
            id="p"
            x1={536.05}
            y1={529.639}
            x2={79.035}
            y2={244.624}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <linearGradient
            id="q"
            x1={0}
            y1={11.397}
            x2={22.798}
            y2={11.397}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <linearGradient
            id="t"
            x1={427.527}
            y1={530.174}
            x2={475.792}
            y2={517.117}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A695FC" />
            <stop offset={1} stopColor="#F27EE3" />
          </linearGradient>
          <filter
            id="i"
            x={-15}
            y={-20}
            width={756}
            height={656}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImage" stdDeviation={90} />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_4782_19260"
            />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={3} dy={4} />
            <feGaussianBlur stdDeviation={8} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
            <feBlend
              mode="multiply"
              in2="effect1_backgroundBlur_4782_19260"
              result="effect2_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect2_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <filter
            id="k"
            x={190.591}
            y={239.636}
            width={331.244}
            height={147.243}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={4} />
            <feGaussianBlur stdDeviation={4} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.67451 0 0 0 0 0.231373 0 0 0 0 0.670588 0 0 0 0.4 0" />
            <feBlend
              mode="multiply"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <filter
            id="l"
            x={501}
            y={235}
            width={26}
            height={26}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={4} />
            <feGaussianBlur stdDeviation={4} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.67451 0 0 0 0 0.231373 0 0 0 0 0.670588 0 0 0 0.4 0" />
            <feBlend
              mode="multiply"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <filter
            id="m"
            x={198}
            y={192}
            width={68}
            height={28}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={1} />
            <feGaussianBlur stdDeviation={0.5} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.508333 0 0 0 0 0.508333 0 0 0 0 0.508333 0 0 0 0.2 0" />
            <feBlend
              mode="multiply"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <filter
            id="n"
            x={492}
            y={192}
            width={44}
            height={28}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={1} />
            <feGaussianBlur stdDeviation={0.5} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.508333 0 0 0 0 0.508333 0 0 0 0 0.508333 0 0 0 0.2 0" />
            <feBlend
              mode="multiply"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4782_19260"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4782_19260"
              result="shape"
            />
          </filter>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h700v610H0z" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};
