# Fran Bulnes — sitio personal

Sitio personal estático con versiones en inglés y español, una biografía editable y una sección de proyectos preparada para crecer. El inglés es el idioma inicial; el selector conserva la elección manual en este navegador.

## Desarrollo

Requisitos: Node.js 22.12+ o 24 y npm.

```bash
npm ci
npm run dev
```

Agentation está disponible en desarrollo y en la exportación de revisión. La compilación normal lo excluye.

## Contenido

Edita `src/content.js` para actualizar los dos idiomas. Mantén la estructura sincronizada y conserva el mismo `id` para cada proyecto en ambas versiones. Los textos con enlaces se escriben como segmentos `{ text, href }`; los párrafos sin enlace pueden ser un único segmento.

Los proyectos son arreglos vacíos por ahora. Cuando agregues uno, crea su contenido en `es.projects` y `en.projects`, con títulos, fechas, cuerpo y secciones traducidos. Al agregar la primera entrada, el estado «En construcción» / «Coming soon» se reemplaza automáticamente por la lista. Cada proyecto puede declarar tres dibujos fijos en `doodles`; usa dibujos distintos para cada proyecto y elige tonos `ink`, `blue` o `pink`.

Las notas también están en `src/content.js`; actualmente no se muestran en la página.

## Fotos

Usa `ProgressiveImage` para las fotos. El import `?progressive` genera una miniatura borrosa y conserva las dimensiones mientras carga la imagen completa:

```jsx
import photo from './assets/photos/mi-foto.webp?progressive';
import ProgressiveImage from './components/ProgressiveImage';

<ProgressiveImage image={photo} alt="Descripción de la foto" />
```

## Compilar y previsualizar

```bash
npm run build
npm run preview
```

`npm run preview:export` genera `standalone.html`, un HTML autocontenido. `npm run preview:review` genera `review.html` con Agentation para revisar el diseño. Ambos archivos son generados; no los edites a mano.

## Publicación

El workflow de `.github/workflows` compila y despliega `dist` al subir cambios a `main`. GitHub Pages sirve el sitio como archivos estáticos. El dominio configurado en `public/CNAME` es `franciscobulnes.cl` y la base actual es `/`.
