import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Community() {
  const content = (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Community</h1>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Community Gallery</CardTitle>
          <CardDescription className="text-gray-400">Explore and share AI-generated images with the community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">Here you can display a gallery of community-generated images.</p>
          {/* Add community image gallery or feed here */}
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}
