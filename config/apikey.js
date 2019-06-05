require('dotenv').config()

const awsS3 = {
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    region: "ap-south-1"
}

const googleApi = process.env.MY_GOOGLE_API

module.exports = {
    awsS3, googleApi
}