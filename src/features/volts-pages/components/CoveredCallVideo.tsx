import React, { useRef, useState } from "react";
import { css, Interpolation } from "@emotion/react";
import { Theme } from "@mui/material";
import videoThumbnailSrc from "../assets/covered-call-video-thumbnail.png";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useIsImageLoaded } from "../hooks/useIsImageLoaded";
import { AspectRatioBox } from "common/components/AspectRatioBox";

export const CoveredCallVideo = (props: { css?: Interpolation<Theme> }) => {
  const videoTarget = useRef<YouTubePlayer>();
  const { imgRef, loaded: videoThumbnailLoaded } = useIsImageLoaded();

  return (
    <AspectRatioBox
      css={css`
        border-radius: 6.73761px;

        & .income-page__video {
          width: 100%;
          height: 100%;

          // show video only after thumbnail loads
          visibility: ${videoThumbnailLoaded ? "visible" : "hidden"};
        }
      `}
      {...props}
    >
      <VideoThumbnail ref={imgRef} videoTarget={videoTarget} />
      <YouTube
        containerClassName="income-page__video"
        videoId="FJNHk4Z6FNo"
        title="How do Covered Call strategies work?"
        onReady={(event) => {
          videoTarget.current = event.target;
        }}
        opts={{
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 0,
          },
        }}
      />
    </AspectRatioBox>
  );
};

const VideoThumbnail = React.forwardRef<
  HTMLImageElement,
  {
    videoTarget: React.MutableRefObject<YouTubePlayer | undefined>;
  }
>(({ videoTarget }, ref) => {
  const [isPlayed, setIsPlayed] = useState(false);

  if (isPlayed) {
    return null;
  }

  return (
    <div
      css={css`
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
      `}
      onClick={() => {
        if (videoTarget.current !== undefined) {
          videoTarget.current.playVideo();
          setIsPlayed(true);
        }
      }}
    >
      <PlayIcon
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `}
      />
      <img
        ref={ref}
        src={videoThumbnailSrc}
        width="100%"
        height="100%"
        alt="How do Covered Cll strategies work video"
      />
    </div>
  );
});

const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="66"
    height="66"
    fill="none"
    viewBox="0 0 66 66"
    {...props}
  >
    <circle
      cx="33"
      cy="33"
      r="32"
      fill="url(#paint0_linear_3732_31841)"
    ></circle>
    <circle
      cx="33"
      cy="33"
      r="32.421"
      stroke="#fff"
      strokeOpacity="0.2"
      strokeWidth="0.842"
    ></circle>
    <path
      fill="#fff"
      d="M27.21 26.028c0-1.333 1.474-2.138 2.595-1.417l12.267 7.886a1.684 1.684 0 010 2.834l-12.267 7.886c-1.121.72-2.595-.084-2.595-1.417V26.028z"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_3732_31841"
        x1="26.514"
        x2="62.957"
        y1="53"
        y2="37.804"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#24BDED"></stop>
        <stop offset="1" stopColor="#4F8FED"></stop>
      </linearGradient>
    </defs>
  </svg>
);
