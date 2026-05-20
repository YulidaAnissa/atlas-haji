import axios from "axios";
import { profileStorage, accessTokenStorage } from "@/utils/storage";
// import { tokenStorage } from "@/utils/storage"; // kalau ada

function logout() {
  // tokenStorage.remove(); // aktifkan kalau kamu punya token storage
  accessTokenStorage.remove();
  profileStorage.remove();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export default function fetch(options) {
  return new Promise((resolve, reject) => {
    axios(options)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        const defaultError = {
          code: 500,
          status: "error",
          message: "Permintaan gagal, pastikan anda terhubung ke internet",
        };

        const statusCode = err?.response?.status;
        const responseData = err?.response?.data;

        if (statusCode === 401) {
          logout();

          reject({
            code: 401,
            status: "error",
            message: "Sesi anda telah berakhir. Silakan login kembali.",
          });

          return;
        }

        if (!responseData) {
          reject(defaultError);
          return;
        }

        reject(responseData);
      });
  });
}