import { Popover } from "antd";
import moment from "moment";
import LaunchIcon from "@mui/icons-material/Launch";
import "./voltPerformance.less";
import styled from "@emotion/styled";
import { css, SerializedStyles } from "@emotion/react";
import { cx } from "@emotion/css";
import { SquareA09, SquareButton09 } from "../../09/Button09";
import {
  EpochRow,
  parseOptionProduct,
  STRONG_SUBVOLTS,
  SubvoltDef10,
  WEAK_SUBVOLTS,
} from "../../09/registry10";
import { YieldTooltip } from "../../09/YieldTooltip";
import { AutoUniversalAssetLogo } from "../../09/UniversalAssetLogo";
import { VoltNumber } from "../../09/VoltNumber";
import Select, {
  components,
  ControlProps,
  GroupBase,
  OptionProps,
} from "react-select";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { css } from "@emotion/react";
import { chunk } from "lodash-es";
import { HARDCODED_DEVNET_DATA } from "./hardcodedDevnetData";
import { DEFAULT_PERFORMANCE_FEE_BPS } from "@friktion-labs/friktion-sdk";
import { useLocation } from "react-router";
import {
  generateSolanaFmLink,
  useExplorerLink,
} from "../../hooks/useExplorerLink";
import { useAppConnection } from "features/connection";
import { useAuctionResults } from "09/AuctionResults";

// const options = [
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Strawberry" },
//   { value: "vanilla", label: "Vanilla" },
// ];

const SelectPrefix: React.FC<{
  def: SubvoltDef10;
  css?: SerializedStyles;
  className?: string;
}> = ({ def, className }) => {
  return (
    <div
      className={className}
      css={css`
        display: inline-block;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 6px;
        `}
      >
        <SelectNumContainer>
          <SelectNumNum>
            <VoltNumber voltNum={def.volt} />
          </SelectNumNum>
        </SelectNumContainer>
        <SelectAssContainer>
          <SelectAssNum>
            <AutoUniversalAssetLogo def={def} />
          </SelectAssNum>
        </SelectAssContainer>
      </div>
    </div>
  );
};

const EMPTY_ARRAY: EpochRow[] = [];
const SelectNumber: React.FC<{
  voltNum: number;
  css?: SerializedStyles;
  className?: string;
}> = ({ className, voltNum }) => {
  return (
    <div
      className={className}
      css={css`
        display: inline-block;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 6px;
        `}
      >
        <SelectNumContainer>
          <SelectNumNum>
            <VoltNumber voltNum={voltNum} />
          </SelectNumNum>
        </SelectNumContainer>
      </div>
    </div>
  );
};

const SelectNumContainer = styled.div`
  width: 40px;
`;

const SelectNumNum = styled.div`
  transform: scale(0.5);
`;
const SelectAssContainer = styled.div`
  width: 28px;
`;

const SelectAssNum = styled.div`
  transform: scale(0.5);
`;

const Control: React.ComponentType<
  ControlProps<
    {
      value: string;
      label: string;
    },
    false,
    GroupBase<{
      value: string;
      label: string;
    }>
  >
> = ({ children, ...props }) => {
  const selectedValue = props.selectProps.value;
  let singularValue: string = "";
  if (selectedValue && "value" in selectedValue) {
    singularValue = selectedValue.value;
  }

  // Hacks on hacks
  const maybeGlobalId = singularValue.split(" ")[0];

  const def = WEAK_SUBVOLTS[maybeGlobalId];

  return (
    <components.Control
      {...props}
      css={css`
        display: flex;
        background: hsl(230, 15%, 20%);
        color: #fff;
        .react-select__single-value {
          color: #fff !important;
        }
      `}
    >
      {def ? (
        <SelectPrefix def={def} />
      ) : maybeGlobalId === "01" ? (
        <>
          <SelectNumber
            voltNum={1}
            css={css`
              margin-right: 0px;
            `}
          />
        </>
      ) : maybeGlobalId === "02" ? (
        <>
          <SelectNumber
            voltNum={2}
            css={css`
              margin-right: 0px;
            `}
          />
        </>
      ) : maybeGlobalId === "03" ? (
        <>
          <SelectNumber
            voltNum={3}
            css={css`
              margin-right: 0px;
            `}
          />
        </>
      ) : maybeGlobalId === "04" ? (
        <>
          <SelectNumber
            voltNum={4}
            css={css`
              margin-right: 0px;
            `}
          />
        </>
      ) : maybeGlobalId === "05" ? (
        <>
          <SelectNumber
            voltNum={5}
            css={css`
              margin-right: 0px;
            `}
          />
        </>
      ) : null}
      {children}
    </components.Control>
  );
};
const CustomOption: React.ComponentType<
  OptionProps<
    {
      value: string;
      label: string;
    },
    false,
    GroupBase<{
      value: string;
      label: string;
    }>
  >
