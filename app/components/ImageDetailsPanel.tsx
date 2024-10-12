import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface ImageDetailsPanelProps {
  image: {
    _id: string;
    imageUrl: string;
    prompt: string;
    username: string;
    avatarUrl?: string;
  };
  onClose: () => void;
}

const ImageDetailsPanel: React.FC<ImageDetailsPanelProps> = ({ image, onClose }) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixError, setRemixError] = useState<string | null>(null);

  const handleRemix = async () => {
    setIsRemixing(true);
    setRemixError(null);
    try {
      const response = await fetch('/api/magic-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: image.prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to remix prompt');
      }

      const data = await response.json();
      const remixedPrompt = data.enhancedPrompt;

      // Navigate to generate page with the remixed prompt
      router.push(`/generate?prompt=${encodeURIComponent(remixedPrompt)}`);
    } catch (error) {
      console.error('Error remixing prompt:', error);
      setRemixError('Failed to remix prompt. Please try again.');
    } finally {
      setIsRemixing(false);
    }
  };

  const handleDownload = async () => {
    setIsConverting(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.imageUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `image-${image._id}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
            setIsConverting(false);
          }, 'image/png');
        }
      }
    };
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-gray-900 text-white p-6 overflow-y-auto z-50 w-full md:w-1/3 transition-all duration-300 ease-in-out">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        aria-label="Close panel"
      >
        <X size={24} />
      </button>
      <div className="max-w-3xl mx-auto md:mx-0">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={image.avatarUrl} alt={image.username} />
            <AvatarFallback>{image.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{image.username}</h2>
        </div>
        <img src={image.imageUrl} alt="Generated" className="w-full rounded-lg mb-4" />
        <p className="mb-4">{image.prompt}</p>
        <Button 
          onClick={handleRemix} 
          disabled={isRemixing}
          className="w-full mb-2 bg-gradient-to-r from-purple-500 to-pink-500"
        >
          {isRemixing ? 'Remixing...' : 'Remix Prompt'}
        </Button>
        {remixError && <p className="text-red-500 mb-2">{remixError}</p>}
        <Button onClick={handleDownload} disabled={isConverting} className="w-full bg-gray-700">
          {isConverting ? 'Converting to PNG...' : 'Download as PNG'}
        </Button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageDetailsPanel;
