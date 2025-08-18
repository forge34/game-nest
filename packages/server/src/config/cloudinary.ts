import c from "cloudinary";
const cloudinary = c.v2;

cloudinary.config({
  secure: true,
});

export const uploadImage = async (imagePath: string) => {
  const options = {
    foldeer: "avatars",
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result;
  } catch (error) {
    console.error(error);
  }
};
