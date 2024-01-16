const express = require('express');
const bodyParser = require('body-parser');
const qrcodeTerminal = require('qrcode-terminal');
const {Client,LocalAuth} = require('whatsapp-web.js');

const app = express();

let inicializado = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/post', (req, res) => {
    const datos = req.body;
    const numero = datos.numero;
    const mensaje = datos.mensaje;
    enviarMensaje(numero, mensaje);
    res.send("Mensaje enviado");
});

app.get('/get', (req, res) => {
    res.send("inicializado: " + inicializado);
})


const client = new Client({
    authStrategy: new LocalAuth()
});
 

client.on('qr', qr => {
    qrcodeTerminal.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    inicializado = true;
})

client. on('message', msg => {
    if (msg.body == '!ping') {
    msg. reply('pong');
    }
});

function enviarMensaje(numero, mensaje) {
    numero += '@c.us';
    client.sendMessage(numero, mensaje);
}

client.initialize();

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});
