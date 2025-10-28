import { haalFlexpool } from '@/app/lib/actions/flexpool.actions';
import { currentUser } from '@clerk/nextjs/server';
import { AuthorisatieCheck } from '@/app/[lang]/dashboard/AuthorisatieCheck';

interface DebugPageProps {
  params: Promise<{ id: string }>;
}

export default async function DebugFlexpoolPage({ params }: DebugPageProps) {
  const { id } = await params;
  const user = await currentUser();
  
  try {
    // Check if flexpool exists
    const flexpool = await haalFlexpool(id);
    
    // Check authorization
    const isAuthorized = await AuthorisatieCheck(id, 6);
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Flexpool Debug Info</h1>
        <div className="space-y-4">
          <div>
            <strong>Flexpool ID:</strong> {id}
          </div>
          <div>
            <strong>User ID:</strong> {user?.id || 'Not logged in'}
          </div>
          <div>
            <strong>Flexpool exists:</strong> {flexpool ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Authorization:</strong> {isAuthorized ? 'Authorized' : 'Not authorized'}
          </div>
          {flexpool && (
            <div>
              <strong>Flexpool owner:</strong> {flexpool.employer?.toString()}
            </div>
          )}
          <div>
            <strong>Raw flexpool data:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(flexpool, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Flexpool Debug Error</h1>
        <div className="space-y-4">
          <div>
            <strong>Flexpool ID:</strong> {id}
          </div>
          <div>
            <strong>User ID:</strong> {user?.id || 'Not logged in'}
          </div>
          <div>
            <strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }
}
