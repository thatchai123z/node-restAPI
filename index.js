const express = require('express')
const bodyparser = require('body-parser')

const app = express()

app.use(bodyparser.json())

const port = 8000

// สำหรับเก็บ users
let users = [{
    firstname: "ชื่อจริง",
    lastname: "นามสกุล",
    age: 23,
    gender: "ชาย"
}]
let counter = 1

app.get("/users", (req, res) => {
    const filterUsers = users.map(user => {
        return {
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.firstname + " " + user.lastname
        }
    })

    res.json(filterUsers)
})

app.get("/users/:id", (req, res) => {
    let id = req.params.id
    //หา Index ที่ต้องการ
    let selectedIndex = users.findIndex(user => user.id == id)

    res.json(users[selectedIndex])
})

app.post("/users", (req, res) => {
    let user = req.body
    user.id = counter
    counter += 1
    users.push(req.body)
    res.json({
        message: "add ok",
        user: user
    })
})

app.put("/users/:id", (req, res) => {
    let id = req.params.id
    let updateUser = req.body

    //หา Index ที่ต้องการ
    let selectedIndex = users.findIndex(user => user.id == id)

    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
    users[selectedIndex].age = updateUser.age|| users[selectedIndex].age
    users[selectedIndex].gender = updateUser.gender|| users[selectedIndex].gender


    res.json({
        message: "update user complete!",
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})

app.delete("/users/:id", (req, res) => {
    let id = req.params.id
    //หา Index ที่ต้องการ
    let selectedIndex = users.findIndex(user => user.id == id)

    // ลบ user
    users.splice(selectedIndex, 1)

    res.json({
        message: "delete user complete!",
        indexDeleted: selectedIndex
    })
})



app.listen(port, (req, res) => {
    console.log("http server run at " + port);
})