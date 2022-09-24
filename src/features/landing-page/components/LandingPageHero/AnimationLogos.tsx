import { gsap } from "gsap";
import { useEffect } from "react";

import { css } from "@emotion/react";

function animateCoinLogo(coinElementId: string, start: number) {
  const duration = 30;

  gsap.to(coinElementId, {
    duration,
    repeat: -1,
    ease: "none",
    immediateRender: true,
    motionPath: {
      start: start,
      end: start - 1,
      path: "#ellipse-to-navigate",
      align: "#ellipse-to-navigate",
      alignOrigin: [0.5, 0.5],
    },
  });
}

export const AnimationLogos = () => {
  // effects
  useEffect(function animateAllCoinLogos() {
    animateCoinLogo("#ethereum-logo", 0);
    animateCoinLogo("#solana-logo", 0.3);
    animateCoinLogo("#bitcoin-logo", 0.5);
    animateCoinLogo("#avalanche-logo", 0.8);
  }, []);

  return (
    <svg
      viewBox="0 0 700 610"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      `}
    >
      {/* Icons */}
      <g filter="url(#g)" id="avalanche-logo">
        <path
          d="M631.61 396.431c-3.262 13.127-16.552 21.126-29.685 17.864-13.132-3.261-21.132-16.547-17.87-29.675 3.263-13.127 16.553-21.125 29.685-17.864 13.132 3.262 21.133 16.548 17.87 29.675Z"
          fill="#2B1E39"
        />
        <path
          d="M631.61 396.431c-3.262 13.127-16.552 21.126-29.685 17.864-13.132-3.261-21.132-16.547-17.87-29.675 3.263-13.127 16.553-21.125 29.685-17.864 13.132 3.262 21.133 16.548 17.87 29.675Z"
          stroke="#493565"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m598.369 398.424-4.709-1.17c-.989-.246-1.478-.367-1.729-.632a1.231 1.231 0 0 1-.309-1.07c.069-.356.42-.724 1.122-1.461l16.718-17.599c.711-.747 1.069-1.12 1.425-1.202.383-.088.788.012 1.085.269.276.24.418.737.697 1.73l1.353 4.764.007.025c.302 1.065.456 1.606.451 2.132a3.65 3.65 0 0 1-.412 1.657c-.244.471-.63.881-1.408 1.693l-8.789 9.276-.023.023c-.772.808-1.163 1.217-1.63 1.483a3.66 3.66 0 0 1-1.657.48c-.529.015-1.083-.123-2.192-.398Zm11.891 2.953 6.747 1.675c.996.248 1.496.372 1.843.25a1.23 1.23 0 0 0 .777-.807c.101-.336-.035-.808-.303-1.732a3.472 3.472 0 0 0-.028-.096l-1.943-6.619-.022-.075c-.276-.921-.415-1.386-.684-1.619a1.223 1.223 0 0 0-1.078-.268c-.35.084-.706.445-1.412 1.174l-4.804 4.944-.017.017c-.704.728-1.056 1.092-1.125 1.445-.071.387.038.788.308 1.076.245.263.746.388 1.741.635Z"
          fill="#F077D8"
        />
      </g>
      <g filter="url(#h)" id="bitcoin-logo">
        <path
          d="M355.5 109.989c-.004 13.528-10.976 24.495-24.507 24.495s-24.497-10.967-24.493-24.495c.004-13.529 10.977-24.496 24.508-24.496 13.531 0 24.496 10.967 24.492 24.496Z"
          fill="#2B1E39"
        />
        <path
          d="M355.5 109.989c-.004 13.528-10.976 24.495-24.507 24.495s-24.497-10.967-24.493-24.495c.004-13.529 10.977-24.496 24.508-24.496 13.531 0 24.496 10.967 24.492 24.496Z"
          stroke="#493565"
        />
        <path
          d="M340.818 103.455c-.379-3.341-3.288-4.413-6.942-4.669l-.08-4.643-2.826.05.078 4.52c-.743.013-1.503.041-2.257.07l-.078-4.55-2.825.048.079 4.642c-.612.023-1.212.045-1.798.055l-.001-.014-3.898.067.052 3.018s2.087-.076 2.053-.037c1.145-.02 1.529.638 1.647 1.21l.091 5.289c.079-.001.182 0 .299.014l-.299.006.127 7.409c-.044.361-.246.939-1.046.955.037.031-2.055.035-2.055.035l-.503 3.385 3.678-.065c.684-.011 1.358-.011 2.019-.018l.082 4.695 2.824-.049-.08-4.645c.775.002 1.526-.005 2.258-.018l.078 4.624 2.827-.05-.08-4.687c4.747-.355 8.052-1.61 8.389-6.079.272-3.598-1.446-5.172-4.155-5.772 1.625-.863 2.624-2.351 2.342-4.796Zm-3.782 10.109c.062 3.509-5.954 3.215-7.87 3.25l-.106-6.221c1.917-.033 7.914-.689 7.976 2.971Zm-1.465-8.754c.054 3.192-4.964 2.907-6.56 2.935l-.096-5.642c1.595-.028 6.599-.623 6.656 2.707Z"
          fill="#F077D8"
        />
      </g>
      <g filter="url(#r)" id="ethereum-logo">
        <path
          d="M144.5 282.992c0 13.526-10.969 24.491-24.5 24.491s-24.5-10.965-24.5-24.491c0-13.527 10.969-24.492 24.5-24.492s24.5 10.965 24.5 24.492Z"
          fill="#2B1E39"
        />
        <path
          d="M144.5 282.992c0 13.526-10.969 24.491-24.5 24.491s-24.5-10.965-24.5-24.491c0-13.527 10.969-24.492 24.5-24.492s24.5 10.965 24.5 24.492Z"
          stroke="#493565"
        />
        <path
          d="M120.228 278.652v-12.321l-10.23 16.969 10.23-4.648ZM120.228 289.347v-10.695l-10.23 4.648 10.23 6.047Zm0-10.695 10.231 4.648-10.231-16.969v12.321ZM120.228 278.653v10.694l10.231-6.046-10.231-4.648ZM120.228 291.284l-10.23-6.043 10.23 14.412v-8.369ZM130.465 285.241l-10.237 6.043v8.369l10.237-14.412Z"
          fill="#F077D8"
        />
      </g>
      <g filter="url(#s)" id="solana-logo">
        <path
          d="M475.311 517.256c3.533 13.057-4.192 26.505-17.254 30.036-13.063 3.532-26.515-4.191-30.048-17.248-3.532-13.058 4.193-26.506 17.255-30.037 13.062-3.531 26.515 4.191 30.047 17.249Z"
          fill="url(#t)"
        />
        <path
          d="M475.311 517.256c3.533 13.057-4.192 26.505-17.254 30.036-13.063 3.532-26.515-4.191-30.048-17.248-3.532-13.058 4.193-26.506 17.255-30.037 13.062-3.531 26.515 4.191 30.047 17.249Z"
          stroke="#000"
          style={{
            mixBlendMode: "overlay",
          }}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M444.884 533.266a1 1 0 0 1 .631-.511l22.121-5.962a.51.51 0 0 1 .523.171.507.507 0 0 1 .056.546l-3.307 6.457a1 1 0 0 1-.632.512l-22.12 5.96a.501.501 0 0 1-.632-.435.507.507 0 0 1 .053-.281l3.307-6.457Zm22.024-10.586a.507.507 0 0 1 .106.76.507.507 0 0 1-.244.151l-22.111 5.997a1.015 1.015 0 0 1-.803-.123l-6.113-3.914a.5.5 0 0 1-.105-.76.503.503 0 0 1 .244-.151l22.111-5.997a1.015 1.015 0 0 1 .802.124l6.113 3.913Zm-27.163-8.413a1.007 1.007 0 0 1 .631-.511l22.121-5.961a.498.498 0 0 1 .522.17.507.507 0 0 1 .056.546l-3.307 6.458a1.008 1.008 0 0 1-.632.511l-22.12 5.961a.51.51 0 0 1-.523-.17.507.507 0 0 1-.056-.547l3.308-6.457Z"
          fill="#1A1C22"
        />
      </g>
      <defs>
        <filter
          id="g"
          x={575.542}
          y={360.245}
          width={68.581}
          height={68.561}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx={2} dy={4} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend
            mode="overlay"
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
          id="h"
          x={301.993}
          y={84.993}
          width={58.015}
          height={57.991}
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
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend
            mode="overlay"
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
          id="r"
          x={93}
          y={258}
          width={58}
          height={57.983}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx={2} dy={4} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend
            mode="overlay"
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
          id="s"
          x={417}
          y={493}
          width={69.32}
          height={69.3}
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
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend
            mode="overlay"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4782_19260"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_4782_19260"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
