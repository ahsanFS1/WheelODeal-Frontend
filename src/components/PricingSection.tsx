import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PricingSection: React.FC<{ pricing: any }> = ({ pricing }) => {
  const [isYearly, setIsYearly] = useState(false); // State for toggle

  const togglePricing = () => {
    setIsYearly((prev) => !prev);
  };

  return (
    <section className="py-20 bg-[#1B1B21]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-white">
          {pricing.title}
        </h2>

      {/* Toggle Button */}
<div className="flex justify-center mb-10">
  <div className="relative inline-flex bg-[#2A2A32] rounded-full p-1 transition-all">
    {/* Background slider */}
    <motion.div
      className="absolute inset-y-0 rounded-full w-24 bg-[#C33AFF]"
      animate={{ x: isYearly ? "100%" : "0%" }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
      }}
    />

    {/* Monthly Button */}
    <button
      onClick={() => setIsYearly(false)}
      className={`relative w-24 text-center text-sm font-semibold py-2 rounded-full z-10 transition-all ${
        !isYearly ? "text-white" : "text-gray-400"
      }`}
    >
      Monthly
    </button>

    {/* Yearly Button */}
    <button
      onClick={() => setIsYearly(true)}
      className={`relative w-24 text-center text-sm font-semibold py-2 rounded-full z-10 transition-all ${
        isYearly ? "text-white" : "text-gray-400"
      }`}
    >
      Yearly (2 Months Free)
    </button>
  </div>
</div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {pricing.plans.map((plan: any) => (
              <motion.div
                key={plan.id + (isYearly ? "yearly" : "monthly")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-[#121218] p-6 rounded-lg shadow-lg text-white flex flex-col items-center"
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-4xl font-extrabold text-[#C33AFF] mb-6">
                  {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      ✔ <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                    href={plan.buttonLink}
                    className="inline-block w-full max-w-[200px] py-3 px-8 text-center font-semibold rounded-full transition-all"
                    style={{
                      background: plan.buttonColor, // Custom background color
                      color: plan.buttonTextColor,  // Custom text color
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Optional soft shadow
                    }}
                  >
                    {plan.buttonText}
                  </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
