const data = require("./data")

const express = require ('express')
const app = express()
const port = 4131

app.set('views', 'templates')
app.set('view engine', 'pug')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static("resources/"))

app.get("/",async (req, res)=>{
    const posts = await data.getPosts()
    res.render("main", {posts:posts})
})

app.post("/", async (req, res) => {
    await data.addPosts(req.body.bev)
    const posts = await data.getPosts()
    res.render("main", {posts:posts})
})


app.listen(port , () => {
    console.log(`Example app listening on port ${port}`)
})