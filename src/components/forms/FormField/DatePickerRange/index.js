import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

export default function DatePickerRange({ input, className = "" }) {
  const state = [
    {
      startDate: input.value?.startDate || new Date(),
      endDate: input.value?.endDate || input.value?.startDate || new Date(),
      key: "selection",
    },
  ];

  const handleChange = (item) => {
    const start = item.selection.startDate;
    const end = item.selection.endDate;

    input.onChange({
      startDate: start,
      endDate: end,
      formattedStart: start ? format(start, "yyyy-MM-dd") : null,
      formattedEnd: end ? format(end, "yyyy-MM-dd") : null,
    });
  };

  return (
    <div
      className={[
        "w-full overflow-hidden rounded-xl border border-gray-200 bg-white",
        "[&_.rdrCalendarWrapper]:w-full",
        "[&_.rdrMonth]:w-full",
        "[&_.rdrMonth]:p-3",
        "[&_.rdrDateDisplayWrapper]:bg-gray-50",
        "[&_.rdrDateDisplay]:m-3",
        "[&_.rdrDayNumber_span]:text-sm",
        className,
      ].join(" ")}
    >
      <DateRange
        className="w-full"
        editableDateInputs
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        ranges={state}
        months={1}
        direction="vertical"
        rangeColors={["#2563eb"]}
      />
    </div>
  );
}