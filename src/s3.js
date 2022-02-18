const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.getFileFromBucket = (bucket, key) => s3.getObject({
    Bucket: bucket,
    Key: key.toString()
}).promise();

exports.saveFileToBucket = async (bucket, key, body, contentType) => s3.putObject({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentDisposition: 'inline',
    ContentEncoding: 'base64',
    ContentType: contentType,
    ACL: 'public-read'
}).promise();

exports.headObject = async (bucket, key) => s3.headObject({
    Bucket: bucket,
    Key: key
}).promise();