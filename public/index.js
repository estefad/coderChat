const socket = io(); // Referencia a socket.io

let user;
let chatBox = document.getElementById("chatBox");

// Alerta para ingresar datos
document.addEventListener("DOMContentLoaded", () => {
    Swal.fire({
        title: "Tu Nombre",
        input: "text",
        text: "Ingrese usuario para identificarse",
        inputValidator: (value) => {
            return !value && "Por favor, debe ingresar el nombre de usuario";
        },
        allowOutsideClick: false
    }).then((result) => {
        user = result.value;

        // Enviamos usuario al servidor
        socket.emit("newUser", user);
    });
});

// Evento para los mensajes
if (chatBox) {
    chatBox.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && chatBox.value.trim().length > 0) {
            socket.emit("message", {
                user: user,
                message: chatBox.value
            });
            chatBox.value = "";
        }
    });
}

// Recibir mensajes del chat
socket.on("messageLogs", (data) => {
    let messageLogs = document.getElementById("messageLogs");
    if (messageLogs) {
        messageLogs.innerHTML = data.map(msg => `<p class = "name" >${msg.user} dice: ${msg.message}</p>`).join('');
    }
});

// Notificación de nuevo usuario
socket.on("newUser", (data) => {
    Swal.fire({
        text: `Se conectó ${data}`,
        toast: true,
        position: "top-right",
        timer: 2000
    });
});