> = ({ children, getStyles, innerRef, ...props }) => {
  // Hacks on hacks
  const maybeGlobalId = props.data.value.split(" ")[0];

  const def = WEAK_SUBVOLTS[maybeGlobalId];
  return (
    <Option
      ref={innerRef}
      {...props.innerProps}
      // onClick={props.selectOption}
      className={cx(
        {
          isDisabled: props.isDisabled,
        },
        { isFocused: props.isFocused },
        { isSelected: props.isSelected }
      )}
    >
      {def ? (
        <>
          <SelectPrefix
            def={def}
            css={css`
              margin-right: 12px;
            `}
          />
          {children}
        </>
      ) : maybeGlobalId === "01" ? (
        <>
          <SelectNumber
            voltNum={1}
            css={css`
              margin-right: 4px;
            `}
          />
          {children}
        </>
      ) : maybeGlobalId === "02" ? (
        <>
          <SelectNumber
            voltNum={2}
            css={css`
              margin-right: 4px;
            `}
          />
          {children}
        </>
      ) : maybeGlobalId === "03" ? (
        <>
          <SelectNumber
            voltNum={3}
            css={css`
              margin-right: 4px;
            `}
          />
          {children}
        </>
      ) : maybeGlobalId === "04" ? (
        <>
          <SelectNumber
            voltNum={4}
            css={css`
              margin-right: 4px;
            `}
          />
          {children}
        </>
      ) : maybeGlobalId === "05" ? (
        <>
          <SelectNumber
            voltNum={5}
            css={css`
              margin-right: 4px;
            `}
          />
          {children}
        </>
      ) : (
        <NonThing>{children}</NonThing>
      )}
    </Option>
  );
};
const NonThing = styled.div`
  padding: 4px 14px;
`;
const reactSelectColors = {
  primary: "red",
  primary75: "red",
  primary50: "red",
  primary25: "#DEEBFF",

  danger: "#DE350B",
  dangerLight: "#FFBDAD",

  neutral0: "hsl(0, 0%, 100%)",
  neutral5: "hsl(0, 0%, 95%)",
  neutral10: "hsl(0, 0%, 90%)",
  neutral20: "hsl(0, 0%, 80%)",
  neutral30: "hsl(0, 0%, 70%)",
  neutral40: "hsl(0, 0%, 60%)",
  neutral50: "hsl(0, 0%, 50%)",
  neutral60: "hsl(0, 0%, 40%)",
  neutral70: "hsl(0, 0%, 30%)",
  neutral80: "hsl(0, 0%, 20%)",
  neutral90: "hsl(0, 0%, 10%)",
};

