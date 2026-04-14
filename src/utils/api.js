import axios from 'axios'
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })
export const submitContactForm = (data) => API.post('/contact', data)
export const getTestimonials = () => API.get('/testimonials')
export const getGallery = () => API.get('/gallery')