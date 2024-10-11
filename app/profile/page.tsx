import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Profile() {
  const content = (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">User Profile</h1>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Your Generated Images</CardTitle>
          <CardDescription className="text-gray-400">View and manage your saved images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">Here you can display the user's saved images and provide options to manage them.</p>
          {/* Add user's saved images gallery here */}
          {/* Add options to delete, share, or make images private */}
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}
