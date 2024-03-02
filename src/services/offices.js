import axiosIns from "@/plugins/axios"

export const add_offices_service = async ({
  name,
  address,
  lon,
  lat,
}) => {
  try {
    const response =
      await axiosIns.post("offices", {
        name,
        address,
        lon,
        lat,
      })

    return response.data
  } catch (error) {    
    return error.response.data
  }
}
export const get_offices_service = async () => {
  try {
    const response =
      await axiosIns.get(`offices`)
    
    return response.data
  } catch (error) {    
    return error.response.data
  }
}
export const edit_offices_service = async ({
  id,
  name,
  address,
  lon,
  lat,
}) => {
  try {
    const response =
      await axiosIns.put(`offices/${id}`, {
        name,
        address,
        lon,
        lat,
      })

    return response.data
  } catch (error) {    
    return error.response.data
  }
}

export const remove_offices_service = async id => {
  try {
    const response =
      await axiosIns.delete(`offices/${id}`)

    return response.data
  } catch (error) {    
    return error.response.data
  }
}
