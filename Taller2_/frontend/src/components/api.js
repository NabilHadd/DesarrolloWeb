const isAndroid = typeof window.cordova !== "undefined";

// Android: usar 10.0.2.2
const BASE = isAndroid ? "http://10.0.2.2" : "http://localhost";

export const API_POKEMON = `${BASE}:9001`;
export const API_ECONOMIA = `${BASE}:9002`;
export const API_RECETAS = `${BASE}:9000`;
