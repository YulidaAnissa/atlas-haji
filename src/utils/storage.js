import { 
  ACCESS_TOKEN_STORAGE,
  ACCESS_TOKEN_EXPIRE_STORAGE,
  PROFILE_FULLNAME_STORAGE,
  PROFILE_GOLONGAN_STORAGE,
  PROFILE_ID_STORAGE,
  PROFILE_JABATAN_STORAGE,
  PROFILE_ROLE_STORAGE,
  PROFILE_ID_KANTOR_STORAGE
} from "@/configs";
import nookies from 'nookies';
import { encrypt, decrypt } from "./crypto";

function createCookieStorage(_name, options = {}) {
  return {
    _name,
    set(value, { ctx = null, ...cookieOptions } = {}) {
      // 💡 PASTIKAN VALUE TIDAK UNDEFINED & DI-CAST KE STRING
      if (value === undefined || value === null) return;

      const stringValue = String(value);
      const dataToSave = options.encrypt ? encrypt(stringValue) : stringValue;

      nookies.set(ctx, this._name, dataToSave, { path: '/', ...cookieOptions });
    },
    get(ctx) {
      const cookie = nookies.get(ctx)[this._name];
      if (!cookie) return null;
      return options.encrypt ? decrypt(cookie) : cookie;
    },
    remove(ctx, options) {
      nookies.destroy(ctx, this._name, { path: '/', ...options });
    }
  };
}

function getCookieDomain(ctx) {
  try {
    let host = ctx ? ctx?.req?.headers?.host : location.host;
  
    let domain = '';

    if(host.includes('localhost')) {
      domain = 'localhost';
    }

    if(WHITE_LABLE){
      domain = host;
    }

    return domain;
  } catch(_) {
    return '';
  }

}

export const accessTokenStorage = {
  _value: createCookieStorage(ACCESS_TOKEN_STORAGE, { encrypt: true }),
  _expire: createCookieStorage(ACCESS_TOKEN_EXPIRE_STORAGE, { encrypt: true }),

  set(value, options) {
    const finalOptions = {
      ...options
    };

    finalOptions.domain = getCookieDomain(options.ctx);
    this._value.set(value, finalOptions);
    this._expire.set(options.expires, finalOptions);
  },
  get(ctx) {
    return {
      value: this._value.get(ctx),
      expire: this._expire.get(ctx),
    };
  },
  remove(ctx) {
    const options = {
      domain: getCookieDomain(ctx)
    };
    this._value.remove(ctx, options);
    this._expire.remove(ctx, options);
  }
};

export const profileStorage = {
  _fullname: createCookieStorage(PROFILE_FULLNAME_STORAGE, { encrypt: true }),
  _id: createCookieStorage(PROFILE_ID_STORAGE, { encrypt: true }),
  _jabatan: createCookieStorage(PROFILE_JABATAN_STORAGE, { encrypt: true }),
  _gol: createCookieStorage(PROFILE_GOLONGAN_STORAGE, { encrypt: true }),
  _role: createCookieStorage(PROFILE_ROLE_STORAGE, { encrypt: true }),
  _idKantor: createCookieStorage(PROFILE_ID_KANTOR_STORAGE, { encrypt: true }),

  // 💡 Menerima fallback jika backend mengirim id_kantor atau idKantor
  set(user = {}, options = {}) {
    const finalOptions = {
      ...options,
      domain: getCookieDomain(options?.ctx)
    };

    const {
      nama,
      nip,
      jabatan,
      gol,
      role,
      idKantor,
      id_kantor, // 👈 Fallback dari API
      idkantor   // 👈 Fallback dari API
    } = user;

    // Ambil mana saja yang tidak undefined
    const validIdKantor = idKantor ?? id_kantor ?? idkantor ?? "";

    this._fullname.set(nama ?? "", finalOptions);
    this._id.set(nip ?? "", finalOptions);
    this._jabatan.set(jabatan ?? "", finalOptions);
    this._gol.set(gol ?? "", finalOptions);
    this._role.set(role ?? "", finalOptions);
    this._idKantor.set(validIdKantor, finalOptions); // 👈 Disimpan secara aman
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
    const options = {
      domain: getCookieDomain(ctx)
    };
    this._fullname.remove(ctx, options);
    this._id.remove(ctx, options);
    this._jabatan.remove(ctx, options);
    this._gol.remove(ctx, options);
    this._role.remove(ctx, options);
    this._idKantor.remove(ctx, options);
  }
};