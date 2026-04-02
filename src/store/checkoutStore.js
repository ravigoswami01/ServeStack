import { create } from "zustand";
import apiClient from "../API/axios";
import { endpoints } from "../API/ApiEndPoint";

export const useCheckoutStore = create((set, get) => ({
    /* ================= STATE ================= */
    orderType: "delivery",
    loading: false,
    error: null,

    address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        instructions: "",
    },

    tableNumber: "",

    /* ================= SETTERS ================= */
    setOrderType: (type) => set({ orderType: type }),

    setAddress: (field, value) =>
        set((state) => ({
            address: { ...state.address, [field]: value },
        })),

    setTableNumber: (value) => set({ tableNumber: value }),

    resetCheckout: () =>
        set({
            orderType: "delivery",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                phone: "",
                instructions: "",
            },
            tableNumber: "",
            error: null,
        }),

    /* ================= VALIDATION ================= */
    validateCheckout: (cart) => {
        const { orderType, address, tableNumber } = get();

        if (!cart.length) return "Cart is empty";

        if (orderType === "delivery") {
            if (!address.street || !address.phone) {
                return "Street & Phone are required";
            }
        }

        if (orderType === "dine-in") {
            if (!tableNumber) {
                return "Table number required";
            }
        }

        return null;
    },

    /* ================= PLACE ORDER ================= */
    placeOrder: async (cart) => {
        try {
            set({ loading: true, error: null });

            const { orderType, address, tableNumber } = get();

            const validationError = get().validateCheckout(cart);
            if (validationError) throw new Error(validationError);

            const payload = {
                restaurantId: cart[0]?.restaurantId || "default",
                orderType,
                items: cart.map((item) => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    specialInstructions: item.specialInstructions || "",
                })),
                ...(orderType === "delivery" && {
                    deliveryAddress: address,
                }),
                ...(orderType === "dine-in" && {
                    tableNumber,
                }),
            };

            const res = await apiClient.post(endpoints.order.create, payload);

            set({ loading: false });

            return {
                success: true,
                order: res.data,
            };
        } catch (err) {
            const message =
                err.response?.data?.error || err.message || "Order failed";

            set({
                loading: false,
                error: message,
            });

            return {
                success: false,
                message,
            };
        }
    },
}));