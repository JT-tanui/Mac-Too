import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const services = [
    {
      category: 'Branding',
      description: 'Build a powerful brand identity that resonates with your target audience and sets you apart from competitors.',
      services: [
        'Brand Strategy Development',
        'Visual Identity Design',
        'Brand Guidelines',
        'Brand Voice & Messaging',
        'Logo Design',
        'Brand Collateral'
      ],
      caseStudy: {
        client: 'EcoGreen Solutions',
        challenge: 'Needed a complete brand refresh to appeal to environmentally conscious consumers',
        solution: 'Developed a modern, sustainable brand identity that increased market share by 45%',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    },
    {
      category: 'Digital Marketing',
      description: 'Drive growth and engagement through data-driven digital marketing strategies and campaigns.',
      services: [
        'Search Engine Optimization (SEO)',
        'Pay-Per-Click Advertising',
        'Social Media Marketing',
        'Email Marketing',
        'Content Marketing',
        'Analytics & Reporting'
      ],
      caseStudy: {
        client: 'TechStart Innovation',
        challenge: 'Needed to increase online visibility and lead generation',
        solution: 'Implemented comprehensive digital strategy resulting in 200% increase in qualified leads',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    },
    {
      category: 'Content Creation',
      description: 'Engage your audience with compelling content that drives conversions and builds brand loyalty.',
      services: [
        'Copywriting',
        'Blog Content',
        'Video Production',
        'Social Media Content',
        'Infographics',
        'Case Studies'
      ],
      caseStudy: {
        client: 'HealthFirst Medical',
        challenge: 'Required engaging content to educate and attract patients',
        solution: 'Created multi-channel content strategy that increased engagement by 300%',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-6">Our Services</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Comprehensive marketing solutions tailored to your business goals.
              From brand development to digital marketing and content creation,
              we deliver results that matter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={ref} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="mb-20 last:mb-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-4">{service.category}</h2>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.services.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 text-blue-600 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Get Started with {service.category}
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Case Study: {service.caseStudy.client}</h3>
                    <img
                      src={service.caseStudy.image}
                      alt={service.caseStudy.client}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Challenge:</h4>
                        <p className="text-gray-600">{service.caseStudy.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Solution:</h4>
                        <p className="text-gray-600">{service.caseStudy.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Brand?</h2>
            <p className="text-gray-600 mb-8">
              Let's discuss how we can help you achieve your marketing goals.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Schedule a Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;