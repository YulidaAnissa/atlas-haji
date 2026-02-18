import axios from 'axios';

export default function fetch(options) {
  return new Promise((resolve, reject) => {
    axios(options)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        const defaultError = {
          code: 500,
          status: 'error',
          message: 'Permintaan gagal, pastikan anda terhubung ke internet',
        };

        if (typeof err.response === 'undefined') reject(defaultError);
        else if (typeof err.response.data === 'undefined') reject(defaultError);
        else reject(err.response.data);
      });
  });
}

