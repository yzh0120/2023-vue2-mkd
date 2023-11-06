/*
 * @Author: wjs
 * @Date: 2022-04-20 17:08:01
 * @Description: AES加解密
 * @FilePath: \ele-customer\src\utils\aes.js
 * 
 */
import CryptoJS from 'crypto-js'
const signkey = process.env.VUE_APP_AESKEY
export default {
  /**
   *
   * @description: 加密
   * @param {*} word
   * @param {*} keyStr
   * @return {*}
   */
  encrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : signkey;
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },

  /**
   * 
   * @description: 解密
   * @param {*} word
   * @param {*} keyStr
   * @return {*}
   */
  decrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : signkey;
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },

}
