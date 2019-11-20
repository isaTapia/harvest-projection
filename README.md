# Harvest Projection
Proyecto final para la materia de sistemas distribuidos. Este API permite estimar la fecha aproximada de cuándo comenzará la cosecha de un cultivo de hortalizas por medio del cálculo de horas calóricas absorbidas diariamente. 

## Contenido
- General
  - **[Guía rápida de cómo utilizar el API](#guia-rapida-de-como-utilizar-el-api)**
  - [Interactuando con el API](#interactuando-con-el-api)
- Cuentas de Usuario
  - [Crear una Cuenta de Usuario](#crear-una-cuenta-de-usuario)
  - [Iniciar Sesión](#iniciar-sesion)
  - [Recuperar todos los datos del Usuario](#recuperar-todos-los-datos-de-usuario)
  - [Editar los datos de la Cuenta de Usuario](#editar-los-datos-de-la-cuenta-de-usuario)
- Parcelas
  - [Crear una nueva Parcela](#crear-una-nueva-parcela)
  - [Obtener la lista de todas las Parcelas](#obtener-la-lista-de-todas-las-parcelas)
  - [Editar los datos de una Parcela](#editar-los-datos-de-una-parcela)
  - [Borrar una Parcela](#borrar-una-parcela)
- Productos
  - [Crear un nuevo Producto](#crear-un-nuevo-producto)
  - [Obtener la lista de todos los Productos](#obtener-la-lista-de-todos-los-productos)
  - [Editar los datos de un Producto](#editar-los-datos-de-un-producto)
  - [Borrar un Producto](#borrar-un-producto)
- Cultivos
  - [Crear un nuevo Cultivo](#crear-un-cultivo)
  - [Obtener la lista de todos los Cultivos](#obtener-la-lista-de-todos-los-cultivos)
  - [Borrar un Cultivo](#borrar-un-cultivo)

## Guía rápida de cómo utilizar el API
El proceso normal con el cual uno trabaja con este API consiste de los sig. pasos:

1. El usuario [registra una cuenta](#crear-una-cuenta-de-usuario) proveyendo su nombre, un correo electrónico y una contraseña. Las últimas dos serán sus **credenciales de autentificación**.
2. El usuario se [autentifica](#iniciar-sesion) con estas credenciales, a lo cual el API responde con un _JSON web token_. A partir de ése momento en adelante, el usuario debe incluir dicho _token_ en cada petición que envía al API. 
3. El usuario [registra una parcela](#crear-una-nueva-parcela) (en caso de no tener ninguna registrada). 
4. El usuario [registra un producto](#crear-un-nuevo-producto) (en caso de no tener ninguno registrado). 
5. Para comenzar a generar proyecciones el usuario debe [registrar un cultivo](#crear-un-nuevo-cultivo) eligiendo únicamente una parcela y un producto de aquellos que tiene registrados.
6. Para obtener la fecha de cosecha proyectada más reciente de sus cultivos, basta con que el usuario solicite periódicamente (normalmente diario) la [lista de todos sus cultivos registrados](#obtener-la-lista-de-todos-los-cultivos). Al hacer esto, el API automáticamente revisará y actualizará las proyecciones de cada cultivo del usuario para retornar la proyección más reciente. 

El resto de los servicios del API no incluidos en esta lista simplemente son aquellos que permiten realizar opreaciones CRUD sobre los recursos ya mencionados.

**Importante**
> Cabe mencionar que ya existe registrado en el API un usuario de prueba y se recomienda utilizarlo. Para iniciar sesión con la cuenta de este usuario de prueba, utilice el correo electrónico `test@fake.email.com` y la contraseña `cicese`.

## Interactuando con el API
El API siempre responderá a toda petición recibida con un JSON válido que puede representar un _objeto_ o un _arreglo_ de datos cuyo contenido y su formato dependen del recurso solicitado.

Para aquellos servicios que esperan recibir datos de entrada, toda petición que les es enviada debe contener dichos datos de entrada contenidos en un objeto JSON cuyo formato depende del servicio solicitado. Así mismo, se debe colocar el valor `Content-Type: application/json` en el encabezado de la petición HTTP enviada.

En caso de que ocurra algún error durante el procesamiento de alguna petición, el API responderá con el código HTTP 400 o 500 según corresponda al error ocurrido y enviará un objeto JSON como respuesta, el cual incluye los sig. campos:

|Atributo|Tipo|Descripción|
|-|-|-|
|`name`|`string`|Un nombre corto que describe, en general, el tipo de error ocurrido.|
|`message`|`string`|Un breve texto que describe más claramente el error ocurrido.|

## Crear una Cuenta de Usuario
Antes de comenzar a utilizar el API, es necesario crear una cuenta de usuario. Para ello, se realiza la sig. petición

**POST** `http://harvest-projection.herokuapp.com/accounts`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Content-Type`|`application/json`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`name`|`string`|El nombre completo del usuario.|
|`email`|`string`|El correo electrónico del usuario; dos usuarios no pueden tener el mismo correo electrónico.|
|`password`|`string`|La contraseña de acceso a la cuenta de usuario; debe ser de al menos 6 caracteres de largo.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica la cuenta de usuario recién creada.|
|`name`|`string`|El nombre completo del usuario.|
|`email`|`string`|El correo electrónico del usuario.|

Una vez creada la cuenta de usuario, se puede iniciar sesión proveyendo al API el correo electrónico y la contraseña registrados. 

## Iniciar Sesión
La mayoría de los servicios del API requiren que el usuario se autentifique antes de poder atender sus peticiones. Para ello, es necesario que el usuario inicie sesión proveyendo su correo electrónico y contraseño que fueron registrados al momento de crear su cuenta de usuario. 

**POST** `http://harvest-projection.herokuapp.com/session`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Content-Type`|`application/json`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`email`|`string`|El correo electrónico del usuario.|
|`password`|`string`|La contraseña de acceso a la cuenta de usuario.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica la cuenta de usuario.|
|`token`|`string`|Una cadena que representa la firma de autentificación (JSON web token) del usuario para esta sesión.|
|`name`|`string`|El nombre completo del usuario.|
|`email`|`string`|El correo electrónico del usuario.|
|`plotsList`|`array`|La lista de parcelas registradas al usuario.|
|`productsList`|`array`|La lista de productos registrados al usuario.|
|`cropsList`|`array`|La lista de cultivos registrados al usuario. Para cada uno de ellos, el atributo `projectedHarvestDate` representa la fecha de cosecha proyectada más recientemente calculada.|

Una vez iniciada la sesión, el API responde con un JSON que incluye un atributo llamado `token` el cual contiene una firma electronica. A partir de este momento en adelante, cada que se desee enviar una petición al API, ésta debe incluir en el encabezado dicha firma de la sig. forma: `Authorization: Bearer <token>`. De no ser así, el API rechazará la petición. 

**Importante**
> La firma generada al iniciar sesión será válida por las siguientes 8 horas. Actualmente el API no provee ningún mecanismo para invalidar la firma de forma prematura; la firma continuará siendo válida hasta que expire, incluso si el usuario genera una o varias firmas nuevas o si cambia su contraseña. El API tampoco provee ningún mecanismo para cerrar sesión.

**Importante**
> Existe una cuenta de usuario de prueba registrada en el sistema que ya incluye bastante información pre-capturada para trabajar con el API y realizar pruebas. Para iniciar sesión con esta cuenta utilice el correo electrónico `test@fake.email.com` y la contraseña `cicese`.

## Recuperar todos los datos del Usuario
Para recuperar todos los datos del usuario, el API ofrece el sig. servicio.

**GET** `http://harvest-projection.herokuapp.com/accounts`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica la cuenta de usuario.|
|`name`|`string`|El nombre completo del usuario.|
|`email`|`string`|El correo electrónico del usuario.|
|`plotsList`|`array`|La lista de parcelas registradas al usuario.|
|`productsList`|`array`|La lista de productos registrados al usuario.|
|`cropsList`|`array`|La lista de cultivos registrados al usuario. Para cada uno de ellos, el atributo `projectedHarvestDate` representa la fecha de cosecha proyectada más recientemente calculada.|

## Editar los datos de la Cuenta de Usuario
Para editar los datos de la cuenta de usuario, principalmente el correo electrónico y la contraseña, el API ofrece el sig. servicio.

**PUT** `http://harvest-projection.herokuapp.com/accounts`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|
|`Content-Type`|`application/json`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`name`|`string`|El nuevo nombre para el usuario.|
|`email`|`string`|El nuevo correo electrónico del usuario.|
|`password`|`string`|La nueva contraseña de acceso a la cuenta de usuario.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica la cuenta de usuario.|
|`name`|`string`|El nuevo nombre completo del usuario.|
|`email`|`string`|El nuevo correo electrónico del usuario.|

Es importante mencionar que no es necesario proveer todos los datos de entrada de este servicio, únicamente aquellos que se desean editar; el API mantendrá intactos aquellos campos para los cuales no se proveyó un nuevo valor. Por ejemplo, si se desea editar la contraseña, basta con enviar un JSON con contenga únicamente `{ "password": "..." }`.

## Crear una nueva Parcela
Las parcelas representan los lugares geográficos donde físicamente se cultivarán hortalizas. Cada usuario puede tener registrado cualquier cantidad de parcelas que desee. Los datos de una parcela consisten principalmente de las coordenadas geográficas donde se encuentra. Dichas coordenadas son utilizadas por el API para recuperar los datos meteorológicos (históricos y actuales) del lugar donde se encuentra la parcela para después calcular la cantidad de horas calóricas producidas cada día. Para registrar una nueva parcela, se tiene el sig. servicio.

**POST** `http://harvest-projection.herokuapp.com/plots`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|
|`Content-Type`|`application/json`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`name`|`string`|El nombre con el que se identificará la parcela. Debe ser de al menos 3 caracteres de largo.|
|`latitude`|`number`|La coordenada de latitud (en grados) donde se encuentra la parcela.|
|`longitude`|`number`|La coordenada de longitud (en grados) donde se encuentra la parcela.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica la parcela creada.|
|`name`|`string`|El nombre de la parcela creada.|
|`latitude`|`number`|La coordenada de latitud (en grados) donde se encuentra la parcela.|
|`longitude`|`number`|La coordenada de longitud (en grados) donde se encuentra la parcela.|

**Importante**
> El usuario de prueba ya contiene 3 parcelas registradas, una correspondiente a Maneadero, una para Ojos Negros y una más para San Quintín, que son regiones en el municipio de Ensenada.

## Obtener la lista de todas las Parcelas
Para obtener la lista de todas las parcelas que tiene registradas el usuario, se puede utilizar el sig. servicio. 

**GET** `http://harvest-projection.herokuapp.com/plots`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|

#### Respuesta
Este servicio responderá con un arreglo que contiene los datos de todas las parcelas individuales. Dicho arreglo puede estar vacío si el usuario no tiene ninguna parcela registrada. Cada elemento en el arreglo está constituido por los sig. datos:

|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica la parcela.|
|`name`|`string`|El nombre de la parcela.|
|`latitude`|`number`|La coordenada de latitud donde se encuentra la parcela.|
|`longitude`|`number`|La coordenada de longitud donde se encuentra la parcela.|

## Editar los datos de una Parcela
Para editar los datos de una parcela, principalmente sus coordenadas, se puede utilizar el sig. servicio.

**PUT** `http://harvest-projection.herokuapp.com/plots/<id de la parcela>`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|
|`Content-Type`|`application/json`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`name`|`string`|El nuevo nombre de la parcela.|
|`latitude`|`number`|La nueva coordenada de latitud para la parcela.|
|`longitude`|`number`|La nueva coordenada de longitud para la parcela.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica la parcela.|
|`name`|`string`|El nuevo nombre de la parcela.|
|`latitude`|`number`|La nueva latitud de la parcela.|
|`longitude`|`number`|La nueva longitud de la parcela.|

Observe que no es necesario proveer todos los datos descritos como entrada, solamente aquellos que se desean editar. Por ejemplo, digamos que sólo se desea editar el nombre de una parcela, basta con que el JSON de entrada incluya únicamente: `{ "name": "..." }`.

Si las coordenadas de una parcela son editadas, todas las proyecciones de los cultivos relacionados con esa parcela se veerán afectadas. Si bien, las proyecciones no se ajustan inmediatamente después de realizar la edición de coordenadas, las nuevas coordenadas entrarán en juego en el próximo ajuste de la proyección correspondiente. 

## Borrar una Parcela
Para borrar una parcela se tiene el sig. servicio.

**DELETE** `http://harvest-projection.herokuapp.com/plots/<id de la parcela>`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|La cadena hash que identificaba la parcela.|
|`owner`|`string`|Una cadena hash que identifica al usuario al que pertenecía la parcela borrada.|
|`name`|`string`|El nombre de la parcela borrada.|
|`latitude`|`number`|La latitud de la parcela borrada.|
|`longitude`|`number`|La longitud de la parcela borrada.|

Si una parcela está actualmente siendo utilizada por algún cultivo, entonces la parcela **no** puede borrarse.

# Crear un nuevo Producto
Los productos representan las hortalizas que pueden ser cultivadas en una parcela. Cada usuario puede tener registrado cualquier cantidad de productos que desee. La teoría dice que, una vez que una hortaliza es plantada para su cultivo, su crecimiento diario es directamente proporcional a la cantidad de horas calóricas que absorbió cada día. Dichas horas calóricas son acumulables. Así, la hortaliza alcanza la madurez una vez que la cantidad de horas calóricas que fueron acumuladas por la planta cruza un umbral determinado. Los principales datos de un producto son: 

- Un **intervalo de temperatura de tolerancia**, esto es, los límites de temperatura máximo y mínimo dentro de los cuáles la planta puede absorber horas calóricas. Si la temperatura de un día particular no está dentro de estos límites, la planta _no_ absorbe horas calóricas.
- Un **intervalo de temperatura óptima**, esto es, los límites de temperatura máximo y mínimo dentro de los cuáles la planta absorbe la mayor cantidad de horas calóricas posibles. Si la temperatura de un día particular no está dentro de estos límites, la planta aún puede absorber horas calóricas pero en una cantidad limitada.
- Un **umbral de madurez**, esto es, la cantidad total de horas calóricas que la planta necesita absorber a lo largo del tiempo para alcanzar la madurez. 

Para crear un nuevo producto, el API ofrece el sig. servicio.

**POST** `http://harvest-projection.herokuapp.com/products`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|
|`Content-Type`|`application/json`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`name`|`string`|El nombre con el que se identificará el producto. Debe ser de al menos 3 caracteres de largo.|
|`maturityThreshold`|`number`|El umbral de madurez del producto (en horas calóricas).|
|`temperatureTolerance`|`object`|Los límites mínimo y máximo de temperatura tolerable para el producto (en grados Celsius). Estos se agrupan en un objeto JSON que posee dos atributos: `min` y `max`, respectivamente.|
|`temperatureOptimum`|`object`|Los límites mínimo y máximo de temperatura óptima para el producto (en grados Celsius). Estos se agrupan en un objeto JSON que posee dos atributos: `min` y `max` respectivamente.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica el producto creado.|
|`name`|`string`|El nombre del producto creado.|
|`maturityThreshold`|`number`|El umbral de madurez del producto creado.|
|`temperatureTolerance`|`object`|El margen de temperatura tolerable del producto creado.|
|`temperatureOptimum`|`object`|El margen de temperatura óptima del producto creado.|

**Importante**
> El usuario de prueba ya tiene un producto registrado llamado Tomate.

## Obtener la lista de todos los Productos
Para obtener la lista de todos los productos que tiene registrados el usuario, se puede utilizar el sig. servicio. 

**GET** `http://harvest-projection.herokuapp.com/products`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|

#### Respuesta
Este servicio responderá con un arreglo que contiene los datos de todos los productos individuales. Dicho arreglo puede estar vacío si el usuario no tiene ningún producto registrada. Cada elemento en el arreglo está constituido por los sig. datos:

|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica el producto.|
|`name`|`string`|El nombre del producto.|
|`maturityThreshold`|`number`|El umbral de madurez del producto.|
|`temperatureTolerance`|`object`|El margen de temperatura tolerable del producto.|
|`temperatureOptimum`|`object`|El margen de temperatura óptima del producto.|

## Editar los datos de un Producto
Para editar los datos de un producto, principalmente su umbral de madurez y tolerancias de temperatura, se puede utilizar el sig. servicio.

**PUT** `http://harvest-projection.herokuapp.com/productos/<id del producto>`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|
|`Content-Type`|`application/json`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`name`|`string`|El nuevo nombre para el producto.|
|`maturityThreshold`|`number`|El nuevo umbral de madurez para el producto.|
|`temperatureTolerance`|`object`|El nuevo margen de temperatura tolerable para el producto.|
|`temperatureOptimum`|`object`|El nuevo margen de temperatura óptima para el producto.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica el producto.|
|`name`|`string`|El nuevo nombre para el producto.|
|`maturityThreshold`|`number`|El nuevo umbral de madurez para el producto.|
|`temperatureTolerance`|`object`|El nuevo margen de temperatura tolerable para el producto.|
|`temperatureOptimum`|`object`|El nuevo margen de temperatura óptima para el producto.|

No es necesario proveer todos los datos de entrada descritos, solamente aquellos que se desean editar. Por ejemplo, digamos que sólo se desea editar el nombre de una parcela, basta con que el JSON de entrada incluya únicamente: `{ "name": "..." }`.
Si se editan los datos de un cultivo, las proyecciones de los cultivos que hagan uso de él se veerán afectadas. Si bien, las proyecciones no se ajustan inmediatamente después de realizar la edición, sí se utilizarán los nuevos valores en el próximo ajuste de la proyección correspondiente. 

## Borrar un Producto
Para borrar un producto se tiene el sig. servicio.

**DELETE** `http://harvest-projection.herokuapp.com/products/<id de la parcela>`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|La cadena hash que identificaba el producto borrado.|
|`name`|`string`|El nombre del producto borrado.|
|`owner`|`string`|Una cadena hash que identifica al usuario al que pertenecía el producto borrado.|
|`maturityThreshold`|`number`|El umbral de madurez del producto borrado.|
|`temperatureTolerance`|`object`|El margen de temperatura tolerable del producto borrado.|
|`temperatureOptimum`|`object`|El margen de temperatura óptima del producto borrado.|

El producto **no** puede ser borrado si actualmente está siendo utilizado por algún cultivo.

## Crear un nuevo Cultivo
Los cultivos representan las parcelas que actualmente están plantadas con hortalizas que serán cosechadas una vez que maduren, es decir, _un cultivo es la combinación entre una parcela y un producto_. El API calcula la fecha estimada de inicio de cosecha utilizando las coordenadas geográficas de la parcela obtiene los datos metorológicos del lugar donde se encuentra y después combina dichos datos con las tolerancias de temperatura del producto para calcular la cantidad de horas calóricas que fueron generadas cada día, desde la fecha en que se plantaron las semillas del cultivo hasta que el total de horas calóricas acumuladas es mayor o igual al umbral de madurez del producto. Una vez que se cruzó el umbral, se cuentan cuántos días pasaron para llegar a dicho humbral y el resultado se suma a la fecha de inicio del cultivo. El resultado final es la fecha en la que se estima el usuario puede comenzar a cosechar el producto maduro. 

Este proceso es completamente automático, pero para iniciarlo, el usuario debe registrar un cultivo. Para ello, el API ofrece el sig. servicio. 

**POST** `http://harvest-projection.herokuapp.com/crops`

#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|
|`Content-Type`|`application/json`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`cultivationDate`|`string`|La fecha de inicio del cultivo; esto es, la fecha en la que se plantaron las semillas. No necesariamente tiene que ser la fecha actual, puede ser una fecha anterior, pero sólo se permiten fechas del **año actual**. Debe tener el formato `AAAA-MM-DD`.|
|`plotId`|`string`|La cadena hash que identifica la parcela para la cual se registrará el cultivo.|
|`productId`|`string`|La cadena hash que identifica el producto para el cual se registrará el cultivo.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica el cultivo creado.|
|`plot`|`object`|Los datos de la parcela registrada al cultivo creado encapsulados en un objeto JSON. Los datos retornados son `_id`, `name`, `latitude` y `longitude`.|
|`product`|`object`|Los datos del producto registrado al cultivo creado encapsulados en un objeto JSON. Los datos retornados son `_id`, `name`, `maturityThreshold`, `temperatureTolerance` y `temperatureOptimum`.|
|`cultivationDate`|`string`|La fecha en la que se inició el cultivo creado (no necesariamente es la misma que la fecha en que se _registró_ el cultivo). Sigue el formato `AAAA-MM-DD`.|
|`projectedHarvestDate`|`string`|La fecha en la que se estima se podrá comenzar a cosechar el producto cultivado. Sigue el formato `AAAA-MM-DD`.|
|`updatedAt`|`string`|La fecha y hora en la que se actualizó por última vez la fecha proyectada de cosecha, según el huso horario del servidor. Sigue un formato de fecha estándar.|

Cuando se registra un cultivo nuevo, la fecha de cosecha proyectada se calcula completamente utilizando datos meteorológicos del año anterior. Subsecuentes ajustes a la fecha de cosecha proyectada se calcularán utilizando los datos meteorológicos del año presente hasta la fecha más actual disponible y el resto de las horas calóricas necesarias para cruzar el umbral se calcularán de nuevo utilizando datos meteorológicos del año anterior.

**Importante**
> Cabe mencionar que los datos meteorológicos se obtienen del servicio [Dark Sky](https://darksky.net/dev/docs#time-machine-request), los cuales permiten únicamente 1000 peticiones gratuitas al día. Para hacer el uso más eficiente de esta cantidad limitada de peticiones, el API almacena en la base de datos cada dato recuperado de Dark Sky. Sin embargo, dichos datos se asocian con las coordenadas geográficas a las que corresponden. Debido a esto, cuando se crea un cultivo de una parcela cuyos datos meteorológicos no han sido recuperados aún de Dark Sky, el API recurrirá a descargar un año completo de datos meteorológicos diarios, lo que tiene dos consecuencias potencialmente negativas: a) el API podrá tardar un par de minutos en responder, potencialmente excediendo el tiempo de espera del cliente/servidor y b) se podrían agotar las peticiones diarias gratuitas de Dark Sky antes de que se recuperen todos los datos necesarios. Debido a esto, _se recomienda al usuario utilizar únicamente las parcelas que tiene registrado el usuario de prueba_, el API ya tiene almacenados los datos meteorológicos de estas parcelas.

## Obtener la lista de todos los Cultivos
Para obtener la lista de todos los cultivos registrados, el API ofrece el sig. servicio.

**GET** `http://harvest-projection.herokuapp.com/crops`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|

#### Respuesta
Este servicio responderá con un arreglo que contiene los datos de todos los cultivos individuales. Dicho arreglo puede estar vacío si el usuario no tiene ningún cultivo registrado. Cada elemento en el arreglo está constituido por los sig. datos:

|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|La cadena hash que identifica el cultivo.|
|`plot`|`object`|Los datos de la parcela registrada al cultivo encapsulados en un objeto JSON. Dichos datos son `_id`, `name`, `latitude` y `longitude`.|
|`product`|`object`|Los datos del producto registrado al cultivo encapsulados en un objeto JSON. Dichos datos son `_id`, `name`, `maturityThreshold`, `temperatureTolerance` y `temperatureOptimum`.|
|`cultivationDate`|`string`|La fecha de inicio del cultivo. Sigue el formato `AAAA-MM-DD`.|
|`projectedHarvestDate`|`string`|La fecha en la que se estima se podrá comenzar a cosechar el producto cultivado. Sigue el formato `AAAA-MM-DD`.|
|`updatedAt`|`string`|La fecha y hora en la que se actualizó por última vez la fecha proyectada de cosecha, según el huso horario del servidor. Sigue un formato de fecha estándar.|

Este servicio no solamente retorna la lista de cultivos registrados, sino que además revisa primero la última fecha de actualización de cada uno de ellos. Si dicha fecha no es la fecha actual, entonces el API calcula la fecha de cosecha proyectada utilizando los datos más recientes disponibles. Esto garantiza que la fecha de cosecha proyectada que el usuario recibe como respuesta es siempre la estimación más reciente.  

## Borrar un Cultivo
Para borrar un cultivo se tiene el sig. servicio.

**DELETE** `http://harvest-projection.herokuapp.com/crops/<id del cultivo>`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|La cadena hash que identificaba al cultivo borrado.|
|`owner`|`string`|Una cadena hash que identifica al usuario al que pertenecía el cultivo borrado.|
|`plot`|`object`|Los datos de la parcela registrada al cultivo borrado encapsulados en un objeto JSON. Dichos datos son `_id`, `name`, `latitude` y `longitude`.|
|`product`|`object`|Los datos del producto registrado al cultivo borrado encapsulados en un objeto JSON. Dichos datos son `_id`, `name`, `maturityThreshold`, `temperatureTolerance` y `temperatureOptimum`.|
|`cultivationDate`|`string`|La fecha de inicio del cultivo borrado. Sigue el formato `AAAA-MM-DD`.|
|`projectedHarvestDate`|`string`|La última fecha en la que se estimaba se podía comenzar a cosechar el producto cultivado. Sigue el formato `AAAA-MM-DD`.|
|`updatedAt`|`string`|La fecha y hora en la que se actualizó por última vez la fecha proyectada de cosecha, según el huso horario del servidor. Sigue un formato de fecha estándar.|

Este servicio borra únicamente el cultivo, los datos de la parcela y el producto asociados con él, así como tambiénm los datos meteorológicos utilizados, **no** son borrados, sino que permanecen intactos.
