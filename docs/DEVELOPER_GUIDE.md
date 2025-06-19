# Developer Guide

## 1. Coding Standards

- **JavaScript/Node.js:** Use the ESLint recommended rules. For frontend React code, additional React and React Hooks plugin rules are applied (see `frontend/eslint.config.js`).
- **Naming:** Use camelCase for variables/functions, PascalCase for classes, kebab-case for filenames.
- **Linting:** Use ESLint (see `frontend/eslint.config.js`).
- **Formatting:** Use Prettier for consistent formatting (if configured).
- **Comments:** Write clear, concise comments for complex logic.
- **Indentation:** 2 spaces.
- **Quotes:** Use single quotes for JS, double quotes for JSON.
- **Semicolons:** Always use semicolons.
- **Variable Naming:** Use descriptive names, avoid abbreviations.
- **Functions:** Use arrow functions for anonymous functions.
- **Comments:** Use JSDoc for functions and classes.
- **File Structure:** One class/component per file.
- **Imports:** Use ES6 import/export syntax.

**Example:**
```js
// Good
import express from 'express';

/**
 * Get all students
 * @param {Request} req
 * @param {Response} res
 */
export const getAllStudents = async (req, res) => {
  // ...code...
};
```

---

## 2. Overview of Architecture

- **Backend:** Node.js, Express, MongoDB (Mongoose ODM).
- **Frontend:** Vite (React or other, if present).
- **Database**: MongoDB Atlas with Mongoose ODM
- **API:** RESTful endpoints for CRUD, import/export, business rules.
- **i18n:** Internationalization for error messages and entity names.
- **Testing:** Mocha + Chai for unit/integration tests.

---

## 3. Source Code Organization

### Project overall code organization
```
backend/
frontend/
docs/
  DEVELOPER_GUIDE.md
```

### Backend Structure
```
backend/
├── controllers/          # Business logic handlers
├── models/              # Mongoose data models  
├── routes/              # API route definitions
├── middlewares/         # Custom middleware functions
├── validators/          # Input validation rules
├── utils/               # Utility functions (logger, i18n)
├── tests/               # Unit and integration tests
└── server.js           # Application entry point
```

### Frontend Structure  
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Internationalization files
│   └── utils/          # Utility functions
└── public/             # Static assets
```

---

## 4. Getting Started with App Development

### Backend

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Group10-Ex-TKPM/backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and set `MONGODB_CONNECTION_STRING` and `PORT`.
4. **Seed the database:**
   ```sh
   node seed.js
   ```
5. **Run the backend server:**
   ```sh
   npm run dev
   ```
6. **Run tests:**
   ```sh
   npm test
   ```

### Frontend

1. **Install dependencies:**
   ```sh
   cd ../frontend
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set `VITE_API_URL`.
3. **Run the frontend:**
   ```sh
   npm run dev
   ```

---

## 5. Database Schema

### Overall description
- **MongoDB** is used with Mongoose models for `Student`, `Faculty`, `Program`, `IDDocument`, `StudentStatus`, `Enrollment`, etc.
- **Relationships:** Managed via ObjectId references (e.g., `faculty`, `program` in `Student`).
- **i18n:** Names for entities like `Faculty`, `Program`, `StudentStatus` are stored as `{ vi, en }` objects.

### Key Relationships
- Student → Faculty (Many-to-One)
- Student → Program (Many-to-One)  
- Student → StudentStatus (Many-to-One)
- Class → Course (Many-to-One)
- Class → Semester (Many-to-One)
- Enrollment → Student + Class (Many-to-Many relationship table)

---

## 6. Updating an Existing Entity

**Step-by-step example: Add a `middleName` property to the `Student` model.**

1. **Update the Mongoose Schema**

   Open `backend/models/Student.js` and add the new property:
   ```js
   // ...existing code...
   const studentSchema = new mongoose.Schema({
     // ...existing fields...
     middleName: { type: String }, // <-- Add this line
     // ...existing fields...
   });
   // ...existing code...
   ```

2. **Update Data Validation (if needed)**

   If you want to validate `middleName`, update `backend/validators/student.validator.js`:
   ```js
   import { body } from 'express-validator';
   // ...existing code...
   const validateMiddleName = body('middleName')
     .optional()
     .isString()
     .withMessage('Middle name must be a string');
   // Add to your validation chain
   ```

3. **Update Controllers**

   If you want to allow updating/creating this property, ensure your controller handles it:
   ```js
   // In createStudent and updateStudent, no change is needed if you use req.body destructuring.
   ```

