"use strict";

import { datosTabla, buscar, horaActual, abrir , eliminarDeRec, cambiarEstado, palClave, ejecutarCronometro, ejemplosPlacehoder, programarPedido } from "./utils.js";

const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const btnDelete = document.getElementById("btnDelete");
const registro = document.getElementById("registro");

const estado = document.getElementById("estado").children[0]

const tablaPalabrasClave = document.getElementById("tablaPalabrasClave")
datosTabla.forEach( (dato, i) => {
    (i == 0)
    ?   tablaPalabrasClave.innerHTML +=
        `
        <div>
            <p class="negrita">${dato.palabraClave}</p>
            <p class="negrita">${dato.ejemplos}</p>
            <p class="negrita">${dato.descripcion}</p>
            <p class="negrita">${dato.pedidoPreciso}</p>
        </div>
        `
    :   tablaPalabrasClave.innerHTML +=
        `
        <div>
            <p>${dato.palabraClave}</p>
            <p>${dato.ejemplos}</p>
            <p>${dato.descripcion}</p>
            <p>${dato.pedidoPreciso}</p>
        </div>
        `
})

////////// Configuraciones iniciales

let recognition
try {
    recognition = new webkitSpeechRecognition(); // Sirve para el reconocimiento del texto
} catch (e) {
    document.body.innerHTML = `<h1>Lo sentimos, su navegador no soporta al asistente. Puedes chequear la compatibilidad <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#browser_compatibility" target="_blank">aqui</a></h1>`
    console.error(e)
}

recognition.continuous = false; // Si graba continuamente o no. No lo activamos ya que vamos a reiniciar el reconocedor una y otra vez con otro método en el evento onend
recognition.interimResults = false; // Controla si los resultados provisionales deben devolverse o no. Ponemos false porque nos interesa la grabación completa de cada frase
recognition.lang = "es-ES";
recognition.maxAlternatives = 1; // Cantidad máximas de frases alternativas devueltas por cada reconocimiento de voz

// recognition.onnomatch = () => {
//     console.log('No se reconoció ninguna palabra')
// }

recognition.onerror = (e) => { // Muestra esto en consola en caso de que se produzca un error en el reconocedor
    if (e.error == "no-speech") {
        console.log("No se detectó ningún sonido")
    } else {
        console.log(e.error)
    }
}

let terminar
recognition.onend = () => { // Este evento se ejecuta cuando se deja de escuchar el micrófono
    if (terminar == true) {
        console.log("El micrófono dejó de escuchar")
    } else { // Si nosotros no pedimos que se apague, vuelve a empezar
        console.log("Escuchando...")
        recognition.start();
    }
}

btnStart.addEventListener("click", () => { // Inicia el reconocimiento de voz
    try {
        recognition.start();
        terminar = cambiarEstado("ON", estado, terminar, registro, nombre)
    } catch (e) {
        console.error(e)
        console.warn("Es posible que el error de arriba sea porque quisiste iniciar el asistente cuando ya estaba iniciado")
    }
})

btnStop.addEventListener("click", () => { // Detiene el reconocimiento de voz
    registro.value += "\n\n"
    print_and_talk("Asistente apagado")
    recognition.stop()
    terminar = cambiarEstado("OFF", estado, terminar, registro, nombre)
})

btnDelete.addEventListener("click", () => {
    if (registro.value != "") {
        registro.value = ""
        k = 1
        registro.setAttribute("placeholder", `Ejemplo: Di "${nombre}, ${ejemplosPlacehoder()}"`)
    }

})

const limpiarTexto = (rec) => {
    rec = rec.slice(rec.toLowerCase().indexOf(nombre.toLowerCase())) // Reefino el texto. Me quedo únicamente con la parte del texto que inicia con el nombre del asistente
    if (k==1) {
        registro.value += `----- ${horaActual()} -----\n${k}) Dijiste: ${rec}\n`
    } else {
        registro.value += `\n\n----- ${horaActual()} -----\n${k}) Dijiste: ${rec}\n`
    }
    rec = rec.toLowerCase().replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u').replaceAll(",", "").replaceAll("?", "").replaceAll("¿", "") // Coloco el texto en minúsculas, quito las tildes, las comas y los signos de pregunta 
    rec = eliminarDeRec(rec, nombre.toLowerCase()).trim() // Quito el nombre del asistente del pedido, los espacios iniciales, y finales si los hubiera
    if (rec[rec.length-1] == ".") { // Elimina el punto final
        rec = rec.slice(0, rec.length-1)
    }
    return rec
}

