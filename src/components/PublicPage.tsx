import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SpinningWheel } from './SpinningWheel';
import { SpinResult } from '../types';
import { Carousel } from './carousel/Carousel';
import { CountdownTimer } from './CountdownTimer';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { api_Url } from '../config';
export const PublicPage: React.FC = () => {
  const { publicPageId } = useParams(); // Extract publicPageId from URL
  console.log(publicPageId)
  const [config, setConfig] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [bonusCode] = useState('20CHRISTMAS');
  const [expiryTime] = useState(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry time
  const measurementId = 'G-28B7K98MKT'; // Replace with your GA4 Measurement ID

  // Load gtag.js dynamically
  useEffect(() => {
    const loadGtag = () => {
      const existingScript = document.querySelector(
        `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`
      );

      if (existingScript) {
        console.log('Google Analytics script already loaded.');
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      script.onload = () => {
        console.log('Google Analytics script loaded.');
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() { window.dataLayer.push(arguments); };

        // Track initial pageview
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
          page_path: `/wheel/${publicPageId}`,
          debug_mode: true,
        });
        console.log('Pageview tracked for:', `/wheel/${publicPageId}`);
      };

      script.onerror = () => {
        console.error('Failed to load Google Analytics script.');
      };
    };

    loadGtag();
  }, [publicPageId, measurementId]);

  // Fetch public page configuration
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching configuration for PublicPage', publicPageId);
      setIsFetching(true);
      try {
        const response = await fetch(`${api_Url}/api/public-page/single/${publicPageId}`);
        const data = await response.json();

        if (data.success) {
          setConfig(data.data);

          if (window.gtag) {
            console.log('Tracking page load event');
            window.gtag('event', 'page_loaded', {
              event_category: 'PublicPage',
              event_label: `PublicPage_${publicPageId}`,
              page_path: `/wheel/${publicPageId}`,
              debug_mode: true,
            });
          }
        } else {
          console.error('Failed to fetch configuration:', data.message);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [publicPageId]);

  // Handle the end of a spin
// Handle the end of a spin
const handleSpinEnd = async (result: SpinResult) => {
  setSpinResult(result);
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Track the spin event in Google Analytics
  if (window.gtag) {
    window.gtag('event', 'spin_completed', {
      event_category: 'SpinningWheel',
      event_label: `Prize_${result.prize.text}`,
      value: result.prize.text,
      debug_mode: true,
    });
  }

  // Save the prize to the backend
  try {
    const response = await fetch(`${api_Url}/api/prizes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageId: publicPageId, // Pass the project/page ID
        prizeName: result.prize.text, // Pass the prize name
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`Prize "${result.prize.text}" saved successfully for pageId "${publicPageId}".`);
    } else {
      console.error('Failed to save the prize:', data.message);
    }
  } catch (error) {
    console.error('Error saving the prize:', error);
  }
};


  // Handle claim button click
  const handleClaim = () => {
    if (spinResult) {
      if (window.gtag) {
        window.gtag('event', 'prize_claimed', {
          event_category: 'SpinningWheel',
          event_label: `Prize_${spinResult.prize.text}`,
          value: spinResult.prize.text,
          debug_mode: true,
        });
      }

      
      window.open(spinResult.prize.redirectUrl, '_blank', 'noopener,noreferrer');

      

    }
  };

  // Track carousel interactions
  const handleCarouselInteraction = (action: string, imageIndex: number) => {
    if (window.gtag) {
      window.gtag('event', 'carousel_interaction', {
        event_category: 'Carousel',
        event_action: action,
        event_label: `ImageIndex_${imageIndex}`,
      });
    }
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!config) {
    return <div>Failed to load page configuration.</div>;
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-[#121218] text-white relative">
      {/* Background Image */}
      {config.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${config.backgroundImage})`,
            filter: 'blur(2px) brightness(0.7)',
            zIndex: 0, // Background layer
          }}
        ></div>
      )}
  
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <header className="border-b border-purple-900/20 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <img
              src={config.logo || '/logo.png'}
              alt="Logo"
              className="h-12 object-contain"
            />
          </div>
        </header>
  
        {/* Hero Section */}
        <section className="py-8 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-400">
              {config.headerTitle}
            </h1>
            <p className="text-lg text-gray-300">{config.subtitle}</p>
          </div>
        </section>







  
        {/* Product Carousel Section */}
        {config.carouselImages && config.carouselImages.length > 0 && (
          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4">
              <Carousel images={config.carouselImages} />
            </div>
          </section>
        )}
  


    {config.videoId && (
        <section id='video' className="py-8">
      <motion.div
        className="px-auto py-20 container mx-auto px-4"
        initial="initial"
        whileInView="animate"
        variants={fadeIn}
        viewport={{ once: true }}
      >
        

        <div className="max-w-4xl mx-auto">
          {/* Embed a random YouTube video */}
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${config.videoId}`}
            title="Random YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-xl"
          ></iframe>
        </div>
      </motion.div>
    </section>
    )}
        
        {/* Wheel Section */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
              <SpinningWheel
                prizes={config.prizes}
                onSpinEnd={handleSpinEnd}
                disabled={!!spinResult}
              />
  
              {/* Bonus Code Display */}
              <div className="mt-6 text-center">
                <div className="inline-block bg-purple-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-300">Bonus Code:</p>
                  <p className="text-xl font-bold text-purple-400">{bonusCode}</p>
                  <p className="text-sm text-gray-300 mt-2">Expiring In:</p>
                  <CountdownTimer expiryTimestamp={expiryTime} />
                </div>
              </div>
            </div>
  
            {/* Spin Result */}
            {spinResult && (
              <div className="mt-6 text-center">
                <div className="bg-purple-900/20 rounded-lg p-6 inline-block">
                  <h3 className="text-xl font-bold mb-4">
                    Congratulations! You won: {spinResult.prize.text}
                  </h3>
                  <button
                    onClick={handleClaim}
                    className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                  >
                    Claim Offer!
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
  
        {/* Footer Section */}
        <footer className="border-t border-purple-900/20 py-4 mt-8">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
            <p>Terms and offers, conditions, refund and trial policy apply.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};