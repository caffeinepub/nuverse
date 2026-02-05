import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserPortfolio } from '../hooks/useQueries';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';
import { Principal } from '@dfinity/principal';

interface AIRspacePageProps {
  onViewProfile: (principal: Principal) => void;
}

export default function AIRspacePage({ onViewProfile }: AIRspacePageProps) {
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal() || null;
  const { data: portfolio, isLoading } = useGetUserPortfolio(currentPrincipal);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const posts = portfolio?.posts || [];
  const sortedPosts = [...posts].sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">AIRspace Feed</h2>
        <p className="text-sm text-muted-foreground">Your personal content from the Nutech Universe</p>
      </div>

      {sortedPosts.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <PostCard 
              key={post.id.toString()} 
              post={post} 
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