const Option = styled.div`
  display: flex;
  color: #fff;

  min-height: 36px;

  align-items: center;
  &:hover {
    background-color: hsl(230, 15%, 30%);
    cursor: pointer;
  }
  &.isSelected {
    background-color: hsl(230, 15%, 22%);
  }
  &.isFocused {
    background-color: hsl(230, 15%, 22%);
  }
`;
type Op = { value: string; label: string };
export const VoltPerformanceAndTitle: React.VFC<{
  twenty?: true; // if true, 20px padding both sides. otherwise default (40px)
  onlyGlobalId?: string; // if set, will not show the filter
  hideFirstColAt?: number; // if set, will do a media query to hide first column at max-width pixel,
  className?: string;
  css?: SerializedStyles;
}> = (props) => {
  const { createExplorerLink } = useExplorerLink();
  const { auctionData } = useAuctionResults();
  const { network } = useAppConnection();
  const { pathname } = useLocation();

  const allData: EpochRow[] = useMemo(
    () =>
      network === "mainnet-beta"
        ? (auctionData ?? []).filter((x) => !x.globalId.endsWith("_circuits"))
        : HARDCODED_DEVNET_DATA.filter(
            (x) => !x.globalId.endsWith("_circuits")
          ),
    [network, auctionData]
  );

  const [selectedOption, setSelectedOption] = useState<Op | null>(null);
  const handleChange = useCallback((a: Op) => {
    if (a.value === "clear") {
      setSelectedOption(null);
    } else {
      setSelectedOption(a);
    }
  }, []);

  const options = useMemo(() => {
    const staticOptions: Op[] = [
      {
        value: "clear",
        label: "No filter",
      },
      {
        value: "01",
        label: "Calls only",
      },
      {
        value: "02",
        label: "Puts only",
      },
      {
        value: "03",
        label: "Power Perps only",
      },
      {
        value: "04",
        label: "Basis Yield only",
      },
      {
        value: "05",
        label: "Capital Protection only",
      },
    ];
    const possibleOptions: Op[] = [];

    // sort allData from low to high because substring sorting logic below is jank. Finds normal sol before the sol_high.
    allData.sort((a, b) => a.startEpoch - b.startEpoch);
    for (const row of allData) {
      if (!possibleOptions.find((o) => o.value.startsWith(row.globalId))) {
        const def = STRONG_SUBVOLTS[row.globalId];
        if (def === undefined) {
          console.warn(
            "LET THE DEVS KNOW in discord- to check the auction data! Thanks :)"
          );
          continue;
        }
        const underlyingName = row.globalId.toLowerCase().includes("high")
          ? def.underlying.name + "-HIGH"
          : def.underlying.name;
        possibleOptions.push({
          value: `${row.globalId} Volt 0${def.volt} ${
            def.optionType ? def.optionType : "perp"
          } ${def.underlying.name} ${def.underlying.symbol}`,
          label: `${underlyingName}`,
        });
      }
    }
    // sort allData from high to low again so that the rows display correctly.
    allData.sort((a, b) => b.startEpoch - a.startEpoch);

    possibleOptions.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    return [...staticOptions, ...possibleOptions];
  }, [allData]);

  // set default filter to selected volt
  useEffect(() => {
    switch (pathname) {
      case "/income":
        setSelectedOption(
          options.find((option) => option.value === "01") ?? null
        );
        break;
      case "/stables":
        setSelectedOption(
          options.find((option) => option.value === "02") ?? null
        );
        break;
      case "/crab":
        setSelectedOption(
          options.find((option) => option.value === "03") ?? null
        );
        break;
      case "/basis":
        setSelectedOption(
          options.find((option) => option.value === "04") ?? null
        );
        break;
      case "/protection":
        setSelectedOption(
          options.find((option) => option.value === "05") ?? null
        );
        break;
      default:
        setSelectedOption(null);
    }
  }, [pathname, options]);

  const maybeGlobalId = selectedOption?.value.split(" ")[0] ?? "";
  const def: SubvoltDef10 | undefined = props.onlyGlobalId
    ? WEAK_SUBVOLTS[props.onlyGlobalId]
    : WEAK_SUBVOLTS[maybeGlobalId];

  const filteredData = useMemo(() => {
    if (def) {
      return allData.filter((row) => row.globalId === def.globalId);
    } else if (selectedOption?.value === "01") {
      return allData.filter((row) => STRONG_SUBVOLTS[row.globalId].volt === 1);
    } else if (selectedOption?.value === "02") {
      return allData.filter((row) => STRONG_SUBVOLTS[row.globalId].volt === 2);
    } else if (selectedOption?.value === "03") {
      return allData.filter((row) => STRONG_SUBVOLTS[row.globalId].volt === 3);
    } else if (selectedOption?.value === "04") {
      return allData.filter((row) => STRONG_SUBVOLTS[row.globalId].volt === 4);
    } else if (selectedOption?.value === "05") {
      return allData.filter((row) => STRONG_SUBVOLTS[row.globalId].volt === 5);
    } else {
      return allData;
    }
  }, [allData, def, selectedOption?.value]);

  const dataPages: EpochRow[][] = useMemo(() => {
    return chunk(filteredData, 16);
  }, [filteredData]);

  let [pageIndex, setPageIndex] = useState(0);
  const totalPages = dataPages.length;

  const handlePrev = useCallback(() => {
    setPageIndex((oldPageIndex) => {
      if (oldPageIndex > 0) {
        return oldPageIndex - 1;
      }
      return oldPageIndex;
    });
  }, []);

  const handleNext = useCallback(() => {
    setPageIndex((oldPageIndex) => {
      if (pageIndex < totalPages - 1) {
        return pageIndex + 1;
      }
      return oldPageIndex;
    });
  }, [pageIndex, totalPages]);

  if (pageIndex > totalPages - 1 && pageIndex !== 0) {
    setPageIndex(0);
    pageIndex = 0;
  }
  const data = dataPages[pageIndex] ? dataPages[pageIndex] : EMPTY_ARRAY;

  const pager =
    totalPages > (props.onlyGlobalId ? 1 : 0) ? (
      <div
        css={css`
          display: flex;

          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
        `}
      >
        <SquareButton09
          onClick={handlePrev}
          css={css`
            &:disabled {
              opacity: 0.4;
            }
          `}
          disabled={pageIndex === 0}
        >
          <KeyboardArrowLeftIcon className="downIcon" />
        </SquareButton09>

        <div
          css={css`
            margin: 0 10px;
          `}
        >
          Page {totalPages === 0 ? 0 : pageIndex + 1} of {totalPages}
        </div>
        <SquareButton09
          onClick={handleNext}
          css={css`
            &:disabled {
              opacity: 0.4;
            }
          `}
          disabled={pageIndex === totalPages - 1}
        >
          <KeyboardArrowRightIcon className="downIcon" />
        </SquareButton09>
      </div>
    ) : null;

  const hideAtQuery = props.hideFirstColAt
    ? `@media (max-width: ${props.hideFirstColAt}px) {display: none}`
    : "";
  const fixSecondColumnThatBecameTheFirst = props.hideFirstColAt
    ? `@media (max-width: ${props.hideFirstColAt}px) {
           border-top-left-radius: 4px;
           border-bottom-left-radius: 4px;
           padding-left: 24px !important;
        }`
    : "";
  const fixSecondColumnHeaderThatBecameTheFirst = props.hideFirstColAt
    ? `@media (max-width: ${props.hideFirstColAt}px) {
             padding-left: 14px !important;
          }`
    : "";

  return (
    <TableSection
      css={css`
        max-width: 980px;
      `}
      className={props.className}
    >
      <div
        css={css`
          max-width: 980px;
          ${props.twenty ? "padding: 0 20px 0 20px" : "padding: 0 45px 0 45px"};

          display: flex;
          justify-content: space-between;
          align-items: center;

          @media screen and (max-width: 750px) {
            align-items: flex-start;
            flex-direction: column;
            justify-content: flex-start;
          }
        `}
      >
        <SectionTitle
          css={css`
            margin-bottom: 12px;

            @media screen and (max-width: 750px) {
              margin-bottom: 12px;
            }
          `}
        >
          Volt Performance
        </SectionTitle>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;

            @media screen and (max-width: 750px) {
              flex-wrap: wrap;
            }
          `}
        >
          {props.onlyGlobalId ? null : (
            <Select
              css={css`
                width: 245px;
                margin-right: 16px;
                /* background: #000; */
                input {
                  color: #fff !important;
                }
                .react-select__control {
                  border-color: hsl(230, 15%, 35%);

                  @media print {
                    & {
                      border-color: hsl(230, 15%, 60%);
                      color: hsl(230, 15%, 60%);
                    }
                  }
                }
                .react-select__menu {
                  background: hsl(230, 15%, 18%);
                  box-shadow: 0 0 16px rgba(0, 0, 0, 0.5);
                }
                margin-bottom: 12px;
              `}
              maxMenuHeight={Math.max(400, window.innerHeight * 0.5)}
              options={options}
              placeholder="No filter"
              components={{
                Control: Control,
                Option: CustomOption,
              }}
              value={selectedOption}
              //@ts-ignore // ugh i dont want to deal with this. its not infectious
              onChange={handleChange}
              classNamePrefix="react-select"
              colors={reactSelectColors}
              onKeyDown={(e) => {
                const input = e.currentTarget.querySelector("input");
                if (input) {
                  if (
                    e.key === "Backspace" &&
                    selectedOption !== null &&
                    input.value === ""
                  ) {
                    setSelectedOption(null);
                  }
                }
              }}
            />
          )}
          {pager}
        </div>
      </div>
      <TableScroller
        css={css`
          margin-top: -12px;
        `}
      >
        <div
          css={css`
            padding: 0 0 0 ${props.twenty ? "20px" : "45px"};
            table {
              padding-right: ${props.twenty ? "20px" : "45px"};
            }
          `}
        >
          <div className="volt-activity">
            <table
              id="itemTable"
              style={{
                width: "100%",
                overflow: "auto",
                fontFamily: "Euclid Circular B",
              }}
            >
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th
                    css={css`
                      font-family: "Euclid Circular B";
                      ${hideAtQuery}
                    `}
                  ></th>
                  <th>
                    <Popover
                      destroyTooltipOnHide
                      placement="top"
                      content={
                        <div
                          css={css`
                            font-family: "Euclid Circular B";
                          `}
                        >
                          <NoWrap>Asset Strike OptionType Expiry</NoWrap>
                        </div>
                      }
                      css={css`
                        cursor: pointer;
                        font-family: "Euclid Circular B";
                        ${fixSecondColumnHeaderThatBecameTheFirst}
                      `}
                    >
                      Product
                    </Popover>
                  </th>
                  <th
                    css={css`
                      font-family: "Euclid Circular B";
                    `}
                  >
                    Deposited
                  </th>
                  <th>
                    <Popover
                      destroyTooltipOnHide
                      placement={"bottom"}
                      css={css`
                        font-family: "Euclid Circular B";
                        cursor: pointer;
                      `}
                      content={
                        <div
                          css={css`
                            font-family: "Euclid Circular B";
                            max-width: 240px;
                          `}
                        >
                          Hover over the yield elements to see a detailed
                          breakdown of APR and APY
                        </div>
                      }
                    >
                      <NoWrap>
                        Premium <InfoI />
                      </NoWrap>
                    </Popover>
                  </th>
                  <th>
                    <Popover
                      destroyTooltipOnHide
                      placement={"bottom"}
                      css={css`
                        font-family: "Euclid Circular B";
                        cursor: pointer;
                      `}
                      content={
                        <div
                          css={css`
                            font-family: "Euclid Circular B";
                            max-width: 240px;
                          `}
                        >
                          Net Return after fees and strategy performance (no
                          fees for negative return epochs)
                        </div>
                      }
                    >
                      <NoWrap>
                        Return <InfoI />
                      </NoWrap>
                    </Popover>
                  </th>
                  <th
                    css={css`
                      padding-left: 10px !important;
                      font-family: "Euclid Circular B";
                    `}
                  >
                    Tx
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, key) => {
                  const anotherDef = STRONG_SUBVOLTS[item.globalId];
                  if (anotherDef === undefined) {
                    console.warn(
                      "LET THE DEVS KNOW in discord- to check the auction data! Thanks :)"
                    );
                    return null;
                  }
                  let productTd = (
                    <td
                      css={css`
                        ${fixSecondColumnThatBecameTheFirst}
                      `}
                    >
                      {item.product}
                    </td>
                  );

                  const optionProduct = parseOptionProduct(item.product);
                  let netRealizedPnl =
                    item.realizedPnl > 0
                      ? (1 - DEFAULT_PERFORMANCE_FEE_BPS / 10000) *
                        item.realizedPnl
                      : item.realizedPnl;
                  // Add 16 hours to threshold for options auctions to allow for us to manually update.
                  let isCurrentEpoch =
                    item.globalId === "mainnet_protection_usdc_sol" ||
                    item.globalId === "mainnet_basis_usdc_sol" ||
                    item.globalId === "mainnet_basis_usdc_btc" ||
                    item.globalId === "mainnet_income_perp_btc"
                      ? Date.now() / 1000 < item.endEpoch + 3600 * 4
                      : Date.now() / 1000 < item.endEpoch + 3600 * 4;

                  if (typeof optionProduct !== "string") {
                    productTd = (
                      <TableCell
                        css={css`
                          ${fixSecondColumnThatBecameTheFirst}
                        `}
                      >
                        <Popover
                          destroyTooltipOnHide
                          placement="bottom"
                          content={
                            <div
                              css={css`
                                text-align: center;
                                font-family: "Euclid Circular B";
                              `}
                            >
                              <NoWrap>
                                <span>
                                  {"Start: " +
                                    moment
                                      .unix(item.startEpoch as number)
                                      .format("ll")}{" "}
                                  {moment
                                    .unix(item.startEpoch as number)
                                    .format("LT")}{" "}
                                </span>
                                <span
                                  css={css`
                                    opacity: 0.5;
                                  `}
                                >
                                  {" "}
                                  (UTC
                                  {moment(item.startEpoch).format("Z")})
                                </span>
                                <br></br>
                                <span>
                                  {"Expiry: " +
                                    moment(optionProduct.expiry).format(
                                      "ll"
                                    )}{" "}
                                  {moment(optionProduct.expiry).format("LT")}
                                </span>
                                <span
                                  css={css`
                                    opacity: 0.5;
                                  `}
                                >
                                  {" "}
                                  (UTC
                                  {moment(optionProduct.expiry).format("Z")})
                                </span>
                              </NoWrap>
                              <br />
                              <NoWrap>
                                Timestamp:{" "}
                                <a
                                  css={css`
                                    color: inherit;
                                    text-decoration: underline;
                                  `}
                                  href={`https://www.epochconverter.com/?q=${optionProduct.expiry.getTime()}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {optionProduct.expiry.getTime() / 1000}
                                </a>
                              </NoWrap>
                            </div>
                          }
                          css={css`
                            cursor: pointer;
                          `}
                        >
                          <div>
                            <NoWrap>
                              {optionProduct.asset}
                              <span
                                css={css`
                                  margin-right: 0px;
                                `}
                              >
                                {" "}
                              </span>
                              {optionProduct.strike
                                ? "$" + optionProduct.strike
                                : ""}
                              <span
                                css={css`
                                  margin-right: 0px;
                                `}
                              >
                                {" "}
                              </span>
                              {optionProduct.type}
                            </NoWrap>
                            <br />
                            <NoWrap>
                              {moment(optionProduct.expiry).format("ll")}
                            </NoWrap>
                          </div>
                        </Popover>
                      </TableCell>
                    );
                  }

                  const epochYield = item.balancePnl / item.balanceStart;

                  return (
                    <tr key={key}>
                      <td
                        css={css`
                          padding-right: 0 !important;
                          white-space: nowrap;
                          ${hideAtQuery}
                        `}
                      >
                        <div
                          css={css`
                            display: flex;
                            transform: scale(0.77);
                            align-items: center;
                          `}
                        >
                          <VoltNumber voltNum={anotherDef.volt} />
                          <div
                            css={css`
                              padding-left: 8px;
                              div {
                              }
                            `}
                          >
                            <AutoUniversalAssetLogo def={anotherDef} />
                          </div>
                        </div>
                      </td>
                      {productTd}
                      <TableCellNum
                        css={css`
                          padding-right: 0 !important;
                        `}
                      >
                        <NoWrap>
                          <TinyAssetLogo
                            src={anotherDef.depositToken.icon}
                            alt=""
                          />
                          {anotherDef.depositToken.formatShort(
                            item.balanceStart
                          )}{" "}
                        </NoWrap>
                      </TableCellNum>
                      <TableCellNum
                        css={css`
                          /* padding-right: 0 !important; */
                        `}
                      >
                        {isCurrentEpoch &&
                        (item.globalId === "mainnet_protection_usdc_sol" ||
                          item.globalId === "mainnet_basis_usdc_sol" ||
                          item.globalId === "mainnet_basis_usdc_btc" ||
                          item.globalId === "mainnet_income_perp_btc") ? (
                          <Popover
                            destroyTooltipOnHide
                            placement={"bottom"}
                            css={css`
                              cursor: pointer;
                              font-family: "Euclid Circular B";
                            `}
                            content={
                              <div
                                css={css`
                                  max-width: 240px;
                                  font-family: "Euclid Circular B";
                                `}
                              >
                                Epoch is currently in progress. If the option is
                                not exercised, the premium becomes the return
                                (minus the performance fee).
                              </div>
                            }
                          >
                            <NoWrap>
                              In progress <InfoI />
                            </NoWrap>
                          </Popover>
                        ) : (
                          <Popover
                            destroyTooltipOnHide
                            placement={"bottom"}
                            css={css`
                              cursor: pointer;
                            `}
                            content={YieldTooltip({
                              epochYield,
                              epochLength: item.endEpoch - item.startEpoch,
                              windowSize: 1,
                              hadLoss: item.realizedPnl < 0,
                            })}
                          >
                            <GroupWithUhhhLeftAlignQuestionMark>
                              <NoWrap>
                                <TinyAssetLogo
                                  src={anotherDef.depositToken.icon}
                                  alt=""
                                />
                                {anotherDef.depositToken.formatShort(
                                  item.balancePnl
                                )}{" "}
                              </NoWrap>
                              <br />
                              <NoWrap>
                                <span
                                  css={css`
                                    margin-left: 0px;
                                    color: ${item.balancePnl > 0
                                      ? "#54b843"
                                      : "#ff6766"};
                                  `}
                                >
                                  {item.balancePnl > 0 ? "+" : ""}
                                  {(
                                    (item.balancePnl / item.balanceStart) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </span>
                                <InfoI />
                              </NoWrap>
                            </GroupWithUhhhLeftAlignQuestionMark>
                          </Popover>
                        )}
                      </TableCellNum>
                      <TableCellNum>
                        <GroupWithUhhhLeftAlignQuestionMark>
                          <NoWrap>
                            {isCurrentEpoch ? null : (
                              <TinyAssetLogo
                                src={
                                  isCurrentEpoch
                                    ? ""
                                    : anotherDef.depositToken.icon
                                }
                                alt=""
                              />
                            )}
                            {item.realizedPnl > 0 ? "" : "-"}
                            {isCurrentEpoch ? (
                              <Popover
                                destroyTooltipOnHide
                                placement={"bottom"}
                                css={css`
                                  cursor: pointer;
                                  font-family: "Euclid Circular B";
                                `}
                                content={
                                  <div
                                    css={css`
                                      max-width: 240px;
                                      font-family: "Euclid Circular B";
                                    `}
                                  >
                                    Epoch is currently in progress. If the
                                    option is not exercised, the premium becomes
                                    the return (minus the performance fee).
                                  </div>
                                }
                              >
                                <NoWrap>
                                  In progress <InfoI />
                                </NoWrap>
                              </Popover>
                            ) : (
                              anotherDef.depositToken.formatShort(
                                Math.abs(netRealizedPnl)
                              )
                            )}{" "}
                          </NoWrap>
                          <br />
                          <NoWrap>
                            <span
                              css={css`
                                margin-left: 0px;
                                color: ${isCurrentEpoch
                                  ? "#fff"
                                  : item.realizedPnl > 0
                                  ? "#54b843"
                                  : "#ff6766"};
                              `}
                            >
                              {isCurrentEpoch
                                ? ""
                                : item.realizedPnl > 0
                                ? "+"
                                : ""}
                              {isCurrentEpoch
                                ? ""
                                : (
                                    (netRealizedPnl / item.balanceStart) *
                                    100
                                  ).toFixed(2)}
                              {isCurrentEpoch ? "" : "%"}
                            </span>
                          </NoWrap>
                        </GroupWithUhhhLeftAlignQuestionMark>
                      </TableCellNum>

                      <TableCell
                        css={css`
                          padding-top: 0 !important;
                          padding-bottom: 0 !important;
                        `}
                      >
                        {item.txid !== "nan" ? (
                          <SquareA09
                            href={createExplorerLink(
                              item.txid,
                              item.globalId.includes("_eth")
                                ? generateSolanaFmLink
                                : undefined
                            )}
                          >
                            <LaunchIcon
                              css={css`
                                opacity: 0.8;
                              `}
                            />
                          </SquareA09>
                        ) : null}
                      </TableCell>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages === 0 ? (
            <div
              css={css`
                ${props.twenty ? "padding-right: 20px" : "padding-right: 45px"};
              `}
            >
              <EmptyRow className="noHover">
                <EmptyRowEmpty>
                  <span>
                    No performance for{" "}
                    {def?.shareTokenSymbol ?? "Volt #" + selectedOption?.value}{" "}
                    yet.
                  </span>
                </EmptyRowEmpty>
              </EmptyRow>
            </div>
          ) : null}
        </div>
      </TableScroller>
      <div
        css={css`
          > div {
          }
        `}
      >
        {pager}
      </div>
    </TableSection>
  );
};

