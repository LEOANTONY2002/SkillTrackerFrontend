import { uploadFile } from "react-s3";
import AWS from 'aws-sdk'
import axios from "axios";
window.Buffer = window.Buffer || require("buffer").Buffer

// const S3_BUCKET ='changecx-skill-app';
// const REGION ='us-east-1';
// const ACCESS_KEY ='AKIAVDKJGNE3TNSYGUOP';
// const SECRET_ACCESS_KEY ='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';
// const URL_EXPIRATION_TIME = 60;

// AWS.config.update({
//     accessKeyId: ACCESS_KEY,
//     secretAccessKey: SECRET_ACCESS_KEY,
// })

// const myBucket = new AWS.S3({
//     params: { Bucket: S3_BUCKET},
//     region: REGION,
// })

// const config = {
//     bucketName: S3_BUCKET,
//     dirName: 'certificate',
//     region: REGION,
//     accessKeyId: ACCESS_KEY,
//     secretAccessKey: SECRET_ACCESS_KEY,
// }

// export const uploadToS3 = async (file) => {
//     try {
//         let data = await uploadFile(file, config)
//         console.log("AFT S3", data);
//         return data?.location
//     } catch (error) {
//         console.log(error);
//     }
// }

// const getSignedUrl = (fileName, fileType) => {
//     myBucket.getSignedUrl('putObject', {
//         Key: fileName,
//         ContentType: fileType,
//         Expires: URL_EXPIRATION_TIME
//     } , (err , url) => {
//         return url // API Response Here
//     });
// }


export const uploadToS3 = async (file) => {

    let {data} = await axios.post("http://localhost:5000", {
        fileName: file.name,
        fileType: file.type,
        file
    }) 

    console.log("SIGNED URL...", data);

    // let res = await axios.put(data, file)
    // console.log("RESP...", res?.data);
    
}