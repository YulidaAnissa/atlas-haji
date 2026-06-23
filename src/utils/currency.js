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

export const terbilang = (value) => {
  const satuan = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];

  value = Number(value);

  if (Number.isNaN(value)) return "";
  if (value < 0) return `minus ${terbilang(Math.abs(value))}`;
  if (value < 12) return satuan[value];
  if (value < 20) return `${terbilang(value - 10)} belas`;
  if (value < 100) {
    return `${terbilang(Math.floor(value / 10))} puluh ${terbilang(value % 10)}`.trim();
  }
  if (value < 200) return `seratus ${terbilang(value - 100)}`.trim();
  if (value < 1000) {
    return `${terbilang(Math.floor(value / 100))} ratus ${terbilang(value % 100)}`.trim();
  }
  if (value < 2000) return `seribu ${terbilang(value - 1000)}`.trim();
  if (value < 1_000_000) {
    return `${terbilang(Math.floor(value / 1000))} ribu ${terbilang(value % 1000)}`.trim();
  }
  if (value < 1_000_000_000) {
    return `${terbilang(Math.floor(value / 1_000_000))} juta ${terbilang(value % 1_000_000)}`.trim();
  }
  if (value < 1_000_000_000_000) {
    return `${terbilang(Math.floor(value / 1_000_000_000))} miliar ${terbilang(value % 1_000_000_000)}`.trim();
  }

  return `${terbilang(Math.floor(value / 1_000_000_000_000))} triliun ${terbilang(
    value % 1_000_000_000_000,
  )}`.trim();
}