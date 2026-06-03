"use client"
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

const page = () => {
    const router = useRouter();
    const {setAuth} = useAuthStore();
    const searchParams = useSearchParams();

    

    React.useEffect(() => {
        const oAuthLoginHandler = async ()=>{
            try {
                const accessToken = searchParams.get("accessToken");
                const refreshToken = searchParams.get("refreshToken");

                if (!accessToken || !refreshToken) {
                    router.push("/login");
                    return;
                }

                const res = await api.get(`${ENDPOINTS.auth.me}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    }
                );

                if (!res.data.success) {
                    throw new Error("Failed to fetch user");
                }

                setAuth(
                    res.data.data, 
                    accessToken, 
                    refreshToken
                );
                router.replace("/overview");
                } catch (error:any) {
                    console.log(error);
                    toast.error(error.response?.data?.message || "Google login failed, please try again");
                    router.replace("/login");
                }
        }
        oAuthLoginHandler();
    }, []);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-lg font-medium">
          redirecting to dashboard...
        </div>
        <div className="text-sm text-muted-foreground">
          Please wait
        </div>
      </div>
    </div>
  )
}

export default page