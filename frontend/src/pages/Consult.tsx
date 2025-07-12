import React, { useState } from "react";
import PodcastHighlight from "../components/PodcastHighlight";
import ConsultationFormModal from "../components/ConsultationFormModal";
import kirren1 from "../assets/kirren1.jpg";
import dubaiskyline from "../assets/Dubai-Skyline.jpg";
import { Link } from "react-router-dom";
import logoLight from "../assets/darklogo.webp";
const Consult = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitForm = (formData) => {
    console.log("Form submitted:", formData);
  };

  return (
    <main>
      <section className="relative min-h-screen w-full flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent z-10"></div>
          <img
            src={dubaiskyline}
            alt="Dubai Skyline"
            className="h-full w-full object-cover object-right md:object-center transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
          />
        </div>

        <div className="relative z-20 px-6 py-24 sm:px-12 lg:px-24 xl:px-32 text-white w-full max-w-7xl">
          <div className="backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative group">
                <img
                  src={kirren1}
                  alt="Kirren"
                  className="w-48 h-48 rounded-full object-cover border-4 border-[rgb(0,104,80)] shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold text-white">Kirren Aujla</h3>
                <p className="text-[rgb(0,104,80)]  font-medium">
                  Real Estate Expert
                </p>
                <div>
                  <div className="flex justify-center space-x-3 mt-3 items-center">
                    <a
                      href="https://www.linkedin.com/company/koffee-with-kirren/"
                      target="_blank"
                      className="text-white hover:text-[rgb(0,104,80)] transition-colors"
                    >
                      <svg
                        stroke="currentColor"
                        className="w-5 h-5"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://www.youtube.com/@KoffeewithKirren"
                      target="_blank"
                      className="text-white hover:text-[rgb(0,104,80)] transition-colors"
                    >
                      <svg
                        stroke="currentColor"
                        className="w-5 h-5"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 576 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://www.tiktok.com/@koffeewithkirren"
                      target="_blank"
                      className="text-white hover:text-[rgb(0,104,80)] transition-colors"
                    >
                      <svg
                        stroke="currentColor"
                        className="w-5 h-5"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://www.facebook.com/share/18c2MMRyJR/"
                      target="_blank"
                      className="text-white hover:text-[rgb(0,104,80)] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 320 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                      </svg>
                    </a>
                  </div>
                  <div className="flex justify-center space-x-3 mt-3 items-center">
                    <a
                      href="https://www.instagram.com/koffeewithkirren"
                      target="_blank"
                      className="text-white hover:text-[rgb(0,104,80)]  transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/971555547963"
                      target="_blank"
                      className="text-white hover:text-[rgb(0,104,80)] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-7 lg:mt-10">
                  <img
                    src={logoLight}
                    alt="Logo"
                    className="h-24 w-24 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-green-400 to-[rgb(0,104,80)] bg-clip-text text-transparent">
                  Your Expert Guide to Profitable Dubai Property Investments
                </span>
                <br />
                <span className="text-white">Free Consultation</span>
              </h1>

              <div className="border-l-4 border-[rgb(0,104,80)] pl-4 mb-8">
                <p className="text-lg sm:text-xl font-light leading-relaxed text-gray-100 opacity-90">
                  Leverage 26+ years of real estate expertise to identify
                  high-yield properties and navigate the Dubai market with
                  confidence. My approach cuts through the noise, providing
                  clear, actionable insights for serious investors. Direct,
                  one-on-one time with Kirren – not a sales pitch, only guidance
                  and an informal Koffee with Kirren.
                </p>
              </div>

              {/* <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-gray-100">
                    Direct one-on-one time with Kirren
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-gray-100">
                    No sales pitch - just valuable insights
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-gray-100">
                    Personalized market analysis
                  </p>
                </div>
              </div> */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <button
                  onClick={() => setIsModalOpen(true)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="max-sm:w-full cursor-pointer relative overflow-hidden group flex items-center justify-center px-8 py-4 text-lg font-medium tracking-wide text-gray-900 bg-gradient-to-r from-green-400 to-[rgb(0,104,80)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center">
                    Book Free Consultation
                    <svg
                      className={`ml-3 w-5 h-5 transition-transform duration-300 ${
                        isHovered ? "translate-x-1" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-[rgb(0,104,80)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
                <Link
                  to="/"
                  className="max-sm:w-full text-center py-3.5 px-5 rounded-xl border-2 border-solid border-[rgb(0,104,80)] hover:bg-[rgb(0,104,80)] duration-150"
                >
                  Visit Our Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ConsultationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
      />
      <PodcastHighlight />
    </main>
  );
};

export default Consult;
