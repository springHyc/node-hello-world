var ImgInfo = require('./models/imgInfo');
function getByUrl(url) {
    return new Promise((resolve, reject) => {
        ImgInfo.find({ url }, (err, data) => {
            if (err) {
                reject({
                    message: err,
                    code: 500
                });
            } else {
                let imgInfo = {};
                if (data && data.length > 0) {
                    imgInfo = {
                        createdTime: data[0].createdTime,
                        desc: data[0].desc,
                        id: data[0].id,
                        title: data[0].title,
                        url: data[0].url,
                        viewPointId: data[0].viewPointId
                    };
                }
                resolve({
                    message: '获取图片信息成功！',
                    code: 200,
                    imgInfo
                });
            }
        });
    });
}

exports.getByUrl = getByUrl;
