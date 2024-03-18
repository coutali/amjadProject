import axiosIns from "@/plugins/axios"

export const add_fiber_service = async ({
  name,
  address,
  location,
  zone,
  columns,
}) => {
  try {
    const response =
      await axiosIns.post("fiber", {
        name,
        address,
        location,
        zone,
        columns,
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
  location,
  columns,
}) => {
  try {
    const response =
      await axiosIns.put(`fiber/${id}`, {
        name,
        address,
        zone,
        location,
        columns,
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
