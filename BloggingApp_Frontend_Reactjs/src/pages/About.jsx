import React from "react";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Sonu Kumar",
    role: "Full Stack Developer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Riya Sharma",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    name: "Amit Singh",
    role: "Backend Developer",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <h1 className="text-4xl font-bold text-center text-yellow-500 mb-6">
        About Us
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
        Welcome to MyBlogApp! We are a team of passionate developers and designers dedicated to creating modern, interactive, and user-friendly web experiences.
      </p>

      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Meet the Team
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
              <div className="flex justify-center gap-4 mt-2">
                <a href={member.social.linkedin} target="_blank" className="text-blue-600 hover:text-blue-400 transition">
                  LinkedIn
                </a>
                <a href={member.social.github} target="_blank" className="text-gray-800 dark:text-gray-100 hover:text-gray-400 transition">
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
