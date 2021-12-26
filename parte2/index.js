const express = require('express')
const req = require('express/lib/request')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")
const crypto = require('crypto')

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<html>
                <head>
                    <title>Login</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
                </head>
                <body>
                    <div class="container col-12 col-md-4 py-3">
                        <form method="POST" action="/login">
                            <label for="nameField" class="form-label">Nombre de usuario: </label>
                            <input type="text" name="username" id="nameField" class="form-control">
                            <label for="passwordField" class="form-label"> Contraseña: </label>
                            <input type="password" name="password" id="passwordField" class="form-control"><br>
                            <input type="submit" class="btn btn-primary" value="Entrar" />
                        </form>
                    </div>
                </body>
            </html>`);
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const pw = { password: password }
    const hashedPw = crypto.createHash('sha256').update(pw.password).digest('hex')

    if (hashedPw == "c646069af102df864a9535831a87644fb6713065c90098e5db676f09995960bb") {
        const accessToken = jwt.sign({ username: username, password: hashedPw }, "c646069af102df864a9535831a87644fb6713065c90098e5db676f09995960bb");
        return res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
            .status(200)
            .send(`<html>
                    <head>
                        <title>Ingresar</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
                    </head>
                    <body>
                        <div class="container col-12 col-md-4 py-3">
                        <h1>Cookie generada</h1>
                            <p><b>Nombre:</b> ` + username + `</p>
                            <p><b>Password:</b> `+ hashedPw + `</p>
                            <a href="/interno" class="btn btn-primary">Ingresar</a>
                        </div>
                    </body>
                </html>`);
    } else {
        return res.send(`<html>
                            <head>
                                <title>No se creó la cookie</title>
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
                            </head>
                            <body>
                            <div class="container col-12 col-md-4 py-3">
                                <h1>No se generó la cookie</h1>
                                <p><b>Nombre:</b> ` + username + `</p>
                                <p><b>Password:</b> `+ hashedPw + `</p>
                                <a href="/" class="btn btn-primary">Regresar al formulario de acceso</a>
                                </div>
                            </body>
                        </html>`)
    }

})

app.get("/interno", (req, res) => {
    const cookie = req.cookies.access_token;
    const data = jwt.verify(cookie, "c646069af102df864a9535831a87644fb6713065c90098e5db676f09995960bb");
    req.userName = data.username;
    if (!cookie) {
        return res.redirect('/');
    } else {
        return res.send(`<html>
                <head>
                    <title>Interno</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
                </head>
                <body>
                    <div class="container col-12 col-md-4 py-3">
                        <h1>¡Hola, ` + req.userName + `!</h1>
                        <form method="GET" action="/logout">
                            <input type="submit" class="btn btn-primary" value="Salir" />
                        </form>
                    </div>
                </body>
            </html>`);
    };
});

app.get("/logout", (req, res) => {
    const cookie = req.cookies.access_token;
    return res
        .clearCookie("access_token")
        .status(200)
        .redirect('/');
});


app.listen(port, () => {
})
