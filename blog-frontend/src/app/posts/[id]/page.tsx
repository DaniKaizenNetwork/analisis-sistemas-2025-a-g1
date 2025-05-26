// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '../../../services/apiService';
import type { Post as PostType } from '../../../services/apiService';

interface PostPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PostPageProps) {
  const postId = parseInt(params.id, 10);
  if (isNaN(postId)) return { title: 'ID inválido | Mi Blog' };

  try {
    const post = await getPostById(postId);
    return { title: `${post.title} | Mi Blog` };
  } catch {
    return { title: 'Entrada no encontrada | Mi Blog' };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const postId = parseInt(params.id, 10);

  if (isNaN(postId)) {
    notFound(); // Redirige automáticamente a /404
  }

  let post: PostType | null = null;

  try {
    post = await getPostById(postId);
  } catch {
    notFound(); // Lanza 404 directamente sin declarar 'err'
  }

  if (!post) return notFound();

  return (
    <div className="container">
      <div className="page-header">
        <h1>{post.title}</h1>
        <div className="button-group">
          <Link href={`/posts/${postId}/edit`} className="button">
            Editar
          </Link>
          <Link href="/" className="button button-secondary">
            ← Volver al listado
          </Link>
        </div>
      </div>
      <article className="post-detail-content">
        {post.imageUrl && (
          <div className="post-image">
            <img src={post.imageUrl} alt={post.title} />
          </div>
        )}
        <p>{post.content}</p>
        <div className="post-metadata">
          <small>Creado: {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'N/A'}</small>
          <small>Actualizado: {post.updatedAt ? new Date(post.updatedAt).toLocaleString() : 'N/A'}</small>
        </div>
      </article>
    </div>
  );
}
