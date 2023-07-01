const fs = require("fs")
const https = require("https")
const GitHub = require("github-api")

let login = "timmson" //user

const download = (url, filename) => {
    console.log(`${url} is downloading`);
    https.get(url, (res) => {
        const path = `${__dirname}/repos/${filename}`;
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on("finish", () => {
            filePath.close();
            console.log(`${filename} is downloaded`);
        })
    })
}

const user = new GitHub().getUser(login)
user.listRepos(function (err, repos) {
    console.log(`Repos: ${repos.length}`)
    repos.filter((it) => it.owner.login === login)
        .map((it) => ({url: `https://codeload.github.com/${it.owner.login}/${it.name}/zip/refs/heads/${it.default_branch}`, filename: `${it.name}.zip`}))
        .forEach((it) => download(it.url, it.filename))
})
