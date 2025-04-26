import API from "@/api/api-instance";

export const imageUpload = async (formData: any): Promise<any> => {
  const response = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.url;
};

export const videoUpload = async (formData: FormData): Promise<string> => {
  const response = await API.post("/upload-video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.url;
};