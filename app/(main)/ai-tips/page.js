import AITipsComponent from '@/components/ai-tips';
import { checkUser } from '@/lib/checkUser';

export default async function AITipsPage() {
  const user = await checkUser();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Financial Tips</h1>
      <AITipsComponent userProfile={user} />
    </div>
  );
}