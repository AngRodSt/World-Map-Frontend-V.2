import axiosClient from "@/config/axios"
import handleApiError from "@/utils/handleApiError";


const TokenVerifierPass = async (token: string, password: string) => {
  let isValid = false;
  let msg: string | null = null

  try {
    const url = `/resetPassword/${token}`
    const { data } = await axiosClient.post(url, { password })
    msg = data.msg
    isValid = true;

  } catch (error: unknown) {
    msg = handleApiError(error)

  }
  return { isValid, msg }

}

export default TokenVerifierPass