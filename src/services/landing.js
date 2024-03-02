import axiosIns from "@/plugins/axios"

export const get_analyze_service = async () => {
  try {
    const response =
        await axiosIns.get(`analyze`)
  
      
    return response.data
  } catch (error) {
      
    return error.response.data
  }
}
