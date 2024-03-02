import axiosIns from "@/plugins/axios"


export const get_offers_service = async ({
  page,
  limit,
  search,
}) => {
  try {
    const response =
      await axiosIns.get(`offers?page=${page}&limit=${limit}&search=${search}`)

    
    return response.data
  } catch (error) {
    
    return error.response.data
  }
}

export const add_offers_service = async ({
  title,
  description,
  image,
  price,
}) => {
  try {
    const response =
      await axiosIns.post("offers", {
        title,
        description,
        image,
        price,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const edit_offers_service = async ({
  id,
  title,
  description,
  image,
  price,
}) => {
  try {
    const response =
      await axiosIns.put(`offers/${id}`, {
        title,
        description,
        image,
        price,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}

export const remove_offers_service = async id => {
  try {
    const response =
      await axiosIns.delete(`offers/${id}`)

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
