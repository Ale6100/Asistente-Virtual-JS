"use strict";

const datosTabla = [ // Datos para colocar en la tabla del html
    {
        palabraClave : "Palabras clave",
        ejemplos : "Ejemplos",
        descripcion : "Descripción",
        pedidoPreciso : "Pedido preciso*"
    },
    {
        palabraClave : 'cancelá',
        ejemplos : '"Ok, abrir Google. No, cancelá"',
        descripcion : "Cancela el pedido actual",
        pedidoPreciso : "No"
    },
    {
        palabraClave : '... en X minutos <span class="negrita">**</span>',
        ejemplos : '"Ok, abrir wikipedia en 3 minutos"',
        descripcion : "Ejecuta el pedido entre puntos suspensivos en X minutos",
        pedidoPreciso : "Si"
    },
    {
        palabraClave : 'buscar...en X<span class="negrita">**</span>',
        ejemplos : '"Ok, buscar definición de oso en Google"',
        descripcion : "Busca lo que está entre puntos suspensivos en el sitio X",
        pedidoPreciso : "Si"
    },
    {
        palabraClave : 'repetir...',
        ejemplos : '"Ok, repetir: Messi trae la copa"',
        descripcion : "Repite la frase en puntos suspensivos",
        pedidoPreciso : "Si"
    },
    {
        palabraClave : "estás ahí",
        ejemplos : '"Ok, ¿estás ahí?"',
        descripcion : "",
        pedidoPreciso : "No"
    },
    {
        palabraClave : "basta",
        ejemplos : '"Ok, basta"',
        descripcion : "Apaga el programa. Puede tardar varios segundos",
        pedidoPreciso : "No"
    },
    {
        palabraClave : "hora",
        ejemplos : '"Ok, qué hora es?"',
        descripcion : "",
        pedidoPreciso : "No"
    },
    {
        palabraClave : "fecha",
        ejemplos : '"Ok, qué fecha es hoy?"',
        descripcion : "",
        pedidoPreciso : "No"
    },
    {
        palabraClave : "gracias",
        ejemplos : '"Ok, gracias"',
        descripcion : "",
        pedidoPreciso : "No"
    },
    {
        palabraClave : 'abrí<span class="negrita">**</span>',
        ejemplos : '"Ok, abrí google"',
        descripcion : "Abre el sitio web solicitado",
        pedidoPreciso : "No"
    },
    {
        palabraClave : "cómo te llamás",
        ejemplos : '"Ok, ¿Cómo te llamás?"',
        descripcion : "",
        pedidoPreciso : "No"
    },
    {
        palabraClave : "iniciar/detener cronómetro",
        ejemplos : '"Ok, iniciar cronómetro"',
        descripcion : "",
        pedidoPreciso : "No"
    },
    {
        palabraClave : "eliminar registro",
        ejemplos : '"Ok, eliminar registro"',
        descripcion : 'Borra el registro de peticiones',
        pedidoPreciso : "No"
    }
]

