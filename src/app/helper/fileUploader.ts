import multer from "multer";
import path from "path";

import { v2 as cloudinary } from "cloudinary"
import config from "../../config";
cloudinary.config({

        cloud_name: config.coundinary_cloud_name,
        api_key: config.cloudinary_api_key,
        api_secret: config.cloudinary_api_secret
    })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "/uploads"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '_' + uniqueSuffix)
    }
})
const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: Express.Multer.File) => {
    
    try {
        const uploadResult = await cloudinary.uploader
            .upload(
                file.path, {
                public_id: file.filename
            }

            )
        return uploadResult;
    }

    catch (error) {
        console.log("Cloudinary upload error:", error);
        return undefined;
    }

}
const deleteFromCloudinary = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.log("Cloudinary delete error:", error);
        return undefined;
    }
};

export const fileUploader = {
    upload,
    uploadToCloudinary,
    deleteFromCloudinary
}