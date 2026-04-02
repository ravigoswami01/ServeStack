import { create } from "zustand";
import apiClient from "../API/axios";
import { endpoints } from "../API/ApiEndPoint";

export const useOrderStore = create((set, get) => ({
    orderType: "delivery",
    loading: false,
    error: null,
    order: null,

    address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        instructions: "",
    },

    tableNumber: "",

    setOrderType: (type) => set({ orderType: type }),

    setAddress: (field, value) =>
        set((state) => ({
            address: { ...state.address, [field]: value },
        })),

    setTableNumber: (value) => set({ tableNumber: value }),

    reset: () =>
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

    validate: (cart) => {
        const { orderType, address, tableNumber } = get();

        if (!cart?.length) return "Cart is empty";

        if (orderType === "delivery") {
            if (!address?.street || !address?.phone) {
                return "Street & Phone required";
            }
        }

        if (orderType === "dine-in") {
            if (!tableNumber) {
                return "Table number required";
            }
        }

        return null;
    },

    buildPayload: (cart) => {
        const { orderType, address, tableNumber } = get();

        return {
            restaurantId: cart?.[0]?.restaurantId || "default",
            orderType,
            items: cart.map((item) => ({
                menuItemId: item.menuItemId || item._id || item.id,
                quantity: Number(item.quantity),
                specialInstructions: item.specialInstructions || "",
            })),
            ...(orderType === "delivery" && {
                deliveryAddress: {
                    street: address?.street || "",
                    city: address?.city || "",
                    state: address?.state || "",
                    zipCode: address?.zipCode || "",
                    phone: address?.phone || "",
                    instructions: address?.instructions || "",
                },
            }),
            ...(orderType === "dine-in" && {
                tableNumber: String(tableNumber),
            }),
        };
    },

    placeOrder: async (cart) => {
        try {
            set({ loading: true, error: null });

            const validationError = get().validate(cart);
            if (validationError) throw new Error(validationError);

            const payload = get().buildPayload(cart);
            console.log("Order Payload:", payload);

            const { data } = await apiClient.post(
                endpoints.order.create,
                payload
            );

            set({ loading: false });

            return { success: true, order: data };
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Order failed";

            set({ loading: false, error: message });

            return { success: false, message };
        }
    },

    getOrder: async (orderId) => {
        try {
            set({ loading: true, error: null });

            const { data } = await apiClient.get(
                endpoints.order.getById(orderId)
            );
            set({ loading: false, order: data });

            return { success: true, order: data };
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to fetch order";

            set({ loading: false, error: message });

            return { success: false, message };
        }
    },
}));