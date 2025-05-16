import React from 'react';

const EditableField = ({ type, item, field, editing, onEdit, onChange, onSave, onCancel }) => {
  const isEditing = editing.type === type && editing.id === item._id && editing.field === field;

  return isEditing ? (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={editing.value}
        onChange={onChange}
        className="border p-1 rounded w-full"
      />
      <button onClick={onSave} className="text-green-600 font-medium">Save</button>
      <button onClick={onCancel} className="text-red-600">Cancel</button>
    </div>
  ) : (
    <span
      className="cursor-pointer underline hover:text-blue-600"
      onClick={() => onEdit(type, item._id, field, item[field])}
      title="Click to edit"
    >
      {item[field] || '—'}
    </span>
  );
};

export default EditableField;
