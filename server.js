var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file.mimetype);
    if (file.mimetype === "image/jpeg" && "image/jpg" && "image/png") {
      cb(null, "./uploads/images");
    } else if (file.mimetype === "video/mp4") {
      cb(null, "./uploads/videos");
    } else if (file.mimetype === "application/pdf") {
      cb(null, "./uploads/pdf");
    }
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let ext = file.originalname.lastIndexOf(".");
    ext = file.originalname.substr(ext + 1);
    callback(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

exports.upload = multer({ storage: storage });
