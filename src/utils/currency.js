export const formatRupiah = (value, withSymbol = true) => {
  if (typeof value !== "number") {
    value = parseInt(value, 10);
    if (isNaN(value)) return "";
  }

  const formatted = value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return withSymbol ? `Rp ${formatted},-` : formatted;
};
