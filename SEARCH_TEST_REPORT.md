# 🔍 SEARCH TEST REPORT — UMAS COMMUNITY RULES WEB

> **Pipeline de Búsqueda:** Normalización Unicode NFD + Diccionario de Sinónimos + Ranking Ponderado + Navegación Command Palette

---

## Matriz de Pruebas del Buscador

| Caso de Prueba | Entrada (Query) | Comportamiento Esperado | Resultado |
| :--- | :--- | :--- | :--- |
| **ST-01** | `acoso` | Renderiza tarjeta `#02 Prevención de Acoso` en el modal con severidad y snippet | ✅ **PASS** |
| **ST-02** | `hostigamiento` (Sinónimo) | Resuelve sinónimo y muestra regla `#02` | ✅ **PASS** |
| **ST-03** | `doxxing` | Muestra regla `#11 Doxxing (Tolerancia Cero)` con insignia roja Nivel 5 | ✅ **PASS** |
| **ST-04** | `datos personales` | Resuelve sinónimo de doxxing y resalta regla `#11` | ✅ **PASS** |
| **ST-05** | `spam` / `flood` | Muestra regla `#03 Control de Spam, Flood y Ruido Visual` | ✅ **PASS** |
| **ST-06** | `audio` / `voz` | Muestra regla `#07 Confort Auditivo en Canales de Voz` | ✅ **PASS** |
| **ST-07** | `staff` / `moderacion` | Lista reglas `#M1`, `#M2`, `#M3`, `#M4` con insignia morada de Código Staff | ✅ **PASS** |
| **ST-08** | `puntos` / `sanciones` | Enlaza con reglas de severidad y simulador sancional | ✅ **PASS** |
| **ST-09** | `xyzinexistente` | Muestra empty state formal con sugerencias rápidas | ✅ **PASS** |
| **ST-10** | Clic en resultado | Cierra modal, scroll suave, abre ficha `#02`, activa resplandor esmeralda | ✅ **PASS** |
| **ST-11** | `ArrowDown` + `Enter` | Selecciona el resultado activo con teclado, cierra modal y navega | ✅ **PASS** |
| **ST-12** | `Escape` | Cierra modal sin alterar la página y restaura foco en botón disparador | ✅ **PASS** |
