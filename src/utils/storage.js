const Storage = localStorage; // 配置使用的存储器
export function setStorage(key, value) {
  if (typeof value === 'object') {
    Storage.setItem(key, JSON.stringify(value));
  } else {
    Storage.setItem(key, value);
  }
}
export function getStorage(key) {
  let value = Storage.getItem(key) || '';
  return value.match(/(^\[[\s\S]*\]$|^\{[\s\S]*\}$)/) ? JSON.parse(value) : value;
}
export function removeStorage(...keys) {
  return keys.map((item) => Storage.removeItem(item));
}
export function clearStorage() {
  return Storage.clear();
}
export function keyStorage(index) {
  return Storage.key(index);
}
export default {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  keyStorage
};
