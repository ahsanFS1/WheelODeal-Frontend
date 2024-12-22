import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SpinningWheel } from './SpinningWheel';
import { SpinResult } from '../types';
import { Carousel } from './carousel/Carousel';
import { CountdownTimer } from './CountdownTimer';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { api_Url } from '../config';
import { AccessibilityMenu } from './AccessibilityMenu';
import { Helmet } from 'react-helmet-async';



export const PublicPage: React.FC = () => {
  const { publicPageId } = useParams(); // Extract publicPageId from URL
  console.log(publicPageId)
  const [config, setConfig] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [isMobile, setIsMobile] = useState(false); // State to track if the device is mobile
  
 
  const measurementId = 'G-28B7K98MKT'; // Replace with your GA4 Measurement ID


  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // 768px breakpoint for mobile
    };
    
    checkIfMobile(); // Initial check
    window.addEventListener('resize', checkIfMobile); // Update on resize
    
    return () => {
      window.removeEventListener('resize', checkIfMobile); // Clean up on component unmount
    };
  }, []);
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
<>
        <Helmet prioritizeSeoTags>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta httpEquiv="X-Robots-Tag" content="noindex, nofollow" />
      </Helmet>
    <div className="min-h-screen bg-[#121218] text-white relative">

    {config.accessibilityOn && (
    <AccessibilityMenu />)}
     {/* Header Section */}
     <header
        className="border-b border-purple-900/20 p-4 z-20 relative"
        style={{
          backgroundColor: 'rgba(18, 18, 24, 0.85)', // Adds a transparent background
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.6)', // Subtle shadow effect
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <img
            src={config.logo || '/logo.png'}
            alt="Logo"
            className="h-16 object-contain"
          />
        </div>
      </header>
        

      {/* Main Content with Background */}
      <div
      className="relative"
      style={{
        backgroundImage: `url(${isMobile && config.mobileBackgroundImage ? config.mobileBackgroundImage : config.backgroundImage})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Hero Section */}
      <section className="py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            }}
            dangerouslySetInnerHTML={{
              __html: config.headerTitle || 'Your Amazing Headline',
            }}
          />
          <p
            className="text-lg md:text-xl lg:text-2xl mb-8"
            style={{
              lineHeight: '1.8',
            }}
            dangerouslySetInnerHTML={{
              __html: config.subtitle || 'Your Subheadline Goes Here',
            }}
          />
        </div>
      </section>

      {/* Add other sections like Wheel, Carousel, etc. here */}
    

  
        {/* Wheel Section */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
              <SpinningWheel
                prizes={config.prizes}
                onSpinEnd={handleSpinEnd}
                disabled={!!spinResult}
                music={config.musicEnabled}
                button={config.wheelButton}
                className="w-full max-w-3xl mx-auto"  // Added responsive class to make the wheel responsive
              />
            </div>
  

  
  {spinResult && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-900/90 rounded-lg p-6 shadow-md shadow-purple-500/30 transition-transform transform scale-110">
      <p className="text-xl text-gray-300">🎉 Bonus Code 🎉</p>
      <p className="text-3xl font-bold text-purple-400 mt-2 tracking-widest animate-pulse">
        {spinResult?.prize.bonusCode}
      </p>
      <p className="text-sm text-gray-300 italic mt-2">
        Use this code to claim your reward!
      </p>
      <div className="mt-6 border-t border-purple-500/30 pt-4">
        <p className="text-sm text-gray-300">Expiring In:</p>
        <br />
        <p className="text-lg font-semibold text-white">
          <CountdownTimer
            expiryTimestamp={new Date(spinResult?.prize.expirationDate).getTime()}
          />
        </p>
      </div>

      {/* Final CTA Button */}
      <div className="mt-6">
        <div className="flex justify-center mt-4">
          <a
            href={spinResult.prize?.redirectUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg transition-all duration-200"
            style={{
              padding:
                config.finalCta?.size === "small"
                  ? "8px 16px"
                  : config.finalCta?.size === "large"
                  ? "14px 28px"
                  : "10px 20px",
              fontSize:
                config.finalCta?.size === "small"
                  ? "12px"
                  : config.finalCta?.size === "large"
                  ? "18px"
                  : "16px",
              background: config.finalCta?.gradient
                ? `linear-gradient(${config.finalCta.gradientStart}, ${config.finalCta.gradientEnd})`
                : config.finalCta?.backgroundColor || "#4CAF50",
              color: config.finalCta?.textColor || "#ffffff",
              textAlign: "center",
              textDecoration: "none",
              width: "fit-content",
              cursor: "pointer",
            }}
            onClick={async (e) => {
              e.preventDefault();
              try {
                await handleClaim();
                window.open(spinResult.prize?.redirectUrl || "#", "_blank");
              } catch (error) {
                console.error("Error handling claim:", error);
                alert("Failed to claim the prize.");
              }
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                config.finalCta?.hoverColor || "#45a049")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                config.finalCta?.backgroundColor || "#4CAF50")
            }
          >
            {config.finalCta?.text || "Claim Offer"}
          </a>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setSpinResult(null)} // Close the modal
        className="mt-4 bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 flex justify-center mx-auto "
      >
        Close
      </button>
    </div>
  </div>
)}
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
          <section id="video" className="py-8">
            <motion.div
              className="px-auto py-20 container mx-auto px-4"
              initial="initial"
              whileInView="animate"
              variants={fadeIn}
              viewport={{ once: true }}
            >
              <div className="max-w-4xl mx-auto">
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
  </div>
        {/* Footer Section */}
        <footer
  className="text-gray-400 py-4"
  style={{
    backgroundColor: 'rgba(18, 18, 24, 0.85)', // Transparent background
    boxShadow: '0 -1px 7px rgba(0, 0, 0, 0.5)', // Subtle shadow
  }}
>
  <div className="max-w-4xl mx-auto text-center text-sm px-4 sm:px-6 lg:px-8">
    <div
      dangerouslySetInnerHTML={{
        __html: config.footer || "<p>Footer Preview</p>",
      }}
    />
  </div>
  <div className="border-t border-gray-700 mt-2 pt-2 text-center text-xs text-white">
    <div
      dangerouslySetInnerHTML={{
        __html: config.lowerFooter || "<p>&copy; 2024 Your Company</p>",
      }}
    />
  </div>
</footer>

      </div>
      </>
  );
};  