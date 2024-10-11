"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2, Share2, EyeOff, Eye, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardLayout from '../components/DashboardLayout';

interface UserData {
  _id: string;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
}

interface SavedImage {
  _id: string;
  imageUrl: string;
  prompt: string;
  isPublic: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [visiblePrompts, setVisiblePrompts] = useState<{ [key: string]: boolean }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.id) {
      fetchUserData(session.user.id);
      fetchSavedImages(session.user.id);
    }
  }, [status, session, router]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    }
  };

  const fetchSavedImages = async (userId: string) => {
    try {
      const response = await fetch(`/api/images?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch saved images');
      }
      const data = await response.json();
      setSavedImages(data);
    } catch (err) {
      setError('Failed to load saved images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      setSavedImages(savedImages.filter(image => image._id !== imageId));
    } catch (err) {
      setError('Failed to delete image');
      console.error(err);
    }
  };

  const handleTogglePublic = async (imageId: string, isPublic: boolean) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (!response.ok) {
        throw new Error('Failed to update image visibility');
      }
      setSavedImages(savedImages.map(image => 
        image._id === imageId ? { ...image, isPublic: !isPublic } : image
      ));
    } catch (err) {
      setError('Failed to update image visibility');
      console.error(err);
    }
  };

  const togglePromptVisibility = (imageId: string) => {
    setVisiblePrompts(prev => ({ ...prev, [imageId]: !prev[imageId] }));
  };

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setDialogMessage('Prompt copied to clipboard!');
      setDialogOpen(true);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
      setDialogMessage('Failed to copy prompt');
      setDialogOpen(true);
    }
  };

  const content = (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">User Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : userData ? (
        <Card className="bg-gray-900 text-white mb-8 border border-gray-800">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userData.avatarUrl} alt={userData.username} />
              <AvatarFallback>{userData.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{userData.username}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Member since:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ) : (
        <p>No user data found</p>
      )}

      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Saved Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedImages.map((image) => (
          <Card key={image._id} className="bg-gray-900 text-white border border-gray-800">
            <CardContent className="p-4">
              <img src={image.imageUrl} alt={image.prompt} className="w-full h-48 object-cover rounded-lg mb-4" />
              <div className="flex justify-between items-center mb-2">
                <Button
                  onClick={() => togglePromptVisibility(image._id)}
                  variant="ghost"
                  size="sm"
                >
                  {visiblePrompts[image._id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {visiblePrompts[image._id] && (
                  <Button
                    onClick={() => copyPrompt(image.prompt)}
                    variant="ghost"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {visiblePrompts[image._id] && (
                <p className="text-sm mb-2">{image.prompt}</p>
              )}
              <div className="flex justify-between items-center">
                <Button onClick={() => handleDeleteImage(image._id)} variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button 
                  onClick={() => handleTogglePublic(image._id, image.isPublic)} 
                  className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${image.isPublic ? 'opacity-80' : ''}`}
                  size="sm"
                >
                  {image.isPublic ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Make Private
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Make Public
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Action Successful</DialogTitle>
          </DialogHeader>
          <p>{dialogMessage}</p>
        </DialogContent>
      </Dialog>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}
