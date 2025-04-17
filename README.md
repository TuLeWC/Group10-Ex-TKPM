# Cách chạy chương trình:

## Cách chạy server Backend

- Tạo database trống ở MongoDB Atlas
- Điều hướng tới folder backend
  ```sh
  cd backend
  ```
- Cài đặt các dependencies:
  ```sh
  npm install
  ```
- Tạo file **.env** và cung cấp thông tin **MONGODB_CONNECTION_STRING** và **PORT** như hướng dẫn ở **.env.example**
- Khởi tạo database bằng lệnh:
  ```sh
  node seed.js
  ```
- Chạy server bằng lệnh:
  ```sh
  npm run dev
  ```

## Cách chạy server Frontend

### Cài đặt

1. Mở terminal và điều hướng đến thư mục frontend của dự án.
   ```sh
   cd frontend
   ```
2. Chạy lệnh sau để cài đặt các phụ thuộc:
   ```sh
   npm install
   ```

### Chạy chương trình

1. Tạo file **.env** và cung cấp thông tin **VITE_API_URL** như hướng dẫn ở **.env.example**
2. Để chạy ứng dụng ở chế độ phát triển, sử dụng lệnh:
   ```sh
   npm run dev
   ```
3. Mở trình duyệt và truy cập vào URL được cung cấp bởi terminal (thường là `http://localhost:5173`).

### Biên dịch

1.  Để biên dịch ứng dụng cho môi trường sản xuất, sử dụng lệnh:
    ```sh
    npm run build
    ```

## Hình ảnh minh hoạ tính năng

- Thêm sinh viên mới:
  [ADD-NEW-STUDENT](https://drive.google.com/file/d/12bm2igDFDUMIO5fb9F3xoHoDRyLnMLWO/view?usp=sharing)
- Xóa sinh viên:
  [DELETE-STUDENT](https://drive.google.com/file/d/1UYNcsLooTZ2X9my8amH0emtnqPaUjIDW/view?usp=sharing)
- Cập nhật thông tin sinh viên:
  [UPDATE-STUDENT](https://drive.google.com/file/d/1DfrFU6bRsa8KpmoEHDj0IPdvdUx0LOh2/view?usp=sharing)
- Tìm kiếm sinh viên:
  [SEARCH-STUDENT](https://drive.google.com/file/d/1BkgsIwPPkboWCbje2V7kZqGJQvyh2Ssd/view?usp=sharing)
- Cho phép đổi tên & thêm mới: khoa, tình trạng sinh viên, chương trình:
  [MANAGE-FACULTY](https://drive.google.com/file/d/1unebPH5v1kGXTA6aI4nB2ynR5X-2I9Dn/view?usp=sharing),
  [MANAGE-STUDENT-STATUS](https://drive.google.com/file/d/1aaMcZhb7DljRADF1DqAANpTwT3A371Ml/view?usp=sharing),
  [MANAGE-PROGRAM](https://drive.google.com/file/d/1KEIc-8wF4_WsxhmUB19149g1lNgL9Shr/view?usp=sharing)

- import JSON file:
  ![Import JSON Feature](./frontend/images/import_JSON.png)

- import CSV file:
  ![Import CSV Feature](./frontend/images/import_CSV.png)

- export:
  ![Export Feature](./frontend/images/export.png)

  - export JSON:
    ![Export JSON Feature](./frontend/images/export_JSON.png)

  - export CSV:
    ![Export CSV Feature](./frontend/images/export_CSV.png)

- Các business rules:
  [CONFIG-EMAIL-DOMAIN](https://drive.google.com/file/d/1SjobgUnJRVjRM1q3-gH48MOwIYHOuqYL/view?usp=sharing),
  [CONFIG-PHONE](https://drive.google.com/file/d/1F1JFGEkrm86b2Jliqdj7U4_nJmwhWT1k/view?usp=sharing),
  [CONFIG-STUDENT-STATUS](https://drive.google.com/file/d/1zC_H8E5ErOQH2YtWZgQlntYGURA4-PIf/view?usp=sharing),
  [DEMO-BUSINESS-RULE](https://drive.google.com/file/d/1Di3p0vI1wGEYnLCpRmlPzYGvCfVu1wdj/view?usp=sharing)

- Thêm khóa học mới: 
  [ADD-NEW-COURSE](https://drive.google.com/file/d/1URWBQ6pvL0_SOAOIxR3YvJUUxxXzAxcF/view?usp=sharing)
- Xóa khóa học: 
  [REMOVE-COURSE](https://drive.google.com/file/d/1lkL5osbkM2SxqTY_ii5_o84uTd5jDLsE/view?usp=sharing)
- Cập nhật thông tin khóa học: 
  [EDIT-COURSE](https://drive.google.com/file/d/1hxyfckaCzoeDAVWZBIyeNgjTVX4WevJI/view?usp=sharing)
- Mở lớp học cho một khóa học cụ thể: 
  [ADD-NEW-CLASS](https://drive.google.com/file/d/1aq6n2FQlRRAb1x_hwouVFkgFzp1YGoTF/view?usp=sharing)
- Đăng ký khóa học cho sinh viên: 
  [REGISTER-CLASS-STUDENT](https://drive.google.com/file/d/1Ta0vcLcwWYN5iJqwXJ9WLRYELBCrnPax/view?usp=sharing)
- Hủy đăng ký khóa học của sinh viên: 
  [REMOVE-CLASS-STUDENT](https://drive.google.com/file/d/1iEYeVHqbvjWAt9RdPJVM4EEwVD34ekAF/view?usp=sharing)
- In bảng điểm chính thức: 
  [PRINT-GRADE](https://drive.google.com/file/d/1TCVxFLv1WU7fAGaEB9Vs5zOO135hxY4t/view?usp=sharing)
