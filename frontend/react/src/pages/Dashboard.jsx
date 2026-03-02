import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Layout, Users, Clock, Trash2 } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  // Fetch boards on component mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const { data } = await API.get('/boards');
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const { data } = await API.post('/boards', { title: newBoardTitle });
      setBoards([data, ...boards]);
      setNewBoardTitle('');
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to create board");
    }
  };

  const deleteBoard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    try {
      await API.delete(`/boards/${id}`);
      setBoards(boards.filter(board => board._id !== id));
    } catch (error) {
      alert("Only owners can delete boards");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Layout className="text-blue-600" />
            My Workspaces
          </h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create New Board
        </button>
      </div>

      {/* Boards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board) => (
          <div key={board._id} className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
            <Link to={`/board/${board._id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 truncate">{board.title}</h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {board.members?.length || 1}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(board.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>

            {/* Only show delete if user is owner */}
            {board.owner === user?._id && (
              <button 
                onClick={() => deleteBoard(board._id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}

        {boards.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No boards found. Start by creating one!</p>
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>
            <form onSubmit={handleCreateBoard}>
              <input
                autoFocus
                type="text"
                placeholder="Board Title (e.g., Marketing Sprint)"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;