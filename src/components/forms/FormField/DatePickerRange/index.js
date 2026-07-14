"use client";

import { useMemo } from "react";
import PropTypes from "prop-types";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import styles from "./DatePickerRange.module.css";

const accentColor = "#0f8b75";

function toPayload(startDate, endDate) {
  return {
    startDate,
    endDate,
    formattedStart: startDate ? format(startDate, "yyyy-MM-dd") : null,
    formattedEnd: endDate ? format(endDate, "yyyy-MM-dd") : null,
  };
}

export default function DatePickerRange({ input, className = "", minDate }) {

  console.log('minDate ', minDate);
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  
  const minimumDate = useMemo(() => {
    if (!minDate) return today;

    const date = new Date(minDate);
    date.setHours(0, 0, 0, 0);

    return date;
  }, [minDate, today]);

  console.log('minimumDate ', minimumDate);

  const selection = {
    startDate:
      input.value?.startDate &&
      new Date(input.value.startDate) >= minimumDate
        ? new Date(input.value.startDate)
        : minimumDate,

    endDate:
      input.value?.endDate &&
      new Date(input.value.endDate) >= minimumDate
        ? new Date(input.value.endDate)
        : minimumDate,

    key: "selection",
  };

  const rangeLabel = `${format(selection.startDate, "dd MMM yyyy", {
    locale: id,
  })} - ${format(selection.endDate, "dd MMM yyyy", { locale: id })}`;

  const handleChange = (item) => {
    const { startDate, endDate } = item.selection;
    input.onChange(toPayload(startDate, endDate));
  };

  const clearRange = () => {
    input.onChange({
      startDate: null,
      endDate: null,
      formattedStart: null,
      formattedEnd: null,
    });
  };

  return (
    <div className={`${styles.shell} ${className}`}>
      <div className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>Rentang tanggal</p>
          <p className={styles.rangeText}>{rangeLabel}</p>
        </div>

        <button type="button" className={styles.clearButton} onClick={clearRange}>
          Bersihkan
        </button>
      </div>

      <DateRange
        className={styles.dateRange}
        showDateDisplay={false}
        editableDateInputs={false}
        onChange={handleChange}
        minDate={minimumDate}
        moveRangeOnFirstSelection={false}
        ranges={[selection]}
        months={1}
        direction="vertical"
        rangeColors={[accentColor]}
        locale={id}
      />
    </div>
  );
}

DatePickerRange.propTypes = {
  className: PropTypes.string,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.shape({
      endDate: PropTypes.instanceOf(Date),
      formattedEnd: PropTypes.string,
      formattedStart: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
    }),
  }).isRequired,
  minDate: PropTypes.instanceOf(Date),
};