import { AspectRatioBox } from "common/components/AspectRatioBox";
import { css, useTheme } from "@emotion/react";
import { Ellipse } from "common/components/Ellipse";

const ellipseBgBaseStyles = css`
  position: absolute;
`;

export const EllipseBg = () => {
  const theme = useTheme();

  return (
    <div
      css={(theme) => css`
        position: absolute;
        top: 0;
        width: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1099;

        // FIXME: 100vh does not work well on mobile,
        // we will have to one day fix footer to the bottom of the page and we
        // will be able to remove usage of 100vh when that happens
        height: max(100%, 100vh);
      `}
    >
      {theme.palette.mode === "dark" ? (
        <>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              ${ellipseBgBaseStyles};
              filter: blur(100px);
              width: 48.2%;
              min-width: 694px;
              left: 70%;
              top: 0;
              /* transform: translate(-50%, -50%); */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(-50%, -50%, 0);
              -moz-transform: translate3d(-50%, -50%, 0);
            `}
          >
            <Ellipse />
          </AspectRatioBox>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              ${ellipseBgBaseStyles};
              filter: blur(100px);
              width: 48.2%;
              min-width: 694px;
              left: 0%;
              top: 500px;
              /* transform: translate(-50%, -50%); */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(-50%, -50%, 0);
              -moz-transform: translate3d(-50%, -50%, 0);

              @media (max-width: 620px) {
                display: none;
              }
            `}
          >
            <Ellipse />
          </AspectRatioBox>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              ${ellipseBgBaseStyles};
              filter: blur(100px);
              width: 48.2%;
              min-width: 994px;
              left: 90%;
              top: 1000px;
              /* transform: translate(-50%, -50%); */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(-50%, -50%, 0);
              -moz-transform: translate3d(-50%, -50%, 0);

              @media (max-width: 620px) {
                display: none;
              }
            `}
          >
            <Ellipse />
          </AspectRatioBox>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              z-index: -99;
              position: absolute;
              filter: blur(170px);
              width: 48.2%;
              min-width: 994px;
              left: 30%;
              top: 1400px;
              /* transform: translate(-50%, -50%); */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(-50%, -50%, 0);
              -moz-transform: translate3d(-50%, -50%, 0);
            `}
          >
            <Ellipse />
          </AspectRatioBox>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              z-index: -99;
              position: absolute;
              filter: blur(190px);
              width: 48.2%;
              min-width: 794px;
              left: 0%;
              top: 1900px;
              /* transform: translate(-50%, -50%); */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(-50%, -50%, 0);
              -moz-transform: translate3d(-50%, -50%, 0);
            `}
          >
            <Ellipse />
          </AspectRatioBox>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              z-index: -99;
              position: absolute;
              filter: blur(170px);
              width: 48.2%;
              min-width: 594px;
              left: 90%;
              top: 2300px;
              /* transform: translate(-50%, -50%); */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(-50%, -50%, 0);
              -moz-transform: translate3d(-50%, -50%, 0);
            `}
          >
            <Ellipse />
          </AspectRatioBox>
        </>
      ) : (
        <>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              ${ellipseBgBaseStyles};
              filter: blur(100px);
              width: 48.2%;
              min-width: 694px;
              top: 0;
              left: 0;
              /* transform: translate(-56.9%, 35%); */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(-56.9%, 35%, 0);
              -moz-transform: translate3d(-56.9%, 35%, 0);
            `}
          >
            <Ellipse />
          </AspectRatioBox>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              ${ellipseBgBaseStyles};
              filter: blur(100px);
              width: 62.7%;
              min-width: 903px;
              top: 0;
              right: 0;
              /* transform: translate(34%, 30.6%); */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(34%, 30.6%, 0);
              -moz-transform: translate3d(34%, 30.6%, 0);
            `}
          >
            <Ellipse />
          </AspectRatioBox>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              ${ellipseBgBaseStyles};
              filter: blur(150px);
              width: 62.7%;
              min-width: 903px;
              top: 0;
              right: 0;
              transform: translate(-70%, 140.6%);
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(-70%, 140.6%, 0);
              -moz-transform: translate3d(-70%, 140.6%, 0);
            `}
          >
            <Ellipse />
          </AspectRatioBox>
          <AspectRatioBox
            paddingTop="100%"
            css={css`
              ${ellipseBgBaseStyles};
              filter: blur(150px);
              width: 62.7%;
              min-width: 903px;
              top: 0;
              right: 0;
              transform: translate(70%, 200.6%);
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              -webkit-transform: translate3d(70%, 200.6%, 0);
              -moz-transform: translate3d(70%, 200.6%, 0);
            `}
          >
            <Ellipse />
          </AspectRatioBox>
        </>
      )}
    </div>
  );
};
