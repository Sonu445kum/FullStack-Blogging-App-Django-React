import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Footer() {
  // Dynamic social links
  const socialLinks = [
    { icon: <FaTwitter />, url: "https://twitter.com/yourprofile", label: "Twitter" },
    { icon: <FaFacebookF />, url: "https://facebook.com/yourprofile", label: "Facebook" },
    { icon: <FaInstagram />, url: "https://instagram.com/yourprofile", label: "Instagram" },
    { icon: <FaLinkedinIn />, url: "https://linkedin.com/in/yourprofile", label: "LinkedIn" },
    { icon: <FaGithub />, url: "https://github.com/Sonu445kum", label: "GitHub" },
  ];

  const quickLinks = ["Home", "Blogs", "Contact", "Privacy Policy"];

  return (
    <footer className="bg-gray-900 dark:bg-gray-100 text-gray-300 dark:text-gray-700 mt-16 border-t border-gray-800 dark:border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-yellow-500">About Us</h3>
          <p className="text-sm leading-relaxed">
            MyBlogApp is your trusted blogging platform — write, explore and share your ideas with the world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-yellow-500">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link, i) => (
              <motion.li key={i} whileHover={{ x: 5 }} className="transition-colors">
                <Link
                  to={`/${link.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-yellow-500"
                >
                  {link}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-yellow-500">Connect With Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            {socialLinks.map((social, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.2 }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-xl hover:text-yellow-500 transition-colors"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-sm py-4 border-t border-gray-800 dark:border-gray-300">
        © {new Date().getFullYear()} <span className="text-yellow-500 font-semibold">SonuBlogApp</span>. All rights reserved.
      </div>
    </footer>
  );
}
