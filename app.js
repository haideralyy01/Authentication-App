const express = require('express');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "Your secret key";

const app = express();
app.use(express.json());

const users = [];

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    users.push ({
        username: username,
        password: password
    });

    res.json ({
        message: "You have signed up"
    });
    console.log(users);
});

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for (let i = 0; i< users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        }
    }

    if (!foundUser) {
        return res.status(401).json ({
            message: "Invalid credentials"
        });
    } else {
        const token = jwt.sign({
            username
        }, JWT_SECRET);

        res.json ({
            token: token,
            message: "You have signed in"
        })
    }
    console.log(users);
});

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    if (decodedData.username) {
        req.username = decodedData.username;
        next();
    } else {
        res.status(401).json ({
            message: "Unauthorized"
        });
    }
}

app.get("/me", auth,  (req, res) => {
    let foundUser = null;

    for (let i=0; i<users.length; i++) {
        if (users[i].username === req.username) {
            foundUser = users[i];
        }
    }

    if (!foundUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    });
});

app.listen(3000);