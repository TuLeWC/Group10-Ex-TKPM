export function localizeObject(obj, lang) {
  if (Array.isArray(obj)) {
    return obj.map((item) => localizeObject(item, lang));
  }

  if (!obj || typeof obj !== 'object') return obj;

  const clone = {};

  for (const key in obj) {
    const value = obj[key];

    if (value instanceof Date) {
      // Xử lý riêng cho kiểu Date
      clone[key] = value.toISOString();
    }
    else if (
      typeof value === 'object' &&
      value?.vi &&
      value?.en &&
      typeof value.vi === 'string' &&
      typeof value.en === 'string'
    ) {
      clone[key] = value[lang] || value.en;
    } else if (key === '_id') {
      clone[key] = value.toString();
    } else if (typeof value === 'object' && value !== null) {
      clone[key] = localizeObject(value, lang);
    } else {
      clone[key] = value;
    }
  }

  return clone;
}
