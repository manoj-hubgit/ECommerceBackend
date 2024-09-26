import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Services/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'ecommerce/products', //folder where the image need to be stored cloudinary
        allowed_formats:['jpg','jpeg','png'],
    },
});

const upload = multer({storage});

export default upload;

