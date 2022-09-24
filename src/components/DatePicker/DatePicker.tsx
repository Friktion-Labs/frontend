import DatePicker from "react-date-picker";
import styled from "@emotion/styled";
import { CalendarIcon } from "../Icons";
import { useState } from "react";
import moment from "moment";
import {
  CalendarArrowRight,
  CalendarArrowLeft,
} from "common/components/Calendar/CalendarArrows";
import { ReactCalendarStyles } from "common/components/Calendar";

export const StyledDatePicker = () => {
  const [startDate, setStartDate] = useState({} as Date);
  const dueDate = startDate
    ? moment(startDate).format("DD MMM YYYY")
    : "Choose date";

  return (
    <ReactCalendarStyles>
      <DatePickerContainer>
        <DatePicker
          onChange={(date: Date) => setStartDate(date)}
          clearIcon={null}
          calendarIcon={<CalendarIcon />}
          nextLabel={<CalendarArrowRight />}
          next2Label={null}
          prevLabel={<CalendarArrowLeft />}
          prev2Label={null}
          //returns class name to style Loan due date
          tileClassName={({ date, view }) => {
            return moment(date).format("DD MMM YYYY") === dueDate
              ? "loan-due-date"
              : "";
          }}
        />
        <DateContainer>{dueDate || "Choose date"}</DateContainer>
      </DatePickerContainer>
    </ReactCalendarStyles>
  );
};

const DateContainer = styled.span`
  font-family: "Inter";
  color: ${({ theme }) => theme.palette.grey[200]};
  font-size: 16px;
  line-height: 24px;
`;

const DatePickerContainer = styled.div`
  /* ~~~ Reset~~~ */

  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  color: ${({ theme }) => theme.palette.grey[500]} !important;
  background-color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.common.white};
  border: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : `1px solid ${theme.palette.grey[200]}`};
  border-radius: 8px;
  padding: 0px 10px;
  height: 44px;
  .react-date-picker__calendar--open {
    top: 200% !important;
    left: -150% !important;
    bottom: unset !important;
  }

  .react-date-picker__inputGroup {
    display: none;
  }

  .react-date-picker__wrapper {
    border: none;
  }
  .react-date-picker__calendar-button {
    padding: 0px !important;
  }
`;
