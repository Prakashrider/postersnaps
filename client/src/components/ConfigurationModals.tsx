import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, BookOpen, Quote, List, Flame, Lightbulb, Info, Square, Smartphone, Monitor } from 'lucide-react';

interface ConfigurationModalsProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  config: {
    style: 'narrative' | 'quote' | 'pointers';
    contentType: 'trending' | 'awareness' | 'informative';
    outputFormat: 'square' | 'portrait' | 'story';
    minPages: number;
    maxPages: number;
  };
  setConfig: (config: any) => void;
}

export default function ConfigurationModals({
  isOpen,
  onClose,
  onComplete,
  config,
  setConfig
}: ConfigurationModalsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(config);

  // Update selectedOptions when config changes
  useEffect(() => {
    setSelectedOptions(config);
  }, [config]);

  // Reset currentStep when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const steps = [
    {
      title: "Choose Your Poster Style",
      description: "Select the style that best fits your content",
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              key: 'narrative',
              icon: BookOpen,
              title: 'Narrative',
              description: 'Perfect for storytelling and educational content with flowing text',
              gradient: 'from-blue-500 to-purple-600'
            },
            {
              key: 'quote',
              icon: Quote,
              title: 'Quote',
              description: 'Highlight powerful quotes and key messages with bold typography',
              gradient: 'from-pink-500 to-red-500'
            },
            {
              key: 'pointers',
              icon: List,
              title: 'Pointers',
              description: 'Organize information with clear bullet points and structured layout',
              gradient: 'from-green-500 to-teal-500'
            }
          ].map((option) => (
            <Card
              key={option.key}
              className={`cursor-pointer transition-all border-2 group hover:border-primary ${
                selectedOptions.style === option.key ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => setSelectedOptions({ ...selectedOptions, style: option.key as any })}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${option.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <option.icon className="text-white h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{option.title}</h4>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      title: "Content Type",
      description: "What type of content are you creating?",
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              key: 'trending',
              icon: Flame,
              title: 'Trending',
              description: 'Hot topics and viral content',
              gradient: 'from-orange-500 to-red-500'
            },
            {
              key: 'awareness',
              icon: Lightbulb,
              title: 'Awareness',
              description: 'Educational and awareness content',
              gradient: 'from-yellow-500 to-orange-500'
            },
            {
              key: 'informative',
              icon: Info,
              title: 'Informative',
              description: 'Detailed information and tutorials',
              gradient: 'from-blue-500 to-indigo-500'
            }
          ].map((option) => (
            <Card
              key={option.key}
              className={`cursor-pointer transition-all border-2 group hover:border-primary ${
                selectedOptions.contentType === option.key ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => setSelectedOptions({ ...selectedOptions, contentType: option.key as any })}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${option.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <option.icon className="text-white h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{option.title}</h4>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      title: "Page Count",
      description: "How many pages do you want in your poster series?",
      content: (
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <Label className="text-gray-700 font-medium">Minimum Pages</Label>
              <span className="text-2xl font-bold text-primary">{selectedOptions.minPages}</span>
            </div>
            <Slider
              value={[selectedOptions.minPages]}
              onValueChange={(value) => setSelectedOptions({ ...selectedOptions, minPages: value[0] })}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <Label className="text-gray-700 font-medium">Maximum Pages</Label>
              <span className="text-2xl font-bold text-primary">{selectedOptions.maxPages}</span>
            </div>
            <Slider
              value={[selectedOptions.maxPages]}
              onValueChange={(value) => setSelectedOptions({ ...selectedOptions, maxPages: value[0] })}
              max={5}
              min={selectedOptions.minPages}
              step={1}
              className="w-full"
            />
          </div>
          
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-800 mb-2">Selected Range</h4>
              <p className="text-gray-600">
                AI will generate between <span className="font-bold text-primary">{selectedOptions.minPages}-{selectedOptions.maxPages} pages</span> based on your content
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "Output Format",
      description: "Choose the dimensions for your poster",
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              key: 'square',
              icon: Square,
              title: 'Square',
              ratio: '1:1 Ratio',
              description: 'Perfect for Instagram posts',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              key: 'portrait',
              icon: Smartphone,
              title: 'Portrait',
              ratio: '4:5 Ratio',
              description: 'Great for Instagram posts',
              gradient: 'from-green-500 to-teal-500'
            },
            {
              key: 'story',
              icon: Monitor,
              title: 'Story',
              ratio: '9:16 Ratio',
              description: 'Perfect for Instagram stories',
              gradient: 'from-blue-500 to-indigo-500'
            }
          ].map((option) => (
            <Card
              key={option.key}
              className={`cursor-pointer transition-all border-2 group hover:border-primary ${
                selectedOptions.outputFormat === option.key ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => setSelectedOptions({ ...selectedOptions, outputFormat: option.key as any })}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${option.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <option.icon className="text-white h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{option.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{option.ratio}</p>
                <p className="text-gray-500 text-xs">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setConfig(selectedOptions);
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{steps[currentStep].title}</h3>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </div>

        <div className="mb-8">
          {steps[currentStep].content}
        </div>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex items-center"
          >
            {currentStep === steps.length - 1 ? 'Generate Poster' : 'Next Step'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
