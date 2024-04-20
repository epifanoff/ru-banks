const needle = require("needle");
const cheerio = require("cheerio");
const fs = require("fs");
const camelCase = require("lodash.camelcase");

const url = "https://raw.githubusercontent.com/melpnz/rblp/master/README.md";

needle.get(url, async function (err, res) {
  if (err) throw err;

  const banks = res.body
    .match(/\| .* \|/giu)
    .splice(2)
    .map((item) =>
      item
        .split("|")
        .map((item) => item.trim())
        .filter((item, index) => item && index !== 1),
    );

  if (!(banks && banks.length > 0)) {
    console.error("Не удалось получить список банков");
  }

  fs.writeFileSync(`./src/shared/index.js`, ``, "utf8");

  const bfr = [];

  for (const [name, alias, lastUpdate] of banks) {
    let color;
    const backgroundPicture = fs.readFileSync(
      `./src/assets/dark/svg/horizontal/${alias}.svg`,
    );

    if (backgroundPicture) {
      const $ = cheerio.load(backgroundPicture.toString());
      const tmp = $(".bg-logo").attr("fill");
      color = tmp.indexOf("#") === 0 ? tmp : undefined;
    }

    fs.writeFileSync(
      `./src/shared/${alias}.js`,
      `// Последнее обновление — ${lastUpdate}

const bankInfo = {
  name: "${name}",
  alias: "${alias}",
  color: ${color ? `"${color}"` : `undefined`}
};

export default bankInfo
`,
      "utf8",
    );

    const variable = camelCase(/[0-9]/.test(alias[0]) ? "b_" + alias : alias);

    fs.appendFileSync(
      `./src/shared/index.js`,
      `export ${variable} from './${alias}.js';\n`,
    );

    bfr.push([alias, variable]);

    console.log("Добавлен в проект " + name);
  }

  fs.appendFileSync(
    `./src/shared/index.js`,
    `
export default [
  ${bfr.map((item) => `['${item[0]}', ${item[1]}]`).join(",\n  ")}
]`,
  );
});
