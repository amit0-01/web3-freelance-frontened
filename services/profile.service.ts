import axiosInstance from "@/lib/axiosInstance"

export const connectToRazorPay = () =>{
    return axiosInstance.post('payment/razorpay/connect')
}

export const checkRazorPayStatus = () =>{
    return axiosInstance.get('/payment/razorpay/status')
}

export const getUserProfile = () =>{
   return axiosInstance.get('/user/profile')
}

export const updateProfile = (formData:any) =>{
    return axiosInstance.post('user/update-profile', formData)
}