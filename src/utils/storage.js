import { 
  ACCESS_TOKEN_STORAGE,
  ACCESS_TOKEN_EXPIRE_STORAGE,
  PROFILE_FULLNAME_STORAGE,
  PROFILE_GOLONGAN_STORAGE,
  PROFILE_ID_STORAGE,
  PROFILE_JABATAN_STORAGE,
  PROFILE_ROLE_STORAGE,
  PROFILE_ID_KANTOR_STORAGE,
  REFRESH_TOKEN_STORAGE,
  // WHITE_LABLE,
} from "@/configs";
import nookies from 'nookies';
import { encrypt, decrypt } from "./crypto";

function createCookieStorage(_name, options = {}) {
  return {
    _name,
    set(value, { ctx = null, ...cookieOptions } = {}) {
      if (value === undefined || value === null) return;

      const stringValue = String(value);
      const dataToSave = options.encrypt ? encrypt(stringValue) : stringValue;

      // Pastikan path selalu '/' agar cookie bisa diakses di seluruh halaman
      nookies.set(ctx, this._name, dataToSave, { path: '/', ...cookieOptions });
    },
    get(ctx) {
      const cookie = nookies.get(ctx)[this._name];
      if (!cookie) return null;
      return options.encrypt ? decrypt(cookie) : cookie;
    },
    remove(ctx, cookieOptions = {}) {
      nookies.destroy(ctx, this._name, { path: '/', ...cookieOptions });
    }
  };
}

function getCookieDomain(ctx) {
  try {
    let host = ctx ? ctx?.req?.headers?.host : (typeof window !== 'undefined' ? window.location.host : '');
    if (!host) return undefined; // Biarkan browser menentukan domain secara default jika tidak ada host

    let domain = '';

    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      domain = undefined; // Jangan set domain manual untuk localhost agar tidak konflik port
    } else {
      domain = host.split(':')[0]; // Ambil nama domain saja tanpa port jika production
    }

    return domain;
  } catch (_) {
    return undefined;
  }
}

export const accessTokenStorage = {
  _value: createCookieStorage(ACCESS_TOKEN_STORAGE, { encrypt: true }),
  _expire: createCookieStorage(ACCESS_TOKEN_EXPIRE_STORAGE, { encrypt: true }),

  set(value, options = {}) {
    // Pastikan options.ctx diterima dengan benar (bisa dikirim via options.ctx atau parameter terpisah)
    const finalOptions = {
      ...options
    };
    
    // Tangani keamanan domain agar tidak bentrok
    const domain = getCookieDomain(finalOptions.ctx);
    if (domain) {
      finalOptions.domain = domain;
    } else {
      delete finalOptions.domain;
    }
    // Teruskan finalOptions ke method set cookie storage
    this._value.set(value, finalOptions);
    
    if (finalOptions.expires) {
      this._expire.set(finalOptions.expires, finalOptions);
    }
  },
  
  get(ctx) {
    return {
      value: this._value.get(ctx),
      expire: this._expire.get(ctx),
      expires: this._expire.get(ctx), // Ditambahkan agar mendukung pengecekan .expires maupun .expire
    };
  },
  
  remove(ctx) {
    const domain = getCookieDomain(ctx);
    const options = domain ? { domain } : {};
    this._value.remove(ctx, options);
    this._expire.remove(ctx, options);
  }
};

export const refreshTokenStorage = {
  _value: createCookieStorage(REFRESH_TOKEN_STORAGE, { encrypt: true }),
  set(value, options = {}) {
    const finalOptions = {
      ...options
    };
    const domain = getCookieDomain(finalOptions.ctx);
    if (domain) {
      finalOptions.domain = domain;
    } else {
      delete finalOptions.domain;
    }
    this._value.set(value, finalOptions);
  },
  get(ctx) {
    return {
      value: this._value.get(ctx),
    };
  },
  remove(ctx) {
    const domain = getCookieDomain(ctx);
    const options = domain ? { domain } : {};
    this._value.remove(ctx, options);
  }
};

export const profileStorage = {
  _fullname: createCookieStorage(PROFILE_FULLNAME_STORAGE, { encrypt: true }),
  _id: createCookieStorage(PROFILE_ID_STORAGE, { encrypt: true }),
  _jabatan: createCookieStorage(PROFILE_JABATAN_STORAGE, { encrypt: true }),
  _gol: createCookieStorage(PROFILE_GOLONGAN_STORAGE, { encrypt: true }),
  _role: createCookieStorage(PROFILE_ROLE_STORAGE, { encrypt: true }),
  _idKantor: createCookieStorage(PROFILE_ID_KANTOR_STORAGE, { encrypt: true }),

  set(user = {}, options = {}) {
    const domain = getCookieDomain(options?.ctx);
    const finalOptions = {
      ...options
    };
    if (domain) {
      finalOptions.domain = domain;
    } else {
      delete finalOptions.domain;
    }

    const {
      nama,
      nip,
      jabatan,
      gol,
      role,
      idKantor,
      id_kantor, 
      idkantor   
    } = user;

    const validIdKantor = idKantor ?? id_kantor ?? idkantor ?? "";

    this._fullname.set(nama ?? "", finalOptions);
    this._id.set(nip ?? "", finalOptions);
    this._jabatan.set(jabatan ?? "", finalOptions);
    this._gol.set(gol ?? "", finalOptions);
    this._role.set(role ?? "", finalOptions);
    this._idKantor.set(validIdKantor, finalOptions);
  },

  get(ctx) {
    return {
      nama: this._fullname.get(ctx),
      nip: this._id.get(ctx),
      jabatan: this._jabatan.get(ctx),
      gol: this._gol.get(ctx),
      role: this._role.get(ctx),
      idKantor: this._idKantor.get(ctx),
    };
  },

  remove(ctx) {
    const domain = getCookieDomain(ctx);
    const options = domain ? { domain } : {};
    this._fullname.remove(ctx, options);
    this._id.remove(ctx, options);
    this._jabatan.remove(ctx, options);
    this._gol.remove(ctx, options);
    this._role.remove(ctx, options);
    this._idKantor.remove(ctx, options);
  }
};