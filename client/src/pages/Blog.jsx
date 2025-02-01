import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiShare2, FiUser, FiTag, FiSearch } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api';

const Blog = () => {
  const [posts] = useState([
    {
      id: 1,
      title: "Digital Marketing Trends for 2024",
      excerpt: "Explore the latest trends shaping the digital marketing landscape in 2024...",
      category: "Digital Marketing",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      tags: ["Marketing", "Digital", "Trends"]
    },
    {
      id: 2,
      title: "Building a Strong Brand Identity",
      excerpt: "Learn the essential elements of creating a memorable brand identity...",
      category: "Branding",
      author: "Michael Chen",
      date: "2024-01-10",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d",
      tags: ["Branding", "Design", "Identity"]
    },
    {
      id: 3,
      title: "Content Strategy Masterclass",
      excerpt: "Master the art of content strategy with our comprehensive guide...",
      category: "Content",
      author: "Emma Wilson",
      date: "2024-01-05",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1542435503-956c469947f6",
      tags: ["Content", "Strategy", "Marketing"]
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const categories = ['All', 'Digital Marketing', 'Branding', 'Content', 'Strategy'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (data.success) {
        setSubscribeStatus('success');
        setEmail('');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSubscribeStatus('error');
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Marketing Insights</h1>
            <p className="text-xl opacity-90">Latest trends, strategies, and thoughts from our experts</p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/fallback-image.jpg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <FiUser size={14} />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={14} />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      Read More →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-8">Get the latest marketing insights delivered to your inbox</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 flex-grow max-w-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </form>
          {subscribeStatus === 'success' && <p className="text-green-600 mt-4">Subscribed successfully!</p>}
          {subscribeStatus === 'error' && <p className="text-red-600 mt-4">Subscription failed. Please try again.</p>}
        </div>
      </section>
    </div>
  );
};

export default Blog;