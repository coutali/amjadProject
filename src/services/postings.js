import axiosIns from "@/plugins/axios"


export const get_ads_service = async ({
  page,
  limit,
  search,
}) => {
  try {
    const response =
      await axiosIns.get(`postings?page=${page}&limit=${limit}&search=${search}`)

    
    return response.data
  } catch (error) {
    
    return error.response.data
  }
}

export const add_ads_service = async ({
  title,
  description,
  image,
}) => {
  try {
    const response =
      await axiosIns.post("postings", {
        title,
        description,
        image,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const edit_ads_service = async ({
  id,
  title,
  description,
  image,
}) => {
  try {
    const response =
      await axiosIns.put(`postings/${id}`, {
        title,
        description,
        image,
      })

    return response.data
  } catch (error) {    
    return error.response.data
  }
}

export const remove_ads_service = async id => {
  try {
    const response =
      await axiosIns.delete(`postings/${id}`)

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
