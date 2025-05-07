import { Clock, Users, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

const PopularCoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Courses" },
    { id: "development", name: "Development" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
    { id: "data", name: "Data Science" }
  ];

  const courses = [
    {
      id: 1,
      title: "Modern Web Development Bootcamp",
      instructor: "Alex Morgan",
      image: "/api/placeholder/400/250", // Replace with actual image
      rating: 4.9,
      students: 4328,
      duration: "8 weeks",
      price: 79.99,
      category: "development",
      badge: "Bestseller"
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Jessica Chen",
      image: "/api/placeholder/400/250", // Replace with actual image
      rating: 4.8,
      students: 3150,
      duration: "6 weeks",
      price: 69.99,
      category: "design",
      badge: "New"
    },
    {
      id: 3,
      title: "Data Analytics for Business Decisions",
      instructor: "Michael Johnson",
      image: "/api/placeholder/400/250", // Replace with actual image
      rating: 4.7,
      students: 2875,
      duration: "10 weeks",
      price: 89.99,
      category: "data",
      badge: null
    },
    {
      id: 4,
      title: "Project Management Professional",
      instructor: "Sarah Williams",
      image: "/api/placeholder/400/250", // Replace with actual image
      rating: 4.9,
      students: 5120,
      duration: "12 weeks",
      price: 99.99,
      category: "business",
      badge: "Bestseller"
    },
    {
      id: 5,
      title: "Machine Learning Fundamentals",
      instructor: "David Lee",
      image: "/api/placeholder/400/250", // Replace with actual image
      rating: 4.8,
      students: 2560,
      duration: "8 weeks",
      price: 84.99,
      category: "data",
      badge: "Popular"
    },
    {
      id: 6,
      title: "Advanced React Development",
      instructor: "Emily Rodriguez",
      image: "/api/placeholder/400/250", // Replace with actual image
      rating: 4.9,
      students: 3250,
      duration: "6 weeks",
      price: 74.99,
      category: "development",
      badge: null
    }
  ];

  const filteredCourses = 
    activeCategory === "all" 
      ? courses 
      : courses.filter(course => course.category === activeCategory);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Most Popular <span className="text-blue-600">Courses</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore our top-rated courses designed to help you master in-demand skills and advance your career.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
              {/* Course Image */}
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                {course.badge && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {course.badge}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center text-white">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{course.rating}</span>
                    <span className="mx-1 text-xs">•</span>
                    <span className="text-sm">{course.students.toLocaleString()} students</span>
                  </div>
                </div>
              </div>
              
              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">Instructor: {course.instructor}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="text-blue-600 font-bold">${course.price}</div>
                </div>
                
                <a 
                  href={`/courses/${course.id}`} 
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition"
                >
                  View Course
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a 
            href="/courses" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View all courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularCoursesSection;