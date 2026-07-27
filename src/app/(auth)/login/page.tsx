"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
// import Image from 'next/image';
import useSignInHandler from "@/hooks/use-sign-handler";
import { extractErrorMessage } from "@/utils/error";
import Vector from "@/assets/images/Vector.png";
import CryptoJS from "crypto-js";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signInHandler } = useSignInHandler();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const encryptedPassword = CryptoJS.SHA256(data.password).toString()
      await signInHandler({ email: data.email, password: encryptedPassword});
      router.push("/dashboard");
    } catch (error) {
      const message = extractErrorMessage(error);
      form.setError("root", {
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left illustration */}
        <div
          className="hidden md:flex p-10 items-center justify-center bg-center"
          style={{ backgroundImage: `url(${Vector.src})` }}
        >
          <div className="w-full max-w-2xl">
            {/* <div className="w-full h-56 md:h-72 lg:h-500 rounded-xl overflow-hidden relative shadow-sm">
              <Image src={Vector} alt="Login illustration" fill className="object-cover" priority />
            </div> */}
          </div>
        </div>

        {/* Right form */}
        <div className="p-10 md:p-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            Case-smeq xin chào
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Đăng nhập để quản trị hệ thống
          </p>

          <CardContent className="p-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập hoặc email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tên đăng nhập hoặc email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Mật khẩu"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            aria-label="Toggle password visibility"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <div className="flex items-center gap-3">
                  <input id="remember" type="checkbox" className="h-4 w-4 text-green-700 border-gray-300 rounded" />
                  <label htmlFor="remember" className="text-sm text-gray-600">Lưu tài khoản</label>
                </div> */}

                {form.formState.errors.root && (
                  <div className="text-sm text-red-600">
                    {form.formState.errors.root.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#0C2447] hover:bg-[#09203A]"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-sm text-gray-500">
              Demo credentials: admin@example.com / password
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
