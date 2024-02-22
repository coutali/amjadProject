import axiosIns from "@/plugins/axios"

export const get_aboutUs_service = async () => {
  try {
    const response =
        await axiosIns.get(`contact_us`)
  
      
    return response.data
  } catch (error) {
    console.log("error", error)
      
    return error.response.data
  }
}

export const edit_aboutUs_service = async ({
  address,
  phone,
  email,
  facebook,
  instagram,
  whatsapp,
  location,
  telegram,
  description,
}) => {
  try {
    const response =
        await axiosIns.put(`contact_us`, {
          address,
          phone,
          email,
          facebook,
          instagram,
          whatsapp,
          location,
          telegram,
          description,
        })
  
    return response.data
  } catch (error) {
    console.log("error", error)
      
    return error.response.data
  }
}
