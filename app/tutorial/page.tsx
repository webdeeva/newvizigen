import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Tutorial() {
  const content = (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Tutorial</h1>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">How to Use AI Image Generator</CardTitle>
          <CardDescription className="text-gray-400">Learn how to create amazing AI-generated images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">Here you can add step-by-step instructions on how to use the AI Image Generator.</p>
          {/* Add more tutorial content here */}
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}
