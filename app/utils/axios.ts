import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return String(error);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const checkConnection = async () => {
  try {
    const response = await api.get("/health"); 
    
    console.log("🟢 [FE CONNECTED] Koneksi ke Backend Berhasil!");
    console.log("   Endpoint:", API_BASE_URL + "/health");
    console.log("   Status BE:", response.data.status, response.data.message);

  } catch (error) {
    
    const errorMessage = getErrorMessage(error);
    
    console.error("🔴 [FE DISCONNECTED] Gagal terhubung ke Backend.");
    console.error("   Pastikan Backend berjalan di:", API_BASE_URL);
    console.error("   Detail Error:", errorMessage);

    if (axios.isAxiosError(error) && error.response) {
      console.error("   Status HTTP:", error.response.status);
    }
  }
};

export default api;