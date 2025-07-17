import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Lock, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

const editProfileSchema = z.object({
  username: z.string().min(1, "Username harus diisi").optional(),
  email: z.string().email("Email tidak valid").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter").optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Jika ada newPassword, maka currentPassword harus diisi
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  // Jika ada newPassword dan confirmPassword, keduanya harus sama
  if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Password lama harus diisi saat mengubah password",
  path: ["currentPassword"]
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const { user, updateUserContext } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: EditProfileFormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("padidoc_token");
      const response = await fetch("/api/auth/edit-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Update user context with new data
        updateUserContext(result.user);
        
        toast({
          title: "Berhasil",
          description: result.message,
        });
        
        // Reset password fields
        reset({
          username: result.user.username,
          email: result.user.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordFields(false);
      } else {
        toast({
          title: "Gagal",
          description: result.message || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui profil",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
          <p className="text-gray-600">Perbarui informasi profil dan keamanan akun Anda</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Profil
            </CardTitle>
            <CardDescription>
              Perbarui informasi dasar profil Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Username"
                      {...register("username")}
                      className={errors.username ? "border-red-500" : ""}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {user?.role && (
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="p-2 bg-gray-100 rounded-md">
                      <span className="text-sm font-medium">
                        {user.role === "admin" ? "Administrator" : "Operator"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Role tidak dapat diubah. Hubungi administrator untuk perubahan role.
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Password Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Keamanan
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ubah password untuk meningkatkan keamanan akun
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                  >
                    {showPasswordFields ? "Batal" : "Ubah Password"}
                  </Button>
                </div>

                {showPasswordFields && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Password Lama</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Masukkan password lama"
                        {...register("currentPassword")}
                        className={errors.currentPassword ? "border-red-500" : ""}
                      />
                      {errors.currentPassword && (
                        <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Password Baru</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Masukkan password baru"
                          {...register("newPassword")}
                          className={errors.newPassword ? "border-red-500" : ""}
                        />
                        {errors.newPassword && (
                          <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Ulangi password baru"
                          {...register("confirmPassword")}
                          className={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <Alert>
                        <AlertDescription>
                          Password tidak cocok. Pastikan password baru dan konfirmasi password sama.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}