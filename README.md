# Quản lý sinh viên

## Cấu trúc source code

```sh
Group10-Ex-TKPM/ 
├── .gitignore 
├── eslint.config.js 
├── index.html 
├── package.json 
├── src/ 
│ ├── App.jsx 
│ ├── App.scss 
│ ├── components/ 
│ │ ├── EditStudent.jsx 
│ │ └── StudentTable.jsx 
│ ├── contexts/ 
│ │ └── StudentContext.jsx 
│ └── main.jsx 
└── vite.config.js
```

## Hướng dẫn cài đặt & chạy chương trình

### Cài đặt

1. Mở terminal và điều hướng đến thư mục gốc của dự án.
2. Chạy lệnh sau để cài đặt các phụ thuộc:
    ```sh
    npm install
    ```

### Chạy chương trình

1. Để chạy ứng dụng ở chế độ phát triển, sử dụng lệnh:
    ```sh
    npm run dev
    ```
2. Mở trình duyệt và truy cập vào URL được cung cấp bởi terminal (thường là `http://localhost:5173`).

### Biên dịch

1. Để biên dịch ứng dụng cho môi trường sản xuất, sử dụng lệnh:
    ```sh
    npm run build
    ```