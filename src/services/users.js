import axiosIns from "@/plugins/axios"


export const get_users_service = async ({
  page,
  limit,
  search,
}) => {
  try {
    const response =
      await axiosIns.get(`users?page=${page}&limit=${limit}&search=${search}`)

    
    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}

export const add_users_service = async ({
  name,
  phone,
  password_show,
  email,
  address,
  privileges,
}) => {
  try {
    const response =
      await axiosIns.post("users", {
        name,
        phone,
        password_show,
        email,
        address,
        privileges,
      })

    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}
export const edit_users_service = async ({
  id,
  name,
  phone,
  password_show,
  email,
  address,
  privileges,
}) => {
  try {
    const response =
      await axiosIns.put(`users/${id}`, {
        name,
        phone,
        password_show,
        email,
        address,
        privileges,
      })

    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}

export const remove_users_service = async id => {
  try {
    const response =
      await axiosIns.delete(`users/${id}`)

    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}
