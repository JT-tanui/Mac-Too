import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong.</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

const Portfolio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const projects = [
    {
      title: "EcoGreen Brand Transformation",
      client: "EcoGreen Solutions",
      industry: "sustainability",
      service: "branding",
      year: 2023,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      challenge: "EcoGreen needed a complete brand refresh to better connect with environmentally conscious consumers.",
      solution: "We developed a modern, sustainable brand identity that resonated with their target audience.",
      results: [
        "45% increase in market share",
        "200% increase in social media engagement",
        "3x increase in website traffic"
      ],
      testimonial: {
        text: "Mac & Too transformed our brand into something truly special. The results exceeded our expectations.",
        author: "Sarah Chen",
        position: "CEO, EcoGreen Solutions"
      }
    },
    {
      title: "TechStart Digital Growth Campaign",
      client: "TechStart Innovation",
      industry: "technology",
      service: "digital-marketing",
      year: 2023,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      challenge: "TechStart needed to increase their online visibility and generate more qualified leads.",
      solution: "We implemented a comprehensive digital marketing strategy across multiple channels.",
      results: [
        "200% increase in qualified leads",
        "150% increase in conversion rate",
        "4x ROI on marketing spend"
      ],
      testimonial: {
        text: "The digital marketing campaign exceeded all our KPIs and transformed our lead generation process.",
        author: "Michael Park",
        position: "Marketing Director, TechStart"
      }
    },
    {
      title: "HealthFirst Content Strategy",
      client: "HealthFirst Medical",
      industry: "healthcare",
      service: "content",
      year: 2023,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      challenge: "HealthFirst needed engaging content to educate and attract potential patients.",
      solution: "We created a multi-channel content strategy focused on patient education and engagement.",
      results: [
        "300% increase in content engagement",
        "250% increase in organic traffic",
        "2x increase in patient inquiries"
      ],
      testimonial: {
        text: "The content strategy completely transformed how we connect with our patients.",
        author: "Dr. Emily Rodriguez",
        position: "Director, HealthFirst Medical"
      }
    }
  ];

  const filteredProjects = projects
    .filter(project => 
      (selectedIndustry === 'all' || project.industry === selectedIndustry) &&
      (selectedService === 'all' || project.service === selectedService)
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return b.year - a.year;
      }
      return a.title.localeCompare(b.title);
    });

  // Add image error handler
  const handleImageError = (e) => {
    e.target.src = '/fallback-image.jpg';
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
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
                <h1 className="text-4xl font-bold mb-6">Our Portfolio</h1>
                <p className="text-xl max-w-3xl mx-auto">
                  Explore our successful projects and see how we've helped businesses
                  achieve their marketing goals through innovative solutions.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Filter Section */}
          <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Industries</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                </select>

                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Services</option>
                  <option value="branding">Branding</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="content">Content Creation</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="name">Project Name</option>
                </select>
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section ref={ref} className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-64 object-cover"
                      onError={handleImageError}
                    />
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.client}</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                        <p className="text-gray-600">{project.challenge}</p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                        <p className="text-gray-600">{project.solution}</p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Results:</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {project.results.map((result, i) => (
                            <li key={i}>{result}</li>
                          ))}
                        </ul>
                      </div>

                      <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-600 mb-6">
                        "{project.testimonial.text}"
                        <footer className="mt-2 text-gray-500 not-italic">
                          - {project.testimonial.author}, {project.testimonial.position}
                        </footer>
                      </blockquote>

                      <Link
                        to="/contact"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Start Similar Project
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>

                <p className="text-xl text-gray-600 mb-8">
                  Let's work together to create something amazing for your business.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold"
                >
                  Contact Us Today
                </Link>
              </motion.div>
            </div>
          </section>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

// PropTypes
Portfolio.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.required,
      client: PropTypes.string.required,
      industry: PropTypes.string.required,
      service: PropTypes.string.required,
      year: PropTypes.number.required,
      image: PropTypes.string.required,
      challenge: PropTypes.string.required,
      solution: PropTypes.string.required,
      results: PropTypes.arrayOf(PropTypes.string).required,
      testimonial: PropTypes.shape({
        text: PropTypes.string.required,
        author: PropTypes.string.required,
        position: PropTypes.string.required
      }).required
    })
  )
};

export default Portfolio;