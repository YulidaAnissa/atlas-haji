import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

export default function DatePickerRange({ input }) {
  const state = [
    {
      startDate: input.value?.startDate || new Date(),
      endDate: input.value?.endDate || null,
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
    <DateRange
      className="w-fit mx-auto"
      editableDateInputs={true}
      onChange={handleChange}
      moveRangeOnFirstSelection={false}
      ranges={state}
    />
  );
}