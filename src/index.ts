import { red as R, green as G, blue as B } from "colors";
import axios from "axios";
import { appendFile } from "fs";

export const genWordlist = function (n: number, letters: string) {
  let results: Array<string> = [];

  const helper = function (cache: string) {
    for (var i = 0; i < letters.length; i++) {
      cache += letters[i];
      if (cache.length === n) {
        results.push(cache);
      } else {
        helper(cache);
      }
      cache = cache.slice(0, -1);
    }
  }
  helper("");
  return results;
};

const list = genWordlist(3, "abcdefghijklmnopqrstuvwxyz123456789");
let count = 0;
const check = (domain_name: string, list_count: number) => axios.get(`http://api.whoapi.com/?apikey=5e5345ee4cbc7db2f752e7598a933d02&r=whois&domain=${domain_name}.ir`)
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
    check(list[list_count + 1], list_count + 1);
  }).catch(function (error) {
    console.error(error);
  });

check(list[0], 0)
