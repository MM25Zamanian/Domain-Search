import { red as R, green as G, blue as B } from "colors";
import axios from "axios";
import { appendFile, readFileSync } from "fs";

const genWordlist = function (n: number, letters: string) {
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

let exists_list: Array<string> = [];
readFileSync('domains.txt', 'utf-8').split(/\r?\n/).forEach(function (line) {
  exists_list.push(line.replace('\n', ''))
})

const list = genWordlist(3, "abcdefghijklmnopqrstuvwxyz123456789");
let count = 0;
const check = (domain_name: string, list_count: number) => {
  if (exists_list.includes(`${domain_name}.ir`)) {
    console.log(
      `${B('[')}${G(String(count))}${B(']')} ${domain_name}${G(' Checked')}`
    );
    count++;
    if (list_count < list.length) {
      check(list[list_count + 1], list_count + 1);
    }
  } else {
    axios.get(`http://api.whoapi.com/?apikey=5e5345ee4cbc7db2f752e7598a933d02&r=whois&domain=${domain_name}.ir`)
      .then(function (response) {
        if (response.data.registered === false) {
          appendFile('./free_domains.txt',
            `${response.data.domain_name}\n`
            , () => { });
        }
        appendFile('./domains.txt',
          `${response.data.domain_name}\n`
          , () => { });
        console.log(
          `${B('[')}${G(String(count))}${B(']')} ${response.data.domain_name}${(response.data.registered === false) ? G(' Free') : R(' Registered')}${(response.data.premium === true) ? R(' PREMIUM') : ""}`
        );
        count++;
        if (list_count < list.length) {
          check(list[list_count + 1], list_count + 1);
        }
      }).catch(function (error) {
        appendFile('.log', error, () => { });
        console.error(error.response.status);
      });

  }
}

check(list[0], 0)
