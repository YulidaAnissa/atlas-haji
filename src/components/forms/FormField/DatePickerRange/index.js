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

export default function DatePickerRange({ input, className = "" }) {
  const today = useMemo(() => new Date(), []);

  const selection = {
    startDate: input.value?.startDate || today,
    endDate: input.value?.endDate || input.value?.startDate || today,
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
};