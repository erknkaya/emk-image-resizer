const sendResponse = (body, contentType, statusCode, errorMessage) => {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": contentType,
            "Cache-control": "public, max-age=300",
            "X-Error": errorMessage || null
        },
        body: body,
        isBase64Encoded: true
    };
};

const sendRedirect = (url) => {
    return {
        statusCode: "301",
        headers: { location: url },
        body: "",
    }
}

exports.successResponse = (body, contentType) => sendResponse(body, contentType, 200);
exports.redirectResponse = (url) => sendRedirect(url);

const onePixelGif = Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
    0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x04, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b
]).toString('base64');

exports.errorResponse = (body, statusCode, err) => {
    console.log(`ERROR ${statusCode} ${body}`, err);
    return sendResponse(JSON.stringify({"error": body}), 'application/json', statusCode, err)
    //return sendResponse(onePixelGif, 'image/gif', statusCode, body);
};