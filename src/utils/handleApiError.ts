import axios from "axios"


export default function handleApiError (error: unknown){
    if(axios.isAxiosError(error) && error.response){
        const message = error.response.data.msg || 'An unexpected error occurred';
        return message;
    }

    return 'An unexpecter error occurred';
}
