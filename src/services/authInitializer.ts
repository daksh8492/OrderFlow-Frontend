import { store } from "@/store/store";
import { me, refresh } from "./authService";
import { loginSuccess, logoutSuccess, setLoading, setUser } from "@/store/authSlice";

export async function initializeAuth() {

    try {
        const refreshResponse = await refresh();
        store.dispatch(loginSuccess(refreshResponse))
        console.log(`refresh done ${refreshResponse}`)
        const user = await me();
        store.dispatch(setUser(user))
        console.log(`me done ${user}`)
    } catch (error) {
        store.dispatch(logoutSuccess())
    } finally {
        store.dispatch(setLoading(false))
    }
    
}