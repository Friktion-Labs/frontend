import { css } from "@emotion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Typography } from "common/components/Typography";
import { CoveredCallVideo } from "../components/CoveredCallVideo";
import { useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls } from "09/useChristmasCard10";
import { useQuery } from "react-query";
import Select from "react-select";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
  AssetsHeader,
  AssetsSectionContainer,
  Cards,
  ViewOption,
} from "../components/assets-section";
import {
  // Header,
  StrategyContainer,
  StrategyDescription,
  VoltInformation,
} from "../components/volt-description";
import {
  InfoCardsContainer,
  PerformanceCard,
  RiskCard,
} from "../components/volt-description-cards";
import { Table } from "components/Table";
import { getVoltColumns } from "../constants/getVoltColumns";
import { useViewMode } from "../hooks/useViewMode";
import {
  useManagementModal,
  ZeroNineManagementModal,
} from "09/ZeroNineManagementModal";
import { useLocation, useNavigate } from "react-router";
import {
  AmountInput,
  Col,
  customSelectOptionStyles,
  Op,
  Row,
  SearchBox,
  SortBySelect,
  SortByTextAndControlRow,
  SortMethod,
  sortOptions,
  TableControlsRow,
  TableControlsText,
  voltageDefAdjustedCards,
} from "common/utils/voltageDefAdjustedCards";
import { Card10GroupWrapped } from "09/Card10";
import { GlobalId, newGlobalIdToNull } from "09/registry10";
import searchIcon from "../../../09/friktionLogos/searchIcon.png";
import { useElementSize } from "usehooks-ts";
import { getVoltColorPair } from "09/glow09";
import { useAuctionResults } from "09/AuctionResults";

