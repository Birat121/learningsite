import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState({}); // { type: 'course'|'module'|'video', id, field, value }
  const [loading, setLoading] = useState(false);

  // Fetch all courses with modules and videos
  const fetchCourses = async () => {
    setLoading(true);
    try {
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

  // Start editing a field
  const startEdit = (type, id, field, currentValue) => {
    setEditing({ type, id, field, value: currentValue });
  };

  // Cancel editing
  const cancelEdit = () => setEditing({});

  // Change value on input
  const onEditChange = (e) => setEditing((ed) => ({ ...ed, value: e.target.value }));

  // Save edited field
  const saveEdit = async () => {
    if (!editing.value.trim()) {
      toast.error('Value cannot be empty');
      return;
    }

    const { type, id, field, value } = editing;

    try {
      let url = '';
      let body = { [field]: value };

      switch (type) {
        case 'course':
          url = `/courses/course/${id}`;
          break;
        case 'module':
          url = `/modules/module/${id}`;
          break;
        case 'video':
          url = `/videos/videos/${id}`;
          break;
        default:
          return;
      }

      await axiosInstance.put(url, body);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated!`);
      setEditing({});
      fetchCourses(); // refresh list
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    }
  };

  // Delete item (course/module/video)
  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure to delete this ${type}? This cannot be undone.`)) return;

    try {
      let url = '';
      switch (type) {
        case 'course':
          url = `/courses/course/${id}`;
          break;
        case 'module':
          url = `/modules/module/${id}`;
          break;
        case 'video':
          url = `/videos/videos/${id}`;
          break;
        default:
          return;
      }

      await axiosInstance.delete(url);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`);
      fetchCourses();
    } catch (err) {
      toast.error('Delete failed');
      console.error(err);
    }
  };

  // Render editable field or text
  const renderField = (type, item, field) => {
    if (editing.type === type && editing.id === item._id && editing.field === field) {
      return (
        <>
          <input
            type="text"
            value={editing.value}
            onChange={onEditChange}
            className="border p-1 rounded mr-2"
          />
          <button onClick={saveEdit} className="text-green-600 mr-2">Save</button>
          <button onClick={cancelEdit} className="text-red-600">Cancel</button>
        </>
      );
    }
    return (
      <span
        className="cursor-pointer underline"
        onClick={() => startEdit(type, item._id, field, item[field])}
        title="Click to edit"
      >
        {item[field] || '—'}
      </span>
    );
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Courses Management</h1>

      {courses.length === 0 && <p>No courses found.</p>}

      {courses.map((course) => (
        <div key={course._id} className="mb-8 border rounded p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              {renderField('course', course, 'title')}
            </h2>
            <button
              onClick={() => deleteItem('course', course._id)}
              className="text-red-600 hover:underline"
            >
              Delete Course
            </button>
          </div>
          <p>Description: {renderField('course', course, 'description')}</p>
          <p>Price: {renderField('course', course, 'price')}</p>

          <div className="ml-4 mt-4">
            <h3 className="font-semibold mb-2">Modules:</h3>
            {course.modules?.length > 0 ? (
              course.modules.map((mod) => (
                <div key={mod._id} className="mb-4 border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <strong>{renderField('module', mod, 'title')}</strong>
                    <button
                      onClick={() => deleteItem('module', mod._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete Module
                    </button>
                  </div>
                  <p>Description: {renderField('module', mod, 'description')}</p>

                  <div className="ml-4 mt-2">
                    <h4 className="font-medium mb-1">Videos:</h4>
                    {mod.videos?.length > 0 ? (
                      mod.videos.map((vid) => (
                        <div key={vid._id} className="mb-2 flex justify-between items-center">
                          <span>{renderField('video', vid, 'title')}</span>
                          <button
                            onClick={() => deleteItem('video', vid._id)}
                            className="text-red-400 hover:underline"
                          >
                            Delete Video
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="italic">No videos.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="italic">No modules.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseManagementPage;
