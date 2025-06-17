// export function localizeObject(obj, lang) {
//   // Nếu là mảng → xử lý từng phần tử
//   if (Array.isArray(obj)) {
//     return obj.map((item) => localizeObject(item, lang));
//   }

//   if (!obj || typeof obj !== 'object') return obj;

//   // Deep clone tránh ảnh hưởng gốc
//   const clone = structuredClone(obj);

//   for (const key in clone) {
//     const value = clone[key];

//     // Nếu là object có { vi, en }, và là string
//     if (
//       typeof value === 'object' &&
//       value?.vi &&
//       value?.en &&
//       typeof value.vi === 'string'
//     ) {
//       clone[key] = value[lang] || value.en;
//     }

//     // Nếu là object, tiếp tục đệ quy
//     else if (typeof value === 'object' && value !== null) {
//       clone[key] = localizeObject(value, lang);
//     }
//   }

//   return clone;
// }

export function localizeObject(obj, lang) {
  // Nếu là mảng → xử lý từng phần tử
  if (Array.isArray(obj)) {
    return obj.map((item) => localizeObject(item, lang));
  }

  if (!obj || typeof obj !== 'object') return obj;

  // Tạo object mới thay vì dùng structuredClone
  const clone = {};

  for (const key in obj) {
    const value = obj[key];

    // Nếu là object có { vi, en }, và cả hai đều là string
    if (
      typeof value === 'object' &&
      value?.vi &&
      value?.en &&
      typeof value.vi === 'string' &&
      typeof value.en === 'string'
    ) {
      clone[key] = value[lang] || value.en;
    }
    // Nếu là _id, chuyển thành chuỗi
    else if (key === '_id') {
      clone[key] = value.toString();
    }
    // Nếu là object, tiếp tục đệ quy
    else if (typeof value === 'object' && value !== null) {
      clone[key] = localizeObject(value, lang);
    }
    // Các trường hợp khác, giữ nguyên giá trị
    else {
      clone[key] = value;
    }
  }

  return clone;
}
