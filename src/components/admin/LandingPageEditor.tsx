import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { HeroEditor } from './editors/HeroEditor';
import { DemoEditor } from './editors/DemoEditor';
import { FeaturesEditor } from './editors/FeaturesEditor';
import { BenefitsEditor } from './editors/BenefitsEditor';
import { HowItWorksEditor } from './editors/HowItWorksEditor';
import { TestimonialsEditor } from './editors/TestimonialsEditor';
import { PricingEditor } from './editors/PricingEditor';
import { FaqEditor } from './editors/FaqEditor';
import { FinalCtaEditor } from './editors/FinalCtaEditor';
import { api_Url } from '../../config';
import { VideoEditor } from './editors/VideoEditor';
import { TextInput } from './shared/TextInput';
import WheelEditor from './editors/WheelEditor';
import { FloatingWidgetEditor } from './editors/FloatingWidgetEditor';
import { CarouselEditor } from './editors/CarouselEditor';




export const LandingPageEditor: React.FC = () => {
  const [mlp, setMlp] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('hero'); // Manage active tab state

  // Fetch the landing page data from the database
  const fetchLandingPage = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`${api_Url}/api/`);
      const data = await response.json();
      if (data.success) {
        setMlp(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch landing page data.');
      }
    } catch (error) {
      console.error('Error fetching landing page:', error);
      toast.error(`Error fetching landing page: ${error.message}`, {
        style: {
          background: '#1B1B21',
          color: '#D3D3DF',
          border: '1px solid rgba(255, 58, 58, 0.2)',
        },
      });
    } finally {
      setIsFetching(false);
    }
  };

  // Save changes to the database
  const handleSave = async () => {
    try {
      const response = await fetch(`${api_Url}/api/landing-page`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mlp),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Landing Page updated successfully!', {
          style: {
            background: '#1B1B21',
            color: '#D3D3DF',
            border: '1px solid rgba(195, 58, 255, 0.2)',
          },
        });
        fetchLandingPage(); // Refresh data after save
      } else {
        throw new Error(result.message || 'Failed to update landing page.');
      }
    } catch (error) {
      console.error('Error updating landing page:', error);
      toast.error(`Error updating landing page: ${error.message}`, {
        style: {
          background: '#1B1B21',
          color: '#D3D3DF',
          border: '1px solid rgba(255, 58, 58, 0.2)',
        },
      });
    }
  };

  useEffect(() => {
    fetchLandingPage();
  }, []);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!mlp) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Failed to load landing page configuration.
      </div>
    );
  }

  return (
    <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#D3D3DF]">Landing Page Editor</h2>
        <button
          onClick={handleSave}
          className=" flex items-center w-[px] gap-2 px-4 py-3 bg-white text-black border border-[#C33AFF] text-sm rounded-lg hover:bg-gray-300 hover:text-black transition-all duration-200"
            
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
              <label className="text-sm font-medium text-[#D3D3DF]">
                Accessibility Settings
              </label>
              <input
                type="checkbox"
                checked={mlp.accessibilityOn ?? true} // Default to true
                onChange={(e) =>
                  setMlp({
                    ...mlp,
                    accessibilityOn: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
            </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex space-x-2 overflow-x-auto border-b border-purple-900/20 scrollbar-thin scrollbar-thumb-purple-900/20">
          {[{ value: 'floatingWidget', label: 'Floating Widget' },
            { value: 'hero', label: 'Hero' },
            { value: 'demo', label: 'Demo' },
            { value: 'carousel', label: 'Carousel' },
            {value: 'wheel-settings', label: 'Wheel Settings'},
            { value: 'video', label: 'Video' },
            { value: 'features', label: 'Features' },
            { value: 'benefits', label: 'Benefits' },
            { value: 'howItWorks', label: 'How It Works' },
            { value: 'testimonials', label: 'Testimonials' },
            { value: 'pricing', label: 'Pricing' },
            { value: 'faq', label: 'FAQ' },
            { value: 'finalCta', label: 'Final CTA' },
            { value: 'footer', label: 'Footer' },
            
          ].map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 text-[#D3D3DF] hover:text-purple-900 data-[state=active]:text-purple-900 data-[state=active]:border-b-2 data-[state=active]:border-purple-900 transition-colors whitespace-nowrap"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-4 -mr-4">
        <Tabs.Content value="floatingWidget" className="text-[#D3D3DF]">
        <FloatingWidgetEditor
          data={mlp.floatingWidget || {}}
          onChange={(floatingWidget) => setMlp({ ...mlp, floatingWidget })}
        />
      </Tabs.Content>
          <Tabs.Content value="hero" className="text-[#D3D3DF]">
            <HeroEditor
              data={mlp.hero}
              onChange={(hero) => setMlp({ ...mlp, hero })}
            />
          </Tabs.Content>

          <Tabs.Content value="demo" className="text-[#D3D3DF]">
            <DemoEditor
              data={mlp.demo}
              onChange={(demo) => setMlp({ ...mlp, demo })}
            />
          </Tabs.Content>
          
          <Tabs.Content value="wheel-settings" className="space-y-8">
          <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[#D3D3DF]">Wheel Settings</h2>
            <WheelEditor
              prizes={mlp?.prizes || []} // Pass the current prizes to WheelEditor
              onChange={(updatedPrizes) => {
                setMlp((prev) => ({
                  ...prev,
                  prizes: updatedPrizes,
                }));
              }}
            />
          </div>
        </Tabs.Content>

          <Tabs.Content value="video" className="text-[#D3D3DF]">
            <VideoEditor
              videoId={mlp.videoId || ''}
              onChange={(videoId) => setMlp({ ...mlp, videoId })}
            />
          </Tabs.Content>
          <Tabs.Content value="carousel" className="text-[#D3D3DF]">
          <CarouselEditor
            data={mlp.carousel}
            onChange={(carousel) => setMlp({ ...mlp, carousel })}
          />
        </Tabs.Content>
          <Tabs.Content value="features" className="text-[#D3D3DF]">
            <FeaturesEditor
              data={mlp.features}
              onChange={(features) => setMlp({ ...mlp, features })}
            />
          </Tabs.Content>

          <Tabs.Content value="benefits" className="text-[#D3D3DF]">
            <BenefitsEditor
              data={mlp.benefits}
              onChange={(benefits) => setMlp({ ...mlp, benefits })}
            />
          </Tabs.Content>

          <Tabs.Content value="howItWorks" className="text-[#D3D3DF]">
            <HowItWorksEditor
              data={mlp.howItWorks}
              onChange={(howItWorks) => setMlp({ ...mlp, howItWorks })}
            />
          </Tabs.Content>

          <Tabs.Content value="testimonials" className="text-[#D3D3DF]">
            <TestimonialsEditor
              data={mlp.testimonials}
              onChange={(testimonials) => setMlp({ ...mlp, testimonials })}
            />
          </Tabs.Content>

          <Tabs.Content value="pricing" className="text-[#D3D3DF]">
            <PricingEditor
              data={mlp.pricing}
              onChange={(pricing) => setMlp({ ...mlp, pricing })}
            />
          </Tabs.Content>

          <Tabs.Content value="faq" className="text-[#D3D3DF]">
            <FaqEditor
              data={mlp.faq}
              onChange={(faq) => setMlp({ ...mlp, faq })}
            />
          </Tabs.Content>

          <Tabs.Content value="finalCta" className="text-[#D3D3DF]">
            <FinalCtaEditor
              data={mlp.finalCta}
              onChange={(finalCta) => setMlp({ ...mlp, finalCta })}
            />
          </Tabs.Content>

          <Tabs.Content value="footer" className="text-[#D3D3DF]">
            <div>
              <label className="block text-sm font-medium text-white">
                Footer Text <span className="text-gray-400">(HTML Allowed)</span>
              </label>
              <textarea
                value={mlp.footer || ''} // Ensure a fallback value
                onChange={(e) =>
                  setMlp((prev: any) => ({
                    ...prev,
                    footer: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-md bg-[#232329] border border-purple-900/20 text-gray-300 focus:ring-purple-900 focus:border-purple-900"
                rows={4}
                placeholder="Enter footer text here..."
              />
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};
