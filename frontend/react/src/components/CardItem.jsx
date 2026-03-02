import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User, Trash2, Edit3, Check, X } from 'lucide-react';
import API from '../services/api';

const CardItem = ({ card, index, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);

  // Handle inline title update
  const handleUpdate = async () => {
    if (editTitle.trim() === card.title) {
      setIsEditing(false);
      return;
    }

    try {
      const { data } = await API.patch(`/cards/${card._id}`, { title: editTitle });
      onUpdate(data); // Notify parent Board to update state
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update card");
      setEditTitle(card.title);
    }
  };

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-3 mb-3 rounded-lg shadow-sm border border-gray-200 group transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500 rotate-2' : 'hover:border-blue-300 hover:shadow-md'
          }`}
        >
          {/* Header Section */}
          <div className="flex justify-between items-start mb-2">
            {isEditing ? (
              <div className="flex flex-col w-full gap-2">
                <input
                  autoFocus
                  className="text-sm font-medium border-b-2 border-blue-500 outline-none w-full py-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="text-green-600 hover:bg-green-50 p-1 rounded">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <h4 className="text-sm font-semibold text-gray-700 leading-snug">
                {card.title}
              </h4>
            )}

            {!isEditing && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-gray-400 hover:text-blue-500 p-1"
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  onClick={() => onDelete(card._id)} 
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          
          {/* Description */}
          {card.description && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2 italic">
              {card.description}
            </p>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <Calendar size={12} className={card.dueDate ? 'text-blue-400' : ''} />
              <span>
                {card.dueDate ? new Date(card.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Deadline'}
              </span>
            </div>

            {/* Assigned User Display */}
            <div className="flex -space-x-1">
              {card.assignedTo ? (
                <div 
                  title={card.assignedTo.name}
                  className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] text-white border-2 border-white font-bold"
                >
                  {card.assignedTo.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-white">
                  <User size={10} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;