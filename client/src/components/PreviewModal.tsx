import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterData: any;
  isLoading: boolean;
  onCreateAnother: () => void;
}

export default function PreviewModal({
  isOpen,
  onClose,
  posterData,
  isLoading,
  onCreateAnother
}: PreviewModalProps) {
  const handleDownload = (format: 'png' | 'jpg', url: string) => {
    if (url.startsWith('data:image/svg+xml')) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `poster.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, `image/${format}`);
      };
      img.src = url;
      return;
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = `poster.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-8">
        {isLoading || posterData?.status === 'processing' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="text-white h-8 w-8 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Creating Your Poster</h3>
            <p className="text-gray-600 mb-8">Our AI is working its magic...</p>
            
            <div className="space-y-4 max-w-md mx-auto">
              {[
                { label: 'Extracting content', status: 'completed' },
                { label: 'Generating text', status: 'processing' },
                { label: 'Creating design', status: 'pending' },
                { label: 'Rendering poster', status: 'pending' }
              ].map((step, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{step.label}</span>
                  {step.status === 'completed' && (
                    <Badge variant="default" className="bg-green-500">✓</Badge>
                  )}
                  {step.status === 'processing' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {step.status === 'pending' && (
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : posterData?.status === 'failed' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">✕</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Generation Failed</h3>
            <p className="text-gray-600 mb-8">{posterData.errorMessage || 'Something went wrong. Please try again.'}</p>
            <Button onClick={onCreateAnother} className="bg-primary hover:bg-primary/90">
              Try Again
            </Button>
          </div>
        ) : posterData?.status === 'completed' ? (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Poster is Ready!</h3>
              <p className="text-gray-600">Preview and download your AI-generated poster</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Poster Preview */}
              <div className="lg:w-1/2">
                {posterData.posterUrls && posterData.posterUrls.length > 0 ? (
                  <div className="space-y-4">
                    {posterData.posterUrls.map((url: string, index: number) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Poster ${index + 1}`}
                        className="w-full rounded-xl shadow-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white aspect-square">
                    <h2 className="text-3xl font-bold mb-4">Sample Poster</h2>
                    <p className="text-lg mb-6">Your AI-generated content will appear here</p>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <span className="mr-3">•</span>
                        Professional design
                      </li>
                      <li className="flex items-center">
                        <span className="mr-3">•</span>
                        AI-generated content
                      </li>
                      <li className="flex items-center">
                        <span className="mr-3">•</span>
                        Ready to share
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Download Options */}
              <div className="lg:w-1/2">
                <div className="space-y-6">
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Poster Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Style:</span>
                          <Badge variant="outline">{posterData.style}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <Badge variant="outline">{posterData.outputFormat}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <Badge variant="outline">{posterData.contentType}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pages:</span>
                          <Badge variant="outline">{posterData.posterUrls?.length || 1}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-4">
                    {posterData.posterUrls?.map((url: string, index: number) => (
                      <div key={index} className="space-y-2">
                        <h5 className="font-medium text-gray-700">Page {index + 1}</h5>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleDownload('png', url)}
                            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PNG
                          </Button>
                          <Button
                            onClick={() => handleDownload('jpg', url)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download JPG
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      onClick={onCreateAnother}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Create Another
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
