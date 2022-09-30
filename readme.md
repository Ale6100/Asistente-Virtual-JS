# Asistente Virtual en JavaScript (versión 0.3.0)

¿Hasta qué tan lejos pueden llegar las funcionalidades de un código? Creo que este proyecto es ideal para responder la pregunta inicial ya que un asistente virtual es justamente eso: un asistente, por lo tanto debería ser capaz de hacer todo lo que le pidas.

Otro de mis objetivos en este proyecto es lograr que sea lo suficientemente útil para que desees usario a diaro, sabiendo que lo puedes dejar encendido en segundo plano para que esté listo en cualquier momento que lo necesites.

## Deploy 🌎

Utiliza la versión más reciénte subida a la web [aquí](https://asistentevirtual.netlify.app/).

## Contexto 📌

La primera versión de este asistente la hice con Python allá por el 2020. Ahora es el turno de crearlo utilizando las herramientas que me proporciona JavaScript y el desarrollo web en general.

Sin embargo hay que aclarar dos contras muy importantes:

1) Hasta donde tengo entendido JavaScript no puede controlar los dispositivos (teclado y mouse por ejemplo) ni acceder a tus archivos internos. Esto nos corta mucho el potencial que podría tener el asistente ya que está limitado al navegador.

2) La API que uso para que funcione el programa no es compatible en muchos navegadores todavía, puedes chequearlo [aquí](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#browser_compatibility).

## Comenzando 🚀

Descarga el archivo comprimido .zip desde el botón verde "code" o haz click [aquí](https://github.com/Ale6100/Asistente-Virtual-JS/archive/refs/heads/main.zip)

Mira **Despliegue** para saber cómo desplegar el proyecto en tu computadora y **Funcionalidades** para conocer la mayoría de las funciones actuales.

### Pre-requisitos 📋

Necesitas ejecutar el archivo desde un servidor. En caso de que tengas Visual Studio Code puedes utilizar la extensión Live Server.

### Instalación 🔧

Ninguna!

## Despliegue 📦

Ejecuta el código con Live Server y listo!

## Pedidos por voz 🤖

Actualmente tiene muy pocos ya que es un proyecto nuevo y estoy limitado a crear pedidos relacionados al navegador. Las funcionalidades actuales que hace el asistente simplemente pidiéndolas por micrófono son:

* Realiza búsquedas en los sitios web que quieras (google, youtube, twitter, etc.), siempre y cuando sean sitios que yo haya configurado previamente.

* Repite cualquier frase que le pidas (sin insultos)

* Te abre la página web que solicites (al igual que antes, solo funciona en algunas)

* Te dice la hora

* Te dice la fecha

* Inicia y detiene un cronómetro

* Se detiene a sí mismo

* Podés preguntarle si "sigue ahí", para corroborar que todavía nos está escuchando aunque haya pasado mucho tiempo

Tiene cuatro más pero son pequeñeces que solo sirven para aumentar la interactividad.

Estoy abierto a sugerencias!

## Construido con 🛠️

* HTML5
* CSS
* JavaScript
* [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Texto-a-voz y Reconocimiento de voz asíncrono

## Autores ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)
