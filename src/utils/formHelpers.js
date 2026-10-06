// utils/formHelpers.js

export function getOptionValue(option) {
  if (typeof option === "object" && option !== null) {
    return option.value;
  }
  return option;
}

export function buildFormPayload(values) {
  return {
    dateRange: {
      startDate: values.dateRange?.startDate || null,
      endDate: values.dateRange?.endDate || null,
      formattedStart: values.dateRange?.formattedStart || null,
      formattedEnd: values.dateRange?.formattedEnd || null,
    },
    idKabKota: getOptionValue(values.idKabKota) || "",
    tujuan: String(values.tujuan || "").trim(),
    pegawai: Array.isArray(values.pegawai)
      ? values.pegawai
          .map((item) => {
            if (typeof item === "object" && item !== null && "utama" in item) {
              return {
                utama: getOptionValue(item.utama),
                pengikut: Array.isArray(item.pengikut)
                  ? item.pengikut.map(getOptionValue).filter(Boolean)
                  : [],
              };
            }
            return getOptionValue(item);
          })
          .filter((p) =>
            typeof p === "object" ? Boolean(p.utama) : Boolean(p)
          )
      : [],
  };
}