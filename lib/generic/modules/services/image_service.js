const fs = require("fs");
const path = require("path");

async function convertBase64ImageAndSaveToStorage(base64Image) {
  // Create a buffer from the base64 data
  const imageBuffer = Buffer.from(base64Image, "base64");

  // Save the image to the uploads folder with a timestamped filename
  const filename = `image_${Date.now()}.png`; // You can use a different file extension if needed
  const filePath = path.join("uploads", filename);
  const imagePath = `/uploads/${filename}`;

  await fs.writeFile(filePath, imageBuffer, (err) => {
    if (err) {
      console.error("Error saving image:", err);
    }
  });
  return imagePath;
}

async function deleteImage(imagePath) {
  try {
    const fileExists = await fs
      .access(imagePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      console.log("Image not found");
    } else {
      // Delete the image file
      await fs.unlink(imagePath);

      console.log("Image deleted");
    }
  } catch (error) {
    console.error("Couldn't delete image");
  }
}

module.exports = { convertBase64ImageAndSaveToStorage, deleteImage };
