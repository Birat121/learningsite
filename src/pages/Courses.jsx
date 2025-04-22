// src/pages/Courses.jsx
// src/pages/Courses.jsx
import React, { useEffect, useState } from "react";

import CourseCard from "../components/CourseCard";
import FiltersSidebar from "../components/FilterOptions";
import SearchAndSortBar from "../components/SearchAndSort";
import Pagination from "../components/Pagination";
import axiosInstance from "../api/axiosInstance";


const Courses = () => {
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filters, setFilters]       = useState({ categories: [], price: "" });
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("latest");
  const [page, setPage]             = useState(1);
  const perPage = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/videos/videos");
        // ensure we only store an array
        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.videos)
          ? data.videos
          : [];
        setCourses(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // now `courses` is guaranteed an array
  const processed = courses
    .filter((c) => {
      const matchCategory =
        filters.categories.length === 0 ||
        filters.categories.some((cat) => c.category?.includes(cat));
      const matchPrice =
        filters.price === "" ||
        (filters.price === "Free" && c.price === 0) ||
        (filters.price === "Paid" && c.price > 0);
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchPrice && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "latest")  return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest")  return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "priceLow")  return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      return 0;
    });

  const total     = Math.ceil(processed.length / perPage);
  const paginated = processed.slice((page - 1) * perPage, page * perPage);

  if (loading) return <p className="text-center mt-10">Loading courses…</p>;
  if (error)   return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 pt-28 pb-16 px-4 md:px-10 mt-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <aside className="md:col-span-3 mt-16">
            <FiltersSidebar filters={filters} setFilters={setFilters} />
          </aside>

          <section className="md:col-span-9 space-y-8">
            <SearchAndSortBar
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            <Pagination page={page} setPage={setPage} total={total} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Courses;
