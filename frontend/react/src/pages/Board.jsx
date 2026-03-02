import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import API from '../services/api';
import ListColumn from '../components/ListColumn';
import ActivityPanel from '../components/ActivityPanel';

const Board = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // FETCH ALL DATA
  const fetchBoardData = useCallback(async () => {
    try {
      const [boardRes, activityRes] = await Promise.all([
        API.get(`/boards/${id}`),
        API.get(`/boards/${id}/activity`)
      ]);

      setBoard(boardRes.data.board);
      setLists(boardRes.data.lists);
      setCards(boardRes.data.cards);
      setActivities(activityRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // INITIAL LOAD & POLLING
  useEffect(() => {
    fetchBoardData();
    const interval = setInterval(fetchBoardData, 10000); // Polling every 10s to reduce server load
    return () => clearInterval(interval);
  }, [fetchBoardData]);

  // DRAG AND DROP LOGIC
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // 1. Optimistic UI Update
    const originalCards = [...cards];
    const updatedCards = cards.map((card) => {
      if (card._id === draggableId) {
        return { 
          ...card, 
          list: destination.droppableId, 
          order: destination.index 
        };
      }
      return card;
    });
    setCards(updatedCards);

    try {
      // 2. Persistent Update
      await API.patch(`/cards/${draggableId}/move`, {
        newListId: destination.droppableId,
        newIndex: destination.index
      });
      
      // Refresh activity to show the "move" action
      const activityRes = await API.get(`/boards/${id}/activity`);
      setActivities(activityRes.data);
    } catch (err) {
      setCards(originalCards); // Rollback
      alert("Failed to sync move with server.");
    }
  };

  // CARD ACTIONS
  const handleAddCard = async (listId) => {
    const title = prompt("Enter card title:");
    if (!title) return;

    try {
      const { data } = await API.post('/cards', { title, listId, boardId: id });
      setCards((prev) => [...prev, data]);
      
      // Sync activity
      const activityRes = await API.get(`/boards/${id}/activity`);
      setActivities(activityRes.data);
    } catch (err) {
      alert("Error adding card");
    }
  };

  const handleUpdateCard = (updatedCard) => {
    setCards((prev) => 
      prev.map((c) => (c._id === updatedCard._id ? updatedCard : c))
    );
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    try {
      await API.delete(`/cards/${cardId}`);
      setCards((prev) => prev.filter((c) => c._id !== cardId));
    } catch (err) {
      alert("Error deleting card");
    }
  };

  // LIST ACTIONS
  const handleAddList = async () => {
    const title = prompt("Enter list title:");
    if (!title) return;
    try {
      const { data } = await API.post(`/boards/${id}/lists`, { title });
      setLists((prev) => [...prev, data]);
    } catch (err) {
      alert("Error adding list");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-600">
        <div className="text-white font-medium animate-pulse">Loading board assets...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Main Board Area */}
      <div className="flex-1 flex flex-col bg-blue-600 overflow-hidden relative">
        {/* Header */}
        <div className="p-4 bg-black/10 backdrop-blur-md flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white uppercase tracking-tight">
              {board?.title}
            </h1>
            <button 
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-all"
            >
              {isPanelOpen ? "Hide Activity" : "Show Activity"}
            </button>
          </div>
          <div className="text-white/70 text-sm font-medium">
            {cards.length} Cards across {lists.length} Lists
          </div>
        </div>

        {/* Board Canvas */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto flex items-start gap-4 p-6 scrollbar-thin scrollbar-thumb-white/20">
            {lists.map((list) => (
              <ListColumn
                key={list._id}
                list={list}
                cards={cards.filter((c) => {
                  const cardListId = typeof c.list === 'object' ? c.list._id : c.list;
                  return cardListId === list._id;
                })}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                onUpdateCard={handleUpdateCard}
              />
            ))}
            
            {/* Add List Button */}
            <div className="w-80 flex-shrink-0">
               <button 
                onClick={handleAddList}
                className="w-full p-4 bg-white/10 hover:bg-white/20 text-white rounded-xl border-2 border-dashed border-white/20 transition-all flex items-center justify-center gap-2 font-semibold"
               >
                 <span className="text-lg">+</span> Add another list
               </button>
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* Activity Sidebar */}
      {isPanelOpen && (
        <div className="w-80 flex-shrink-0 shadow-2xl transition-all duration-300 ease-in-out">
          <ActivityPanel 
            activities={activities} 
            onClose={() => setIsPanelOpen(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default Board;