import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import EditableField from './EditableField';
import CollapsibleSection from './CollapsibleSection';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Assuming backend returns courses with populated modules and modules with populated videos
      const { data } = await axiosInstance.get('/courses/course?populate=modules,videos');
      setCourses(data);
    } catch (err) {
      toast.error('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const startEdit = (type, id, field, currentValue) => {
    setEditing({ type, id, field, value: currentValue });
  };

  const cancelEdit = () => setEditing({});

  const onEditChange = (e) => setEditing((ed) => ({ ...ed, value: e.target.value }));

  const saveEdit = async () => {
    if (!editing.value.trim()) {
      toast.error('Value cannot be empty');
      return;
    }

    const { type, id, field, value } = editing;
    try {
      const url =
        type === 'course'
          ? `/courses/course/${id}`
          : type === 'module'
          ? `/modules/module/${id}`
          : `/videos/videos/${id}`;
      await axiosInstance.put(url, { [field]: value });

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated!`);
      setEditing({});
      fetchCourses();
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure to delete this ${type}? This cannot be undone.`)) return;
    try {
      const url =
        type === 'course'
          ? `/courses/course/${id}`
          : type === 'module'
          ? `/modules/module/${id}`
          : `/videos/videos/${id}`;
      await axiosInstance.delete(url);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`);
      fetchCourses();
    } catch (err) {
      toast.error('Delete failed');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
        <style>{`
          .loader {
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-900 drop-shadow-md">
        Courses Management
      </h1>

      {courses.length === 0 && (
        <p className="text-center text-gray-600 italic">No courses found.</p>
      )}

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-semibold text-blue-800 hover:text-blue-600 cursor-pointer">
                  <EditableField
                    type="course"
                    item={course}
                    field="title"
                    editing={editing}
                    onEdit={startEdit}
                    onChange={onEditChange}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                  />
                </h2>
                <button
                  onClick={() => deleteItem('course', course._id)}
                  className="text-red-600 hover:text-red-700 font-semibold"
                  title="Delete Course"
                >
                  ✕
                </button>
              </div>
              <p className="mb-2 text-gray-700">
                <span className="font-semibold">Description: </span>
                <EditableField
                  type="course"
                  item={course}
                  field="description"
                  editing={editing}
                  onEdit={startEdit}
                  onChange={onEditChange}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                />
              </p>
              <p className="mb-4 text-gray-700">
                <span className="font-semibold">Price: </span>₹{' '}
                <EditableField
                  type="course"
                  item={course}
                  field="price"
                  editing={editing}
                  onEdit={startEdit}
                  onChange={onEditChange}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                />
              </p>

              <CollapsibleSection title={`Modules (${course.modules?.length || 0})`}>
                {course.modules?.length > 0 ? (
                  course.modules.map((mod) => (
                    <div
                      key={mod._id}
                      className="bg-gray-100 rounded-md p-3 mb-4 border border-gray-300"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-800">
                          <EditableField
                            type="module"
                            item={mod}
                            field="title"
                            editing={editing}
                            onEdit={startEdit}
                            onChange={onEditChange}
                            onSave={saveEdit}
                            onCancel={cancelEdit}
                          />
                        </h3>
                        <button
                          onClick={() => deleteItem('module', mod._id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                          title="Delete Module"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="mb-2 text-gray-600 text-sm">
                        <span className="font-semibold">Description: </span>
                        <EditableField
                          type="module"
                          item={mod}
                          field="description"
                          editing={editing}
                          onEdit={startEdit}
                          onChange={onEditChange}
                          onSave={saveEdit}
                          onCancel={cancelEdit}
                        />
                      </p>

                      <CollapsibleSection title={`Videos (${mod.videos?.length || 0})`}>
                        {mod.videos?.length > 0 ? (
                          mod.videos.map((vid) => (
                            <div
                              key={vid._id}
                              className="flex justify-between items-center mb-2 text-sm"
                            >
                              <EditableField
                                type="video"
                                item={vid}
                                field="title"
                                editing={editing}
                                onEdit={startEdit}
                                onChange={onEditChange}
                                onSave={saveEdit}
                                onCancel={cancelEdit}
                              />
                              <button
                                onClick={() => deleteItem('video', vid._id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete Video"
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="italic text-gray-500 text-xs ml-2">
                            No videos available.
                          </p>
                        )}
                      </CollapsibleSection>
                    </div>
                  ))
                ) : (
                  <p className="italic text-gray-500 text-sm ml-2">
                    No modules available for this course.
                  </p>
                )}
              </CollapsibleSection>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagementPage;
