import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import axios from 'axios';
import dayjs from 'dayjs';

import cacheJson from './cache.json'; // 数据缓存
import { createFolder } from './util';
import log from './util/log';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建产出文件夹
let fliename = path.join(__dirname, './output');
createFolder(fliename);

// 保存图片到本地
const saveImg = async (url: string, fileName: string, item: any) => {
    try {
        let response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFile(fileName, response.data, (err) => {
            if (err) {
                throw err;
            } else {
                log.success(`保存${item.text}成功`);
            }
        });
    } catch (error) {
        log.error(error);
    }
};

// 格式化数据并创建分类目录
const formatJson = (data: any) => {
    const { packages } = data;
    const types = packages.map((item: any) => item.text);
    log.debug(`本次获取到分类: ${types}`);
    packages
        .filter((item: any) => item.text !== '颜文字')
        .forEach((item: any) => {
            let fliename = path.join(__dirname, `./output/${item.text}`);
            createFolder(fliename);
            if (item.emote?.length > 0) {
                item.emote.forEach((emoteItem: any) => {
                    let fliename = path.join(__dirname, `./output/${item.text}/${emoteItem.text}.png`);
                    saveImg(emoteItem.url, fliename, emoteItem);
                });
            }
        });
};

// 获取数据缓存
const updteCache = async () => {
    const cacheApi = 'http://api.bilibili.com/x/emote/user/panel/web?business=dynamic';
    const cacheFileName = './cache.json'; // 最新版本缓存
    const cacheFileNameDay = `./cache/${dayjs().format('YYYY-MM-DD')}.json`;
    try {
        let response = await axios.get(cacheApi);
        const { data, code } = response.data;
        if (code === 0) {
            const str = JSON.stringify(data);
            fs.writeFile(cacheFileName, str, (err) => {
                if (err) {
                    formatJson(cacheJson);
                    throw err;
                } else {
                    log.success(`数据缓存获取成功, 已保存至: ${cacheFileName}`);
                    formatJson(data);
                }
            });
            fs.writeFile(cacheFileNameDay, str, (err) => {
                if (err) {
                    formatJson(cacheJson);
                    throw err;
                } else {
                    log.success(`数据缓存获取成功, 已保存至: ${cacheFileNameDay}`);
                    formatJson(data);
                }
            });
        } else {
            log.error('接口返回错误');
            formatJson(cacheJson);
        }
    } catch (error) {
        log.error(error);
        formatJson(cacheJson);
    }
};
updteCache();
