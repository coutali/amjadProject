import axiosIns from "@/plugins/axios"


export const get_jobs_service = async ({
  page,
  limit,
  search,
}) => {
  try {
    const response =
      await axiosIns.get(`jobs?page=${page}&limit=${limit}&search=${search}`)

    
    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}

export const add_jobs_service = async ({
  title,
  description,
  image,
  salary,
}) => {
  try {
    const response =
      await axiosIns.post("jobs", {
        title,
        description,
        image,
        salary,
      })

    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}
export const edit_jobs_service = async ({
  id,
  title,
  description,
  image,
  salary,
}) => {
  try {
    const response =
      await axiosIns.put(`jobs/${id}`, {
        title,
        description,
        image,
        salary,
      })

    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}

export const remove_jobs_service = async id => {
  try {
    const response =
      await axiosIns.delete(`jobs/${id}`)

    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}
