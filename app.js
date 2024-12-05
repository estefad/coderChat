//inicializar config del backend - comando: npm run dev para iniciar y guardar servidor
import express from "express"
import {Server} from "socket.io"
import fs from 'fs'

//import cartRoutes from './router/cart.router.js'

//inicializar y ejecutar express 
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/index', express.static("public")) //utilizar archivos html, css 


app.use((req, res, next)=>{
    console.log("ruta a nivel app ejecutandose")  
    next()//una vez que se ejecuta, sale de la func y continua con el resto de los endpoint
})


app.use((err,req, res, next)=>{
    console.log(err.stack)
    res.status(500).send("error")
    
 })


const PORT = 8080 //puerto dinamico


const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})

app.get("/", (req, res) => {
    res.render("index");
  });

let messages = []
//ENTREGAAAA: guardar los mensajes en file system y que prevalezcan al cerrar sesion
const menssagesSaved = './data/messages.json'

//cargar mensajes desde el json si existen
if (fs.existsSync(menssagesSaved)) { 
    const data = fs.readFileSync(menssagesSaved, 'utf-8') 
    messages = JSON.parse(data)
}

//guardar mensajes en el json
const saveMessages = () => { 
    fs.writeFileSync(menssagesSaved, JSON.stringify(messages))
}

const io= new Server(httpServer)

io.on("connection", (socket)=>{
    console.log("cliente conectado")


    socket.on("newUser", (data)=>{
        socket.broadcast.emit("newUser", data)
    })

    socket.on("message",(data)=>{
        messages.push(data)
        saveMessages()
        io.emit("messageLogs", messages)
    })

    //desconectar
    socket.on("disconnect", ()=>{
        console.log("cliente desconectado")
    })
    
})