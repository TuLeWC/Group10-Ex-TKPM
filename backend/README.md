### Request body mẫu với email và số điện thoại hợp lệ với business rules được định nghĩa sẵn khi seed database

```json
{
  "idDocument": {
    "type": "CMND",
    "idNumber": "12222",
    "issuedDate": "2025-02-25T00:00:00.000Z",
    "expiryDate": "2025-03-15T00:00:00.000Z",
    "issuedPlace": "vn",
    "issuedCountry": "",
    "hasChip": false,
    "notes": ""
  },
  "studentId": "123123",
  "fullName": "sdfsdf",
  "dateOfBirth": "2025-02-27T00:00:00.000Z",
  "gender": "Nam",
  "faculty": "67e5a7c42db9afe18c54dd3e",
  "program": "67e5a7c42db9afe18c54dd43",
  "studentStatus": "67e5a7c42db9afe18c54dd4f",
  "addresses": {
    "permanent": {
      "houseNumber": "l;kj;lkj",
      "street": ";lkj",
      "district": ";lkj",
      "city": ";l",
      "country": "kj"
    },
    "temporary": {
      "houseNumber": ";lkj",
      "street": ";lk",
      "district": "j",
      "city": ";lkj",
      "country": ";lkj"
    },
    "mailing": {
      "houseNumber": "dfvfdg",
      "street": "l;kjl;kj",
      "district": "l;kj",
      "city": "l;kjl;kj",
      "country": "sdf"
    }
  },
  "email": "test100@university.edu.vn",
  "phoneNumber": "0901234567",
  "nationality": "kjlh"
}
```

### Các endpoint của API

| Endpoint                  | Chức năng                              |
| ------------------------- | -------------------------------------- |
| `/api/students`           | Quản lý sinh viên                      |
| `/api/faculties`          | Quản lý khoa                           |
| `/api/programs`           | Quản lý chương trình học               |
| `/api/student-statuses`   | Quản lý Trạng thái sinh viên           |
| `/api/email-configs`      | Cấu hình email                         |
| `/api/phone-configs`      | Cấu hình số điện thoại                 |
| `/api/status-transitions` | Cấu hình thay đổi trạng thái sinh viên |