const print_and_talk = (text) => { // El asistente lee lo que hay en el string "text" y lo coloca en el registro
    const speech = new SpeechSynthesisUtterance()
    speech.text = text; // Para que tome el texto pasado por parámetro
    speech.volume = 1; // Volumen entre 0 y 1
    speech.rate = 1; // Velocidad del habla
    speech.pitch = 1;  // Tono de voz
    window.speechSynthesis.speak(speech) // Le decimos que hable
    registro.value += `${nombre} dijo: ${text}`
    registro.scrollTop = registro.scrollHeight
}

////////// Configuración de pedidos

const nombre = "Ok" // Nombre del asistente (sin tildes)
let k = 1
let inicioCronometro = null

recognition.onresult = (e) => { // Ejecuta esta función cuando hayamos recibido algo a traves del micrófono
    const results = e.results; // Acá se recibe la información
    let rec = results[results.length-1][0].transcript; // Este es el el texto que recibe el micrófono
    console.log("----------\nTexto interpretado: " + rec)
    if (!rec.toLowerCase().includes(nombre.toLowerCase())) {
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
        if (rec.includes("cancela")) {
            print_and_talk("Ok, cancelo el pedido")

        } else if (pedidoPreciso(rec)) { // Considero dos tipos de pedidos distintos. Si hacemos un "pedido preciso", esta función ejecuta el pedido solicitado y devuelve true
            null

        } else if (pedidoGenerico(rec)) {
            null

        } else if (rec != "") { // Devuelve esto si no se ejecutó ningún pedido y si rec no es un string vacío
            print_and_talk("No te entendí")
        }
    } catch (e) { // Si hay un error imprevisto lo muestra
        print_and_talk("Error desconocido")
        console.error(e)
    }
}

// Denomino "pedido preciso" a todos aquellos pedidos que necesitan ser solicitados con las palabras exactas. Estas palabras clave no tienen variaciones para no interferir con los pedidos genéricos
const pedidoPreciso = (rec) => {
    let res = true
    if (palClave(rec, "minutos", "ultimo") || palClave(rec, "minuto", "ultimo")) {
        print_and_talk("Pedido programado")
        programarPedido(rec, pedidos)

    } else if (palClave(rec, "buscar") && rec.includes("en")) {
        buscar(rec) ? print_and_talk("Hecho") : print_and_talk("Dirección no encontrada")

    } else if (palClave(rec, "repetir") || palClave(rec, "repeti") || palClave(rec, "decir") || palClave(rec, "deci")) { // Elimina la primera palabra de rec y repite la frase
        rec = rec.split(" ")
        rec.splice(0, 1)
        print_and_talk(`${rec.join(" ")}`)

    } else if (false) { // Próximamente

    } else {
        res = false
    }
    return res
}

const pedidoGenerico = (rec) => { // La función va a devolver true si el if se corta antes de llegar al else. Esto quiere decir que se ejecutó un "pedido generico"
    let res = true
    if ((rec.includes("estas") || rec.includes("seguis") || rec.includes("continuas")) && (rec.includes("ahi") || rec.includes("aca") || rec.includes("presente"))) { // Abarca casos comoo: estas ahi / seguis ahi / estas por ahi / seguis por ahi
        print_and_talk("Estoy aquí")

    } else if ((rec.includes("basta") || rec.includes("apaga") || rec.includes("chau")) && !rec.includes("bastante")) {
        print_and_talk("Asistente apagado")
        recognition.stop()
        terminar = cambiarEstado("OFF", estado, terminar, registro, nombre)
    
    } else if (rec.includes("hora") && !rec.includes("ahora")) {
        print_and_talk(`Son las ${horaActual()}`)
    
    } else if ((rec.includes("fecha") || rec.includes("dia")) && !rec.includes("edia")) {
        print_and_talk(`Hoy es ${new Date().toLocaleDateString()}`)
    
    } else if (rec.includes("gracias")) {
        print_and_talk("De nada")

    } else if (rec.includes("abr") || rec.includes("anda a") || rec.includes("ir a")) {
        abrir(rec) ? print_and_talk("Hecho") : print_and_talk("Dirección no encontrada")

    } else if (rec.includes("como te llamas") || rec.includes("cual es tu nombre")) {
        print_and_talk(`Me llamo ${nombre}`)

    } else if (rec.includes("cronometro")) {
        inicioCronometro = ejecutarCronometro(rec, inicioCronometro, print_and_talk)

    } else if ((rec.includes("borrar") || rec.includes("elimina")) && (rec.includes("historial") || rec.includes("registro"))) { // Elimina el registro de peticiones
        if (registro.value != "") {
            print_and_talk("Hecho")
            registro.value = ""
            k = 1
            registro.setAttribute("placeholder", `Ejemplo: Di "${nombre}, ${ejemplosPlacehoder()}"`)
        } else {
            print_and_talk("El registro ya estaba vacío")
        }

    } else if (false) { // Próximamente

    } else {
        res = false
    }
    return res
}
