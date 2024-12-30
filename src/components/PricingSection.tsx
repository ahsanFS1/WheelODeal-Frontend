import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PricingSection: React.FC<{ pricing: any }> = ({ pricing }) => {
  const [isYearly, setIsYearly] = useState(false); // State for toggle

  const togglePricing = () => {
    setIsYearly((prev) => !prev);
  };
  
  return (
    <section className="py-20 bg-[#1B1B21]">
      <div
             className="container mx-auto px-4 "
             initial="initial"
             whileInView="animate"
             variants={{
               initial: { opacity: 0, y: 20 },
               animate: { opacity: 1, y: 0 },
               transition: { duration: 0.6 },
             }}
           >
             <h2
               className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-11 text-center"
               dangerouslySetInnerHTML={{ __html: pricing.title }}
             />

      {/* Toggle Button */}
  <div
   className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-1"
   onClick={() => setIsYearly((prev) => !prev)} // Switch on click anywhere
>
  {/* Billed Monthly Label */}
  <span
    className={`text-sm font-semibold transition-all cursor-pointer ${
      !isYearly ? "text-white" : "text-gray-400"
    }`}
  >
    {pricing.plans[0].monthlyplanText}
  </span>

  {/* Toggle Box */}
  <div className="relative w-16 h-8 bg-[#2A2A32] rounded-full shadow-lg shadow-purple-500/50 cursor-pointer">
    {/* Slider */}
    <motion.div
      className="absolute top-1 left-1 w-6 h-6 bg-gradient-to-r from-[#C33AFF] to-[#9D50FF] rounded-full shadow-lg"
      animate={{
        x: isYearly ? 32 : 0, // Adjust based on the actual size of the toggle
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    />
  </div>

  {/* Billed Yearly Label */}
  <div className="flex items-center gap-2">
  {/* Yearly Plan Label */}
  <span
    className={`text-sm font-semibold transition-all cursor-pointer ${
      isYearly ? "text-white" : "text-gray-400"
    }`}
  >
    {pricing.plans[0].yearlyPlanText}
  </span>

  {/* Save 33% Badge */}
  <span
    className="bg-[#9D50FF] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md bg-gradient-to-r from-purple-700 to-blue-400 "
  >
    {pricing.plans[0].planText || "Save 33%"}
  </span>
</div>


</div>

<p
  className="text-center text-sm font-medium text-white mt-6 mb-8 px-4 sm:px-0 leading-relaxed  bg-clip-text text-transparent"
>
  {pricing.plans[0].planTextBelow}
</p>


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
                <p className="text-4xl font-bold text-[#C33AFF] mb-6">
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
              className="inline-block w-full max-w-[200px] py-3 px-8 text-center font-semibold rounded-full transition-all hover:scale-105 shadow-lg"
              style={{
                background: plan.isGradient
                  ? `linear-gradient(${plan.gradientDirection || "to right"}, ${plan.gradientStart || "#C33AFF"}, ${plan.gradientEnd || "#9D50FF"})`
                  : plan.buttonColor,
                color: plan.buttonTextColor,
                boxShadow: `0px 4px 8px rgba(0, 0, 0, 0.3)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0px 4px 20px ${plan.glowColor || "rgba(128, 90, 213, 0.8)"}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0px 4px 8px rgba(0, 0, 0, 0.3)`;
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
