const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// FIX: Update the fileFilter to accept both images and videos
const fileFilter = (req, file, cb) => {
  // Check if the file is an image or a video
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file
    cb(new Error('Invalid file type! Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

module.exports = upload;