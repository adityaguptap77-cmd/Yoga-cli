import { notFound } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id) || id < 1) notFound();
  return <BlogEditor id={id} />;
}
