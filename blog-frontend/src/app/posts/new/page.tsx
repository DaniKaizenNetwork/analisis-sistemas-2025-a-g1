// app/posts/new/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, CreatePostDto } from '../../../services/apiService';
// import Layout from '../../../components/Layout'; // Opcional, si lo adaptas
import Link from 'next/link';


export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);
  const router = useRouter();

  const validateImageUrl = (url: string) => {
    if (!url) return true; // URL vacía es válida
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!title.trim() || !content.trim()) {
      setError('El título y el contenido son obligatorios.');
      setSubmitting(false);
      return;
    }

    if (imageUrl && !validateImageUrl(imageUrl)) {
      setError('La URL de la imagen no es válida');
      setSubmitting(false);
      return;
    }

    const postData: CreatePostDto = {
      title: title.trim(),
      content: content.trim(),
      ...(imageUrl && { imageUrl: imageUrl.trim() }),
      ...(createdAt && { createdAt })
    };

    try {
      await createPost(postData);
      router.push('/');
    } catch (err) {
      const apiError = err as any;
      setError(apiError?.message || (err instanceof Error ? err.message : 'Error al crear la entrada.'));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Si usas el componente Layout: <Layout pageTitle="Crear Nueva Entrada">...</Layout>
  return (
    <div className="container"> {/* Añadido para centrar */}
      <div className="page-header">
        <h1>Crear Nueva Entrada</h1>
        <Link href="/" className="button button-secondary">Cancelar</Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">URL de la imagen (opcional):</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {imageUrl && (
            <div className="image-preview-controls">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setPreviewImage(!previewImage)}
              >
                {previewImage ? 'Ocultar vista previa' : 'Mostrar vista previa'}
              </button>
            </div>
          )}
          {previewImage && imageUrl && (
            <div className="image-preview">
              <img
                src={imageUrl}
                alt="Vista previa"
                onError={() => {
                  setError('No se pudo cargar la imagen. Verifica la URL.');
                  setPreviewImage(false);
                }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="createdAt">Fecha de publicación (opcional):</label>
          <input
            type="date"
            id="createdAt"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            max={getCurrentDate()}
          />
          <small className="form-help">Si no seleccionas una fecha, se usará la fecha actual.</small>
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenido:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear Entrada'}
        </button>
      </form>
    </div>
  );
}