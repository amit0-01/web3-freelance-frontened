import axiosInstance from "@/lib/axiosInstance"

export const getUsers = async () =>{
    try {
        return axiosInstance.get('/chat/getUsers')
    } catch (error) {
        console.log('error', error)
    }
}