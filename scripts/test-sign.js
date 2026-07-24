const cloudinary = require('cloudinary').v2;

console.log(cloudinary.utils.sign_request({ timestamp: 1718000000, folder: "test" }, { api_secret: "test_secret" }));
