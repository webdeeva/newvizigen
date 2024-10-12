"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Copy, Heart, Flame } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ImageDetailsPanel from '../components/ImageDetailsPanel';

interface Image {
  _id: string;
  imageUrl: string;
  prompt: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
  favorites: number;
}

type FilterType = 'hot' | 'all' | 'newest';

export default function CommunityPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visiblePrompts, setVisiblePrompts] = useState<{ [key: string]: boolean }>({});
  const [copiedPrompt, setCopiedPrompt] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('hot');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    fetchPublicImages();
  }, [filter]);

  const fetchPublicImages = async () => {
    try {
      const response = await fetch(`/api/images/public?filter=${filter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch public images');
      }
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError('Failed to load public images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePrompt = (imageId: string) => {
    setVisiblePrompts(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedPrompt(prompt);
      setIsDialogOpen(true);
    }).catch(err => {
      console.error('Failed to copy prompt: ', err);
    });
  };

  const handleFavorite = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}/favorite`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to favorite image');
      }
      // Update the image's favorite count in the local state
      setImages(prevImages => 
        prevImages.map(img => 
          img._id === imageId ? { ...img, favorites: img.favorites + 1 } : img
        )
      );
    } catch (err) {
      console.error('Failed to favorite image:', err);
    }
  };

  const filterButtons = [
    { type: 'hot', icon: Flame, label: 'Hot' },
    { type: 'all', icon: FileText, label: 'All' },
    { type: 'newest', icon: Copy, label: 'Newest' },
  ] as const;

  const content = (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Community Gallery</h1>
      
      <div className="mb-6 flex justify-center space-x-4">
        {filterButtons.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            onClick={() => setFilter(type)}
            className={`flex items-center ${filter === type ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-800'}`}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Loading images...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image._id} className="bg-gray-800 text-white border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{image.username}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFavorite(image._id)}
                      className="text-gray-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-600 hover:text-white transition-all duration-300"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{image.favorites}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePrompt(image._id)}
                      className="text-gray-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-600 hover:text-white transition-all duration-300"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img 
                    src={image.imageUrl} 
                    alt="Generated" 
                    className="w-full h-48 object-cover rounded-lg mb-2 cursor-pointer" 
                    onClick={() => setSelectedImage(image)}
                  />
                </div>
                {visiblePrompts[image._id] && (
                  <div className="text-sm mt-2 p-2 bg-gray-800 rounded flex justify-between items-center">
                    <p className="flex-grow mr-2">{image.prompt}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPrompt(image.prompt)}
                      className="text-gray-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-600 hover:text-white transition-all duration-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-sm mt-2">Created: {new Date(image.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prompt Copied!</DialogTitle>
          </DialogHeader>
          <p>The following prompt has been copied to your clipboard:</p>
          <p className="bg-gray-700 p-2 rounded mt-2 text-white">{copiedPrompt}</p>
        </DialogContent>
      </Dialog>
      {selectedImage && (
        <ImageDetailsPanel
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}
