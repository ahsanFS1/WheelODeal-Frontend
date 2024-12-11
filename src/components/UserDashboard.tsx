import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { Button } from './ui/button';
import { Settings, Eye, LogOut, Save, Calendar } from 'lucide-react';
import { SpinningWheel } from './SpinningWheel';
import { TextInput } from './admin/shared/TextInput';
import { ImageUpload } from './admin/shared/ImageUpload';
import { Carousel } from './carousel/Carousel';
import { Toaster, toast } from 'sonner';
import { AnalyticsDashboard } from './analytics/AnalyticsDashboard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { api_Url } from '../config';
import { useParams } from 'react-router-dom'; // Import for accessing route parameters
import { VideoEditor } from './admin/editors/VideoEditor';



export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams(); // Access projectId from URL
  const [config, setConfig] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false); // Define showPreview state
  const [isFetching, setIsFetching] = useState(false);

  // Fetch configuration from the backend API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(`${api_Url}/api/public-page/${projectId}`); // Use projectId in API call
        const data = await response.json();
        if (data.success) {
          setConfig(data.data);
        } else {
          toast.error('Failed to fetch configuration.');
        }
        setIsFetching(false);
      } catch (error) {
        console.error('Error fetching configuration:', error);
        toast.error('Error fetching configuration.');
        setIsFetching(false);
      }
    };

    if (projectId) {
      fetchConfig();
    }
  }, [projectId]); // Re-fetch if projectId changes

  // Save configuration changes
  const handleSave = async () => {
    try {
      const response = await fetch(`${api_Url}/api/public-page/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Changes saved successfully!');
      } else {
        toast.error('Failed to save changes.');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Error saving configuration.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      navigate('/');
    }
  };

  if (isFetching) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!config) {
    return <div className="min-h-screen flex items-center justify-center text-white">Failed to load configuration.</div>;
  }

  return (
    <div className="min-h-screen bg-[#121218]">
      <Toaster position="top-center" />
      <header className="bg-[#1B1B21] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#D3D3DF] flex items-center gap-2">
            <Settings className="w-8 h-8 text-[#C33AFF]" />
            Project Configuration
          </h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#1B1B21] text-[#C33AFF] border border-[#C33AFF] hover:bg-[#C33AFF] hover:text-white transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 bg-[#1B1B21] border-[#C33AFF] text-[#C33AFF] hover:bg-[#C33AFF] hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs.Root defaultValue="general" className="space-y-8">
          <Tabs.List className="flex space-x-4 border-b border-[#C33AFF]/20">
            <Tabs.Trigger
              value="general"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              General Settings
            </Tabs.Trigger>
            <Tabs.Trigger
              value="carousel"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Carousel
            </Tabs.Trigger>
            <Tabs.Trigger value="video" className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF]">
              Video Settings
            </Tabs.Trigger>
            <Tabs.Trigger
              value="wheel"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Wheel Settings
            </Tabs.Trigger>
            <Tabs.Trigger
              value="preview"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Preview
            </Tabs.Trigger>
            <Tabs.Trigger
              value="analytics"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Analytics
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="general" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#D3D3DF]">Page Settings</h2>
                  <TextInput
                    label="Title"
                    value={config.headerTitle}
                    onChange={(value) => setConfig({ ...config, headerTitle: value })}
                  />
                  <TextInput
                    label="Subtitle"
                    value={config.subtitle}
                    onChange={(value) => setConfig({ ...config, subtitle: value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageUpload
                      label="Logo"
                      type="publicpage"
                      currentImage={config.logo}
                      onUpload={(url) => setConfig({ ...config, logo: url })}
                      recommendations={{
                        maxSize: '1MB',
                        dimensions: '200x200px',
                        format: 'PNG, SVG preferred',
                      }}
                    />
                    <ImageUpload
                      label="Background Image"
                      type="publicpage"
                      currentImage={config.backgroundImage}
                      onUpload={(url) => setConfig({ ...config, backgroundImage: url })}
                      recommendations={{
                        maxSize: '1MB',
                        dimensions: '1920x1080px',
                        format: 'JPG, PNG',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-[#D3D3DF]">Preview</h2>
                  <div className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4">
                    <a
                      href={config.backgroundImage}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="relative aspect-video overflow-hidden rounded-lg"
                      style={{
                        backgroundImage: `url(${config.backgroundImage})`,
                        filter: 'brightness(0.7)',
                      }}
                    >
                      <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-center">
                        <img
                          src={config.logo}
                          alt="Logo"
                          className="h-20 mb-6 object-contain"
                        />
                        <h1 className="text-4xl font-bold text-white mb-4">
                          {config.headerTitle}
                        </h1>
                        <p className="text-xl text-white/80">{config.subtitle}</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>
          
          <Tabs.Content value="carousel" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#D3D3DF]">Carousel Images</h2>
                  <ImageUpload
                    label="Add Image (Max 6)"
                    type = "carousel"
                    currentImage=""
                    onUpload={(url,alt) => {
                      if (!url) {
                        toast.error('Invalid image URL.');
                        return;
                      }
                      if (config.carouselImages.length >= 6) {
                        toast.error('Maximum 6 images allowed');
                        return;
                      }
                      setConfig({
                        ...config,
                        carouselImages: [...config.carouselImages,{ url,alt}], // Update carousel images
                      });
                    }}
                    recommendations={{
                      maxSize: '1MB',
                      dimensions: '1200x800px',
                      format: 'JPG, PNG',
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {config.carouselImages.map((image: {url: string, alt: string}, index: number) => (
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        key={index}
                        className="relative"
                      >
                        <img
                          src={image.url}
                          alt={`Carousel ${index + 1}`}
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                        <Button
                          onClick={() =>
                            setConfig({
                              ...config,
                              carouselImages: config.carouselImages.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          Remove
                        </Button>
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-[#D3D3DF]">Preview</h2>
                  <div className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4">
                    {config.carouselImages && config.carouselImages.length > 0 ? (
                      <Carousel
                      images={(config?.carouselImages || [])}
                      
                    />
                    
                    ) : (
                      <p className="text-[#D3D3DF] text-center">No images to display in preview.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>
          
          <Tabs.Content value="video" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#D3D3DF]">Video Settings</h2>
              <VideoEditor
                videoId={config.videoId || ''}
                onChange={(videoId) => setConfig({ ...config, videoId })}
              />
            </div>
          </Tabs.Content>          

          <Tabs.Content value="wheel" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#D3D3DF]">Wheel Settings</h2>
                  {config.prizes.map((prize, index) => (
                    <div
                      key={index}
                      className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4"
                    >
                      <TextInput
                        label="Prize Text"
                        value={prize.text}
                        onChange={(value) =>
                          setConfig({
                            ...config,
                            prizes: config.prizes.map((p, i) =>
                              i === index ? { ...p, text: value } : p
                            ),
                          })
                        }
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                            Color
                          </label>
                          <input
                            type="color"
                            value={prize.color}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                prizes: config.prizes.map((p, i) =>
                                  i === index ? { ...p, color: e.target.value } : p
                                ),
                              })
                            }
                            className="w-full h-10 px-1 py-1 bg-[#121218] border border-[#C33AFF]/20 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                            Probability (0-1)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={prize.probability}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                prizes: config.prizes.map((p, i) =>
                                  i === index
                                    ? { ...p, probability: parseFloat(e.target.value) }
                                    : p
                                ),
                              })
                            }
                            className="w-full px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#D3D3DF]">Preview</h2>
                    <Button
                      onClick={() => setShowPreview(!showPreview)}
                      variant="outline"
                      className="flex items-center gap-2 bg-[#1B1B21] border-[#C33AFF] text-[#C33AFF] hover:bg-[#C33AFF] hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                  </div>
                  {showPreview && (
                    <div className="relative">
                      <SpinningWheel
                        prizes={config.prizes}
                        onSpinEnd={() => {}}
                        disabled={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>







          <Tabs.Content value="preview" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <iframe
                src={`/wheel/${projectId}`}
                className="w-full h-[800px] rounded-lg border border-[#C33AFF]/20"
                title="Page Preview"
                target="_blank"
                rel="noopener noreferrer nofollow"
                sandbox="allow-scripts allow-same-origin"
                allowFullScreen
              />
            </div>
          </Tabs.Content>
          
          <Tabs.Content value="analytics" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <AnalyticsDashboard pageId={projectId || 'defaultPageId'} />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};
