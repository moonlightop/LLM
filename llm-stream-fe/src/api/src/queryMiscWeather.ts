import { get } from "@/utils/http"

const queryMiscWeather = (params = {}) => get("https://uapis.cn/api/v1/misc/weather", params)

export default queryMiscWeather
