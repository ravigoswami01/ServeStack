import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../API/axios";
import { endpoints } from "../API/ApiEndPoint";

export const useBookingStore = create(
    persist(
        (set, get) => ({
            // Booking form state
            booking: {
                restaurantId: "",
                date: "",
                time: "",
                partySize: 1,
                guestName: "",
                guestEmail: "",
                guestPhone: "",
                specialRequests: "",
                tableType: "standard", // standard, window, private
            },

            // UI state
            loading: false,
            error: null,
            success: false,
            successMessage: "",

            // Data state
            bookings: [],
            currentBooking: null,
            availableTables: [],
            bookingHistory: [],

            // Setters for booking details
            setBookingField: (field, value) =>
                set((state) => ({
                    booking: {
                        ...state.booking,
                        [field]: value,
                    },
                })),

            setBooking: (bookingData) =>
                set({
                    booking: { ...bookingData },
                }),

            // Fetch all user bookings
            fetchBookings: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await apiClient.get(endpoints.booking?.getAll);
                    set({
                        bookings: response.data?.bookings || [],
                        bookingHistory: response.data?.bookings || [],
                        loading: false,
                    });
                } catch (err) {
                    set({
                        error: err?.response?.data?.message || "Failed to fetch bookings",
                        loading: false,
                    });
                }
            },

            // Fetch booking by ID
            fetchBookingById: async (bookingId) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiClient.get(
                        endpoints.booking?.getById
                            ? endpoints.booking.getById(bookingId)
                            : `/api/bookings/${bookingId}`
                    );
                    set({
                        currentBooking: response.data?.booking || null,
                        loading: false,
                    });
                } catch (err) {
                    set({
                        error: err?.response?.data?.message || "Failed to fetch booking",
                        loading: false,
                    });
                }
            },

            // Check available tables for date/time
            checkAvailability: async (restaurantId, date, time, partySize) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiClient.get(
                        endpoints.booking?.checkAvailability
                            ? `${endpoints.booking.checkAvailability}?restaurantId=${restaurantId}&date=${date}&time=${time}&partySize=${partySize}`
                            : `/api/bookings/availability?restaurantId=${restaurantId}&date=${date}&time=${time}&partySize=${partySize}`
                    );
                    set({
                        availableTables: response.data?.tables || [],
                        loading: false,
                    });
                    return response.data?.tables || [];
                } catch (err) {
                    set({
                        error: err?.response?.data?.message || "Failed to check availability",
                        loading: false,
                    });
                    return [];
                }
            },

            // Create new booking
            createBooking: async (bookingData) => {
                set({ loading: true, error: null, success: false });
                try {
                    const bookingPayload = bookingData || get().booking;

                    if (!bookingPayload.restaurantId) {
                        throw new Error("Restaurant ID is required");
                    }
                    if (!bookingPayload.date) {
                        throw new Error("Date is required");
                    }
                    if (!bookingPayload.time) {
                        throw new Error("Time is required");
                    }
                    if (!bookingPayload.partySize || bookingPayload.partySize < 1) {
                        throw new Error("Valid party size is required");
                    }

                    const response = await apiClient.post(
                        endpoints.booking?.create || "/api/bookings",
                        bookingPayload
                    );

                    const newBooking = response.data?.booking || response.data;

                    set((state) => ({
                        bookings: [...state.bookings, newBooking],
                        currentBooking: newBooking,
                        success: true,
                        successMessage: "Booking confirmed successfully!",
                        loading: false,
                        error: null,
                    }));

                    return newBooking;
                } catch (err) {
                    set({
                        error: err?.response?.data?.message || err.message || "Failed to create booking",
                        success: false,
                        loading: false,
                    });
                    throw err;
                }
            },

            // Update existing booking
            updateBooking: async (bookingId, updates) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiClient.put(
                        endpoints.booking?.update
                            ? endpoints.booking.update(bookingId)
                            : `/api/bookings/${bookingId}`,
                        updates
                    );

                    const updatedBooking = response.data?.booking || response.data;

                    set((state) => ({
                        bookings: state.bookings.map((b) =>
                            b._id === bookingId ? updatedBooking : b
                        ),
                        currentBooking:
                            state.currentBooking?._id === bookingId ? updatedBooking : state.currentBooking,
                        success: true,
                        successMessage: "Booking updated successfully!",
                        loading: false,
                    }));

                    return updatedBooking;
                } catch (err) {
                    set({
                        error: err?.response?.data?.message || "Failed to update booking",
                        loading: false,
                    });
                    throw err;
                }
            },

            // Cancel booking
            cancelBooking: async (bookingId, reason = "") => {
                set({ loading: true, error: null });
                try {
                    const response = await apiClient.delete(
                        endpoints.booking?.cancel
                            ? endpoints.booking.cancel(bookingId)
                            : `/api/bookings/${bookingId}`,
                        { data: { reason } }
                    );

                    set((state) => ({
                        bookings: state.bookings.filter((b) => b._id !== bookingId),
                        currentBooking:
                            state.currentBooking?._id === bookingId ? null : state.currentBooking,
                        success: true,
                        successMessage: "Booking cancelled successfully!",
                        loading: false,
                    }));

                    return response.data;
                } catch (err) {
                    set({
                        error: err?.response?.data?.message || "Failed to cancel booking",
                        loading: false,
                    });
                    throw err;
                }
            },

            // Reset booking form
            resetBooking: () =>
                set({
                    booking: {
                        restaurantId: "",
                        date: "",
                        time: "",
                        partySize: 1,
                        guestName: "",
                        guestEmail: "",
                        guestPhone: "",
                        specialRequests: "",
                        tableType: "standard",
                    },
                    error: null,
                    success: false,
                    successMessage: "",
                }),

            // Clear messages
            clearMessages: () =>
                set({
                    error: null,
                    success: false,
                    successMessage: "",
                }),

            // Validate booking data
            validateBooking: () => {
                const { booking } = get();
                const errors = [];

                if (!booking.restaurantId) errors.push("Restaurant is required");
                if (!booking.date) errors.push("Date is required");
                if (!booking.time) errors.push("Time is required");
                if (!booking.partySize || booking.partySize < 1)
                    errors.push("Party size must be at least 1");
                if (booking.partySize > 20) errors.push("Party size cannot exceed 20");
                if (!booking.guestName?.trim()) errors.push("Guest name is required");
                if (!booking.guestPhone?.trim()) errors.push("Phone number is required");

                return {
                    isValid: errors.length === 0,
                    errors,
                };
            },
        }),
        {
            name: "booking-storage",
            partialize: (state) => ({
                bookingHistory: state.bookingHistory,
                booking: state.booking,
            }),
        }
    )
);
