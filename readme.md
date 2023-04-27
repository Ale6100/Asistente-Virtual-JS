# Asistente Virtual en JavaScript

> **Importante**: Este proyecto ya no recibe actualizaciones ya que decidí reemplazarlo por uno mejor hecho con Python, aprovechando la versatilidad y potencial que dicho lenguaje posee. Haz click [aquí](https://github.com/Ale6100/Asistente-Virtual-Python.git) para ver la nueva versión.

Mi objetivo con este proyecto es lograr que el asistente sea lo suficientemente útil como para que desees utilizarlo a diaro, sabiendo que lo puedes dejar encendido en segundo plano para que esté listo en cualquier momento que lo necesites. 

Utiliza la versión más reciente subida a la web [aquí](https://asistentevirtual.netlify.app/).

## Limitaciones 📌

Debo aclarar tres limitaciones **muy importantes**:

1) Hasta donde tengo entendido JavaScript no puede controlar los dispositivos (teclado y mouse por ejemplo) ni acceder a tus archivos internos. Esto nos corta mucho el potencial que podría tener el asistente ya que está limitado al navegador.

2) La API que uso para que funcione el programa no está terminada y no es compatible en muchos navegadores todavía, puedes chequearlo [aquí](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#browser_compatibility).

3) Está pensado para ser funcional en computadoras con navegadores compatibles, no en celulares.

## Comenzando 🚀

Descarga el archivo comprimido .zip desde el botón verde "code" o haz click [aquí](https://github.com/Ale6100/Asistente-Virtual-JS/archive/refs/heads/main.zip)

Mira **Despliegue** para saber cómo desplegar el proyecto en tu computadora y **Pedidos por voz** para conocer la mayoría de las funciones actuales.

### Pre-requisitos 📋

Necesitas ejecutar el archivo desde un servidor. En caso de que tengas Visual Studio Code puedes utilizar la extensión Live Server.

### Instalación 🔧

Ninguna!

## Despliegue 📦

Ejecuta el código con Live Server y listo!

## Pedidos por voz 🤖

El asistente tiene múltiples funcionalidades que ejecuta cuando las solicitás por micrófono. Estas son:

* Realiza búsquedas en los sitios web que quieras (google, youtube, twitter, etc.), siempre y cuando sean sitios que yo haya configurado previamente.

* Repite cualquier frase que le pidas (sin insultos)

* Te abre la página web que solicites (al igual que antes, solo funciona en algunas)

* Podés pedirle que te ejecute cualquier pedido dentro de la lista en n minutos (siendo n un número natural menor a un millón)

* Te dice la hora

* Te dice la fecha

* Inicia y detiene un cronómetro

* Se detiene a sí mismo

* Podés preguntarle si "sigue ahí", para corroborar que todavía nos está escuchando aunque haya pasado mucho tiempo

Tiene varios más pero son pequeñeces que solo sirven para aumentar la interactividad.

Estoy abierto a sugerencias!

## Construido con 🛠️

* HTML
* CSS
* JavaScript
* [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Texto-a-voz y Reconocimiento de voz asíncrono

## Autor ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)
