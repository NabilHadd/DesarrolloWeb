En este taller se llevo a cabo una APK para el cliente de la empresa InfoMovil, desarrollando una webview para android donde los clientes pudieran acceder al mismo contenido de la pagina web.
Ademas querian poseer un mayor control sobre sus datos por lo que la información ahora se consulta directo desde bases de datos internas.

La arquitectura principal del proyecto es la siguiente:

![Arquitectura del Proyecto](./Arq.jpg)

Se utilizo react y tailwind css para renovar y modularizar el aspecto de la pagina web.
Por medio de Axios es que se realizaron las consultas al BackEnd.
En el Backend existen 3 API, 2 programadas con Typescript haciendo uso de la libreria node.js y una con python haciendo uso de la libreria FastApi.
Las API de node.js corresponden una a NestJs y otra a Express.
Para acceder a una documentación mas en detalle sobre las API revise [AQUÍ](./api-doc).
Cada una de las API apuntan a una base de datos distinta como se puede observar en el diagrama de la arquitectura.
Cada una de las bases fue poblada por medio de su respectivo seeder. Seeder el cual accede a API externas para rescatar la información y luego alamcenarla en su respectiva base de datos.
De esta manera las base de datos fueron pobladas de manera automatica y con datos reales (Los mismos datos de la pagina web original).
La unica salvedad es que en las consultas a las API externas se aplico un limite para evitar una espera muy extendida a la hora de poblar las bases de datos.
Todo lo mencionado anteriormente fue encapsulado en un docker, de manera que esta completamente automatizado.

Instalación. 
Para la instalación debe clonar el repositorio y desde la raíz del proyecto correr el siguiente comando:

```bash
docker compose up --build
```

Luego que el docker ha sido buildeado y este corriendo, es importante que exponga los siguientes puertos de su maquina por medio de vs Tunnel o por el servicio de tuneles de su preferencia.

| Servicio              | URL                   |
|-----------------------|------------------------|
| RECETAS (FastApi)     | http://localhost:9000/ |
| POKEMON (NestApi)     | http://localhost:9001/ |
| ECONOMIA (ExpressApi) | http://localhost:9002/ |

Cuando ya tenga sus url correspondientes a cada API por ejemplo:

| Servicio              | URL                                                |
|-----------------------|----------------------------------------------------|
| RECETAS (FastApi)     | https://bg6nj47p-9000.brs.devtunnels.ms/           |
| POKEMON (NestApi)     | https://bg6nj47p-9001.brs.devtunnels.ms/           |
| ECONOMIA (ExpressApi) | https://bg6nj47p-9002.brs.devtunnels.ms/           |

Se habilito un script dentro de el frontend para que reemplace los de ejemplo los suyos.

[AQUÍ](./frontend/src/components/api.js)

En el repositorio podra encontrar la APK ([AQUÍ]()) El problema es que esta APK fue buildeada a partir del frontend con los endpoint de ejemplo. A continuación se detalla como instalar la APK en un entorno de Android Studio, pero para que pueda probar la APK de forma adecuada debe buildear una WebView Propia. Mas adelante indicamos como hacerlo exactamente.

Para instalar la APK disponible en el repositorio es necesario que corra el siguiente comando con el emulador de Android Studio funcionando:

```bash
adb install -r 'ruta donde esta su .apk'
```
Luego ya puede echar a andar la APK sin problemas.

Para hacer una build a partir del FrontEnd con los endpoints actualizados:

Desde la raiz del repositorio (DesarrolloWeb)

```bash
cd .\Taller2_\frontend

npm install

npm run build

cd ..

Remove-Item -Path "./cordovaApp/www/*" -Recurse -Force

Copy-Item -Path "./frontend/build/*" -Destination "./cordovaApp/www/" -Recurse -Force

cd cordovaApp

npm install

cordova platform rm android

cordova platform add android

cordova prepare android

cordova run android
```

Todo lo anterior considerando el emulador corriendo, los docker arriba y con el frontend actualizado, no deberia generar problemas.


