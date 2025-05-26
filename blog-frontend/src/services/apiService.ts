// src/services/apiService.ts
const API_BASE_URL = 'http://localhost:3001'; // URL de tu backend NestJS

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: string; // Las fechas pueden venir como strings ISO
  updatedAt?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export const getPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Error al obtener las entradas');
  }
  return response.json();
};

export const getPostById = async (id: number): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener la entrada ${id}`);
  }
  return response.json();
};

export const createPost = async (postData: CreatePostDto): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error creating post:', errorData);
    throw new Error(errorData.message || 'Error al crear la entrada');
  }
  return response.json();
};

export const updatePost = async (id: number, postData: UpdatePostDto): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error updating post:', errorData);
    throw new Error(errorData.message || `Error al actualizar la entrada ${id}`);
  }
  return response.json();
};

export const deletePost = async (id: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error al eliminar la entrada ${id}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return { message: 'Post deleted successfully' };
};

// Puedes añadir updatePost de manera similar si lo necesitas
// export const updatePost = async (id: number, postData: Partial<CreatePostDto>): Promise<Post> => { ... }