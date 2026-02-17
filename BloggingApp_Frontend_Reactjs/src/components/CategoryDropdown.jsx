import React, { useEffect, useState } from "react";

const CategoryDropdown = ({ selectedCategory, onChange }) => {
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://127.0.0.1:8000/api/categories/");

        const data = await res.json();
        // Backend returns {"categories": [...]}
        const fetched = data.categories?.map((cat) => cat.name) || [];
        console.log("Fetch data:",data,fetched);
        setCategories(["All", ...fetched]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <select
      className="border px-3 py-2 rounded-md text-gray-700"
      value={selectedCategory}
      onChange={(e) => onChange(e.target.value)}
    >
      {categories.map((cat, idx) => (
        <option key={idx} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;