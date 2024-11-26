const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json({ limit: "10mb" })); // Increase the limit as necessary
app.use(express.static("public"));

// Ensure the images directory exists
const imageDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Endpoint to upload image
app.post("/upload", (req, res) => {
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    const imageName = `image_${Date.now()}.png`;
    const imagePath = path.join(imageDir, imageName);

    fs.writeFile(imagePath, base64Data, "base64", (err) => {
        if (err) {
            console.error("Error saving image:", err);
            return res.status(500).json({ error: "Failed to save image" });
        }
        res.json({ message: "Image uploaded successfully", path: imagePath });
    });
});

// Endpoint to list images
app.get("/images", (req, res) => {
    fs.readdir(imageDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read images" });
        }
        const images = files.filter((file) =>
            /\.(jpg|jpeg|png|gif|png)$/.test(file),
        );
        res.json(images);
    });
});

// Endpoint to delete image
app.delete("/delete/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(imageDir, imageName);
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error("Error deleting image:", err);
            return res.status(500).json({ error: "Failed to delete image" });
        }
        res.json({ message: "Image deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