const direcciones = { // El primer elemento es un array con palabras clave para identificar la página. El segundo son las páginas, y el tercero es una url que se completa con la frase que quieras buscar en los buscadores de las páginas
    googlemaps : [["Google Maps", "Maps"], "https://www.google.com.ar/maps", "https://www.google.com.ar/maps/search/"],
    google : [["Google", "el buscador"], "https://www.google.com.ar/", "https://www.google.com.ar/search?q="],
    youtube : [["Youtube"], "https://www.youtube.com/", "https://www.youtube.com/results?search_query="], 
    steam : [["Steam", "Stim"], "https://store.steampowered.com/", "https://store.steampowered.com/search/?term="],
    facebook : [["Facebook"], "https://www.facebook.com/", "https://www.facebook.com/search/top/?q="],
    twitch : [["Twitch"], "https://www.twitch.tv/", "https://www.twitch.tv/search?term="],
    twitter : [["Twitter"], "https://twitter.com/", "https://twitter.com/search?q="],
    mercadolibre : [["MercadoLibre", "Mercado Libre"], "https://www.mercadolibre.com.ar/", "https://listado.mercadolibre.com.ar/"],
    linkedin : [["LinKedIn"], "https://www.linkedin.com/", "https://www.linkedin.com/search/results/all/?keywords="],
    github : [["GitHub"], "https://github.com/", "https://github.com/search?q="],
    wikipedia : [["Wikipedia"], "https://es.wikipedia.org/", "https://es.wikipedia.org/wiki/"],
    tiktok : [["Tik Tok", "Tic Tac", "Tic Toc"], "https://www.tiktok.com/", "https://www.tiktok.com/search?q="],
    amazon : [["Amazon"], "https://www.amazon.com/", "https://www.amazon.com/s?k="],
    whatsapp : [["WhatsApp Web"], "https://web.whatsapp.com/"],
    netflix : [["Netflix"], "https://www.netflix.com/"],
    disney : [["Disney"], "https://www.disneyplus.com/"],
    prime : [["Prime Video"], "https://www.primevideo.com/"],
    starplus : [["Star Plus"], "https://www.starplus.com/"],
    geogebra : [["Geogebra"], "https://www.geogebra.org/calculator"],
    drive : [["Google Drive"], "https://drive.google.com/drive/u/0/my-drive"],
    mercadopago : [["MercadoPago", "Mercado Pago"], "https://www.mercadopago.com.ar/"],
    hbo : [["HBO Max", " Max"], "https://play.hbomax.com/"],
    traductor : [["Traductor", "Translate"], "https://translate.google.com.ar/"],
    nacion : [["Banco Nacion"], "https://hb.redlink.com.ar/bna/login.htm"],
    santander : [["Banco Santander"], "https://www2.personas.santander.com.ar/obp-webapp/angular/#!/login"],
    buscagatos : [["Buscaminas", "Buscagatos"], "https://buscagatos.netlify.app/"],
    codigofuente : [["codigo fuente"], "https://github.com/Ale6100/Asistente-Virtual-JS.git"]
}

const buscar = (rec) => { // Busca en el buscador del sitio web solicitado siempre y cuando lo tengamos previamente en el objeto "direcciones"
    let sitioEncontrado = false
    rec = eliminarDeRec(rec, "buscar")
    rec = eliminarDeRec(rec, " en", "ultimo")
    for (let direccion in direcciones) {
        if (algunValorIncluido(rec, direcciones[direccion][0])) {
            let palabraClave = direcciones[direccion][0].filter( elemento => rec.includes(elemento.toLowerCase()))[0] // Busca la o las palabras claves del array direcciones[direccion][0] que están incluidas en rec, para después borrarlas
            rec = eliminarDeRec(rec, palabraClave.toLowerCase(), "ultimo") 
            window.open(direcciones[direccion][2]+rec)
            sitioEncontrado = true
            break
        }
    }
    return sitioEncontrado
}

const horaActual = () => new Date().toLocaleTimeString()

const abrir = (rec) => { // Abre alguno de los sitios web guardados en el objeto "direcciones"
    let direccionEncontrada = false
    for (let direccion in direcciones) {
        if (algunValorIncluido(rec, direcciones[direccion][0])) { // 
            window.open(direcciones[direccion][1])
            direccionEncontrada = true
            break
        }
    }
    return direccionEncontrada
}

const eliminarDeRec = (rec, frase, lugar="primero") => { // Elimina "frase" de "rec" y además quita los espacios extra. Si lugar="primero", entonces se elmina la primera vez que encontramos esa palabra. Sino, se elimina la última vez
    // Ejemplo: Supongamos que rec="yo soy juan" y frase="soy"
    let indicePrimeraLetra = (lugar == "primero") ? rec.indexOf(frase) : rec.lastIndexOf(frase) // indicePrimeraLetra=3
    let fraseRecortada = rec.slice(0, indicePrimeraLetra) + rec.slice(indicePrimeraLetra + frase.length) // fraseRecortada="yo  juan"
    let fraseRecortadaArray = fraseRecortada.split(" ") // fraseRecortadaArray=["yo", "", "juan"] 
    let espacioFiltrado = fraseRecortadaArray.filter(palabra => palabra != "") // espacioFiltrado=["yo", "juan"]
    return espacioFiltrado.join(" ") // "yo juan"
}