4. **Update API Documentation**

   Add `middleName` to your API docs and sample requests.

5. **Update Tests**

   Add/modify tests in `backend/tests/student.test.js`:
   ```js
   it('should create a student with a middle name', async () => {
     const studentData = { ...validStudent, middleName: 'Van' };
     const res = await chai.request(app).post('/api/students').send(studentData);
     expect(res.body).to.have.property('middleName', 'Van');
   });
   ```

---

## 7. Registering New Routes

**Step-by-step example: Add a new route for managing departments.**

1. **Create a Model**

   `backend/models/Department.js`:
   ```js
   import mongoose from 'mongoose';
   const departmentSchema = new mongoose.Schema({
     name: { type: String, required: true, unique: true }
   });
   export default mongoose.model('Department', departmentSchema);
   ```

2. **Create a Controller**

   `backend/controllers/department.controller.js`:
   ```js
   import Department from '../models/Department.js';
   export const getAllDepartments = async (req, res) => {
     const departments = await Department.find();
     res.json(departments);
   };
   // Add more CRUD methods as needed
   ```

3. **Create a Route File**

   `backend/routes/department.routes.js`:
   ```js
   import express from 'express';
   import { getAllDepartments } from '../controllers/department.controller.js';
   const router = express.Router();
   router.get('/', getAllDepartments);
   export default router;
   ```

4. **Register the Route in the App**

   In `backend/server.js`:
   ```js
   import departmentRoutes from './routes/department.routes.js';
   app.use('/api/departments', departmentRoutes);
   ```

5. **Test the New Route**

   Use Postman or write a test in `backend/tests/department.test.js`.

---

## 9. Data Validation

**How to add and use validation for a new or existing entity:**

1. **Create a Validator**

   `backend/validators/department.validator.js`:
   ```js
   import { body } from 'express-validator';
   export const validateDepartment = [
     body('name')
       .trim()
       .notEmpty().withMessage('Department name is required')
       .isLength({ min: 2 }).withMessage('Department name must be at least 2 characters')
   ];
   ```

2. **Use the Validator in Routes**

   In `backend/routes/department.routes.js`:
   ```js
   import { validateDepartment } from '../validators/department.validator.js';
   import { validationResult } from 'express-validator';

   router.post(
     '/',
     validateDepartment,
     (req, res, next) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
       next();
     },
     createDepartment
   );
   ```

3. **Test Validation**

   Add tests for invalid/valid data in your test file.

---

## 10. Exposing and Handling Events

- **Not used by default.**

---

## 11. Settings API

- **Email/Phone Config:** Endpoints for managing allowed email domains and phone number formats.
- **Location:** `backend/routes/emailConfig.routes.js`, `backend/routes/phoneConfig.routes.js`

---

## 12. Unit Testing

- **Framework:** Mocha + Chai.
- **Location:** `backend/tests/`
- **How to run:** `npm test` in the `backend` folder.
- **Coverage:** CRUD, business rules, import/export, validation, i18n, edge cases.
- **Example files:** `student.test.js`, `importExport.test.js`, `businessRules.test.js`
- **Test data:** Use test data builders and seed scripts for isolation.

---

## 13. How to Write a Plugin for Your App

- **Not supported by default.** If you add plugin support, document the plugin interface, registration, and lifecycle here.

---

## 14. Web API Documentation

- **Endpoints:**  
  | Endpoint                  | Description                              |
  |---------------------------|------------------------------------------|
  | `/api/students`           | Student management                       |
  | `/api/faculties`          | Faculty management                       |
  | `/api/programs`           | Program management                       |
  | `/api/student-statuses`   | Student status management                |
  | `/api/email-configs`      | Email domain configuration               |
  | `/api/phone-configs`      | Phone number configuration               |
  | `/api/status-transitions` | Student status transition configuration  |
  | `/api/courses`            | Course management                        |
  | `/api/classes`            | Class management                         |
  | `/api/enrollments`        | Enrollment management                    |

- **Request/Response:** See `backend/README.md` for sample request bodies.
- **i18n:** Use `?lang=vi` or `?lang=en` in query params for localized responses.
- **Error Handling:** Standardized error messages, status codes, and i18n support.

---

## 15. Additional Notes

- **Logger:** All major actions and errors are logged via `utils/logger.js`.
- **Import/Export:** Students can be imported/exported via CSV endpoints.
- **Business Rules:** Enforced in validators and controllers (e.g., allowed email domains, phone formats, status transitions).
- **Seed Data:** Use `seed.js` to initialize the database with test data.

---
