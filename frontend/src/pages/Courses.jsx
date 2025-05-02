import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { ClipLoader } from "react-spinners";
import CourseCard from "../components/CourseCard";
import SearchAndSortBar from "../components/SearchAndSort";
import Pagination from "../components/Pagination";
import axiosInstance from "../api/axiosInstance";
import dubai1 from "../assets/dubai1.jpeg";
import dubai2 from "../assets/dubai2.jpg";
import dubai3 from "../assets/dubai3.avif";
import dubai4 from "../assets/dubai5.webp";
import dubai5 from "../assets/dubai6.jpg";
import dubai6 from "../assets/dubai7.webp";

// Static fallback courses
const staticCourses = [
  {
    _id: "off-plan",
    slug: "introduction-to-off-plan",
    title: "Introduction to Off Plan",
    description:
      "Discover Dubai's past, present, and future, and understand the off-plan process.",
    price: 0,
    thumbnailUrl: dubai1,
    comingSoon: false,
  },
  {
    _id: "leasing",
    slug: "introduction-to-leasing",
    title: "Introduction to Leasing",
    description: "Coming soon",
    price: 0,
    thumbnailUrl: dubai2,
    comingSoon: true,
  },
  {
    _id: "secondary",
    slug: "introduction-to-secondary",
    title: "Introduction to Secondary",
    description: "Coming soon",
    price: 0,
    thumbnailUrl: dubai3,
    comingSoon: true,
  },
  {
    _id: "sales-techniques",
    slug: "sales-techniques",
    title: "Sales Techniques",
    description: "Coming soon",
    price: 0,
    thumbnailUrl: dubai4,
    comingSoon: true,
  },
  {
    _id: "area-guides",
    slug: "dubai-area-guides",
    title: "Dubai Area Guides",
    description: "Coming soon",
    price: 0,
    thumbnailUrl: dubai5,
    comingSoon: true,
  },
  {
    _id: "property-developers",
    slug: "dubai-property-developers",
    title: "Dubai Property Developers",
    description: "Coming soon",
    price: 0,
    thumbnailUrl: dubai6,
    comingSoon: true,
  },
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        setCourses(list.length ? list : staticCourses);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to load courses.");
        setCourses(staticCourses); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const processed = useMemo(() => {
    return courses
      .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sort === "priceLow") return a.price - b.price;
        if (sort === "priceHigh") return b.price - a.price;
        return 0;
      });
  }, [courses, search, sort]);

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
          content="Explore a variety of real estate training courses in AED, including property investment, licensing, negotiation, and more. Learn from expert Kirren."
        />
        <meta
          name="keywords"
          content="real estate courses, property training, real estate licensing, real estate investment, online property course, AED"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <section className="space-y-8">
            <SearchAndSortBar
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
            />

            {processed.length > 0 && (
              <p className="text-sm text-gray-600 text-right">
                Showing {(page - 1) * perPage + 1}–
                {Math.min(page * perPage, processed.length)} of {processed.length} results
              </p>
            )}

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
