import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhbmRpbmclMjBwYWdlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1173",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFuZGluZyUyMHBhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
];

export default function Landing() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide}
            alt={`slide-${index}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex flex-col justify-center items-center text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
              Welcome to BlogApp
            </h1>
            <p className="text-white text-lg md:text-2xl mb-6">
              Read, Write and Share your thoughts
            </p>
            <button
              onClick={() => navigate("/blogs")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg font-semibold"
            >
              Explore Blogs
            </button>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 flex gap-3">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