export const Income = () => {
  const { toggleViewMode, viewMode } = useViewMode();
  const vfac09 = useQuarantineChristmas10VFACWarningOnlyWorksWithCoveredCalls();
  const { openModal, modalSesameBall } = useManagementModal();
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();
  let [searchFilter, setSearchFilter] = useState("");
  const [wrapperRef, { width: wrapperWidth }] = useElementSize();
  const { yieldDataPerVolt } = useAuctionResults();
  const [selectedSortOption, setSelectedSortOption] = useState<Op>(
    sortOptions[0]
  );

  // eslint-disable-next-line
  const [_, colorB] = getVoltColorPair(1);

  const handleChange = useCallback((a: Op) => {
    if (a.value === "clear") {
      setSelectedSortOption(sortOptions[0]);
    } else {
      setSelectedSortOption(a);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hash.startsWith("#deposit_")) {
      const hashWithoutDeposit = hash.replace(/#deposit_/, "");

      // Card doesn't load immediately
      const card = vfac09.cards.find((card) => {
        return card.def && card.def.globalId === hashWithoutDeposit;
      });
      if (card && card.def?.globalId) {
        var element = document.getElementsByClassName(
          "offset_" + card.def.globalId
        );
        if (element && element[0]) {
          setTimeout(() => {
            element[0].scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 20);
        }

        setTimeout(() => {
          openModal(card.def?.globalId);

          navigate(pathname, { replace: true });
        }, 30);
      }
    }
  }, [openModal, vfac09.cards, pathname, hash, navigate]);

  const cards = useMemo(
    () =>
      voltageDefAdjustedCards(
        vfac09.cards,
        yieldDataPerVolt,
        1,
        selectedSortOption.value as SortMethod,
        searchFilter.toLowerCase()
      ),
    [vfac09, selectedSortOption.value, searchFilter, yieldDataPerVolt]
  );

  const winRateQuery = useQuery<
    unknown,
    unknown,
    Record<GlobalId, { win: number; count: number }>[]
  >(
    "winRateQuery",
    () => {
      return fetch("https://api.friktion.fi/win_rate").then((res) =>
        res.json()
      );
    },
    { staleTime: Infinity, retry: 3 }
  );

  const winRateMap: Record<GlobalId, string | null> = newGlobalIdToNull();
  if (winRateQuery.data) {
    winRateQuery.data.forEach((data) => {
      const entries = Object.entries(data);
      if (entries.length) {
        const reformattedData = entries[0];
        if (reformattedData.length > 1) {
          const id = reformattedData[0];
          const actualNumbers = reformattedData[1];
          if (actualNumbers) {
            winRateMap[
              id as GlobalId
            ] = `${actualNumbers.win}/${actualNumbers.count}`;
          }
        }
      }
    });
  }

  const assetsTitle = (
    <Typography
      variant="h4"
      css={css`
        font-weight: 500;
      `}
    >
      Assets
    </Typography>
  );

  const searchBox = (
    <SearchBox>
      <img
        height="20"
        width="20"
        src={searchIcon}
        alt=""
        css={css`
          user-select: none;
        `}
      />
      <AmountInput
        type="text"
        inputMode="text"
        onChange={(e) => {
          let value = e.target.value;
          setSearchFilter(value);
        }}
        value={searchFilter}
        id="voltSearchInput"
        placeholder={"Filter by symbol"}
        maxLength={18} // JS number does some rounding
      />
    </SearchBox>
  );

  const sortByAndToggleGrid = (
    <>
      <SortByTextAndControlRow>
        <TableControlsText>Sort by</TableControlsText>
        <SortBySelect>
          <Select
            styles={customSelectOptionStyles}
            options={sortOptions}
            value={selectedSortOption}
            classNamePrefix="react-select"
            //@ts-ignore // ugh i dont want to deal with this. its not infectious
            onChange={handleChange}
          />
        </SortBySelect>
      </SortByTextAndControlRow>
      <ViewOption viewMode={viewMode} toggleViewMode={toggleViewMode} />
    </>
  );

  return (
    <>
      {/* <Header voltNumber={1}>Generate Income</Header> */}
      <ZeroNineManagementModal modalSesameBall={modalSesameBall} />
      <VoltInformation>
        <StrategyContainer>
          <StrategyDescription>
            Volt #01 generates income by running an automated covered call
            strategy and collecting the option premium. Deposits are deployed in
            the upcoming Epoch and earnings are auto-compounded weekly.{" "}
            <a
              href="https://docs.friktion.fi/products/covered-call"
              target="_blank"
              rel="noreferrer"
              css={css`
                gap: 2px;
                color: ${colorB};
                font-weight: 500;
                cursor: pointer;

                &:hover {
                  color: #a7a7b1;
                }
              `}
            >
              Learn more
              <KeyboardArrowRightIcon
                css={css`
                  width: 18px;
                  height: 18px;
                  align-self: center;
                  padding-bottom: 2px;
                `}
              />
            </a>
          </StrategyDescription>
          <CoveredCallVideo
            css={css`
              max-width: 390px;

              @media only screen and (max-width: 1030px) {
                margin: auto;
                max-width: 520px;
              }
            `}
          />
        </StrategyContainer>

        <InfoCardsContainer>
          <PerformanceCard
            voltNumber={1}
            css={css`
              margin-bottom: 24px;

              @media only screen and (max-width: 1030px) and (min-width: 785px) {
                margin-bottom: 0;
                padding-right: 32px;
              }
            `}
            cards={cards}
          >
            Best in bearish to mild bull markets
          </PerformanceCard>
          <RiskCard voltNumber={1}>
            If the price of the underlying asset goes above the call option’s
            strike price at expiration and the options are in-the-money, Volt
            may incur a loss.
          </RiskCard>
        </InfoCardsContainer>
      </VoltInformation>

      <AssetsSectionContainer ref={wrapperRef}>
        <AssetsHeader>
          {wrapperWidth > 605 ? (
            assetsTitle
          ) : wrapperWidth > 485 ? (
            <Row>
              {assetsTitle}
              {searchBox}
            </Row>
          ) : (
            <Col>
              {assetsTitle}
              {searchBox}
            </Col>
          )}

          <TableControlsRow>
            {wrapperWidth > 605 && searchBox}
            {wrapperWidth > 605 ? (
              <>{sortByAndToggleGrid}</>
            ) : (
              <Row
                css={css`
                  justify-content: ${wrapperWidth > 485
                    ? "end"
                    : "start"} !important;
                `}
              >
                {sortByAndToggleGrid}
              </Row>
            )}
          </TableControlsRow>
        </AssetsHeader>
        {viewMode === "grid" ? (
          <Cards>
            {cards.map((card, i) => (
              <Card10GroupWrapped key={i} card={card} openModal={openModal} />
            ))}
          </Cards>
        ) : (
          <Table
            voltGlowNumber={1}
            columns={getVoltColumns(winRateMap, yieldDataPerVolt)}
            dataSource={cards}
          />
        )}
      </AssetsSectionContainer>
    </>
  );
};
