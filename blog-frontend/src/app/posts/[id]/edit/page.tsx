"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPostById, updatePost, UpdatePostDto } from '../../../../services/apiService';
import Link from 'next/link';
import { use } from 'react';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(false);
  const router = useRouter();
  const postId = parseInt(resolvedParams.id, 10);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await getPostById(postId);
        setTitle(post.title);
        setContent(post.content);
        setImageUrl(post.imageUrl || '');
        setCreatedAt(post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : '');
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el post');
        setLoading(false);
      }
    };

    if (!isNaN(postId)) {
      loadPost();
    }
  }, [postId]);

  const validateImageUrl = (url: string) => {
    if (!url) return true;
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

    const postData: UpdatePostDto = {
      title: title.trim(),
      content: content.trim(),
      ...(imageUrl && { imageUrl: imageUrl.trim() }),
      ...(createdAt && { createdAt })
    };

    try {
      await updatePost(postId, postData);
      router.push(`/posts/${postId}`);
    } catch (err) {
      const apiError = err as any;
      setError(apiError?.message || (err instanceof Error ? err.message : 'Error al actualizar la entrada.'));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Editar Entrada</h1>
        <Link href={`/posts/${postId}`} className="button button-secondary">Cancelar</Link>
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
          <label htmlFor="createdAt">Fecha de publicación:</label>
          <input
            type="date"
            id="createdAt"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
          />
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
          {submitting ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
} 