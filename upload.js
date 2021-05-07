const { v4: uuidv4 } = require('uuid');

function uploadImage(image, callback) {
    if (!image) return callback("")
    const type = image.mimetype.split("/")[0]
    if (type != "image") return callback("", "Invalid file type")

    const extension = image.name.split(".").pop();
    const imageName = new Date().getTime() + uuidv4() + "." + extension
    const path = `${__dirname}/uploads/${imageName}`
    image.mv(path, function (err) {
        if (err) return callback("")
        return callback(imageName)
    });
}

module.exports = { uploadImage }
