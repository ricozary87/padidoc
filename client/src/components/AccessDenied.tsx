import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";

export default function AccessDenied() {
  const [, setLocation] = useLocation();

  return (
    <Card className="mt-8 max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-semibold mb-2">403 - Akses Ditolak</h2>
        <p className="text-gray-600 mb-4">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Button 
          onClick={() => setLocation("/dashboard")}
          className="w-full"
        >
          Kembali ke Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}