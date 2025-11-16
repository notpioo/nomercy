export const CLOUDINARY_CLOUD_NAME = "dvybhadnh";
export const CLOUDINARY_UPLOAD_PRESET = "nomercy_uploads";

export const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
  // Validate file size (max 10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size too large. Maximum size is 10MB.");
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error response:", data);
      throw new Error(
        data.error?.message || 
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload image. Please try again.");
  }
};
