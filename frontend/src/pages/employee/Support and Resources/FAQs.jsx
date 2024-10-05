import { useState } from 'react';

const FAQs = () => {
  const [faqs, setFaqs] = useState([
    {
      question: 'What does JJM Company do?',
      answer: 'JJM Company is a leading provider of innovative solutions.',
    },
    {
      question: 'How do I contact JJM Company?',
      answer: 'You can contact us through our website or by phone.',
    },
    {
      question: 'What are JJM Company\'s business hours?',
      answer: 'Our business hours are Monday to Friday, 9am to 5pm.',
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(-1);

  const handleToggle = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4">
          <button
            className="flex justify-between w-full text-left text-lg font-bold text-gray-900"
            onClick={() => handleToggle(index)}
          >
            <span>{faq.question}</span>
            <span className={`text-lg ${activeIndex === index ? 'text-gray-900' : 'text-gray-500'}`}>
              {activeIndex === index ? '-' : '+'}
            </span>
          </button>
          {activeIndex === index && (
            <div className="text-lg text-gray-600 mt-2">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQs;
