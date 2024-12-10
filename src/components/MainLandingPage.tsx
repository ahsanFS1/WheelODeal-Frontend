import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from './ui/button';
import { SpinningWheel } from './SpinningWheel';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';


import { useConStore } from '../store/configStore';





export const MainLandingPage: React.FC = () => {

  const {fetchMLP, mlp: landingPage} = useConStore() as {
    fetchMLP: () => void;
    landingPage: any;
  };

  useEffect(()=>{

     fetchMLP();
  },[fetchMLP]);

  const navigate = useNavigate();
  
  console.log(landingPage);
  // Ensure `hero` exists
  if (!landingPage.hero) {
    return <div>Landing Page configuration is incomplete.</div>;
  }
  
  
  // const landingPage = config.landingPage;

  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  // Helper function to render Lucide icons dynamically
  const renderIcon = (iconName: string): JSX.Element | null => {
    const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };



  const handleAdminLogin = () => {
    navigate('/admin_d01z');
  };
 


console.log("Landing Page Data: ",landingPage);
  return (
    <div className="min-h-screen bg-[#121218] text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
  {landingPage.hero.backgroundImage && (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${landingPage.hero.backgroundImage})`,
        filter: 'blur(2px) brightness(0.7)',
      }}
    />
  )}

  {/* Logo at the top */}
  {landingPage.hero.logo && (
    <img
      src={landingPage.hero.logo}
      alt="Logo"
      className="absolute top-8 left-1/2 transform -translate-x-1/2 h-24 object-contain drop-shadow-lg"
    />
  )}

  <motion.div
    className="relative z-10 container mx-auto px-4 text-center"
    initial="initial"
    animate="animate"
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
    }}
  >
    <h1 className="text-6xl md:text-7xl font-bold mb-6 text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
      {landingPage.hero.headline}
    </h1>
    <p className="text-xl md:text-2xl mb-8 text-gray-200 text-shadow-lg">
      {landingPage.hero.subheadline}
    </p>
    <Button
      onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
      style={{
        backgroundColor: landingPage.hero.ctaButton.color,
        color: landingPage.hero.ctaButton.textColor,
      }}
      className="text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/50"
    >
      {landingPage.hero.ctaButton.text}
    </Button>
  </motion.div>
</section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-[#1B1B21]">
        <motion.div
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient">{landingPage.demo.title}</h2>
            <p className="text-xl text-gray-300">{landingPage.demo.caption}</p>
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
                // Scroll to the video section
                document.getElementById('video')?.scrollIntoView({ behavior: 'smooth' });
                
                // Open the first video link in a new tab
                ; // Replace with desired logic for selecting a video
                const videoUrl = `https://www.youtube.com/watch?v=${landingPage.videoId}`;}}
              style={{
                backgroundColor: landingPage.demo.secondaryCta.color,
                color: landingPage.demo.secondaryCta.textColor,
              }}
              className="text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/50"
            >
              {landingPage.demo.secondaryCta.text}
            </Button>
          </div>
        </motion.div>
      </section>
      

      {/*Video Section*/}

        <section id='video' className="min-h-screen bg-[#121218] text-white">
      <motion.div
        className="px-auto py-20 container mx-auto px-4"
        initial="initial"
        whileInView="animate"
        variants={fadeIn}
        viewport={{ once: true }}
      >
        <h1 className="text-4xl font-bold mb-12 text-center text-gradient">Tutorial</h1>

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






      {/* Features Section */}
      <section className="py-20 bg-[#1B1B21]">
        <motion.div 
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
            {landingPage.features.title}
          </h2>
          <p className="text-xl text-center text-gray-300 mb-12">
            {landingPage.features.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landingPage.features.items.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#1B1B21] p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all hover:shadow-purple-500/20"
              >
                <div className="w-12 h-12 bg-[#C33AFF] rounded-lg flex items-center justify-center mb-4">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
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
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-gradient">
            {landingPage.benefits.title}
          </h2>
          <p className="text-xl text-center text-gray-300 mb-12">
            {landingPage.benefits.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {landingPage.benefits.items.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center space-x-4 bg-[#121218] p-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <div className="w-8 h-8 bg-[#C33AFF] rounded-full flex items-center justify-center">
                  <Icons.Check className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg">{benefit}</p>
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
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
            {landingPage.howItWorks.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {landingPage.howItWorks.steps.map((step, index) => (
              <div 
                key={index}
                className="text-center bg-[#1B1B21] p-8 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <div className="w-16 h-16 bg-[#C33AFF] rounded-full flex items-center justify-center mx-auto mb-6">
                  {renderIcon(step.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#121218]">
        <motion.div 
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-gradient">
            {landingPage.testimonials.title}
          </h2>
          <p className="text-xl text-center text-gray-300 mb-12">
            {landingPage.testimonials.subtitle}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landingPage.testimonials.items.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-[#121218] p-8 rounded-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-400"
                      )}
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">{testimonial.content}</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#1B1B21]">
        <motion.div 
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
            {landingPage.pricing.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {landingPage.pricing.plans.map((plan) => (
              <div 
                key={plan.id}
                className="bg-[#1B1B21] p-8 rounded-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold mb-6 text-[#C33AFF]">{plan.price}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Icons.Check className="w-5 h-5 text-[#C33AFF]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate(plan.buttonLink)}
                  style={{
                    backgroundColor: plan.buttonColor,
                    color: plan.buttonTextColor
                  }}
                  className="w-full py-3 rounded-lg transform hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/50"
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
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
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
            {landingPage.faq.title}
          </h2>
          
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
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-8 text-gradient">
            {landingPage.finalCta.title}
          </h2>
          <Button
            onClick={() => navigate(landingPage.finalCta.buttonLink)}
            style={{
              backgroundColor: landingPage.finalCta.buttonColor,
              color: landingPage.finalCta.buttonTextColor
            }}
            className="text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/50 mb-6"
          >
            {landingPage.finalCta.buttonText}
          </Button>
          <p className="text-gray-300">{landingPage.finalCta.guarantee}</p>
        </motion.div>
      </section>

      <section>
            Admin dashboard

            <button onClick={handleAdminLogin}>
              Admin
            </button>

      </section>
    </div>
  );
};