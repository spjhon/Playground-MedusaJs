# Validacion

Aquí tienes un resumen estructurado de la documentación sobre validación de parámetros en rutas API personalizadas con MedusaJS:

---

## 📌 **Resumen: Validación de Cuerpo de Petición y Parámetros de Consulta en MedusaJS**

### **📍 Introducción**

Este capítulo explica cómo validar el cuerpo de la petición y los parámetros de consulta en rutas API personalizadas en MedusaJS utilizando **Zod** y los middlewares integrados de Medusa.

### **✅ Middlewares de Validación**

Medusa proporciona dos middlewares para validar los datos de entrada en las rutas API:

1. **`validateAndTransformBody`** → Valida el **cuerpo** de la petición.
2. **`validateAndTransformQuery`** → Valida los **parámetros de consulta**.

Ambos utilizan esquemas definidos con **Zod**.

---

## **🛠️ Validación del Cuerpo de la Petición**

### **📌 Paso 1: Crear el Esquema de Validación**

Crear un archivo `validators.ts` en la ruta `src/api/custom/`:

```ts
import { z } from "zod"

export const PostStoreCustomSchema = z.object({
  a: z.number(),
  b: z.number(),
})
```
📌 **Reglas de validación:**

- `a` y `b` son **números obligatorios** dentro de un objeto.

---

### **📌 Paso 2: Aplicar Middleware de Validación**

En `src/api/middlewares.ts`, agregar el middleware de validación:

```ts
import { 
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PostStoreCustomSchema } from "./custom/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/custom",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostStoreCustomSchema),
      ],
    },
  ],
})
```

🔹 **Si la validación falla**, se lanza un error con detalles del problema.  
🔹 **Si es válida**, los datos se almacenan en `req.validatedBody`.

---

### **📌 Paso 3: Usar los Datos Validados en la Ruta API**

En `src/api/custom/route.ts`:

```ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { PostStoreCustomSchema } from "./validators"

type PostStoreCustomSchemaType = z.infer<typeof PostStoreCustomSchema>

export const POST = async (
  req: MedusaRequest<PostStoreCustomSchemaType>,
  res: MedusaResponse
) => {
  res.json({
    sum: req.validatedBody.a + req.validatedBody.b,
  })
}
```

✅ **Accede a los datos validados** con `req.validatedBody`.  
✅ **Ejemplo de respuesta en caso de error** (si falta `a`):

```json
{
  "type": "invalid_data",
  "message": "Invalid request: Field 'a' is required"
}
```

---

## **🔎 Validación de Parámetros de Consulta**

### **📌 Paso 1: Crear el Esquema de Validación**

Como los parámetros de consulta son **cadenas de texto**, usamos `preprocess` en `validators.ts`:

```ts
import { z } from "zod"

export const PostStoreCustomSchema = z.object({
  a: z.preprocess(
      (val) => (val && typeof val === "string") ? parseInt(val) : val,
      z.number()
  ),
  b: z.preprocess(
      (val) => (val && typeof val === "string") ? parseInt(val) : val,
      z.number()
  ),
})
```

📌 **Convierte los valores de `a` y `b` a enteros antes de validarlos**.

---

### **📌 Paso 2: Aplicar Middleware de Validación**

En `src/api/middlewares.ts`:

```ts
import { 
  validateAndTransformQuery,
  defineMiddlewares,
} from "@medusajs/framework/http"
import { PostStoreCustomSchema } from "./custom/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/custom",
      method: "POST",
      middlewares: [
        validateAndTransformQuery(PostStoreCustomSchema, {}),
      ],
    },
  ],
})
```

🔹 **Si la validación falla**, se lanza un error con detalles.  
🔹 **Si es válida**, los datos se almacenan en `req.validatedQuery`.

---

### **📌 Paso 3: Usar los Parámetros Validados en la Ruta API**

En `src/api/custom/route.ts`:

```ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const a = req.validatedQuery.a as number
  const b = req.validatedQuery.b as number

  res.json({
    sum: a + b,
  })
}
```

✅ **Accede a los parámetros validados** con `req.validatedQuery`.  
✅ **Ejemplo de respuesta en caso de error** (si falta `a`):

```json
{
  "type": "invalid_data",
  "message": "Invalid request: Field 'a' is required"
}
```

---

## **📚 Más Información**

Para más ejemplos de validación con **Zod**, consulta su [documentación oficial](https://zod.dev/).

---

¿Este resumen te sirve? 🚀
