import {} from "../lib/crypto-js.js"
function cryptJs(text, key, iv, type) {
    var key = CryptoJS.enc.Utf8.parse(key || 'PBfAUnTdMjNDe6pL');
    var iv = CryptoJS.enc.Utf8.parse(iv || 'sENS6bVbwSfvnXrj');
    if (type) {
        var content = CryptoJS.AES.encrypt(text, key, {
            iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
        })
    } else {
        var content = CryptoJS.AES.decrypt(text, key, {
            iv: iv, padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
    }
    return content
}

var rand = "5724753791262537";
var player = "0mZ/M6ucZgPUdligzimKUPE1JRTj8jaM03v8QRVVKAN8Lx18ez+MVGH/2Eh8eC6tvEiUXqn+zTln3kBMxEIlINoT9BSDbx52Jtu49alvYp7+Z/ONWeL5SIjgc5RtCBu4cT1c8blMGCf9BDTZ5ZMYZEHwKI+OwkSdRXhf0Yu0+u1nF+bctNNYeQnBrM1geIqNAhtCBlbm++YJbeRS0uPGPN28DjQcHyZ039f2SIJaqL6VsbSQEkPIyYWPCuV/zylqf2899KWloFp4NxAhf/QvHrqEzJpBd/YbIt0kcjmA5vQx3pqWE0Doo57nJhnE4TRjl5NP+7HQohDIvqqK8VrHkSiCcerWTlfcFZ7fX2Fytoj0wEcsC1wBKi2w+a9p5nvILw2KvrGi0j0gx4yjURD2Fw/pWXtkLs+N4UWiMXKLXU7JLHVkzaZHgzbj6cpX+t5JoUUqcw0TzhGo9wiLiQVKZxe1DT0HGsHOKxYTqB0QDfmSDp21u3lKTLJugA6tHn6gLVhd0Zz/TxWxmysAWLqodvfxRUNu9iTw3UaRVf9i1svkfISaaNmLdc/v2/+rYu6cegOusptnWurHyH/MPxMOk7LIlqEGr7AqLKIvqy2AqhwKFcqj/lgKjt0xKlE/TBQ0HRsd/E1/2ZnDWUudxmZY1HntIT28nSp6IaUDFJi1sOTd9JBR6Sp0VgLTmFI0rqY5lPX8jNveZ3t6lX13kQ5mGdMK4IiTWf3VyHmcAK/qqKwu3kzZANhhtZXRqCutp9el0ECMJAmNxYIOYWCatjTmDsnuT6219hmFFjo1zhZiqzE2QR9IW69xkxbSVXvItX8VFtTFJfXTIw2r65QdB3fKYucEsQa0liDEe6NZfV4IPmxYO3ta72Xu5V5Ys+5AtLKRZr50jQen457dwd7f7krykJ/KJFnzlkeFJ/RVVipinhLI8UB5CxFKESvWdtaHGKPI+aDKm4LX5c8KchJ07t1iUDyZnb9YHpPEMwNGr7DoeN6Nw3+jT/UZr46TivbgxXLzOWci0nBKS7v2ikkV2FjiGbd3DM9hnp5wjmJt/5mpx5+R9V752ufPh6xrQeEuzNu2vg7Oq4FlSIJz3dFlD86fXZy5YC0S+9jQ8C5zQdPuH1OWIbozEldl+qoce1t05tsFwGptp69pLu478j4N1pArhzSCN9hbZ8zrKsN66s7TA1/hM+Bp0B084poUs6u91Ukhk62wijWi+c6rumXWjy/qaAqi0M/ErX8isaai+Yv6ul9VCMbT45kjgEE6Gd9t0pjchTOunA1Hk54zeu8+fAHwpuRaYiyH8N+JDIAfQhV8ynvp1aIvGjNXxegKcAXNV4iY+rrzLvO0TMLq6eA9dZyGV5+BlzXm0VE5N9Zwm9esL2kB6IWiHraDGlRDjRsaPVaadIAEmm1bBVC5PSn2Xusr2I64b79Sxvni8C4rFzRP1mxG40mmhUOy7hEhFX0u7Cz41yDA3cFVb5ozWGI2pVS28nMol1CroVSBbzPQSrrTLpRg6WGXITkKJlNU2+64couNIonCeyFZedReV3M49KovO1npiycMBWyT3utZWwvNRcJ1Sy+WlzanUdVSlrap7dX1IzSsvKVKffAL/8rEkiIGB9+9IRDvp8RHBzOlAjruvZcWL+lIzg1QfSBtYHbI4j+xWdkpB1xyjnP/dQk1lvRYuF7w9VHbeYoFXDIDXeiRTnIbMY39dO07hR3Vg67CeNqH";

cryptJs(player, 'VFBTzdujpR9FWBhe', rand)
