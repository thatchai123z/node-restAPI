const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()

app.use(bodyparser.json())
app.use(cors())

const port = 8000

let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tutorials',
        port: 3306
    })
}

app.get("/users", async (req, res) => {
    try {
        const results = await conn.query("SELECT * FROM users")
        res.json(results[0])
    } catch (error) {
        console.log("error message", error.message);
        res.status(500).json({
            message: 'something went wrong',
        })
    }
})

app.get("/users/:id", async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query("SELECT * FROM users WHERE id = ?", id)

        if (results[0].length == 0) {
            throw { statusCode: 404, message: "user not found" }

        }
        res.json(results[0][0])

    } catch (error) {
        console.log("error message", error.message);
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'something went wrong',
        })
    }
})

app.post("/users", async (req, res) => {
    try {
        let user = req.body
        const results = await conn.query("INSERT INTO users SET ?", user)
        res.json({
            message: "create user complete!",
            data: results[0]
        })
    } catch (error) {
        console.log("error message", error.message);
        res.status(500).json({
            message: 'something went wrong',
        })
    }
})

app.put("/users/:id", async (req, res) => {
    try {
        let id = req.params.id
        let updateUser = req.body
        const results = await conn.query("UPDATE users SET ? WHERE id=?", [updateUser, id])
        res.json({
            message: "update user complete!",
            data: results[0]
        })
    } catch (error) {
        console.log("error message", error.message);
        res.status(500).json({
            message: 'something went wrong',
        })
    }
})

app.delete("/users/:id", async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query("DELETE FROM users WHERE id=?", id)
        res.json({
            message: "delete user complete!",
            data: results[0]
        })
    } catch (error) {
        console.log("error message", error.message);
        res.status(500).json({
            message: 'something went wrong',
        })
    }
})



app.listen(port, async (req, res) => {
    await initMySQL()
    console.log("http server run at " + port);
})