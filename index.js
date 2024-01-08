const fs = require("fs")
const https = require("https")
const axios = require("axios")

let login = "timmson" //user

const listRepos = async (user) => {
    const result = await axios.get(`https://api.github.com/users/${user}/repos?per_page=100`)
    return result.data
}

const download = (url, filename) => {
    console.log(`${url} => ${filename}`)
    https.get(url, (res) => {
        const path = `${__dirname}/repos/${filename}`
        const filePath = fs.createWriteStream(path)
        res.pipe(filePath)
        filePath.on("finish", () => {
            filePath.close()
            console.log(`${filename} is OK`)
        })
    })
}

listRepos(login).then((repos) => {
    const downloads = repos.filter((it) => it.owner.login === login && !it.archived)
        .map((it) => (
                {
                    url: `https://codeload.github.com/${it.owner.login}/${it.name}/zip/refs/heads/${it.default_branch}`,
                    filename: `${it.name}.zip`
                }
            )
        )
    downloads.forEach((it) => download(it.url, it.filename))
})
