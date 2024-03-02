import axiosIns from "@/plugins/axios"


export const get_all_categorys_service = async () => {
  try {
    const response =
      await axiosIns.get(`products_category/all`)

    
    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
export const get_products_service = async ({
  page,
  limit,
  search,
}) => {
  try {
    const response =
      await axiosIns.get(`products?page=${page}&limit=${limit}&search=${search}`)
    
    return response.data
  } catch (error) {    
    return error.response.data
  }
}

export const add_products_service = async ({
  title,
  description,
  image,
  price,
  category,
}) => {
  try {
    const response =
      await axiosIns.post("products", {
        title,
        description,
        image,
        price,
        category,
      })

    return response.data
  } catch (error) {
    console.log("error", error)
    
    return error.response.data
  }
}
export const edit_products_service = async ({
  id,
  title,
  description,
  image,
  price,
  category,
}) => {
  try {
    const response =
      await axiosIns.put(`products/${id}`, {
        title,
        description,
        image,
        price,
        category,
      })

    return response.data
  } catch (error) {    
    return error.response.data
  }
}

export const remove_products_service = async id => {
  try {
    const response =
      await axiosIns.delete(`products/${id}`)

    return response.data
  } catch (error) {
    
    return error.response.data
  }
}
