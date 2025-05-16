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

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Courses Management</h1>

      {courses.length === 0 && <p>No courses found.</p>}

      {courses.map((course) => (
        <div key={course._id} className="mb-8 p-5 border rounded-xl shadow-sm bg-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-blue-800">
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
              className="text-red-600 hover:underline"
            >
              Delete Course
            </button>
          </div>
          <p>
            Description:{' '}
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
          <p>
            Price: ₹{' '}
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

          <CollapsibleSection title="Modules">
            {course.modules?.length > 0 ? (
              course.modules.map((mod) => (
                <div key={mod._id} className="mb-4 bg-gray-50 rounded p-3 border">
                  <div className="flex justify-between items-center mb-1">
                    <strong>
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
                    </strong>
                    <button
                      onClick={() => deleteItem('module', mod._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete Module
                    </button>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Description:{' '}
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

                  <CollapsibleSection title="Videos">
                    {mod.videos?.length > 0 ? (
                      mod.videos.map((vid) => (
                        <div
                          key={vid._id}
                          className="mb-2 flex justify-between items-center text-sm"
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
                            className="text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="italic text-gray-500">No videos.</p>
                    )}
                  </CollapsibleSection>
                </div>
              ))
            ) : (
              <p className="italic text-sm text-gray-500">No modules available.</p>
            )}
          </CollapsibleSection>
        </div>
      ))}
    </div>
  );
};

export default CourseManagementPage;
