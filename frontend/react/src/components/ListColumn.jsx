import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import CardItem from './CardItem';
import { Plus, MoreVertical, GripVertical } from 'lucide-react';

const ListColumn = ({ list, cards, onAddCard, onDeleteCard, onUpdateCard }) => {
  return (
    <div className="w-80 flex-shrink-0 bg-gray-100 rounded-xl flex flex-col max-h-full shadow-sm border border-gray-200/50">
      {/* Column Header */}
      <div className="p-4 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-400 cursor-grab active:cursor-grabbing" />
          <h3 className="font-bold text-gray-700 tracking-tight">
            {list.title}
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-500 rounded-full font-medium">
              {cards.length}
            </span>
          </h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded-lg transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={list._id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-3 pb-2 min-h-[150px] transition-all duration-200 ease-in-out ${
              snapshot.isDraggingOver 
                ? 'bg-blue-50/50 ring-2 ring-blue-200 ring-inset' 
                : 'bg-transparent'
            }`}
          >
            {/* Note: Sorting is handled here to ensure cards stay in order 
              defined by the backend 'order' property.
            */}
            {cards
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((card, index) => (
                <CardItem 
                  key={card._id} 
                  card={card} 
                  index={index} 
                  onDelete={onDeleteCard} 
                  onUpdate={onUpdateCard} 
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Footer / Add Card Action */}
      <div className="p-3 bg-gray-50/50 rounded-b-xl border-t border-gray-200/30">
        <button 
          onClick={() => onAddCard(list._id)}
          className="w-full flex items-center justify-center gap-2 p-2.5 text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg transition-all text-sm font-semibold"
        >
          <Plus size={16} />
          Add a card
        </button>
      </div>
    </div>
  );
};

export default ListColumn;