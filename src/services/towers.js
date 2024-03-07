import axiosIns from "@/plugins/axios"

export const add_towers_service = async ({
  name,
  address,
  affiliate,
  sector_name,
  phone_first,
  phone_second,
  lon,
  lat,
}) => {
  try {
    const response =
      await axiosIns.post("towers", {
        name,
        address,
        affiliate,
        sector_name,
        phone_first,
        phone_second,
        lon,
        lat,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const get_towers_service = async () => {
  try {
    const response =
      await axiosIns.get(`towers`)

    
    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const edit_towers_service = async ({
  id,
  name,
  address,
  affiliate,
  sector_name,
  phone_first,
  phone_second,
  lon,
  lat,
}) => {
  try {
    const response =
      await axiosIns.put(`towers/${id}`, {
        name,
        address,
        affiliate,
        sector_name,
        phone_first,
        phone_second,
        lon,
        lat,
      })

    return response.data
  } catch (error) {    
    return error.response.data
  }
}

export const remove_towers_service = async id => {
  try {
    const response =
      await axiosIns.delete(`towers/${id}`)

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
