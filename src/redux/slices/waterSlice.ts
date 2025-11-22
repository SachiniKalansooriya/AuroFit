import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import WaterService from '../../services/waterService';
import { WaterGoal, WaterHistory, WaterIntake } from '../../types/wellness';

interface WaterState {
  currentIntake: number;
  goal: WaterGoal | null;
  weeklyHistory: WaterHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: WaterState = {
  currentIntake: 0,
  goal: null,
  weeklyHistory: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadWaterData = createAsyncThunk(
  'water/loadData',
  async () => {
    const [total, goal, history] = await Promise.all([
      WaterService.getTodayTotal(),
      WaterService.getGoal(),
      WaterService.getWeeklyHistory(),
    ]);
    return { currentIntake: total, goal, weeklyHistory: history };
  }
);

export const addWaterIntake = createAsyncThunk(
  'water/addIntake',
  async (amount: number, { getState }) => {
    const state = getState() as { water: WaterState };
    if (!state.water.goal) throw new Error('No goal set');
    await WaterService.addIntake(amount, state.water.goal.glassSize);
    const newTotal = await WaterService.getTodayTotal();
    return newTotal;
  }
);

export const removeWaterIntake = createAsyncThunk(
  'water/removeIntake',
  async () => {
    await WaterService.removeLastIntake();
    const newTotal = await WaterService.getTodayTotal();
    return newTotal;
  }
);

export const updateWaterGoal = createAsyncThunk(
  'water/updateGoal',
  async (newGoal: WaterGoal) => {
    await WaterService.saveGoal(newGoal);
    return newGoal;
  }
);

const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWaterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWaterData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIntake = action.payload.currentIntake;
        state.goal = action.payload.goal;
        state.weeklyHistory = action.payload.weeklyHistory;
      })
      .addCase(loadWaterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addWaterIntake.fulfilled, (state, action) => {
        state.currentIntake = action.payload;
        // Update today's history if exists
        const today = new Date().toISOString().split('T')[0];
        const todayIndex = state.weeklyHistory.findIndex(h => h.date === today);
        if (todayIndex >= 0) {
          state.weeklyHistory[todayIndex].totalIntake = action.payload;
        }
      })
      .addCase(removeWaterIntake.fulfilled, (state, action) => {
        state.currentIntake = action.payload;
        // Update today's history
        const today = new Date().toISOString().split('T')[0];
        const todayIndex = state.weeklyHistory.findIndex(h => h.date === today);
        if (todayIndex >= 0) {
          state.weeklyHistory[todayIndex].totalIntake = action.payload;
        }
      })
      .addCase(updateWaterGoal.fulfilled, (state, action) => {
        state.goal = action.payload;
      });
  },
});

export const { clearError } = waterSlice.actions;
export default waterSlice.reducer;