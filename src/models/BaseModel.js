import fs from 'fs-extra';
import path from 'path';
import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import config from '@/config';
import defaultData from '../config/defaultData';
import { encrypt, decrypt } from '@/utils';
const SALT = 'okmnjiuhbvgytfcxdreszaq741085209630';
export default class BaseModel {
  constructor() {
    this.db = this.initStore();
  }
  initStore() {
    // 存储位置
    const STORE_PATH = config.userPath;
    if (process.type !== 'renderer') {
      if (!fs.pathExistsSync(STORE_PATH)) {
        // 如果不存在路径
        fs.mkdirpSync(STORE_PATH); // 就创建
      }
    }
    const adapter = new FileSync(path.join(STORE_PATH, 'system.config.json'), {
      defaultValue: defaultData,
      serialize: (data) => {
        return JSON.stringify(data, (key, val) => {
          if (key === 'password' && val) {
            return encrypt(val, SALT) || '';
          }
          return val;
        });
      },
      deserialize: (data) => {
        return JSON.parse(data, (key, val) => {
          if (key === 'password' && val) {
            return decrypt(val, SALT) || '';
          }
          return val;
        });
      }
    });
    const db = Datastore(adapter);
    // 初始化数据
    // for (const key in defaultData) {
    //   if (Object.prototype.hasOwnProperty.call(defaultData, key)) {
    //     if (!db.has(key).value() || !Object.keys(db.get(key).value()).length) {
    //       db.set(key, (<any>defaultData)[key]).write();
    //     }
    //   }
    // }
    return db;
  }
  getAppSetting() {
    return this.db.getState();
  }
}
