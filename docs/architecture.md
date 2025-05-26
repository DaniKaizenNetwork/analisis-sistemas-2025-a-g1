# 🏗 Arquitectura del Proyecto - Blog Project

## Diagramas UML

### 1. Diagrama de Clases 📊

```mermaid
classDiagram
    class Post {
        +number id
        +string title
        +string content
        +string? imageUrl
        +Date createdAt
        +Date updatedAt
    }

    class PostsService {
        -Repository<Post> postsRepository
        +create(CreatePostDto): Promise<Post>
        +findAll(): Promise<Post[]>
        +findOne(number): Promise<Post>
        +update(number, UpdatePostDto): Promise<Post>
        +remove(number): Promise<void>
    }

    class CreatePostDto {
        +string title
        +string content
        +string? imageUrl
        +string? createdAt
    }

    class UpdatePostDto {
        +string? title
        +string? content
        +string? imageUrl
        +string? createdAt
    }

    PostsService --> Post : manages
    CreatePostDto --> Post : creates
    UpdatePostDto --> Post : updates
```

### 2. Diagrama de Casos de Uso 👥

```mermaid
graph TD
    User((Usuario))
    ViewPosts[Ver Posts]
    CreatePost[Crear Post]
    UpdatePost[Actualizar Post]
    DeletePost[Eliminar Post]
    PreviewImage[Previsualizar Imagen]
    SetDate[Establecer Fecha]
    
    User --> ViewPosts
    User --> CreatePost
    User --> UpdatePost
    User --> DeletePost
    CreatePost --> PreviewImage
    CreatePost --> SetDate
    UpdatePost --> PreviewImage
    UpdatePost --> SetDate
```

### 3. Diagrama de Secuencia 🔄

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant S as PostsService

    %% Listar Posts
    U->>F: Accede a la aplicación
    F->>B: GET /posts
    B->>S: findAll()
    S-->>B: Lista de posts
    B-->>F: JSON response
    F-->>U: Muestra posts

    %% Crear Post
    U->>F: Crea nuevo post
    F->>B: POST /posts
    B->>S: create(CreatePostDto)
    S-->>B: Nuevo post
    B-->>F: JSON response
    F-->>U: Confirma creación

    %% Actualizar Post
    U->>F: Edita post existente
    F->>B: GET /posts/:id
    B->>S: findOne(id)
    S-->>B: Post existente
    B-->>F: JSON response
    F-->>U: Muestra formulario de edición
    U->>F: Envía cambios
    F->>B: PATCH /posts/:id
    B->>S: update(id, UpdatePostDto)
    S-->>B: Post actualizado
    B-->>F: JSON response
    F-->>U: Confirma actualización
```

### 4. Diagrama de Paquetes 📦

```mermaid
graph TD
    subgraph Frontend
        Next[Next.js App]
        Components[Components]
        Services[Services]
        Styles[Styles]
        Pages[Pages]
    end

    subgraph Backend
        Nest[NestJS App]
        Posts[Posts Module]
        DTOs[DTOs]
        Entities[Entities]
        Database[(PostgreSQL)]
    end

    Next --> Components
    Next --> Services
    Next --> Styles
    Next --> Pages
    Services --> Nest
    Nest --> Posts
    Posts --> DTOs
    Posts --> Entities
    Posts --> Database
```

## Modelo Relacional (MR) 💾

La aplicación utiliza PostgreSQL como base de datos, con la siguiente estructura:

```sql
CREATE TABLE posts (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    image_url   VARCHAR(512),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notas sobre el Modelo Relacional:
- `id`: Identificador único autoincremental
- `title`: Título del post, obligatorio
- `content`: Contenido del post, obligatorio
- `image_url`: URL de la imagen, opcional
- `created_at`: Fecha de creación con valor por defecto
- `updated_at`: Fecha de última actualización

## Notas Técnicas 📝

### Frontend (Next.js)
- Framework React con SSR
- Componentes modulares
- Gestión de estado local con React Hooks
- Servicios API centralizados
- Estilos CSS modernos
- Manejo de rutas dinámicas
- Validación de formularios
- Vista previa de imágenes
- Gestión de fechas personalizadas

### Backend (NestJS)
- Arquitectura modular
- Servicios RESTful
- DTOs para validación
- Entidades TypeORM
- Manejo de errores centralizado
- Conexión a PostgreSQL
- Migraciones automáticas
- Validación de datos

### Comunicación
- API REST
- JSON como formato de datos
- Validación en ambos extremos
- Manejo de errores robusto
- CORS configurado
- Endpoints seguros

### Base de Datos
- PostgreSQL 17.2
- TypeORM para ORM
- Migraciones automáticas
- Índices optimizados
- Relaciones definidas
- Timestamps automáticos