const ejemplosPlacehoder = () => { // Devuelve un elemento al azar del array candidatos
    const candidatos = [
        "repetir: tiempo finalizado en 2 minutos",
        "buscar noticiero en youtube en un minuto",
        "buscar temperatura actual en google",
        "buscar rock nacional en YouTube",
        "repetir: Hola mundo",
        "me decís la hora?",
        "que día es hoy?",
        "abre Netflix",
        "ir a Twitter",
        "inicia el cronómetro"
    ]
    return candidatos[parseInt(Math.random()*candidatos.length)]
}

const cambiarEstado = (condicion, estado, terminar, registro, nombre) => { // Cambia algunas cosas dependiendo de si está prendido o apagado el programa
    estado.innerText = condicion
    if (condicion == "ON") {
        estado.style.color = "rgb(0, 127, 0)"
        terminar = false
        registro.setAttribute("placeholder", `Ejemplo: Di "${nombre}, ${ejemplosPlacehoder()}"`)
    } else {
        estado.style.color = "rgb(255, 0, 0)"
        terminar = true
        registro.setAttribute("placeholder", `Aquí se anotarán tus pedidos`)
    }
    return terminar // Retorno el valor de "terminar" ya que es el único que no se guarda por sí solo
}

const palClave = (rec, palabraClave, lugar="primero") => { // Devuelve true si la primera palabra de rec es igual a "palabraClave" (si lugar no es "primero", entonces hace lo mismo pero con la última palabra)
    rec = rec.split(" ")
    if (lugar == "primero") {
        return rec[0] == palabraClave
    } else {
        return rec[rec.length-1] == palabraClave
    }
   
    // return (lugar == "primero") ? (rec.split(" ")[0] == palabraClave) : (rec.split(" ")[rec.length-1] == palabraClave)
}

const algunValorIncluido = (rec, array) => { // Devuelve true si algún elemento del array está incluido en rec
    return array.some(elemento => rec.includes(elemento.toLowerCase()))
}

const ejecutarCronometro = (rec, inicioCronometro, print_and_talk) => {
    if (rec.includes("inicia") || rec.includes("comenza") || rec.includes("comienza")) {
        if (inicioCronometro == null) {
            print_and_talk("Cronómetro iniciado")
            inicioCronometro = new Date() // Momento en el tiempo en el que inició el cronómetro
        } else {
            print_and_talk("Ya hay un cronómetro iniciado, no puedes comenzar otro")
        }
    
    } else if (rec.includes("detene") || rec.includes("para") || rec.includes("corta") || rec.includes("termina") || rec.includes("finaliza")) {
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
    return inicioCronometro // Retorno este valor porque necesito sacarlo
}

const programarPedido = (rec, pedidos) => { // Programa un pedido para dentro de X minutos
    rec = rec.replace("un millon", 1000000).replace("un", "1").replace("dos", "2").replace("cuatro", "4") // Reemplaza texto por número. Parece que hasta el millón reconoce solo esos cuatro con letras
    rec = rec.split(" ")
    rec.pop() // Primero quito la última palabra clave (minuto o minutos)
    let tiempo = rec.pop() // Después quito y guardo el tiempo pedido
    rec.pop() // Después quito la palabra antes del número (ej: "Buscar pepe en google en 5 minutos" ahora se convirtió en "Buscar pepe en google")
    rec = rec.join(" ")
    console.log(`Pedido programado: "${rec}"`)
    console.log(`Tiempo de espera: ${tiempo} minutos`)
    setTimeout(() => { // Hago que el pedido se ejecute en el tiempo solicitado
        pedidos(rec)
    }, tiempo*60000)
}

export { datosTabla, buscar, horaActual, abrir , eliminarDeRec, cambiarEstado, palClave, ejecutarCronometro, ejemplosPlacehoder, programarPedido }
