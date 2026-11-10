# Dataempresas

Sitio web estático de ejemplo desarrollado con HTML, CSS y JavaScript en archivos separados.

## Ejecutar

1. Descomprime el proyecto.
2. Abre `index.html` en un navegador. También puedes usar la extensión **Live Server** de Visual Studio Code.
3. Desde la página principal busca una empresa o entra a **Ver lista**.
4. Selecciona una empresa para consultar sus datos y publicar una opinión.

## Estructura

- `index.html`: página principal y buscador.
- `empresas.html`: listado vertical de empresas.
- `empresa.html`: detalle, opiniones y formulario para añadir una opinión.
- `css/styles.css`: estilos compartidos.
- `js/app.js`: menú/footer compartidos, datos de demostración, búsqueda y lógica de opiniones.

## Importante: versión de demostración

Los datos de empresas y las opiniones iniciales están definidos en `js/app.js`. Las opiniones nuevas se guardan en `localStorage`, por lo que solo estarán disponibles en el mismo navegador y dispositivo. No se envían a un servidor ni son visibles para otros visitantes.

Para publicar el sitio con opiniones compartidas entre todos los usuarios, será necesario conectar un backend y una base de datos (por ejemplo, una API en Python con Flask o FastAPI). También conviene implementar moderación, validación en el servidor y protección contra spam.

Los datos de empresas, NIT, direcciones y opiniones incluidos son ficticios y sirven únicamente como ejemplo.
