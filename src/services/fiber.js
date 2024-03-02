import axiosIns from "@/plugins/axios"

export const add_fiber_service = async ({
  name,
  address,
  zone,
  number,
  lon,
  lat,
}) => {
  try {
    const response =
      await axiosIns.post("fiber", {
        name,
        address,
        zone,
        number,
        lon,
        lat,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const get_fiber_service = async () => {
  try {
    const response =
      await axiosIns.get(`fiber`)

    
    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const edit_fiber_service = async ({
  id,
  name,
  address,
  zone,
  number,
  lon,
  lat,
}) => {
  try {
    const response =
      await axiosIns.put(`fiber/${id}`, {
        name,
        address,
        zone,
        number,
        lon,
        lat,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}

export const remove_fiber_service = async id => {
  try {
    const response =
      await axiosIns.delete(`fiber/${id}`)

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
