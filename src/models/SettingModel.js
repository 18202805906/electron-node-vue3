import BaseModel from './BaseModel';
class SettingModel extends BaseModel {
  constructor() {
    super();
  }
  getAll() {
    return this.db.read().get('setting').value();
  }
  getOne(key) {
    let setting = this.getAll();
    if (key in setting) {
      return setting[key];
    }
  }
  update(key, value) {
    let setting = this.getAll();
    if (key in setting) {
      setting[key] = value;
      this.db.read().set('setting', setting).write();
      return { msg: '操作成功', code: 0 };
    }
    return { msg: '无效的配置', code: 1 };
  }
  updateAll(setting) {
    this.db.read().set('setting', setting).write();
    return { msg: '操作成功', code: 0 };
  }
}
export default new SettingModel();
