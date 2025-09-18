import fs from 'fs';

import log from './log';

// 创建文件夹
export const createFolder = async (fliename: string) => {
    return fs.mkdir(fliename, { recursive: true }, (err) => {
        if (err) {
            throw err;
        } else {
            log.success(`新建目录: ${fliename} 成功!`);
        }
    });
};