export const TableCell = styled.td`
  text-align: left;
`;

export const TableCellNum = styled.td`
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  text-align: left;
`;

export const TinyAssetLogo = styled.img`
  user-select: none;
  vertical-align: middle;
  width: 15px;
  height: 15px;
  margin-bottom: 3.5px;
  margin-right: 6px;
`;

// const TdSpan = styled.td`
//   display: flex;
//   width: 100%;
//   height: 3px;
//   height: 0;
//   position: absolute;
//   background: blue;
//   padding: 0;
//   background: none !important;
//   background: none;
//   padding: 0 !important;
//   left: 0;
//   right: 0;
// `;
export const NoWrap = styled.span`
  white-space: nowrap;
`;

/// This used to be right align
export const GroupWithUhhhLeftAlignQuestionMark = styled.span`
  display: inline-block;
  text-align: left;
  white-space: nowrap;
`;

export const InfoI: React.VFC = () => {
  return (
    <strong
      css={css`
        user-select: none;
        margin-left: 8px;
        font-size: 13px;
      `}
    >
      ⓘ
    </strong>
  );
};

const TableSection = styled.div`
  max-width: 980px;
  padding: 20px 0;
  margin: 0 auto;
`;

const TableScroller = styled.div`
  overflow: auto;
`;

const SectionTitle = styled.h2`
  padding-bottom: 0;
  font-size: 22px;
  margin-bottom: 0;
`;

const EmptyRow = styled.div`
  min-height: 88px;
  padding: 15px 20px 15px 25px;
  flex-grow: 1;
  width: 100%;

  @media only screen and (max-width: 940px) {
    /* padding-bottom: 10px; // due to the pen and table having 5px to avoid colliding with each other */
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;

  border-radius: 4px;
  &:hover {
    background: linear-gradient(hsl(230, 15%, 19%), hsl(230, 15%, 15%) 80%);
    box-shadow: 0 -1px 0 0 hsl(230, 15%, 21%);
  }
  &,
  &:hover.noHover {
    background: linear-gradient(hsl(230, 15%, 15%), hsl(230, 15%, 11%) 80%);
    box-shadow: 0 -1px 0 0 hsl(230, 15%, 17%);
  }
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }

  @media only screen and (max-width: 940px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const EmptyRowEmpty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 55px;
`;
