import { red as R, green as G, blue as B } from "colors";
import axios from "axios";
import { appendFile } from "fs";



const genRanHex = (size: any) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
let count = 0;
const check = () => axios.get(`http://api.whoapi.com/?apikey=5e5345ee4cbc7db2f752e7598a933d02&r=whois&domain=${genRanHex(3)}.ir`)
  .then(function (response) {
    if (response.data.registered === false) {
      appendFile('./free_domain.txt',
        `${response.data.domain_name}\n`
        , () => { });
    }
    console.log(
      `${B('[')}${G(String(count))}${B(']')} ${response.data.domain_name}${(response.data.registered === false) ? G(' Free') : R(' Registered')}${(response.data.premium === true) ? R(' PREMIUM') : ""}`
    );
    count++;
    check();
  }).catch(function (error) {
    console.error(error);
  });

check()
