import axiosClient from "@/config/axios"
import handleApiError from "@/utils/handleApiError";


const TokenVerifier = async (token: string) => {
  let isValid = false;
  let msg: string | null = null

  try {
    const url = `/confirm/${token}`
    const { data } = await axiosClient.get(url)
    msg = data.msg
    isValid = true;

  } catch (error: unknown) {
    msg = handleApiError(error)
  }
  return { isValid, msg }

}

export default TokenVerifier