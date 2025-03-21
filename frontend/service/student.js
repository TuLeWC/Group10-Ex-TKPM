import axios from "axios";

const studentClient = axios.create({
  baseURL: `https://localhost:5000/api/students`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default studentClient;