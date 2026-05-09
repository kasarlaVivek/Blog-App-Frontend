import { create } from "zustand";
import axios from "axios";


export const useAuth = create((set) => ({
    currentUser: null,
    articles: [],
    isAuthenticated: false,
    err: null,
    loading: false,
    setErr: (msg) => set({ err: msg }),
    setLoading: (status) => set({ loading: status }),
    setArticles: (allArticles) => set({ articles: allArticles }),
    login: async (userCredObj) => {
        try {
            // set loading state
            set({ loading: true, err: null });
            // make api req
            let res = await axios.post("http://localhost:3000/common-api/login", userCredObj,
                { withCredentials: true });
            console.log(res);

            // update the state
            set({ loading: false, err: null, isAuthenticated: true, currentUser: res.data.payload })
        } catch (err) {
            console.log(err);
            // set errors
            set({
                loading: false,
                err: err.response?.data?.error || 'Login failed',
                isAuthenticated: false,
                currentUser: null
            })
        }

    },
    logout: async () => {
        try {
            // set loading state
            set({ loading: true, err: null });
            // make logout api req
            let res = await axios.get("http://localhost:3000/common-api/logout", { withCredentials: true })
            // update state
            set({ loading: false, err: null, isAuthenticated: false, currentUser: null })
        } catch (err) {
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                err: err.response?.data?.error || "Logout failed"
            })
        }
    },
    checkAuth: async () => {
        try {
            set({ loading: true });
            const res = await axios.get("http://localhost:3000/common-api/check-auth", { withCredentials: true });

            set({
                currentUser: res.data.payload,
                isAuthenticated: true,
                loading: false,
            });
            
        } catch (err) {
            // If user is not logged in → do nothing
            if (err.response?.status === 401) {
                set({
                    currentUser: null,
                    isAuthenticated: false,
                    loading: false,
                });
                return;
            }

            // other errors
            console.error("Auth check failed:", err);
            set({ loading: false });
        }
    }
}));



