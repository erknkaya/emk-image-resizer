const s3 = require('./s3')
const widget = require('./widget')
const { errorResponse, successResponse, redirectResponse } = require('./response')
const sharp = require('sharp')

exports.handleImage = async (objectKey, originalImage, destinationBucket, urlParams) => new Promise( (resolve, reject) => {
    
        const imagePath = widget.getImagePath(objectKey, urlParams)
        const destinationBucketUrl = process.env.DESTINATION_BUCKET_URL;
        const redirectUrl = `${destinationBucketUrl}/${imagePath.modified}`;
    
        this.existImage(destinationBucket, imagePath.modified).then(res => {
            if(true === res) {
                return resolve(redirectResponse(redirectUrl));
            }else{
                const img = sharp(originalImage.Body);
        
                if(urlParams.width > 0 && urlParams.height > 0) {
                    img.resize({width: urlParams.width, height: urlParams.height});
                }else if(urlParams.width > 0 && urlParams.height === 0) {
                    img.resize({width: urlParams.width});
                }else if(urlParams.width === 0 && urlParams.height > 0) {
                    img.resize({height: urlParams.height});
                }
        
                switch(originalImage.ContentType) {
                    case 'image/png':
                        img.png({quality: urlParams.quality * 100});
                        break;
                    case 'image/jpeg':
                        img.jpeg({quality: urlParams.quality * 100})
                        break;
                }
        
                img.toBuffer(async (err, data, info) => {
                    await s3.saveFileToBucket(destinationBucket, imagePath.modified, data, originalImage.ContentType)
                    return resolve(redirectResponse(redirectUrl))
                    
                });
            }
        })
});

exports.existImage = async (bucket, objectKey) => {

    return s3.headObject(bucket, objectKey).then(data => {
        return true;
    }).catch(err => {
        return false;
    })

};