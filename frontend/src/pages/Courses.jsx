import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { ClipLoader } from "react-spinners";
import CourseCard from "../components/CourseCard";
import FiltersSidebar from "../components/FilterOptions";
import SearchAndSortBar from "../components/SearchAndSort";
import Pagination from "../components/Pagination";
import axiosInstance from "../api/axiosInstance";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ propertyTypes: [], priceRange: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/videos/videos");
        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.videos)
          ? data.videos
          : [];
        setCourses(list);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    setPage(1); // Reset page on filter change
  }, [filters, search, sort]);

  const matchPriceRange = (price, range) => {
    switch (range) {
      case "Under $50,000":
        return price < 50000;
      case "$50,000 - $100,000":
        return price >= 50000 && price <= 100000;
      case "$100,000 - $250,000":
        return price > 100000 && price <= 250000;
      case "$250,000 - $500,000":
        return price > 250000 && price <= 500000;
      case "Above $500,000":
        return price > 500000;
      default:
        return true;
    }
  };

  const processed = useMemo(() => {
    return courses
      .filter((c) => {
        const matchType =
          filters.propertyTypes.length === 0 ||
          filters.propertyTypes.some((type) => c.category?.includes(type));
        const matchPrice =
          filters.priceRange === "" || matchPriceRange(c.price, filters.priceRange);
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
        return matchType && matchPrice && matchSearch;
      })
      .sort((a, b) => {
        if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sort === "priceLow") return a.price - b.price;
        if (sort === "priceHigh") return b.price - a.price;
        return 0;
      });
  }, [courses, filters, search, sort]);

  const total = Math.ceil(processed.length / perPage);
  const paginated = useMemo(() => {
    return processed.slice((page - 1) * perPage, page * perPage);
  }, [processed, page]);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <ClipLoader color="#4A90E2" size={50} />
        <p>Loading courses…</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-28 pb-16 px-4 md:px-10 mt-16">
      <Helmet>
        <title>Courses | Kirren Real Estate Training</title>
        <meta
          name="description"
          content="Explore a variety of real estate training courses, including property investment, licensing, negotiation, and more. Learn from expert Kirren."
        />
        <meta
          name="keywords"
          content="real estate courses, property training, real estate licensing, real estate investment, online property course"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-3 mt-16">
            <FiltersSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Main Content */}
          <section className="md:col-span-9 space-y-8">
            <SearchAndSortBar
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
            />

            {paginated.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No courses found matching your criteria.
              </p>
            )}

            <Pagination page={page} setPage={setPage} total={total} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Courses;


