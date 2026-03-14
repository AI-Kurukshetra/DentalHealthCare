import { blogFallback } from '../../lib/content';
import { SectionHeading } from '../../components/SectionHeading';
import { supabaseServer } from '../../lib/supabaseServer';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.from('posts').select('id,title,excerpt,tag').order('created_at', {
      ascending: false
    });

    if (error || !data) return blogFallback;
    return data as BlogPost[];
  } catch {
    return blogFallback;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const list = posts.length ? posts : blogFallback;

  return (
    <main>
      <section className="section section-alt">
        <SectionHeading
          eyebrow="Blog"
          title="Insights for modern dental operations"
          subtitle="Fresh clinical and operational guidance, synced from your Supabase CMS."
        />
        <div className="blog-grid">
          {list.map((post) => (
            <article key={post.id} className="blog-card">
              <span className="tag">{post.tag}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
