# Harvest Projection
Proyecto final para la materia de sistemas distribuidos. Este API permite estimar la fecha aproximada de cuándo comenzará la cosecha de un cultivo de hortalizas por medio del cálculo de horas calóricas absorbidas diariamente. 

## Contenido
- General
  - [¿Cómo se utiliza el API?](#como-se-utiliza-el-api)  
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

## ¿Cómo se utiliza el API?
El proceso normal con el cual uno trabaja con este API consiste de los sig. pasos:

1. El usuario [registra una cuenta](#crear-una-cuenta-de-usuario) proveyendo su nombre, un correo electrónico y una contraseña. Las últimas dos serán sus **credenciales de autentificación**.
2. El usuario se [autentifica](#iniciar-sesion) estas credenciales, a lo cual el API responde con un _JSON web token_. A partir de ése momento en adelante, el usuario debe incluir dicho _token_ en cada petición que envía al API. 
3. El usuario [registra una parcela](#crear-una-nueva-parcela) (en caso de no tener ninguna registrada). 
4. El usuario [registra un producto](#crear-un-nuevo-producto) (en caso de no tener ninguno registrado). 
5. Para comenzar a generar proyecciones el usuario debe [registrar un cultivo](#crear-un-nuevo-cultivo) eligiendo únicamente una parcela y un producto de aquellos que tiene registrados.
6. Para obtener la fecha de cosecha proyectada más reciente de sus cultivos, basta con que el usuario solicite periódicamente (normalmente diario) la [lista de todos sus cultivos registrados](#obtener-la-lista-de-todos-los-cultivos). Al hacer esto, el API automáticamente revisará y actualizará las proyecciones de cada cultivo del usuario para retornar la proyección más reciente. 

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
Las parcelas representan los lugares geográficos donde físicamente se plantará el cultivo cuya fecha de cosecha se desea rastrear. Cada usuario puede tener registrado cualquier cantidad de parcelas que desee. Para registrar una nueva parcela, se tiene el sig. servicio.

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

Si las coordenadas de una parcela son editadas, todas las proyecciones de los cultivos relacionados con esa parcela se veerán afectadas. Si bien, las proyecciones no se ajustan inmediatamente después de realizar la edición de coordenadas, las nuevas coordenadas entrarán en juego en el próximo ajuste de la proyección correspondiente. 

## Borrar una Parcela
Para borrar una parcela se tiene el sig. servicio.

**DELETE** `http://harvest-projection.herokuapp.com/plots/<id de la parcela>`
#### Encabezados
|Encabezado|Valor|
|-|-|
|`Authorization`|`Bearer <token>`|

#### Cuerpo
|Atributo|Tipo|Descripción|
|-|-|-|
|`name`|`string`|El nuevo nombre de la parcela.|
|`latitude`|`number`|La nueva coordenada de latitud para la parcela.|
|`longitude`|`number`|La nueva coordenada de longitud para la parcela.|

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
Los productos representan las hortalizas que pueden ser plantadas en una parcela para iniciar un cultivo. Cada usuario puede tener registrado cualquier cantidad de productos que desee. 
