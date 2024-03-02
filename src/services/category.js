import axiosIns from "@/plugins/axios"

export const add_products_category_service = async ({
  name,
  _id,
}) => {
  try {
    const response =
      await axiosIns.post("products_category", {
        name,
        _id,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const get_products_category_service = async () => {
  try {
    const response =
      await axiosIns.get(`products_category`)

    
    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const edit_products_category_service = async ({
  id,
  name,
}) => {
  try {
    const response =
      await axiosIns.put(`products_category/${id}`, {
        name,
      })

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}

export const remove_products_category_service = async id => {
  try {
    const response =
      await axiosIns.delete(`products_category/${id}`)

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
