import React, { useState } from "react";
import CourseCard from "../components/CourseCard";
import FiltersSidebar from "../components/FilterOptions";
import SearchAndSortBar from "../components/SearchAndSort";
import Pagination from "../components/Pagination";
import image1 from "../assets/photo1.jpg";
import image2 from "../assets/photo2.jpg";
import image3 from "../assets/photo3.jpg";
import image4 from "../assets/photo4.jpg";
import image5 from "../assets/photo5.jpg";
import image6 from "../assets/photo6.jpg";
import image7 from "../assets/photo7.jpg";

const dummyCourses = [
  {
    id: 1,
    title: "Real Estate Investment Basics",
    author: "Kwk-Admin",
    students: Math.floor(Math.random() * 500),
    price: 100,
    image: image1,
  },
  {
    id: 2,
    title: "Property Management Essentials",
    author: "Kwk-Admin",
    students: Math.floor(Math.random() * 500),
    price: 150,
    image: image2,
  },
  {
    id: 3,
    title: "Advanced Real Estate Strategies",
    author: "Kwk-Admin",
    students: Math.floor(Math.random() * 500),
    price: 200,
    image: image3,
  },
  {
    id: 4,
    title: "Flipping Houses for Profit",
    author: "Kwk-Admin",
    students: Math.floor(Math.random() * 500),
    price: 120,
    image: image4,
  },
  {
    id: 5,
    title: "Real Estate Marketing Mastery",
    author: "Kwk-Admin",
    students: Math.floor(Math.random() * 500),
    price: 180,
    image: image5,
  },
  {
    id: 6,
    title: "Commercial Real Estate 101",
    author: "Kwk-Admin",
    students: Math.floor(Math.random() * 500),
    price: 250,
    image: image6,
  },
  {
    id: 7,
    title: "Real Estate for Beginners",
    author: "Kwk-Admin",
    students: Math.floor(Math.random() * 500),
    price: 80,
    image: image7,
  },
];

const Courses = () => {
  const [filters, setFilters] = useState({ categories: [], price: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const filtered = dummyCourses.filter((course) => {
    const matchCategory =
      filters.categories.length === 0 ||
      filters.categories.some((cat) => course.title.includes(cat));
    const matchPrice =
      filters.price === "" ||
      (filters.price === "Free" && course.price === 0) ||
      (filters.price === "Paid" && course.price > 0);
    const matchSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchPrice && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 pt-28 pb-16 px-4 md:px-10 mt-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar - now takes more width */}
          <div className="md:col-span-3 mt-16 ">
            <FiltersSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Content - centered better */}
          <div className="md:col-span-9 space-y-8">
            <SearchAndSortBar
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            <Pagination page={page} setPage={setPage} total={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
