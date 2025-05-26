// app/page.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPosts, Post as PostType, deletePost } from '../services/apiService';
import Image from 'next/image';
// Para App Router, el Layout principal está en app/layout.tsx
// Si quieres un layout específico para esta página o sección, puedes crearlo e importarlo.
// Por ahora, usaremos el RootLayout implícitamente.
// Si creaste el componente Layout en components/Layout.tsx, puedes envolver el contenido aquí también.
// import Layout from '../components/Layout'; // Descomentar si quieres usar el mismo Layout

export default function HomePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

   const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        await deletePost(id);
        fetchPosts();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error al eliminar');
      }
    }
  };

  // Si usas el componente Layout, envuelve el return: <Layout pageTitle="Inicio">...</Layout>
  return (
    // Si no usas el Layout aquí, el contenedor se aplica desde globals.css
    // o el RootLayout ya tiene un <main className="container">
    // Por simplicidad, asumimos que el RootLayout ya maneja el contenedor principal.
    // O puedes añadir <div className="container"> aquí si tu RootLayout es mínimo.
    <div className="container"> {/* Añadido para centrar */}
        <div className="page-header">
            <h1>Blog</h1>
            <Link href="/posts/new" className="button">
                ✍️ Nueva Entrada
            </Link>
        </div>

        {loading && <div className="loading"><p>Cargando entradas...</p></div>}
        {error && (
            <div className="error-container">
                <p className="error-message">Error: {error}</p>
                <button onClick={fetchPosts} className="button">
                    Intentar de nuevo
                </button>
            </div>
        )}

        {!loading && !error && posts.length === 0 && (
            <div className="empty-state">
                <p>No hay entradas todavía.</p>
                <Link href="/posts/new" className="button">
                    ¡Crea tu primera entrada!
                </Link>
            </div>
        )}

        {!loading && !error && posts.length > 0 && (
            <div className="posts-grid">
            {posts.map((post) => (
                <article key={post.id} className="post-item">
                {post.imageUrl && (
                    <div className="post-image">
                    <img src={post.imageUrl} alt={post.title} />
                    </div>
                )}
                <div className="post-content">
                    <h2>
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p>{post.content.substring(0, 150)}...</p>
                    <div className="post-meta">
                    <small>
                        Publicado: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                    </small>
                    <button onClick={() => handleDelete(post.id)} className="button-danger">
                        Eliminar
                    </button>
                    </div>
                </div>
                </article>
            ))}
            </div>
        )}
    </div>
  );
}