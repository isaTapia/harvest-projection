# Harvest Projection
Proyecto final para la materia de sistemas distribuidos. Este API permite estimar la fecha aproximada de cuándo comenzará la cosecha de un cultivo de hortalizas por medio del cálculo de horas calóricas absorbidas diariamente. 

## Interactuando con el API
El servidor siempre responde con un JSON válido que puede representar un objeto o un arreglo de datos cuyo contenido y su formato dependen del recurso solicitado.

Para aquellos servicios que esperan recibir datos de entrada, toda petición que es enviada a ellos debe contener dichos datos de entrada en un objeto JSON cuyo formato depende del servicio solicitado. Así mismo, se debe colocar el valor `Content-Type: application/json` en el encabezado de la petición HTTP enviada.

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
|`name`|`string`|El nombre completo del usuario.|
|`email`|`string`|El correo electrónico del usuario.|
|`password`|`string`|La contraseña de acceso a la cuenta de usuario.|

#### Respuesta
|Atributo|Tipo|Descripción|
|-|-|-|
|`_id`|`string`|Una cadena hash que identifica la cuenta de usuario.|
|`name`|`string`|El nuevo nombre completo del usuario.|
|`email`|`string`|El nuevo correo electrónico del usuario.|

Es importante mencionar que no es necesario proveer todos los datos de entrada de este servicio, únicamente aquellos que se desean editar; el API mantendrá intactos aquellos campos para los cuales no se proveyó un nuevo valor. Por ejemplo, si se desea editar la contraseña, basta con enviar un JSON con contenga únicamente `{ "password": "..." }`.

