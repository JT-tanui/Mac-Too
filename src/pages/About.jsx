import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const teamMembers = [
    {
      name: 'Sarah MacKenzie',
      position: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: 'With over 15 years of experience in digital marketing, Sarah leads our agency with vision and innovation.',
      expertise: ['Strategic Planning', 'Brand Development', 'Team Leadership']
    },
    {
      name: 'James Too',
      position: 'CCO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: 'James brings creative excellence and strategic thinking to every project, ensuring outstanding results.',
      expertise: ['Creative Direction', 'Content Strategy', 'Brand Identity']
    },
    {
      name: 'Emily Rodriguez',
      position: 'Director of Digital Marketing',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: 'Emily specializes in creating data-driven digital marketing strategies that deliver measurable results.',
      expertise: ['Digital Marketing', 'Analytics', 'Campaign Management']
    },
    {
      name: 'Michael Chen',
      position: 'Head of Technology',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: 'Michael leads our technical initiatives, ensuring cutting-edge solutions for our clients.',
      expertise: ['Web Development', 'Technical Strategy', 'Innovation']
    }
  ];

  const awards = [
    {
      year: '2023',
      title: 'Agency of the Year',
      organization: 'Digital Marketing Excellence Awards'
    },
    {
      year: '2023',
      title: 'Best Brand Strategy',
      organization: 'Marketing Innovation Summit'
    },
    {
      year: '2022',
      title: 'Creative Excellence',
      organization: 'International Creative Awards'
    },
    {
      year: '2022',
      title: 'Best Digital Campaign',
      organization: 'Digital Impact Awards'
    }
  ];

  return (
    <div className="pt-16">
      {/* Agency Story Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-6">Our Story</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Founded in 2015 by Sarah MacKenzie and James Too, Mac & Too Agency 
              has grown from a small creative studio into a full-service digital 
              marketing powerhouse. Our journey is defined by innovation, 
              creativity, and an unwavering commitment to client success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Profiles Section */}
      <section ref={ref} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-gray-600">Meet the experts behind our success</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-blue-600 mb-4">{member.position}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="space-y-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture and Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Culture & Values</h2>
            <p className="text-gray-600">What drives us forward every day</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Innovation First',
                description: 'We embrace new technologies and approaches to deliver cutting-edge solutions.',
                icon: '💡'
              },
              {
                title: 'Client Success',
                description: 'Your success is our success. We\'re committed to delivering exceptional results.',
                icon: '🎯'
              },
              {
                title: 'Collaboration',
                description: 'We believe in the power of teamwork and open communication.',
                icon: '🤝'
              },
              {
                title: 'Diversity & Inclusion',
                description: 'We celebrate diversity and create an inclusive environment for all.',
                icon: '🌈'
              },
              {
                title: 'Continuous Learning',
                description: 'We invest in our team\'s growth and professional development.',
                icon: '📚'
              },
              {
                title: 'Sustainability',
                description: 'We\'re committed to sustainable practices and environmental responsibility.',
                icon: '🌱'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-gray-600">Celebrating our achievements in the industry</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6 flex items-center"
              >
                <div className="text-3xl font-bold text-blue-600 mr-6">
                  {award.year}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                  <p className="text-gray-600">{award.organization}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Environment Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Life at Mac & Too</h2>
            <p className="text-gray-600">Take a peek into our vibrant work culture</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                title: 'Collaborative Workspace'
              },
              {
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                title: 'Team Building Events'
              },
              {
                image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                title: 'Innovation Lab'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <h3 className="text-white text-xl font-bold p-6">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;