# TestSprite Tests - Letter Hunt

Este directorio contiene pruebas E2E para el botón de reinicio en modo selección con **trace recording** habilitado.

## Configuración

Las pruebas están configuradas con:
- **Trace recording**: `on` (grabado completo para todos los tests)
- **Screenshots**: `on` (capturas en todos los tests)
- **Video**: `on` (grabación de video)

## Ver Traces en trace.playwright.dev

### Opción 1: Ver traces online

1. Ejecuta las pruebas:
   ```bash
   cd testsprite_tests
   npx playwright test --config=playwright.config.ts
   ```

2. Sube el archivo `trace.zip` generado en `test-results/` a:
   **https://trace.playwright.dev/**

3. Arrastra y suelta el archivo trace.zip en la página

### Opción 2: Ver traces localmente

```bash
cd testsprite_tests
npx playwright test --config=playwright.config.ts
npx playwright show-report
```

### Opción 3: Ver trace específico

```bash
npx playwright show-trace test-results/reset-level-reset-button-selection-mode-should-display-reset-button/trace.zip
```

## Tests Incluidos

### `reset-level.spec.ts`

Pruebas para el botón "Reiniciar" en modo selección:

1. **should display reset button** - Verifica que el botón reiniciar es visible
2. **should maintain current level after reset** - El nivel se mantiene después de reiniciar
3. **should regenerate board with new letters on reset** - El tablero se regenera con nuevas letras
4. **should reset timer and score on reset** - El tiempo y puntuación se reinician
5. **should clear all selections on reset** - Todas las selecciones se limpian
6. **should display verify button after reset** - El botón verificar se muestra correctamente
7. **should display target letters after reset** - Las letras objetivo se muestran después de reiniciar
8. **should work correctly from level 2 onwards** - Funciona correctamente desde el nivel 2

## Ejecución de Tests

### Todos los tests:
```bash
cd testsprite_tests
npx playwright test --config=playwright.config.ts
```

### Tests específicos:
```bash
npx playwright test reset-level.spec.ts --config=playwright.config.ts
```

### Con UI:
```bash
npx playwright test --ui --config=playwright.config.ts
```

### En modo headed (ver navegador):
```bash
npx playwright test --headed --config=playwright.config.ts
```

## Estructura de Archivos

```
testsprite_tests/
├── playwright.config.ts    # Configuración con trace habilitado
├── reset-level.spec.ts     # Tests del botón reiniciar
└── test-results/           # Resultados y traces generados
    └── [test-name]/
        ├── trace.zip       # Archivo para subir a trace.playwright.dev
        ├── screenshot.png  # Captura de pantalla
        └── video.webm      # Video de la ejecución
```

## Artifacts Generados

Después de ejecutar los tests, encontrarás:

- **trace.zip**: Archivo para visualizar en https://trace.playwright.dev/
- **screenshots**: Capturas de pantalla de cada test
- **videos**: Grabaciones de video de la ejecución

## Troubleshooting

### El servidor no inicia:
Verifica que no haya otro proceso usando el puerto 3000:
```bash
npx kill-port 3000
```

### Tests fallan por timeout:
Aumenta el timeout en `playwright.config.ts`:
```typescript
timeout: 60000, // 60 segundos
```

### No se generan traces:
Verifica que la configuración tenga `trace: 'on'`:
```typescript
use: {
  trace: {
    mode: 'on',
    snapshots: true,
    screenshots: true,
    sources: true,
  },
}
```
