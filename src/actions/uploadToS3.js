import { uploadFile } from "react-s3";

const S3_BUCKET ='changecx-skill-app';
const REGION ='US East (N. Virginia) us-east-1';
const ACCESS_KEY ='AKIAVDKJGNE3TNSYGUOP';
const SECRET_ACCESS_KEY ='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';

const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
}

export const uploadToS3 = async (file) => {
    try {
        let data = await uploadFile(file, config)
        return data
    } catch (error) {
        console.log(error);
    }
}