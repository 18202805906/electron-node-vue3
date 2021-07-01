import { nativeTheme } from 'electron';
import settingModel from '../../models/SettingModel';
const setting = settingModel.getAll();
const themeSeting = setting.theme || 'system';
nativeTheme.themeSource = themeSeting;
export default {
  isDark: nativeTheme.shouldUseDarkColors,
  themeSource: nativeTheme.themeSource,
  setting
};
