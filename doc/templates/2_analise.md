# Análise: Requirimentos do sistema

Este documento describe os requirimentos para RetroAPI especificando que funcionalidade ofrecerá e de que xeito.

## 1. Descrición xeral

Este proxecto ten dúas partes: a principal, RetroAPI, é un conxunto de funcións para crear, ler, actualizar e borrar (operacións CRUD) unha base de datos con información sobre hardware retro; secundariamente tamén consta dunha web de demostración para consumir os datos da API.

## 2. Funcionalidades

A base de datos estará aloxada nun servidor remoto, polo que todas as operacións que se realicen sobre ela terán que ter isto en conta; especialmente, a forma de acceder e a seguridade son factores cruciais. 

Os datos poderán ser lidos por calquera actor, para modificalos ou borralos será imprescindible autenticarse. Ningún actor poderá ter acceso directo á base de datos; todas as operacións faranse por medio dunha interface que se encargue de comprobar se o actor ten os permisos para realizar a acción, se esta é válida, de coller a información da base de datos e subministrarlla ao actor. A interface tamén será a responsable de comunicar ao actor as mensaxes de erros ou calquera outra que se precise.

Haberá dous tipos de actores que interaccionen co sistema: o usuario anónimo e o usuario autenticado. O usuario anónimo (isto é, que non precisa autenticarse) só poderá ler a información da base de datos mediante o uso da interface; o usuario autenticado poderá, ademais, modificar, engadir ou borrar datos. As operacións realizadas polos usuarios autenticados serán rexistradas nun arquivo de log que será almacenado no servidor.

 Operacións do usuario autenticado:

- Xestión de equipos
  
  - Crear equipo (nome, fabricante, ano, arquitectura, procesador, memoria, tipo, mando, fotos, descripción, xogos, emuladores)
  
  - Modificar equipo (nome, fabricante, ano, arquitectura, procesador, memoria, tipo, mando, fotos, descrición, xogos, emuladores)
  
  - Eliminar equipo (nome)

- Xestión de xogos
  
  - Crear xogo (nome, productora, ano, xénero, descrición, fotos)
  
  - Modificar xogo (nome, productora, ano, xénero, descrición, fotos)
  
  - Eliminar xogo (nome)

- Xestión de emuladores
  
  - Crear emulador (nome, licenza, web, descrición, autor)
  
  - Modificar emulador (nome, licenza, web, descrición, autor)
  
  - Eliminar emulador (nome)

## 3. Requerimentos non funcionais

A modificación da base de datos terá que ser realizada por un actor debidamente autenticado.

## 4. Tipos de usuarios

- Usuario anónimo, que poderá ler a información gardada na base de datos
- Usuario autenticado, que poderá modificar ou eliminar esta información

## 5. Entorno operacional

### 5.1. Dominio

API: https://retroapi-daw.herokuapp.com/

Web: https://retroapi-web.herokuapp.com/

### 5.2. Hardware

Un ordenador para desenvolver a aplicación e un servizo de *hosting* baseado na nube para aloxar a base de datos, a interface e a web de demostración.

### 5.3. Software

Para o desenvolvemento do proxecto empregarase como IDE Visual Studio Code, ademais dos distintos linguaxes e frameworks necesarios (todos eles *Open Source*).

Como servizo de *hosting* da API e a web empregarase Heroku, pola súa facilidade de configuración e despregamento.

A base de datos estará aloxada en Atlas, pertencente a MongoDB, que ten un servizo gratuíto con limitacións, pero suficiente para os propósitos deste proxecto.

## 6. Interfaces externos

Toda a comunicación co exterior será mediante unha API.

## 7. Melloras futuras

A principal mellora de RetroAPI no futuro sería a de incluír máis datos, tanto do hardware como -especialmente- do software, para poder ser cada vez máis completo. O obxectivo final, só acadable de maneira colaborativa, sería recompilar toda a información sobre hardware e software retro nunha base de datos pública e gratuíta.