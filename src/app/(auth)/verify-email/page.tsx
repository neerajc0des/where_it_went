"use client"
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

const VerifyEmailPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    React.useEffect(()=>{
        const verifyEmailHandler = async ()=>{
            try {
                const verificationToken = searchParams.get("token");

                if (!verificationToken) {
                    router.push("/register");
                    return;
                }

                const res = await api.get(`${ENDPOINTS.auth.verifyEmail}`,
                    {
                        params: {
                            token: verificationToken
                        }
                    }
                );

                if (!res.data.success) {
                    throw new Error(res.data.data.message || "Failed to fetch user");
                }

                toast(res.data.data.message || "Email verified successfully, you can now login");
                router.replace("/overview");
            } catch (error:any) {
                toast.error(error?.response?.data?.error || "Email verification failed, please try again");
                router.replace("/login");
            }
        }

        verifyEmailHandler();
    },[])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-lg font-medium">
          Verifying email...
        </div>
        <div className="text-sm text-muted-foreground">
          Please wait
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage