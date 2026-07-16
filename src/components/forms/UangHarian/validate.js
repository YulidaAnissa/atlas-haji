import validate from "../../../utils/validator";

export default function validation(values) {
  return {
    jenisPegawai: validate(values.jenisPegawai, [{ rule: "required" }]),
    jumlah: validate(values.jumlah, [{ rule: "required" }]),
  };
}