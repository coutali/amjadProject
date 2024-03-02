import axiosIns from "@/plugins/axios"


export const get_packages_service = async ({
  page,
  limit,
  search,
}) => {
  try {
    const response =
      await axiosIns.get(`packages?page=${page}&limit=${limit}&search=${search}`)

    
    return response.data
  } catch (error) {    
    return error.response.data
  }
}

export const add_packages_service = async ({
  title,
  image,
  discount,
  price,
  type,
}) => {
  try {
    const response =
      await axiosIns.post("packages", {
        title,
        discount,
        image,
        price,
        type,
      })

    return response.data
  } catch (error) {    
    return error.response.data
  }
}
export const edit_packages_service = async ({
  id,
  title,
  image,
  discount,
  price,
  type,
}) => {
  try {
    const response =
      await axiosIns.put(`packages/${id}`, {
        title,
        image,
        discount,
        price,
        type,
      })

    return response.data
  } catch (error) {    
    return error.response.data
  }
}

export const remove_packages_service = async id => {
  try {
    const response =
      await axiosIns.delete(`packages/${id}`)

    return response.data
  } catch (error) {    
    return error.response.data
  }
}
