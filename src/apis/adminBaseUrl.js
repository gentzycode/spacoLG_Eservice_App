import axios from "axios";

export default axios.create({
    baseURL: import.meta.env.VITE_ADMIN_BASE_URL
});