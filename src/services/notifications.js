import axiosIns from "@/plugins/axios"


export const get_notifications_service = async ({
  page,
  limit,
  search,
}) => {
  try {
    const response =
      await axiosIns.get(`notifications?page=${page}&limit=${limit}&search=${search}`)

    
    return response.data
  } catch (error) {
    
    return error.response.data
  }
}

export const add_notifications_service = async ({
  title,
  body,
  image,
}) => {
  try {
    const response =
      await axiosIns.post("notifications", {
        title,
        body,
        image,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}

export const remove_notifications_service = async id => {
  try {
    const response =
      await axiosIns.delete(`notifications/${id}`)

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
