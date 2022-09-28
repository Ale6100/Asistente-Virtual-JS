"use strict";

import { datosTabla, buscar, horaActual, abrir , eliminarDeRec, cambiarEstado } from "./utils.js";

const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const historial = document.getElementById("historial");
const btnDelete = document.getElementById("btnDelete")

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
recognition.lang = "es-ES";
recognition.continuous = false; // Si graba continuamente o no. No lo necesitamos ya que lo vamos a reiniciar con otro método
recognition.interimResults = false; // "Controla si los resultados provisionales deben devolverse o no"

let abortado
recognition.onend = () => { // Este evento se ejecuta cuando se deja de escuchar el micrófono
    if (abortado == true) {
        console.log("El micrófono dejó de escuchar")
    } else { // Si nosotros no pedimos que se apague, vuelve a empezar
        recognition.start();
        
    }
}

recognition.onerror = (e) => { // Muestra esto en consola en caso de que se produzca un error en el reconocedor
    if (e.error == "aborted") { // Si le dijimos que se apague, "abortado" cambia a true y no vuelve a empezar
        
    } else if (e.error == "no-speech") {
        console.log("No se detectó ningún sonido")
    } else {
        console.log(e.error)
    }
}

recognition.onnomatch = () => {
    console.log('No se reconoció ninguna palabra')
}

btnStart.addEventListener("click", () => { // Inicia el reconocimiento de voz
    try {
        recognition.start();
        abortado = cambiarEstado("ON", estado, abortado, historial, nombre)
    } catch (e) {
        console.error(e)
        console.warn("Es posible que el error de arriba sea porque quisiste iniciar el asistente cuando ya estaba iniciado. Si no es así, hacémelo saber")
    }
})

btnStop.addEventListener("click", () => { // Detiene el reconocimiento de voz
    historial.value += "\n\n"
    print_and_talk("Asistente apagado")
    setTimeout(() => recognition.abort(), 4000) // Por alguna razón que aún no comprendo, es necesario ponerle un pequeño delay al aborto (a pesar de que no lo respeta y lo ejecuta sin esperar el tiempo indicado) para que no se trabe el programa cuando se aprieta el botón. Aún estoy analizando cuál sería el delay adecuado
    abortado = cambiarEstado("OFF", estado, abortado, historial, nombre)
})

btnDelete.addEventListener("click", () => {
    historial.value = ""
    k = 1
})

const limpiarTexto = (rec) => {
    rec = rec.slice(rec.indexOf(nombre)) // Reefino el texto. Me quedo únicamente con la parte del texto que inicia con el nombre del asistente
    if (k==1) {
        historial.value += `${horaActual()} - ${k}) Dijiste: ${rec}\n`
    } else {
        historial.value += `\n\n${horaActual()} - ${k}) Dijiste: ${rec}\n`
    }
    rec = rec.toLowerCase().replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u').replaceAll(",", "").replaceAll("?", "").replaceAll("¿", "") // Coloco el texto en minúsculas, quito las tildes, las comas y los signos de pregunta 
    rec = eliminarDeRec(rec, nombre.toLowerCase()) // Quito el nombre del asistente del pedido
    if (rec[rec.length-1] == ".") { // Elimina el punto final
        rec = rec.slice(0, rec.length-1)
    }
    return rec
}

////////// Configuración de pedidos

const nombre = "Ok" // Nombre del asistente (sin tildes)
let k = 1
let inicioCronometro = null

recognition.onresult = (event) => { // Ejecuta esta función cuando hayamos recibido algo a traves del micrófono
    const results = event.results; // Acá se recibe la información
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

        } else if (rec == "") { // Devuelve esto si sólo decimos el nombre del asistente
            print_and_talk("¿Qué pasa?")

        } else {
            print_and_talk("No te entendí")
        }
    } catch (e) { // Si hay un error imprevisto lo muestra
        print_and_talk("Error desconocido")
        console.error(e)
    }
}

// Denomino "pedido preciso" a todos aquellos pedidos que necesitan ser solicitados con las palabras exactas
const pedidoPreciso = (rec) => {
    let res = true
    if (rec.includes("buscar")) {
        buscar(rec) ? print_and_talk("Hecho") : print_and_talk("Dirección no encontrada")

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

    } else if (rec.includes("basta") || rec.includes("apaga") || rec.includes("chau")) {
        print_and_talk("Asistente apagado")
        recognition.abort() // Acá no es necesario ponerle un delay como en el addEventListener del botón btnStop
        abortado = cambiarEstado("OFF", estado, abortado, historial, nombre)
    
    } else if (rec.includes("hora")) {
        print_and_talk(`Son las ${horaActual()}`)
    
    } else if (rec.includes("fecha") || rec.includes("dia")) {
        print_and_talk(`Hoy es ${new Date().toLocaleDateString()}`)
    
    } else if (rec.includes("gracias")) {
        print_and_talk("De nada")

    } else if (rec.includes("abr") || rec.includes("anda a") || rec.includes("ir a")) {
        abrir(rec) ? print_and_talk("Hecho") : print_and_talk("Dirección no encontrada")

    } else if (rec.includes("como te llamas") || rec.includes("cual es tu nombre")) {
        print_and_talk(`Me llamo ${nombre}`)

    } else if (rec.includes("cronometro")) {
        ejecutarCronometro(rec)

    } else if (false) { // Próximamente

    } else {
        res = false
    }
    return res
}

////////// Funciones que se utilizan arriba

const print_and_talk = (text) => {
    const speech = new SpeechSynthesisUtterance()
    speech.text = text; // Para que tome el texto pasado por parámetro
    speech.volume = 1; // Volumen entre 0 y 1
    speech.rate = 1; // Velocidad del habla
    speech.pitch = 1;  // Tono de voz
    window.speechSynthesis.speak(speech) // Le decimos que hable
    console.log(`${nombre} dijo: ${text}`)
    historial.value += `${horaActual()} - ${nombre} dijo: ${text}`
    historial.scrollTop = historial.scrollHeight
}

const ejecutarCronometro = (rec) => {
    if (rec.includes("inicia") || rec.includes("comenza") || rec.includes("comienza")) {
        if (inicioCronometro == null) {
            print_and_talk("Cronómetro iniciado")
            inicioCronometro = new Date() // Momento en el tiempo en el que inició el cronómetro
        } else {
            print_and_talk("Ya hay un cronómetro iniciado, no puedes comenzar otro")
        }
    
    } else if (rec.includes("detene") || rec.includes("para") || rec.includes("corta") || rec.includes("termina")) {
        if (inicioCronometro != null) {
            let milisegundos = new Date() - inicioCronometro
            let minutosRedondeados = Math.round((milisegundos/60000 + Number.EPSILON) * 100)/100
            print_and_talk(`El cronómetro contabilizó ${minutosRedondeados.toString().replaceAll(".", ",")} minutos`)
            inicioCronometro = null // Vuelve a colocar el tiempo inicial en su estado original
        } else {
            print_and_talk("No puedes detener un cronómetro que no ha sido iniciado")
        }
    } else if (rec == "cronometro") {
        print_and_talk("Para usar el cronómetro debes especificar si quieres iniciarlo o detenerlo")
    } else {
        print_and_talk("No te entendí")
    }
}
