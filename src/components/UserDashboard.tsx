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
import { api_Url, web_Url } from '../config';
import { useParams } from 'react-router-dom'; // Import for accessing route parameters
import { VideoEditor } from './admin/editors/VideoEditor';
import { Select, SelectItem } from './ui/select'; // Example dropdown component
import { ColorPicker } from './admin/shared/ColorPicker';
import TiptapEditor from './admin/shared/TiptapEditor';


export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  interface PublicPage {
    publicPageId: string;
    publicPageName: string;
    [key: string]: any; // Include other properties if applicable
  }
  
  const [publicPages, setPublicPages] = useState<PublicPage[]>([]);
  
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const [remainingPages, setRemainingPages] = useState(0);
  const [newPageName, setNewPageName] = useState('');
  const [showPreview, setShowPreview] = useState(null);
  useEffect(() => {
    const fetchPublicPages = async () => {
      try {
        setIsFetching(true);
        const [pagesResponse, planResponse] = await Promise.all([
          fetch(`${api_Url}/api/public-page/${projectId}`),
          fetch(`${api_Url}/api/admin/SPkeys/${projectId}`),
        ]);

        const pagesData = await pagesResponse.json();
        const planData = await planResponse.json();

        if (pagesData.success) {
          setPublicPages(pagesData.data);
          setSelectedPage(pagesData.data[0] || null);
        }

        if (planData.success) {
          
          setPlanDetails(planData.data[0]);
          setRemainingPages(planData.data[0].remainingPages);
        }

        setIsFetching(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data.');
        setIsFetching(false);
      }
    };

    if (projectId) fetchPublicPages();
  }, [projectId]);
  const handlePageSelection = (pageId: string) => {
    const selected = publicPages.find((page) => page.publicPageId === pageId);
    if (selected) {
      setSelectedPage(selected);
    } else {
      console.error('Page not found for the given ID:', pageId);
      setSelectedPage(null); // Set to null if no matching page is found
    }
  };
  

  const handleCreatePage = async () => {
    if (remainingPages <= 0 || !newPageName.trim()) {
      toast.error('Cannot create a page. Please check remaining pages and enter a name.');
      return;
    }

    try {
      const response = await fetch(`${api_Url}/api/public-page/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, publicPageName: newPageName }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Public page created successfully!');
        setPublicPages([...publicPages, data.data]);
        setRemainingPages(remainingPages - 1);
        setSelectedPage(data.data);
        setNewPageName('');
      } else {
        toast.error('Failed to create a public page.');
      }
    } catch (error) {
      console.error('Error creating a public page:', error);
      toast.error('Error creating a public page.');
    }
  };
  const handleSave = async () => {
    if (!selectedPage) {
      toast.error('No public page selected to save changes.');
      return;
    }
  
    // Optimistically update the publicPages state
    setPublicPages((prev) =>
      prev.map((page) =>
        page.publicPageId === selectedPage.publicPageId ? { ...page, ...selectedPage } : page
      )
    );
    toast('Saving changes...', { icon: '⏳' });
  
    try {
      const response = await fetch(`${api_Url}/api/public-page/${selectedPage.publicPageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPage),
      });
  
      const data = await response.json();
  
      if (data.success) {
        toast.success('Changes saved successfully!');
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving public page:', error);
      toast.error('Failed to save changes.');
    }
  };
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      navigate('/');
    }
  };


  
  if (!publicPages.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-purple-200 space-y-4 bg-[#121218]">
        <h1 className="text-2xl font-semibold">Welcome To Your Projects - You have 0/{planDetails?.remainingPages} projects created - Create your first project!</h1>
        <div className="space-y-4">
          <TextInput
            label="Enter a Name for Your First Page"
            value={newPageName}
            onChange={(value) => setNewPageName(value)}
          />
          <Button
            onClick={handleCreatePage}
            disabled={!newPageName.trim()}
            className={`px-4 py-2 rounded-lg ${
              newPageName.trim()
                ? "bg-purple-700 text-white hover:bg-purple-900"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create Your First Public Page
          </Button>
        </div>
      </div>
    );
  }
  
  const formattedDate = new Date(planDetails?.expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isFetching) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#121218] overflow-x-hidden">
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
              className="flex items-center gap-2 bg-[#1B1B21] text-[#C33AFF] border border-[#C33AFF] hover:bg-[#C33AFF] hover:text-purple-900 transition-all duration-200"
            >
              Save Changes
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 bg-[#1B1B21] border-[#C33AFF] text-[#C33AFF] hover:bg-[#C33AFF] hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 mb-6">
        <div className="bg-[#1B1B21] rounded-lg shadow-md p-6 text-white space-y-4">
  <h2 className="text-2xl font-bold text-[#C33AFF]">Plan Details</h2>
  <div className="space-y-2">
    <p className="text-lg font-bold">
      <span className="font-bold text-[#A22BD9]">Plan:</span> {planDetails?.plan || 'N/A'}
    </p>
    <p className="text-lg font-bold">
      <span className="font-semibold text-[#A22BD9]">Remaining Pages:</span> {remainingPages}
    </p>
    <p className="text-lg">
      <span className="font-semibold text-[#A22BD9]">Public Page Link:</span>{' '}
      {selectedPage ? (
        <a
          href={`${web_Url}/wheel/${selectedPage.publicPageId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C33AFF] underline hover:text-[#A22BD9]"
        >
         {web_Url}/wheel/{selectedPage.publicPageId}
        </a>
      ) : (
        'No page selected'
      )}
    </p>
    
    <p className="text-lg font-bold">
      <span className="font-semibold text-[#A22BD9]">Your plan expires on: {formattedDate}</span> 
    </p>
  </div>
</div>
<h2 className="text-xl font-semibold text-[#D3D3DF]">Projects:</h2>
          <Select
            value={selectedPage?.publicPageId || ''}
            onChange={(e) => handlePageSelection(e.target.value)}
            className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
          >
            {publicPages.map((page) => (
              <SelectItem key={page.publicPageName} value={page.publicPageId}>
                {page.publicPageName}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="space-y-4">
          <TextInput
            label="New Page Name"
            value={newPageName}
            onChange={(value) => setNewPageName(value)}
          />
          <Button
            onClick={handleCreatePage}
            className={`px-4 py-2 rounded-lg ${
              remainingPages > 0 ? 'px-4 py-2 rounded bg-neutral-900 text-purple-800 hover:bg-neutral-800 border border-[#C33AFF]' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            disabled={remainingPages <= 0}
          >
            Create New Public Page
          </Button>
        </div>

    
        <Tabs.Root defaultValue="general" className="space-y-8 py-6">
         {/* Horizontal Scrolling Tabs */}
         <Tabs.List
            className="flex overflow-x-auto space-x-4 pb-4 border-b border-[#C33AFF]/20 scrollbar-thin scrollbar-thumb-[#C33AFF]/20 whitespace-nowrap"
          >
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
            <Tabs.Trigger value="video" className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors">
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
                  value="footer"
                  className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
                >
                  Footer
            </Tabs.Trigger>
            <Tabs.Trigger value="final-cta" className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors">
              Final CTA
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
                  <TiptapEditor
                      content={selectedPage.headerTitle || ''}
                      onContentChange={(content) =>
                        setSelectedPage({ ...selectedPage, headerTitle: content })
                      }
                        />
                  <TiptapEditor
                        content={selectedPage.subtitle || ''}
                        onContentChange={(content) =>
                          setSelectedPage({ ...selectedPage, subtitle: content })
                        }
                      />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageUpload
                      label="Logo"
                      type="publicpage"
                      currentImage={selectedPage.logo}
                      onUpload={(url) => setSelectedPage({ ...selectedPage, logo: url })}
                      recommendations={{
                        maxSize: 1,
                        dimensions: '200x200px',
                        format: 'PNG, SVG preferred',
                      }}
                    />
                    <ImageUpload
                      label="Background Image"
                      type="publicpage"
                      currentImage={selectedPage.backgroundImage}
                      onUpload={(url) => setSelectedPage({ ...selectedPage, backgroundImage: url })}
                      recommendations={{
                        maxSize: 1,
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
                      href={`/wheel/${selectedPage?.publicPageId}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="relative aspect-video overflow-hidden rounded-lg"
                      style={{
                        backgroundImage: `url(${selectedPage.backgroundImage})`,
                      
                      }}
                    >
                  <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-center">
                              <img
                                src={selectedPage.logo}
                                alt="Logo"
                                className="h-20 mb-6 object-contain"
                              />
                              <h1
                                className="text-4xl font-bold text-white mb-4"
                                dangerouslySetInnerHTML={{
                                  __html: selectedPage.headerTitle || "Your Amazing Header",
                                }}
                              />
                              <p
                                className="text-xl text-white/80"
                                dangerouslySetInnerHTML={{
                                  __html: selectedPage.subtitle || "Your Subheadline Goes Here",
                                }}
                              />
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
                      if (selectedPage.carouselImages.length >= 6) {
                        toast.error('Maximum 6 images allowed');
                        return;
                      }
                      setSelectedPage({
                        ...selectedPage,
                        carouselImages: [...selectedPage.carouselImages,{ url,alt}], // Update carousel images
                      });
                    }}
                    recommendations={{
                      maxSize: 1,
                      dimensions: '1200x800px',
                      format: 'JPG, PNG',
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPage.carouselImages.map((image: {url: string, alt: string}, index: number) => (
                      <a
                        
                       
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
                            setSelectedPage({
                              ...selectedPage,
                              carouselImages: selectedPage.carouselImages.filter(
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
                    {selectedPage.carouselImages && selectedPage.carouselImages.length > 0 ? (
                      <Carousel
                      images={(selectedPage?.carouselImages || [])}
                      
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
                videoId={selectedPage.videoId || ''}
                onChange={(videoId) => setSelectedPage({ ...selectedPage, videoId })}
              />
            </div>
          </Tabs.Content>          

          <Tabs.Content value="wheel" className="space-y-8">
  <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Wheel Settings */}
<div className="space-y-6">
  <h2 className="text-xl font-semibold text-[#D3D3DF]">Wheel Settings</h2>
  {selectedPage.prizes.map((prize, index) => (
    <div
      key={index}
      className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 space-y-4 relative"
    >
      {/* Remove Prize Button */}
      <button
        onClick={() =>
          setSelectedPage({
            ...selectedPage,
            prizes: selectedPage.prizes.filter((_, i) => i !== index),
          })
        }
        className="absolute top-2 right-2 bg-[#FF4D4D] text-white px-2 py-1 rounded-full hover:bg-[#FF3333] transition"
        title="Remove Prize"
      >
        ✕
      </button>

      {/* Prize Text */}
      <TextInput
        label="Prize Text"
        value={prize.text || ''}
        onChange={(value) =>
          setSelectedPage({
            ...selectedPage,
            prizes: selectedPage.prizes.map((p, i) =>
              i === index ? { ...p, text: value } : p
            ),
          })
        }
      />

      {/* Gradient Toggle */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-[#D3D3DF]">Enable Gradient</label>
        <input
          type="checkbox"
          checked={prize.gradient || false}
          onChange={(e) =>
            setSelectedPage({
              ...selectedPage,
              prizes: selectedPage.prizes.map((p, i) =>
                i === index ? { ...p, gradient: e.target.checked } : p
              ),
            })
          }
          className="w-5 h-5"
        />
      </div>

      {/* Gradient Colors and Direction */}
      {prize.gradient && (
        <>
          <ColorPicker
            label="Gradient Start Color"
            value={prize.gradientStart || '#6C63FF'}
            onChange={(value) =>
              setSelectedPage({
                ...selectedPage,
                prizes: selectedPage.prizes.map((p, i) =>
                  i === index ? { ...p, gradientStart: value } : p
                ),
              })
            }
          />
          <ColorPicker
            label="Gradient End Color"
            value={prize.gradientEnd || '#4B4AC9'}
            onChange={(value) =>
              setSelectedPage({
                ...selectedPage,
                prizes: selectedPage.prizes.map((p, i) =>
                  i === index ? { ...p, gradientEnd: value } : p
                ),
              })
            }
          />
          <Select
            label="Gradient Direction"
            value={prize.gradientDirection || 'to bottom'}
            onChange={(e) =>
              setSelectedPage({
                ...selectedPage,
                prizes: selectedPage.prizes.map((p, i) =>
                  i === index ? { ...p, gradientDirection: e.target.value } : p
                ),
              })
            }
            className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
          >
            <SelectItem value="to top">To Top</SelectItem>
            <SelectItem value="to bottom">To Bottom</SelectItem>
            <SelectItem value="to left">To Left</SelectItem>
            <SelectItem value="to right">To Right</SelectItem>
            <SelectItem value="to top left">To Top Left</SelectItem>
            <SelectItem value="to top right">To Top Right</SelectItem>
            <SelectItem value="to bottom left">To Bottom Left</SelectItem>
            <SelectItem value="to bottom right">To Bottom Right</SelectItem>
          </Select>
        </>
      )}

      {/* Color and Probability */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#D3D3DF] mb-1">Color</label>
          <input
            type="color"
            value={prize.color}
            onChange={(e) =>
              setSelectedPage({
                ...selectedPage,
                prizes: selectedPage.prizes.map((p, i) =>
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
              setSelectedPage({
                ...selectedPage,
                prizes: selectedPage.prizes.map((p, i) =>
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
{/* Toggle for Winning Music */}
<div className="flex items-center space-x-4 mb-6">
  <label className="text-sm font-medium text-[#D3D3DF]">
    Enable Winning Music
  </label>
  <input
    type="checkbox"
    checked={selectedPage.musicEnabled ?? true} // Default to true
    onChange={(e) =>
      setSelectedPage({
        ...selectedPage,
        musicEnabled: e.target.checked,
      })
    }
    className="w-5 h-5"
  />
</div>


<h2 className="text-xl font-semibold text-[#D3D3DF]">Wheel Button Settings</h2>

{/* Button Text */}
<TextInput
  label="Button Text"
  value={selectedPage.wheelButton?.text || "SPIN"}
  onChange={(value) =>
    setSelectedPage({
      ...selectedPage,
      wheelButton: { ...selectedPage.wheelButton, text: value },
    })
  }
/>

{/* Text Color */}
<ColorPicker
  label="Text Color"
  value={selectedPage.wheelButton?.textColor || "#FFFFFF"}
  onChange={(value) =>
    setSelectedPage({
      ...selectedPage,
      wheelButton: { ...selectedPage.wheelButton, textColor: value },
    })
  }
/>

{/* Background Color */}
<ColorPicker
  label="Background Color"
  value={selectedPage.wheelButton?.backgroundColor || "#8B5CF6"}
  onChange={(value) =>
    setSelectedPage({
      ...selectedPage,
      wheelButton: { ...selectedPage.wheelButton, backgroundColor: value },
    })
  }
/>

{/* Gradient Toggle */}
<div className="flex items-center space-x-4">
  <label className="text-sm font-medium text-[#D3D3DF]">Enable Gradient</label>
  <input
    type="checkbox"
    checked={selectedPage.wheelButton?.gradient || false}
    onChange={(e) =>
      setSelectedPage({
        ...selectedPage,
        wheelButton: { ...selectedPage.wheelButton, gradient: e.target.checked },
      })
    }
    className="w-5 h-5"
  />
</div>

{/* Gradient Colors and Direction */}
{selectedPage.wheelButton?.gradient && (
  <>
    <ColorPicker
      label="Gradient Start Color"
      value={selectedPage.wheelButton?.gradientStart || "#6C63FF"}
      onChange={(value) =>
        setSelectedPage({
          ...selectedPage,
          wheelButton: { ...selectedPage.wheelButton, gradientStart: value },
        })
      }
    />
    <ColorPicker
      label="Gradient End Color"
      value={selectedPage.wheelButton?.gradientEnd || "#4B4AC9"}
      onChange={(value) =>
        setSelectedPage({
          ...selectedPage,
          wheelButton: { ...selectedPage.wheelButton, gradientEnd: value },
        })
      }
    />
    <Select
      label="Gradient Direction"
      value={selectedPage.wheelButton?.gradientDirection || "to bottom"}
      onChange={(e) =>
        setSelectedPage({
          ...selectedPage,
          wheelButton: { ...selectedPage.wheelButton, gradientDirection: e.target.value },
        })
      }
      className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
    >
      <SelectItem value="to top">To Top</SelectItem>
      <SelectItem value="to bottom">To Bottom</SelectItem>
      <SelectItem value="to left">To Left</SelectItem>
      <SelectItem value="to right">To Right</SelectItem>
      <SelectItem value="to top left">To Top Left</SelectItem>
      <SelectItem value="to top right">To Top Right</SelectItem>
      <SelectItem value="to bottom left">To Bottom Left</SelectItem>
      <SelectItem value="to bottom right">To Bottom Right</SelectItem>
    </Select>
  </>
)}


  {/* Add Prize Button */}
  <Button
    onClick={() =>
      setSelectedPage({
        ...selectedPage,
        prizes: [
          ...selectedPage.prizes,
          {
            text: '',
            gradient: false,
            gradientStart: '#6C63FF',
            gradientEnd: '#4B4AC9',
            gradientDirection: 'to right',
            color: '#ffffff',
            probability: 0,
            redirectUrl: '',
            glowColor: '#FFFFFF',
            expirationDate: new Date(),
            bonusCode: '',
          },
        ],
      })
    }
    className="bg-purple-900 hover:bg-purple-950 text-white w-full"
  >
    Add Prize
  </Button>
</div>

      {/* Wheel Preview */}
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
              prizes={selectedPage.prizes}
              onSpinEnd={() => {}}
              disabled={false}
              button= {selectedPage.wheelButton}
            />
          </div>
        )}
      </div>
    </div>
  </div>
</Tabs.Content>


          <Tabs.Content value="preview" className="space-y-8">
  <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-[#D3D3DF]">Preview</h2>
      <Button
        onClick={() => setShowPreview(!showPreview)} // Toggle preview visibility
        variant="outline"
        className="flex items-center gap-2 bg-[#1B1B21] border-[#C33AFF] text-[#C33AFF] hover:bg-[#C33AFF] hover:text-white"
      >
        {showPreview ? "Hide Preview" : "Show Preview"}
      </Button>
    </div>
    {showPreview && (
      <div className="relative">
        <iframe
          src={`${web_Url}/wheel/${selectedPage.publicPageId}`}
          className="w-full h-[800px] rounded-lg border border-[#C33AFF]/20"
          title="Page Preview"
          sandbox="allow-scripts allow-same-origin"
          allowFullScreen
        />
      </div>
    )}
  </div>
</Tabs.Content>
<Tabs.Content value="footer" className="space-y-8">
  <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#D3D3DF]">Footer Content</h2>
      
      {/* HTML/Markdown Editor */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Footer Text 
        </label>
        <TiptapEditor
          content={selectedPage.footer || ''}
          onContentChange={(content) =>
            setSelectedPage({ ...selectedPage, footer: content })
          }
        />
        
         <TextInput
          label = "Lower Footer"
          value={selectedPage.lowerFooter || ''}
          onChange={(value) =>
            setSelectedPage({ ...selectedPage, lowerFooter: value })
          }
        /><strong><span className='text-white'>(HTML Allowed)</span></strong>
      </div>
      
      {/* Preview Section */}
      <div
          className="mt-4 p-4 border border-[#C33AFF]/20 bg-[#121218] rounded-lg text-[#C33AFF]"
          dangerouslySetInnerHTML={{
            __html: selectedPage.footer || '<p>Preview will appear here...</p>',
          }}
        />
         <div
          className="mt-4 p-4 border border-[#C33AFF]/20 bg-[#121218] rounded-lg text-[#C33AFF]"
          dangerouslySetInnerHTML={{
            __html: selectedPage.lowerFooter || '<p>Preview will appear here...</p>',
          }}
        />
    </div>
  </div>
</Tabs.Content>
<Tabs.Content value="final-cta" className="space-y-8">
  <div className="bg-[#1B1B21] p-6 text-white rounded-lg shadow-lg space-y-6 max-w-lg mx-auto">
    <h2 className="text-xl font-bold text-[#D3D3DF]">Final CTA Settings</h2>

    {/* Button Text */}
    <TextInput
      label="Button Text"
      value={selectedPage.finalCta?.text || ''}
      onChange={(value) =>
        setSelectedPage({
          ...selectedPage,
          finalCta: { ...selectedPage.finalCta, text: value },
        })
      }
    />

    {/* Button Size */}
    <Select
      value={selectedPage.finalCta?.size || 'medium'}
      onChange={(e) =>
        setSelectedPage({
          ...selectedPage,
          finalCta: { ...selectedPage.finalCta, size: e.target.value },
        })
      }
      className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
    >
      <SelectItem value="small">Small</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="large">Large</SelectItem>
    </Select>

    {/* Text Color */}
    <ColorPicker
      label="Text Color"
      value={selectedPage.finalCta?.textColor || '#ffffff'}
      onChange={(value) =>
        setSelectedPage({
          ...selectedPage,
          finalCta: { ...selectedPage.finalCta, textColor: value },
        })
      }
    />

    {/* Background Color */}
    <ColorPicker
      label="Background Color"
      value={selectedPage.finalCta?.backgroundColor || '#4CAF50'}
      onChange={(value) =>
        setSelectedPage({
          ...selectedPage,
          finalCta: { ...selectedPage.finalCta, backgroundColor: value },
        })
      }
    />

    {/* Hover Color */}
    <ColorPicker
      label="Hover Color"
      value={selectedPage.finalCta?.hoverColor || '#45a049'}
      onChange={(value) =>
        setSelectedPage({
          ...selectedPage,
          finalCta: { ...selectedPage.finalCta, hoverColor: value },
        })
      }
    />

    {/* Gradient Toggle */}
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-[#D3D3DF]">Enable Gradient</label>
      <input
        type="checkbox"
        checked={selectedPage.finalCta?.gradient || false}
        onChange={(e) =>
          setSelectedPage({
            ...selectedPage,
            finalCta: { ...selectedPage.finalCta, gradient: e.target.checked },
          })
        }
        className="w-5 h-5"
      />
    </div>

    {/* Gradient Colors */}
    {selectedPage.finalCta?.gradient && (
      <>
        <ColorPicker
          label="Gradient Start Color"
          value={selectedPage.finalCta?.gradientStart || '#6C63FF'}
          onChange={(value) =>
            setSelectedPage({
              ...selectedPage,
              finalCta: { ...selectedPage.finalCta, gradientStart: value },
            })
          }
        />
        <ColorPicker
          label="Gradient End Color"
          value={selectedPage.finalCta?.gradientEnd || '#4B4AC9'}
          onChange={(value) =>
            setSelectedPage({
              ...selectedPage,
              finalCta: { ...selectedPage.finalCta, gradientEnd: value },
            })
          }
        />
       <Select
        label="Gradient Direction"
        value={selectedPage.finalCta?.gradientDirection || 'to bottom'}
        onChange={(e) =>
          setSelectedPage({
            ...selectedPage,
            finalCta: { ...selectedPage.finalCta, gradientDirection: e.target.value },
          })
        }
        className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
      >
        <SelectItem value="to top">To Top</SelectItem>
        <SelectItem value="to bottom">To Bottom</SelectItem>
        <SelectItem value="to left">To Left</SelectItem>
        <SelectItem value="to right">To Right</SelectItem>
        <SelectItem value="to top left">To Top Left</SelectItem>
        <SelectItem value="to top right">To Top Right</SelectItem>
        <SelectItem value="to bottom left">To Bottom Left</SelectItem>
        <SelectItem value="to bottom right">To Bottom Right</SelectItem>
      </Select>
      </>
    )}

    {/* Preview */}
    <div className="pt-6">
      <h3 className="text-lg font-semibold text-[#D3D3DF] text-center">Preview</h3>
      <div className="flex justify-center mt-4">
        <a
          href={selectedPage.finalCta?.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg transition-all duration-200"
          style={{
            padding:
              selectedPage.finalCta?.size === 'small'
                ? '8px 16px'
                : selectedPage.finalCta?.size === 'large'
                ? '14px 28px'
                : '10px 20px',
            fontSize:
              selectedPage.finalCta?.size === 'small'
                ? '12px'
                : selectedPage.finalCta?.size === 'large'
                ? '18px'
                : '16px',
            background: selectedPage.finalCta?.gradient
              ? `linear-gradient(${selectedPage.finalCta.gradientDirection}, ${selectedPage.finalCta.gradientStart}, ${selectedPage.finalCta.gradientEnd})`
              : selectedPage.finalCta?.backgroundColor || '#4CAF50',
            color: selectedPage.finalCta?.textColor || '#ffffff',
            textAlign: 'center',
            textDecoration: 'none',
            width: 'fit-content',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = selectedPage.finalCta?.gradient
              ? `linear-gradient(${selectedPage.finalCta.gradientDirection}, ${selectedPage.finalCta.gradientStart}, ${selectedPage.finalCta.gradientEnd})`
              : selectedPage.finalCta?.hoverColor || '#45a049')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = selectedPage.finalCta?.gradient
              ? `linear-gradient(${selectedPage.finalCta.gradientDirection}, ${selectedPage.finalCta.gradientStart}, ${selectedPage.finalCta.gradientEnd})`
              : selectedPage.finalCta?.backgroundColor || '#4CAF50')
          }
        >
          {selectedPage.finalCta?.text || 'Click Me'}
        </a>
      </div>
    </div>
  </div>
</Tabs.Content>





<Tabs.Content value="analytics" className="space-y-8">
            <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
              <AnalyticsDashboard  pageId={selectedPage.publicPageId || 'defaultPageId'} /> 
            </div>
</Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};
