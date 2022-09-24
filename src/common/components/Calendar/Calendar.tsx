import { FunctionComponent } from "react";
import ReactCalendar from "react-calendar";
import styled from "@emotion/styled";
import moment from "moment";
import { Popover } from "antd";

import { CalendarArrowRight, CalendarArrowLeft } from "./CalendarArrows";

interface CalendarProps {
  activeDate: string | Date;
}

interface TitleContentProps {
  date: Date;
  view: string;
  activeDate: string | Date;
}

const sameDate = (date: string | Date, now: string | Date) =>
  moment(date).format("DD MMM YYYY") === moment(now).format("DD MMM YYYY");

const PopoverDate: FunctionComponent = () => (
  <Popover
    destroyTooltipOnHide
    placement={"bottom"}
    content={
      <PopoverContent>
        <div>Loan payment due</div>
        <div css={{ cursor: "pointer" }}>Click to pay</div>
      </PopoverContent>
    }
  >
    &nbsp;
  </Popover>
);

const TitleContent: FunctionComponent<TitleContentProps> = ({
  date,
  view,
  activeDate,
}) => {
  if (view === "month" && sameDate(date, activeDate)) {
    return <PopoverDate />;
  }
  return null;
};

export const Calendar: FunctionComponent<CalendarProps> = ({ activeDate }) => {
  return (
    <ReactCalendarStyles>
      <ReactCalendar
        tileClassName={({ date }) =>
          sameDate(date, activeDate) ? "is-active" : ""
        }
        tileContent={({ date, view }) => (
          <TitleContent date={date} view={view} activeDate={activeDate} />
        )}
        nextLabel={<CalendarArrowRight />}
        next2Label={null}
        prevLabel={<CalendarArrowLeft />}
        prev2Label={null}
        defaultActiveStartDate={new Date()}
      />
    </ReactCalendarStyles>
  );
};

const PopoverContent = styled.div`
  text-align: center;
  ${(props) => props.theme.typography.bodyXs}
  font-weight: 500;
  & div:first-child {
    color: ${(props) => props.theme.palette.grey[900]};
  }

  & div:last-child {
    color: ${({ theme }) => theme.palette.grey[600]};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

export const ReactCalendarStyles = styled.div`
  .react-calendar {
    border-radius: 12px;
    padding: 0;
    ${(props) => props.theme.typography.bodyM}

    ${({ theme }) => {
      const isDarkMode = theme.palette.mode === "dark";

      return `
      background: ${
        isDarkMode
          ? `linear-gradient(
            180.27deg,
            #23242f 0.31%,
            #121317 99.84%
          )`
          : `${theme.palette.grey[0]}A6`
      };
      border: 1px solid ${
        isDarkMode ? `${theme.palette.grey[0]}12` : `${theme.palette.grey[0]}33`
      };
      box-shadow: ${isDarkMode ? "none" : "0px 4px 32px #fbf1f461"};
    `;
    }}

    /* Navigation styles */
  .react-calendar__navigation {
      position: relative;
      margin-bottom: 0;

      button:hover,
      button:focus {
        background: transparent !important;
      }

      button:disabled {
        opacity: 0.5;
        background-color: transparent;
      }

      .react-calendar__navigation__label {
        ${(props) => props.theme.typography.bodyXl}
        font-weight: 500;
        left: 16px;
        padding: 0;
        color: ${({ theme }) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[0]
            : theme.palette.grey[950]};
      }

      .react-calendar__navigation__arrow,
      .react-calendar__navigation__label {
        position: absolute;
        top: 0;
        bottom: 0;
      }

      .react-calendar__navigation__prev-button {
        right: 44px;
      }

      .react-calendar__navigation__next-button {
        right: 0px;
      }
    }

    .react-calendar__viewContainer {
      /* add padding for month, year, decade, century view */
      & > div {
        padding: 8px 16px 16px;
      }

      button {
        border-radius: 8px;
      }

      button:enabled:hover,
      button:enabled:focus {
        border-radius: 8px;
        color: #000000 !important;
        background-color: ${({ theme }) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[0]
            : "#CECED8"} !important;
      }

      .react-calendar__tile--now,
      .react-calendar__tile--hasActive {
        background-color: ${({ theme }) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[0]
            : "#CECED8"} !important;
        color: #000000 !important;
      }

      .react-calendar__tile--active:enabled:hover,
      .react-calendar__tile--active:enabled:focus,
      .react-calendar__tile--now:enabled:hover,
      .react-calendar__tile--now:enabled:focus {
        opacity: 1 !important;
      }

      /* Month view */
      .react-calendar__month-view__weekdays {
        abbr {
          ${(props) => props.theme.typography.bodyXs}
          color: ${({ theme }) =>
            theme.palette.mode === "dark"
              ? theme.palette.grey[400]
              : theme.palette.grey[500]};
          text-decoration: none;
        }
      }

      .react-calendar__month-view__days {
        display: grid !important;
        grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

        .react-calendar__tile {
          display: flex;
          max-width: initial !important;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          border-radius: 50% !important;

          :hover {
            color: #000000;
          }
        }

        button {
          all: unset;
          width: 38px;
          height: 38px;
        }
        .react-calendar__month-view__days__day {
          color: ${({ theme }) =>
            theme.palette.mode === "dark"
              ? theme.palette.grey[0]
              : theme.palette.grey[950]};
        }

        .is-active {
          border-radius: 50% !important;
          color: ${(props) => props.theme.palette.grey[900]} !important;
          background: ${({ theme }) => theme.palette.volt5} !important;
          position: relative;

          span {
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
      }
      .react-calendar__month-view__days__day--neighboringMonth {
        color: ${({ theme }) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[500]
            : "#CECED8"} !important;
      }
      .react-calendar__month-view__days__day--weekend {
        color: ${({ theme }) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[0]
            : theme.palette.grey[950]} !important;
      }
    }

    /* ~~~ other view styles ~~~ */
    .react-calendar__year-view__months,
    .react-calendar__decade-view__years,
    .react-calendar__century-view__decades {
      display: grid !important;
      grid-template-columns: 20% 20% 20% 20% 20%;

      &.react-calendar__year-view__months {
        grid-template-columns: 33.3% 33.3% 33.3%;
      }

      .react-calendar__tile {
        max-width: initial !important;
        padding-bottom: 10px;
        padding-top: 10px;
        margin-bottom: 4px;
        margin-right: 4px;
      }
    }
  }
`;
