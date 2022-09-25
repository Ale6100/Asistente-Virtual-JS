const btnStartRecord = document.getElementById("btnStartRecord");
const btnStopRecord = document.getElementById("btnStopRecord");
const historial = document.getElementById("historial");

let recognition
try {
    recognition = new webkitSpeechRecognition(); // Sirve para el reconocimiento del texto
} catch (e) {
    document.body.innerHTML = `<p>Lo sentimos, su navegador no es compatible con el asistente. Puedes conocer los navegadores compatibles <a href="https://developer.mozilla.org/es/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#compatibilidad_de_navegadores_2" target="_blank">aqui</a></p>`
    console.error(e)
}
recognition.lang = "es-ES";
recognition.continuous = true; // Si graba continuamente o no
recognition.interimResults = false; // Nos devuelve información cuando nos quedamos callados

let abortado = false
recognition.onend = () => { // Este evento se lanza cuando se deja de escuchar el micrófono
    if (abortado == true) {
        console.log("El micrófono dejó de escuchar")
    } else { // Si nosotros no le dijimos que se apague, vuelve a empezar
        recognition.start();
    }
}

recognition.onerror = (event) => { // Muestra esto en consola en caso de que haya habido un error
    console.log(event.error)
    if (event.error == "aborted") { // Si le dijimos que se apague, esto se cambia a true y no vuelve a empezar
        abortado = true
    }
}

btnStartRecord.addEventListener("click", () => { // Inicia el reconocimiento de voz
    recognition.start();
    abortado = false
})

btnStopRecord.addEventListener("click", () => { // Detiene el reconocimiento de voz
    print_and_talk("Cerrando")
    recognition.abort();
})

recognition.onnomatch = () => {
    console.log('No se reconoció ninguna palabra')
}

const horaActual = () => {
    return new Date().toLocaleTimeString()
}

const limpiarTexto = (rec) => {
    rec = rec.slice(rec.indexOf(nombre)) // Reefino el texto. Me quedo únicamente con el texto que inicia con el nombre del asistente
    historial.value += `\n${horaActual()} - ${k}) Dijiste: ${rec}`
    rec = rec.replace(nombre + ', ', '').replace(nombre + ' ', '') // Quito el nombre del pedido
    if (rec[rec.length-1] == "." || rec[rec.length-1] == "?") { // Elimina los símbolos al final del texto
        rec = rec.slice(0, rec.length-1)
    }
    rec = rec.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').toLowerCase()  // Quita las tildes y coloca todo en minúsculas
    return rec
}

const print_and_talk = (text) => {
    const speech = new SpeechSynthesisUtterance()
    speech.text = text; // Para que tome el texto pasado por parámetro
    speech.volume = 1; // Volumen entre 0 y 1
    speech.rate = 1; // Velocidad del habla
    speech.pitch = 1;  // Tono de voz
    window.speechSynthesis.speak(speech) // Le decimos que hable
    console.log(text)
    historial.value += `\n${horaActual()} - ${nombre} dijo: ${text}` 
}

const abrir = (rec) => { // Abre alguno de los sitios web guardados en el objeto "direcciones"
    let direccionEncontrada = false
    for (let direccion in direcciones) {
        if (rec.includes(direccion)) {
            print_and_talk(`Abriendo ${direccion}`)
            window.open(direcciones[direccion])
            direccionEncontrada = true
            break
        }
    }
    if (direccionEncontrada == false) {
        print_and_talk("Dirección no encontrada")
    }
}

///////////////////////////////////

const nombre = "Alexa" // Nombre del asistente
let k = 1
const direcciones = {
    whatsapp : "https://web.whatsapp.com",
    steam : "https://store.steampowered.com",
    facebook : "https://www.facebook.com",
    youtube : "https://www.youtube.com",
    twitch : "https://www.twitch.tv",
    google : "https://www.google.com.ar",
}

recognition.onresult = (event) => { // Ejecuta esta función cuando hayamos recibido algo a traves del micrófono
    const results = event.results; // Acá se recibe la información
    let rec = results[results.length-1][0].transcript; // Este es el el texto que recibe el micrófono
    console.log("----------\nTexto original: " + rec)
    //texto.value += rec;
    if (!rec.includes(nombre)) {
        console.log("No se encontró el nombre")
    } else {
        rec = limpiarTexto(rec)
        console.log("Texto a procesar: " + rec)
        k++
        pedidos(rec) // Ahora que tenemos el texto que nos interesa, analizamos los pedidos
    }
}

const pedidos = (rec) => { 
    try {        
        if (false) {

        } else if (pedidoGenerico(rec)) { // Si hacemos un "pedido genérico" cortamos con este if ya que va a buscar el pedido en esta nueva función
            undefined
        }
    } catch (e) {
        print_and_talk("Error desconocido")
        console.error(e)
    }
}

const pedidoGenerico = (rec) => {
    let res = true
    if (rec.includes("estas") && rec.includes("ahi")) {
        print_and_talk("Estoy aquí")

    } else if (rec.includes("basta") || rec.includes("apaga")) {
        print_and_talk("Asistente apagado")
        recognition.abort()
    
    } else if (rec.includes("hora")) {
        print_and_talk(`Son las ${horaActual()}`)
    
    } else if (rec.includes("fecha")) {
        print_and_talk(`Hoy es ${new Date().toLocaleDateString()}`)
    
    } else if (rec.includes("gracias")) {
        print_and_talk("De nada")

    } else if (rec.includes("abr")) {
        abrir(rec)

    } else {
        rec = false
    }
    return res
}
