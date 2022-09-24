import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { InView } from "react-intersection-observer";

import { ButtonA09 } from "09/Button09";
import { pinkCTAStyles } from "09/HeaderVoltsDropdown";

import { Typography } from "common/components/Typography";

import { DescriptionText } from "features/landing-page/components/DescriptionText";
import { MiddleSectionBackground } from "features/landing-page/components/MiddleSectionBackground";

import circuitsFlowV2 from "./circuitsAssets/circuits-flow-v2.png";
import highLevelCircuitsV2 from "./circuitsAssets/high-level-circuits-v2.png";

// constants
const tableOfContents = [
  { label: "Intro", id: "#intro", childrens: [] },
  {
    label: "Circuits",
    id: "#circuits",
    childrens: [
      { label: "What are circuits?", id: "#what-are-circuits" },
      { label: "Mechanism", id: "#mechanism" },
      { label: "Application", id: "#application" },
      { label: "Inductors", id: "#inductors" },
    ],
  },
  {
    label: "Participants",
    id: "#participants",
    childrens: [
      { label: "DAOs", id: "#daos" },
      { label: "Tradfi Asset Managers", id: "#tradfi" },
      { label: "Market Makers", id: "#market-makers" },
    ],
  },
];

export const ZeroNineCircuits = () => {
  // react hooks
  const [selectedId, setSelectedId] = useState(tableOfContents[0].id);

  // handlers
  function handleScrollIntoView(elementSelector: string) {
    const element = document.querySelector(elementSelector);

    if (element) {
      setSelectedId(elementSelector);

      const NAVBAR_OFFSET = 80;
      const { y } = element.getBoundingClientRect();
      const top = y + window.scrollY - NAVBAR_OFFSET;

      window.scrollTo({ top });
    }
  }

  function handleInViewChange(inView: boolean, elementId: string) {
    if (!inView) return;
    setSelectedId(elementId);
  }

  return (
    <div
      css={css`
        position: relative;
        overflow-x: hidden;
      `}
    >
      <MiddleSectionBackground />
      <Container>
        <Header>
          <div>
            <Typography
              variant="h3"
              css={css`
                font-weight: 600;
              `}
            >
              Circuits
            </Typography>
            <DescriptionText variant="bodyL">
              Treasury management built to maximize long-term protocol value
            </DescriptionText>
          </div>
          <ButtonA09 href="https://forms.gle/rc4cA91CNJzYygGKA" css={ctaButton}>
            Apply to Circuits
          </ButtonA09>
        </Header>
        <ContentContainer>
          <TableOfContents>
            <ul>
              {tableOfContents.map(({ label, id, childrens }) => {
                if (!childrens.length) {
                  return (
                    <li key={id}>
                      <span
                        className={selectedId === id ? "selected" : ""}
                        onClick={() => handleScrollIntoView(id)}
                      >
                        {label}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={id}>
                    <span
                      className={selectedId === id ? "selected" : ""}
                      onClick={() => handleScrollIntoView(id)}
                    >
                      {label}
                    </span>
                    <ul>
                      {childrens.map(({ label, id }) => (
                        <li key={id}>
                          <span
                            className={selectedId === id ? "selected" : ""}
                            onClick={() => handleScrollIntoView(id)}
                          >
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </TableOfContents>
          <Article>
            <InView
              as="div"
              rootMargin="-400px 0px"
              initialInView
              onChange={(inView) => handleInViewChange(inView, "#intro")}
            >
              <Content>
                <Typography
                  variant="h4"
                  css={css`
                    font-weight: 600;
                  `}
                  id="intro"
                >
                  Introduction: DAOs manage risk capital
                </Typography>
                <DescriptionTextContainer>
                  <DescriptionText variant="bodyL">
                    DAOs are evolving to become stewards of users, contributors,
                    and investors. Skillsets vary from software development to
                    token design, with human capital resources clustering to
                    design and ship new products. Acquiring users with bursts of
                    native token emissions has proven powerful but short-term
                    and unsustainable for most.
                  </DescriptionText>
                  <DescriptionText variant="bodyL">
                    Cryptoeconomic systems are at an interesting point - capital
                    inflows capture more time and mindshare in than ever before.
                    However, this evolutionary process has experienced genetic
                    drift in the form of vague circular logic
                    <sup>1</sup> often the only reinforcing mechanism for
                    protocol sustainability.
                  </DescriptionText>
                  <DescriptionText variant="bodyL">
                    A notable void exists today:{" "}
                    <b>sophisticated DAO portfolio management</b>.
                  </DescriptionText>
                  <DescriptionText variant="bodyL">
                    DAOs (and by extension their Treasuries) which aim to
                    survive and thrive across multiple bear markets will
                    recognize the risk inherent in their holdings and seek to
                    deeply analyze and deploy optimized portfolio allocations.
                    Considerations for working capital and revenue reinvestment
                    arise as DAOs scale and require resources outside most DAOs
                    core competencies.
                  </DescriptionText>
                </DescriptionTextContainer>
              </Content>
            </InView>

            <Content>
              <Typography
                variant="h4"
                css={css`
                  font-weight: 600;
                `}
                id="circuits"
              >
                Circuits
              </Typography>
              <DescriptionTextContainer>
                <InView
                  as="div"
                  rootMargin="-400px 0px"
                  onChange={(inView) =>
                    handleInViewChange(inView, "#what-are-circuits")
                  }
                >
                  <Typography
                    variant="h5"
                    css={css`
                      font-weight: 600;
                    `}
                    id="what-are-circuits"
                  >
                    What are Circuits?
                  </Typography>
                </InView>
                <DescriptionText variant="bodyL">
                  Friktion's native <b>on-demand portfolio management</b> system
                  built to drive long-term return generation for decentralized
                  organizations. Circuits enable a new generation of risk-aware
                  DAOs to scale beyond owning/controlling assets (PCA/POL/etc)
                  to managing them <b>(Protocol Managed Assets [PMA])</b>
                </DescriptionText>
                <img
                  src={circuitsFlowV2}
                  alt="Flow for Circuits Participants"
                />
                <InView
                  as="div"
                  rootMargin="-400px 0px"
                  onChange={(inView) =>
                    handleInViewChange(inView, "#mechanism")
                  }
                >
                  <Typography
                    variant="h5"
                    css={css`
                      font-weight: 600;
                    `}
                    id="mechanism"
                  >
                    Mechanism
                  </Typography>
                </InView>
                <DescriptionText variant="bodyL">
                  <b>Current</b> is the flow of capital through <b>Circuits</b>{" "}
                  - Friktion’s portfolio management system.
                </DescriptionText>
                <DescriptionText variant="bodyL">
                  <a
                    style={{
                      color: "white",
                      textDecoration: "underline",
                      fontWeight: "bold",
                    }}
                    rel="noreferrer"
                    target="_blank"
                    href="https://docs.friktion.fi/what-are-volts"
                  >
                    Volts
                  </a>{" "}
                  are Friktion's native capital allocation strategies designed
                  by Inductors - optimizers of Current and risk strategists.
                </DescriptionText>
                <DescriptionText variant="bodyL">
                  <b>Genesis Circuit</b> marks the first Circuit deployment.
                  Once a DAO/Protocol is accepted into a Circuit,{" "}
                  <b>Inductors</b> work to set risk, return, and liquidity
                  parameters (drawdown, volatility, VaR, correlation, sharpe,
                  etc). After these parameters are set, Inductors construct a
                  set of strategies and stress-test across various market
                  conditions. The backtesting process is iterative and learnings
                  are cumulative, out-of-sample simulations after epoch(t) are
                  are updated with performance for epoch(t+1). Strategies are
                  deployed as <b>Custom Volts</b> and allocations change with
                  market environments.
                </DescriptionText>
                <DescriptionText variant="bodyL">
                  <i>
                    Note: While the Genesis deployment is not based on a token
                    voting mechanism, future deployments will be.
                  </i>
                </DescriptionText>
                <img src={highLevelCircuitsV2} alt="High Level Circuit" />
                <InView
                  as="div"
                  rootMargin="-400px 0px"
                  onChange={(inView) =>
                    handleInViewChange(inView, "#application")
                  }
                >
                  <Typography
                    variant="h5"
                    css={css`
                      font-weight: 600;
                    `}
                    id="application"
                  >
                    Application
                  </Typography>
                </InView>
                <DescriptionText variant="bodyL">
                  Apply{" "}
                  <a
                    style={{ color: "white", textDecoration: "underline" }}
                    rel="noreferrer"
                    target="_blank"
                    href="https://forms.gle/rc4cA91CNJzYygGKA"
                  >
                    here
                  </a>{" "}
                  to be a part of the <b>Genesis Circuit</b>. In order to
                  determine whether your currently portfolio would work with
                  Circuits, Inductors require essential data regarding holdings,
                  risk profile, target returns, and capital/liquidity needs.
                  Please include any relevant links! Note: While the Genesis
                  deployment is not based on a token voting mechanism, future
                  deployments will be.
                </DescriptionText>
                <DescriptionText variant="bodyL">
                  Trying to identify if you are a good fit? Connect with us on{" "}
                  <a
                    style={{ color: "white", textDecoration: "underline" }}
                    rel="noreferrer"
                    target="_blank"
                    href="http://discord.gg/friktion"
                  >
                    Discord
                  </a>{" "}
                  with any questions.
                </DescriptionText>
                <InView
                  as="div"
                  rootMargin="-400px 0px"
                  onChange={(inView) =>
                    handleInViewChange(inView, "#inductors")
                  }
                >
                  <Typography
                    variant="h5"
                    css={css`
                      font-weight: 600;
                      margin-top: 24px;
                    `}
                    id="inductors"
                  >
                    Inductors
                  </Typography>
                </InView>
                <DescriptionText variant="bodyL">
                  Inductors serve as <b>risk strategists</b>,{" "}
                  <b>portfolio designers</b>, and <b>architects of Volts</b>.
                  They work closely with Protocols to understand
                  application-specific liabilities<sup>2</sup> and create hedges
                  for them.
                </DescriptionText>
                <DescriptionText variant="bodyL">
                  Eg: AMM Protocols do not underwrite liquidation or solvency
                  risks the same way money markets (lend/borrow) or derivatives
                  protocols with oracle dependencies do<sup>2</sup>.
                  Understanding such dependencies (risk of a liquidation or
                  capitally draining event and magnitude of impact) allows for
                  prudent capital allocation. Inductors identify and simulate
                  market conditions which expose these differences to determine
                  portfolio allocations.
                </DescriptionText>
              </DescriptionTextContainer>
            </Content>

            <Content>
              <Typography
                variant="h4"
                css={css`
                  font-weight: 600;
                `}
                id="participants"
              >
                Participants
              </Typography>
              <DescriptionTextContainer>
                <InView
                  as="div"
                  rootMargin="-50% 0px"
                  onChange={(inView) => handleInViewChange(inView, "#daos")}
                >
                  <Typography
                    variant="h5"
                    css={css`
                      font-weight: 600;
                    `}
                    id="daos"
                  >
                    DAOs (Decentralized Autonomous Organizations)
                  </Typography>
                </InView>
                <DescriptionText variant="bodyL">
                  Direct assets from Treasuries to generate real, risk-managed
                  yields. With over $15bn sitting in DAO Treasuries, the need
                  for sophisticated portfolio construction and dynamic risk
                  management is critical to DAOs becoming the de facto
                  Institutional model of the future. Using Circuits, DAOs can
                  continue to focus on developing new products and growing
                  communities while having access to Friktion’s on-demand market
                  specialists (known as Inductors). to understand
                  application-specific liabilities(n) and create hedges for
                  them.
                </DescriptionText>

                <InView
                  as="div"
                  rootMargin="-450px 0px"
                  onChange={(inView) => handleInViewChange(inView, "#tradfi")}
                >
                  <Typography
                    variant="h5"
                    css={css`
                      font-weight: 600;
                      margin-top: 24px;
                    `}
                    id="tradfi"
                  >
                    Traditional Financial Institutions
                  </Typography>
                </InView>
                <DescriptionText variant="bodyL">
                  The global asset management industry holds north of $100
                  trillion AuM and has been rising steadily over the last two
                  decades. Notably in this zero-interest rate environment,
                  private market AuM has ballooned, largely in part due to the
                  likes of SWFs (Sovereign Wealth Funds), Endowments, and
                  Pension Funds. The thirst for diversification has created a
                  massive liquidity sink in the global financial system which
                  DeFi is primed to fill. Circuits will be critical for legacy
                  Asset Managers to adopt. “Alternatives”, forecasted to be the
                  fastest growing, are ripe for Circuits to disrupt. Friktion is
                  accordingly building infrastructure to enable counterparty
                  identity and KYC/AML requirements to be satisfied where
                  applicable.
                </DescriptionText>

                <InView
                  as="div"
                  rootMargin="-450px 0px"
                  onChange={(inView) =>
                    handleInViewChange(inView, "#market-makers")
                  }
                >
                  <Typography
                    variant="h5"
                    css={css`
                      font-weight: 600;
                      margin-top: 24px;
                    `}
                    id="market-makers"
                  >
                    Market Makers
                  </Typography>
                </InView>
                <DescriptionText variant="bodyL">
                  Friktion's pricing is delivered through a best price engine
                  across multiple settlement layers. A critical part of this is
                  creating deep order books with tight spreads across time and
                  various market volatility levels. Inductors experience in CeFi
                  market microstructure and with various DeFi native AMM models
                  has identified that connecting on-chain platforms like
                  Friktion to the best off-chain Market Makers who run their own
                  pricing algorithms is key to making DeFi markets more
                  efficient. To enable this, Friktion utilizes Channel RFQ,
                  which bridges highly competitive CeFi style on-demand RFQ
                  liquidity from professional market makers.
                </DescriptionText>
              </DescriptionTextContainer>
            </Content>
          </Article>
        </ContentContainer>
      </Container>
    </div>
  );
};

const Container = styled.main`
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 60px 120px 60px;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  padding-bottom: 16px;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[600]};

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: column;

    a {
      margin-top: 18px;
    }
  }
`;

const ctaButton = (theme: any) => css`
  ${pinkCTAStyles(theme)}
  align-self: flex-start;
  padding: 12px 32px;
  justify-content: center;
  width: fit-content;
`;

const ContentContainer = styled.section`
  padding-top: 64px;
  display: grid;
  column-gap: 50px;
  grid-template-columns: 255px 1fr;

  ${({ theme }) => theme.breakpoints.down("md")} {
    grid-template-columns: 1fr;

    > aside {
      display: none;
    }
  }
`;

const TableOfContents = styled.aside`
  font-size: 16px;
  font-family: "Euclid Circular B", sans-serif;
  color: ${({ theme }) => theme.palette.grey[0]};

  ul {
    top: 80px;
    padding: 0;
    position: sticky;
    list-style-type: none;

    li > span {
      will-change: text-shadow;
      transition: text-shadow 100ms ease;

      &.selected {
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.2),
          0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2),
          0 0 20px ${({ theme }) => theme.palette.pink[500]},
          0 0 40px ${({ theme }) => theme.palette.pink[500]},
          0 0 50px ${({ theme }) => theme.palette.pink[500]};
      }

      :hover {
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.2),
          0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2),
          0 0 20px ${({ theme }) => theme.palette.pink[500]},
          0 0 40px ${({ theme }) => theme.palette.pink[500]},
          0 0 50px ${({ theme }) => theme.palette.pink[500]};
      }
    }

    li {
      padding-left: 6px;
      position: relative;
      cursor: pointer;

      :not(:first-child) {
        margin-top: 24px;
      }

      > * + * {
        margin-top: 24px;
      }
    }

    ul {
      padding-left: 16px;
    }
  }
`;

const Article = styled.article`
  h4 {
    margin-bottom: 24px;
  }

  h5 {
    margin-bottom: -10px;
  }

  p {
    > * + * {
      margin-top: 40px !important;
    }
  }

  img {
    width: 100%;

    :not(:last-child) {
      margin-bottom: 48px;
    }
  }
`;

const Content = styled.div`
  padding-bottom: 48px;
`;

const DescriptionTextContainer = styled.div`
  p {
    color: ${({ theme }) => theme.palette.grey[0]};
  }

  > * + * {
    margin-top: 24px;
  }
`;
