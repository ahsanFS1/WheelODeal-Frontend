    import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { SpinningWheel } from './SpinningWheel';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';
import { useConStore } from '../store/configStore';
import PricingSection from './PricingSection';

export const MainLandingPage: React.FC = () => {
  const { fetchMLP, mlp: landingPage } = useConStore() as {
    fetchMLP: () => void;
    landingPage: any;
  };

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const retryInterval = setInterval(() => {
      if (!landingPage.hero) {
        fetchMLP();
      } else {
        setIsLoading(false);
        clearInterval(retryInterval);
      }
    }, 500); // Retry every 055 seconds

    return () => clearInterval(retryInterval); // Cleanup on unmount
  }, [fetchMLP, landingPage.hero]);

  

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const renderIcon = (iconName: string): JSX.Element | null => {
    const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };
  const loadingTexts = [
    "Spinning the Wheel...",
    "Spinning up some marketing magic just for you! 🎡",
    "Are we there yet?",
    "Good things take time; great ones take a few more seconds!",
    "Fetching prizes and pixels... because you deserve both!",
  ];
  
  const randomText = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
  if(isLoading||!landingPage.hero){
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121218] text-white">
      <svg
        className="animate-spin h-16 w-16 text-purple-500 mb-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="text-lg text-gray-400">{randomText}</p>
    </div>
  )};
  return (

    <div className="min-h-screen bg-[#121218] text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-visible px-4">
        {landingPage.hero.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${landingPage.hero.backgroundImage})`,
              filter: 'blur(2px) brightness(0.7)',
            }}
          />
        )}

{landingPage.hero.logo && (
          <div className="absolute top-8 flex justify-center w-full z-10">
            <img
              src={landingPage.hero.logo}
              alt="Logo"
              className="object-contain drop-shadow-lg"
              style={{
                maxWidth: 'clamp(100px, 15vw, 180px)',
                height: 'auto',
              }}
            />
          </div>
        )}

        <motion.div
          className="relative z-10 container mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <h1
            className="inline-block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 break-words"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              overflowWrap: 'break-word',
              lineHeight: '1.32',
            }}
            dangerouslySetInnerHTML={{ __html: landingPage.hero.headline }}
          />
          <p
            className=" text-sm sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 break-words"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              lineHeight: '1.4',
              overflowWrap: 'break-word',
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: landingPage.hero.subheadline }} />
          </p>

          <Button
            onClick={() =>
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="text-xs sm:text-sm md:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full transform hover:scale-105 transition-all shadow-lg"
            style={{
              background: landingPage.hero.ctaButton.isGradient
                ? `linear-gradient(${landingPage.hero.ctaButton.gradientDirection}, ${landingPage.hero.ctaButton.gradientStart}, ${landingPage.hero.ctaButton.gradientEnd})`
                : landingPage.hero.ctaButton.color,
              color: landingPage.hero.ctaButton.textColor,
              transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
             }}
            onMouseEnter={(e) =>
              e.currentTarget.style.boxShadow = `0 4px 20px ${landingPage.hero.ctaButton.glowColor || "transparent"}`
            }
            onMouseLeave={(e) =>
              e.currentTarget.style.boxShadow = "none"
            }
          >
            {landingPage.hero.ctaButton.text}
          </Button>

        </motion.div>
      </section>


       {/* Demo Section */}
    <section id="demo" className="py-16 sm:py-20 bg-[#1B1B21] overflow-visible;">
      <motion.div
        className="container mx-auto px-4"
        initial="initial"
        whileInView="animate"
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
        }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12 ">
        <h2
              className="text-2xl sm:text-4xl font-bold mb-4 text-gradient"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
                lineHeight: '1.2',
                display: 'inline-block',
              }}
              dangerouslySetInnerHTML={{ __html: landingPage.demo.title }}
            />
            <p
              className="text-sm sm:text-lg text-gray-300"
              style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
                lineHeight: '1.5',
              }}
              dangerouslySetInnerHTML={{ __html: landingPage.demo.caption }}
            />

        </div>

        <div className="max-w-3xl mx-auto">
          <SpinningWheel
            prizes={landingPage.prizes}
            onSpinEnd={() => {}}
            disabled={false}
          />
        </div>

        <div className="text-center mt-12">
        <Button
          onClick={() => {
            document.getElementById('video')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full transform hover:scale-105 transition-all shadow-lg"
          style={{
            background: landingPage.demo.secondaryCta.isGradient
              ? `linear-gradient(${landingPage.demo.secondaryCta.gradientDirection}, ${landingPage.demo.secondaryCta.gradientStart}, ${landingPage.demo.secondaryCta.gradientEnd})`
              : landingPage.demo.secondaryCta.color,
            color: landingPage.demo.secondaryCta.textColor,
            transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
          }}
          onMouseEnter={(e) =>
            e.currentTarget.style.boxShadow = `0 4px 20px ${landingPage.demo.secondaryCta.glowColor || "transparent"}`
          }
          onMouseLeave={(e) =>
            e.currentTarget.style.boxShadow = "none"
          }
        >
          {landingPage.demo.secondaryCta.text}
        </Button>


        </div>
      </motion.div>
    </section>

      

      {/*Video Section*/}
              {landingPage.videoId && (
        <section id='video' className="min-h-screen bg-[#121218] text-white">
      <motion.div
        className="px-auto py-20 container mx-auto px-4"
        initial="initial"
        whileInView="animate"
        variants={fadeIn}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-12 text-center text-gradient">Tutorial</h2>

        <div className="max-w-4xl mx-auto">
          {/* Embed a random YouTube video */}
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${landingPage.videoId}`}
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






       {/* Features Section */}
    <section className="py-16 sm:py-20 bg-[#1B1B21]">
      <motion.div
        className="container mx-auto px-4"
        initial="initial"
        whileInView="animate"
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
        }}
      >
        <h2
          className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center"
          dangerouslySetInnerHTML={{ __html: landingPage.features.title }}
        />
        <p
          className="text-sm sm:text-lg text-center text-gray-300 mb-12"
          dangerouslySetInnerHTML={{ __html: landingPage.features.description }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {landingPage.features.items.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1B1B21] p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#C33AFF] rounded-lg flex items-center justify-center mb-4">
                {renderIcon(feature.icon)}
              </div>
              <h3 className="text-sm sm:text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-xs sm:text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>





      {/* Benefits Section */}
      <section className="py-20 bg-[#121218]">
        <motion.div
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
          }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center"
            dangerouslySetInnerHTML={{ __html: landingPage.benefits.title }}
          />
          <p
            className="text-lg md:text-xl text-center text-gray-300 mb-12"
            dangerouslySetInnerHTML={{ __html: landingPage.benefits.description }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {landingPage.benefits.items.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 bg-[#121218] p-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <div className="w-8 h-8 bg-[#C33AFF] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <p className="text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>


        {/* How It Works Section */}
        <section className="py-20 bg-[#1B1B21]">
        <motion.div
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
          }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center"
            dangerouslySetInnerHTML={{ __html: landingPage.howItWorks.title }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {landingPage.howItWorks.steps.map((step, index) => (
              <div
                key={index}
                className="text-center bg-[#1B1B21] p-8 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <div className="w-16 h-16 bg-[#C33AFF] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
    <section className="py-16 sm:py-20 bg-[#121218]">
      <motion.div
        className="container mx-auto px-4"
        initial="initial"
        whileInView="animate"
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
        }}
      >
        <h2
          className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center"
          dangerouslySetInnerHTML={{ __html: landingPage.testimonials.title }}
        />
        <p
          className="text-sm sm:text-lg text-center text-gray-300 mb-12"
          dangerouslySetInnerHTML={{ __html: landingPage.testimonials.subtitle }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {landingPage.testimonials.items.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#121218] p-6 rounded-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-4 sm:w-5 h-4 sm:h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 text-xs sm:text-sm italic">
                {testimonial.content}
              </p>
              <div>
                <p className="font-semibold text-white text-sm sm:text-base">
                  {testimonial.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#1B1B21]">
       <PricingSection pricing={landingPage.pricing}/>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#121218]">
        <motion.div 
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
           <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center"
            dangerouslySetInnerHTML={{ __html: landingPage.faq.title }}
          />
          
          <div className="max-w-3xl mx-auto">
            <Accordion.Root type="single" collapsible>
              {landingPage.faq.items.map((faq) => (
                <Accordion.Item
                  key={faq.id}
                  value={faq.id}
                  className="mb-4 bg-[#121218] rounded-lg overflow-hidden"
                >
                  <Accordion.Trigger className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#1B1B21] transition-colors">
                    <span className="text-lg font-semibold">{faq.question}</span>
                    <Icons.ChevronDown className="w-5 h-5 transform transition-transform duration-200" />
                  </Accordion.Trigger>
                  <Accordion.Content className="px-6 py-4 text-gray-300">
                    {faq.answer}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-[#1B1B21]">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial="initial"
          whileInView="animate"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
          }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8"
            dangerouslySetInnerHTML={{ __html: landingPage.finalCta.title }}
          />
              <Button
              onClick={() =>
                window.open(landingPage.finalCta.buttonLink, '_blank')
              }
              className="text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all shadow-lg"
              style={{
                background: landingPage.finalCta.isGradient
                  ? `linear-gradient(${landingPage.finalCta.gradientDirection}, ${landingPage.finalCta.gradientStart}, ${landingPage.finalCta.gradientEnd})`
                  : landingPage.finalCta.buttonColor,
                color: landingPage.finalCta.buttonTextColor,
                transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
              }}
              onMouseEnter={(e) =>
                e.currentTarget.style.boxShadow = `0 4px 20px ${landingPage.finalCta.glowColor || "transparent"}`
              }
              onMouseLeave={(e) =>
                e.currentTarget.style.boxShadow = "none"
              }
            >
              {landingPage.finalCta.buttonText}
            </Button>



          <p className="text-gray-300 mt-4">{landingPage.finalCta.guarantee}</p>
        </motion.div>
      </section>


       <div className="bg-[#121218]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 bg-[#121218]">
             
      <div
              className="mt-4 border-t border-gray-700 pt-4 text-center text-xs text-gray-500"
              dangerouslySetInnerHTML={{
                __html: (landingPage.footer || "<p>Preview will appear here...</p>").replace(
                  /<a /g,
                  '<a target="_blank" rel="noopener noreferrer" '
                ),
              }}
            />
           </div>
           </div>
    </div>
    
  );
};