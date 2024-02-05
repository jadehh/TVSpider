import {} from "../lib/crypto-js.js"
function uic(url,uid) {
    let ut = CryptoJS.enc.Utf8.parse('2890' + uid + 'tB959C');
    let mm = CryptoJS.enc.Utf8.parse("2F131BE91247866E");
    let decrypted = CryptoJS.AES.decrypt(url, ut, {iv: mm, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypted);
}
const url = "RFRnqsoJ3aWFQ9+g+5HrFk6g6G2rTKuaaxf3T7te1gHqm9bIMSHNjJudSPzFv7fPm/vHz/m2J1EywaXLOkskVwyKiSEg5vFljZhrwIk5w2cZpA1d6c3y5+GndcIXMREkSBywlFAC61RjILDSRxvMkAt6e9cooNO+bcgifriepQ26d6ic0NvxOj/c+O3z+6ioPbDAjhZtk1T2nIQcO/A+MA=="
let u = uic(url,'wZskIf')
let x = 0