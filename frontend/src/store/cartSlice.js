import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [], total: 0 },
    reducers: {
        addToCart: (state, action) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) item.quantity += 1;
            else state.items.push({ ...action.payload, quantity: 1 });
            state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        },
        clearCart: (state) => { state.items = []; state.total = 0; }
    }
});
export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
