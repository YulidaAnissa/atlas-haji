import validate from "../../../utils/validator";

export default function validation(values) {
  return {
    noSurat: validate(values.noSurat, [{ rule: "required" }]),
    tglSurat: validate(values.tglSurat, [{ rule: "required" }]),
    kegiatan: validate(values.kegiatan, [{ rule: "required" }]),
    file: values?.idSurat
      ? undefined
      : validate(values.file, [{ rule: "required" }]),
  };
}