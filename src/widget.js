const url = require('url')
exports.hasDimension = () => {

};

exports.hasDimension.width = (dimension) => {
    if(process.env.ALLOWED_WIDTH_DIMENSIONS) {
        const widthDimensions = process.env.ALLOWED_WIDTH_DIMENSIONS.split(',')
        return widthDimensions.includes(dimension.toString())
    }

    return false
};

exports.hasDimension.height = (dimension) => {
    if(process.env.ALLOWED_HEIGHT_DIMENSIONS) {
        const heightDimensions = process.env.ALLOWED_HEIGHT_DIMENSIONS.split(",")
        return heightDimensions.includes(dimension.toString())
    }

    return false
};

exports.getUrlParams = (path) => {

    let width = path.match(/w(\d+)/);
    let height = path.match(/h(\d+)/);
    let quality = path.match(/q[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/);
    

    return {
        width: width !== null ? parseInt(width[1]) : 0,
        height: height !== null ? parseInt(height[1]) : 0,
        quality: quality !== null ? parseFloat(quality[1]) : 1.0
    }
};

exports.getObjectKey = (path) => {
    let path_ = decodeURI(url.parse(path).pathname.replace(/^\/+/g, ''));
    let objKey = path_.match(/\/(.*)$/);

    return objKey[1];
}

exports.parseUrl = (path) => {
    return path.split('/')
}

exports.getImageName = (objectKey, urlParams) => {
    const urls = this.parseUrl(objectKey);
    const originalImageName = urls[urls.length - 1];
    return {
        'original' : originalImageName,
        'modified' : `w${urlParams.width}h${urlParams.height}q${urlParams.quality}-${originalImageName}`
    }
}

exports.getImagePath = (objectKey, urlParams) => {
    const imageName = this.getImageName(objectKey, urlParams);
    return {
        'original' : objectKey,
        'modified' : objectKey.replace(imageName.original, imageName.modified)
    }
}