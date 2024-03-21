import axiosIns from "@/plugins/axios";
import {
  sha512
} from "js-sha512";

export const login_service = async ({
  email,
  password,
}) => {
  try {

    const response = await axiosIns.post("auth/login", {
      email,
      password: sha512(password),
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
