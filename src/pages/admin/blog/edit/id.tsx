import { useParams } from 'react-router-dom';
import BlogForm from '../BlogForm';

export default function BlogEdit() {
  const { id } = useParams();
  
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 gap-6">
      {!id ? (
        <div className="p-8 text-center text-zinc-400">Post no encontrado</div>
      ) : (
        <BlogForm />
      )}
    </div>
  );
} 