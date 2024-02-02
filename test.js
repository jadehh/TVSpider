import {} from './wrapper/index.js';

// import { test } from './testVideo.js';
// import { test } from './testVideo_customer.js';
import {test} from "./js/testSpider.js";
import {Crypto} from "./lib/cat.js";


function test_des() {
    const md5 = CryptoJS
    var data = "IKo4oRvZjJoWq08t7ryz/C3RYjnMJFLf/pD/IDaAIiChTVZVXElnC5Q9YBS1Xjz1agiRqojKcZ52zxUKpfYypmm9LBqRvsAL98Rn46AjzWbfdbfs6tp2mn5g9pm1aC4IEQYRWV+gul4Ii6z7NbH5RdtL4cb+68wiVNbBjUslw2ncDdCX94mZXoY6kyksSuSSDAjuOrxKH2eHj7JPetwGc88HyuYfbbWbHXFiZTeB5qbnB7ruszGKbst+iuuu9TY3OH922eLeUXPqeCRURXJ7ukEech2r+VY3GbZQ+/ZzKVUDZgeO/AYjGPZThbPcs4rQ9RumSkPmyEVfPglbWmkjvE75x19/rsD9DDNAiXFi0eAt+rbVpkyhfXrxcLPboUz/d1Px501IanrL8//ELck8KrGaUHh4qJRyzDj7lOJ9l4gGO+jxlBiRbSTcSrFJKBnKOc/5iH8u5h/Dzy3LqoNqDZs3eljxA3Um2dt1HA9QMTM+5EKIQj01WKjeHWCpSADD237WbLPrstd5lq0biOYb7uFF7pp/mKN87aWEtaRD7g0x4cWY88bqUJ43a1JgWKPA6xKphd7F2ASLAqbDSlq8hABK25UeNtDL0OYI615PAJpbX6kU+Uv0EUv76I8rAHnsen7/uKF4u5JYKMi293+IzzR0jk/jm/uxR4v74jor2BTBxyHQXn9ukewD42ZjReFduNmL2usU4ALiljsUcmlwzQY47s+6lAWnYc5boyQ+0IvTbhMdWnTIGqqwc9LG4sGqkEa1K9jplFpPEZwIkBA1X0rz21yrg9p4En7+QAWhbYkpWbdh2+tFpv2ijgYiwF+nWf/2+qfRHaLq7AnwZNMX7Qfucq0muZa2hXjkSSE0xQVnc/Jk0kxtDRfqqPTqlqFYkbC+LMLdNL6O2bdZ/6TU6hN0RzGCrgpJc+2TFFDFwe0dvzjHyci4gdI+h/mgbTwQdLhhpzLcL2o5gpzDh7KNzaUA8C3ClsYnSxZlaDAtZSwE1fWzyN5plOvlpVPvwiDjbbjjWdB2ogizKM8QS/ucWV5h06iyRZArrDEqpFPou4ZQa6zJpxDfJsJq9AmkzSsr3IKCPO/Xmp1+7BSnKAbJQzYo4HpECPCZ/8g/L6nerIbbkFZX/dS6i+h4fO3Ykz61z2i1uVyscmrw681hhhS+5PjYGmtPbsNdoGTu46CMiOKCMaHFq2UvY21Z4TGSFbuE7mpHgtjiPtcvWo74eyky4THhV44bIyJmMG9DRhl8gs7WYpp9D7KHvZx/lAra2T0ZJZJXvAJycHjgHGYegm6JZq42biyzTMum44ZM1k7WCIfjUGT6swN3Gfk8m3p11lSvUrgdn2H0i+vd3uTASivDg/AaTquhnVUsZiZg9xSsY1mac1gIj1DUB51fSnDF40gfZIQp/sfhC1sgM/z5h9iQDbSstyWqNP+wqOe+5Ef04YexbSZVnUxih53PMLxt20tokNx3mUniscws19/rUSdqlEQdgM3R5/+SAYnAxZ0kip49JTCr1XcA470AWKGrwPrGltRCzPpAWIZjyo99F9GRHMy951yLHgLnynTbxrsVfOCUZdz9uy7MJi/VVK5zkq7CMMBbXk0gsPqXaYLCF33SEuJPYkhrkNi6gstNxVPmcZCUVIvTSLHZYk0B0cdMdbXAaghZXHXs/fSwHB+vQi/+zbSCoXdw5Ctn7EooEmDtKJ7/A9TPtU/EzcHBdeV6gHEk"
    var kbe822 = md5.enc.Utf8.parse("8434272815928831");
    var iv = md5.enc.Utf8.parse("1234567890983456");
    let x  = CryptoJS.DES.decrypt(md5.enc.Base64.parse("data"), kbe822, {
        mode: Crypto.mode.ECB,
        padding: Crypto.pad.Pkcs7,
    }).toString(Crypto.enc.Utf8);
    let a = 0

}

(async function () {
    test_des()
    await test();
    debugger;
})();


