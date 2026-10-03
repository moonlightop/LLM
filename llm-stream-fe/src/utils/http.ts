import axios from "axios"
import network from "@/config/network"

const http = axios.create({
  baseURL: network.httpUrl,
  timeout: 60000,
  withCredentials: false,
  headers: {
    post: {
      "Content-Type": "application/json",
    }
  }
})

http.requestInterceptor = http.interceptors.request.use(req => {
  return req
})
http.responseInterceptor = http.interceptors.response.use(res => {
  return res.data
})

export const get = (uri, params = {}) => http.get(uri, params)
export const post = (uri, data = {}, options = {}) => http.post(uri, data, options)
export default http
