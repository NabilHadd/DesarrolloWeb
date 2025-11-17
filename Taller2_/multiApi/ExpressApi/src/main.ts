import { app } from './app'; // IMPORTAR sin extensión .js

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});
