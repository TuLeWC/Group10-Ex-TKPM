import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDataFromAPI, postDataToAPI, putDataToAPI } from '../ultis/api';
import i18n from 'i18next';

const language = i18n.language;

// Async thunk để lấy thông tin faculties
export const fetchFaculties = createAsyncThunk(
  'faculty/fetchFaculties',
  async (lang, { rejectWithValue }) => {
    try {
      const response = await fetchDataFromAPI(`/api/faculties?lang=${lang}`); // Thay URL bằng endpoint API của bạn
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch faculties');
    }
  }
);

// Async thunk để thêm khoa
export const addFaculty = createAsyncThunk(
  'faculty/addFaculty',
  async (newFaculty, { rejectWithValue }) => {
    try {
      const response = await postDataToAPI('/api/faculties', newFaculty);
      const facultyName = language === 'vi' ? response.name.vi : response.name.en;
      return {_id: response._id, name: facultyName }; // Trả về ID và tên khoa
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add faculty');
    }
  }
);

// Async thunk để cập nhật khoa
export const updateFaculty = createAsyncThunk(
  'faculty/updateFaculty',
  async ({ id, updatedFaculty }, { rejectWithValue }) => {
    try {
      const response = await putDataToAPI(`/api/faculties/${id}`, updatedFaculty);
      return { id, updatedFaculty: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update faculty');
    }
  }
);

export const FacultyReducer = createSlice({
  name: 'faculty',
  initialState: {
    faculties: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaculties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaculties.fulfilled, (state, action) => {
        state.loading = false;
        state.faculties = action.payload;
      })
      .addCase(fetchFaculties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFaculty.fulfilled, (state, action) => {
        state.faculties.push(action.payload); // Thêm khoa mới vào danh sách
      })
      .addCase(addFaculty.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateFaculty.fulfilled, (state, action) => {
        const { id, updatedFaculty } = action.payload;
        state.faculties = state.faculties.map((faculty) =>
          faculty._id === id ? { ...faculty, ...updatedFaculty } : faculty
        ); // Cập nhật khoa trong danh sách
      })
      .addCase(updateFaculty.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default FacultyReducer.reducer;