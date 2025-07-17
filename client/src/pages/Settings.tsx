import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, Building, Upload } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    companyNpwp: "",
    invoiceFooter: "",
    bankName: "",
    bankAccount: "",
    bankAccountName: "",
    companyLogo: "",
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || "",
        companyAddress: settings.companyAddress || "",
        companyPhone: settings.companyPhone || "",
        companyEmail: settings.companyEmail || "",
        companyNpwp: settings.companyNpwp || "",
        invoiceFooter: settings.invoiceFooter || "",
        bankName: settings.bankName || "",
        bankAccount: settings.bankAccount || "",
        bankAccountName: settings.bankAccountName || "",
        companyLogo: settings.companyLogo || "",
      });
    }
  }, [settings]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("/api/settings", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil disimpan",
      });
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("/api/settings", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil diperbarui",
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui pengaturan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission - FormData:', formData);
    console.log('Phone number in formData:', formData.companyPhone);
    if (settings) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Input change - Field: ${name}, Value: ${value}`);
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      console.log(`FormData after change:`, newData);
      return newData;
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, companyLogo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-inter font-bold text-gray-900">Pengaturan</h2>
              <p className="text-sm text-gray-500">Atur informasi perusahaan untuk nota dan laporan</p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Pengaturan</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Informasi Perusahaan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Informasi Perusahaan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nama Perusahaan *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="PT. Penggilingan Padi Sejahtera"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyNpwp">NPWP</Label>
                    <Input
                      id="companyNpwp"
                      name="companyNpwp"
                      value={formData.companyNpwp}
                      onChange={handleInputChange}
                      placeholder="12.345.678.9-123.456"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
                  <Textarea
                    id="companyAddress"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    placeholder="Jl. Padi Sejahtera No. 123, Desa Makmur, Kec. Sejahtera, Kab. Sukses"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Nomor Telepon</Label>
                    <Input
                      id="companyPhone"
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      placeholder="08123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      name="companyEmail"
                      type="email"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      placeholder="info@penggilinganpadi.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo Perusahaan</Label>
                  <div className="flex items-center space-x-4">
                    {formData.companyLogo && (
                      <img
                        src={formData.companyLogo}
                        alt="Company Logo"
                        className="h-16 w-16 object-contain border rounded"
                      />
                    )}
                    <label
                      htmlFor="logo"
                      className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Logo</span>
                    </label>
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Bank */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Bank</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Nama Bank</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Bank BCA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Nomor Rekening</Label>
                    <Input
                      id="bankAccount"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountName">Atas Nama</Label>
                    <Input
                      id="bankAccountName"
                      name="bankAccountName"
                      value={formData.bankAccountName}
                      onChange={handleInputChange}
                      placeholder="PT. Penggilingan Padi Sejahtera"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Nota */}
            <Card>
              <CardHeader>
                <CardTitle>Footer Nota</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="invoiceFooter">Catatan Footer Nota</Label>
                  <Textarea
                    id="invoiceFooter"
                    name="invoiceFooter"
                    value={formData.invoiceFooter}
                    onChange={handleInputChange}
                    placeholder="Terima kasih atas kepercayaan Anda. Barang yang sudah dibeli tidak dapat dikembalikan."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
    </div>
  );
}