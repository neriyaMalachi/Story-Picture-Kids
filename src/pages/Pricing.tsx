import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React, { useState, useEffect } from 'react';

const Pricing = () => {
  const [animatedItems, setAnimatedItems] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedItems(['title', 'hardcover', 'softcover', 'booklet']);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Pricing plans
  const plans = [
    {
      id: 'hardcover',
      title: 'ספר כריכה קשה',
      price: '₪140',
      features: [
        'איכות מעולה',
        'כריכה קשה עמידה',
        'נייר משובח',
        'חוויית קריאה מושלמת'
      ]
    },
    {
      id: 'softcover',
      title: 'ספר כריכה רכה',
      price: '₪120',
      features: [
        'איכות טובה',
        'כריכה רכה גמישה',
        'מחיר משתלם',
        'קל לנשיאה'
      ],
      popular: true
    },
    {
      id: 'booklet',
      title: 'חוברת',
      price: '₪100',
      features: [
        'גרסה חסכונית',
        'קלה לנשיאה',
        'מחיר נוח',
        'אידיאלי לקריאה מהירה'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
    <Header />

    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-100 to-white" dir="rtl">
      <div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 transform transition-all duration-700 ${
            animatedItems.includes('title') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-4">סוגי ספרים</h1>
          <p className="text-xl text-purple-600 max-w-3xl mx-auto">בחר את הפורמט המושלם עבורך</p>
        </div>
        
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 ${
                  animatedItems.includes(plan.id) 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-16 opacity-0'
                } ${selectedPlan === plan.id ? 'ring-4 ring-purple-500 scale-105 z-10' : 'hover:scale-105'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute top-5 -left-12 w-40 transform rotate-45 bg-purple-700 text-white text-center py-1 font-bold shadow-md z-20">
                    הכי פופולרי
                  </div>
                )}
                
                <div className="p-6 md:p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-purple-800 mb-2">{plan.title}</h3>
                  <div className="text-5xl font-bold mb-6">{plan.price}</div>
                  
                  <ul className="mb-8 space-y-4 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 rounded-full w-6 h-6 mr-3 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                      selectedPlan === plan.id 
                        ? 'bg-purple-800 text-white shadow-lg' 
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-700 hover:text-white'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'נבחר ✓' : 'הזמן עכשיו'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div 
          className={`text-center mt-16 transition-all duration-700 ${
            animatedItems.includes('title') ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isMobile && (
            <p className="text-purple-600 text-sm mt-4">לחץ על החבילה המועדפת עליך לבחירה</p>
          )}
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
  );
};

export default Pricing;