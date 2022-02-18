const {errorResponse, successResponse} = require('./response')
const {hasDimension, getUrlParams, getObjectKey} = require('./widget')
const s3 = require('./s3')
const img = require('./image')

exports.handler = async (event) => new Promise((resolve, reject) => {
    
    try {
        const sourceBucket = process.env.SOURCE_BUCKET;
        const destinationBucket = process.env.DESTINATION_BUCKET;
        const destinationBucketUrl = process.env.DESTINATION_BUCKET_URL;

        if(!sourceBucket) {
            return resolve(errorResponse('Set environment variable SOURCE_BUCKET',400));
        }
        
        if(!destinationBucket) {
            return resolve(errorResponse("Set environment variable DESTINATION_BUCKET",400));
        }

        if(!destinationBucketUrl) {
            return resolve(errorResponse("Set environment variable DESTINATION_BUCKET_URL",400));
        }

        // check allowed dimensions
        const urlParams = getUrlParams(event.path);
        console.log("URL PARAMS:", urlParams);
        if(!hasDimension.width(urlParams.width) && urlParams.width > 0) {
            return resolve(errorResponse("Invalid parameters", 400));
        }

        if(!hasDimension.height(urlParams.height) && urlParams.height > 0) {
            return resolve(errorResponse("Invalid parameters", 400));
        }

        const objectKey = getObjectKey(event.path);
        return s3.getFileFromBucket(sourceBucket, objectKey).then(data => {
            
            // img size check
            if(data.ContentLength > 5767168) {
                resolve(errorResponse("The maximum size of the image should be 5.7 MB"));
            }

            resolve(img.handleImage(objectKey, data, destinationBucket, urlParams))
                
        }).catch(err => {
            return resolve(errorResponse("Not found",404))
        });

    } catch (err) {
         return resolve(errorResponse("Not found",404))
    }

});

