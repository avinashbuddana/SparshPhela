import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Build a media (AI image) URL from a key
export const img = (key) => `${API}/media/${key}`;

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

// Public fetchers
export const getServices = () => api.get("/services").then((r) => r.data);
export const getService = (slug) => api.get(`/services/${slug}`).then((r) => r.data);
export const getBlogs = (params) => api.get("/blogs", { params }).then((r) => r.data);
export const getBlog = (slug) => api.get(`/blogs/${slug}`).then((r) => r.data);
export const getBlogCategories = () => api.get("/blogs/categories").then((r) => r.data);
export const getTestimonials = () => api.get("/testimonials").then((r) => r.data);
export const getFaqs = () => api.get("/faqs").then((r) => r.data);
export const getGallery = (category) => api.get("/gallery", { params: { category } }).then((r) => r.data);
export const postInquiry = (data) => api.post("/inquiries", data).then((r) => r.data);
export const postBooking = (data) => api.post("/bookings", data).then((r) => r.data);
export const postNewsletter = (email) => api.post("/newsletter", { email }).then((r) => r.data);
