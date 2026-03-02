import { Users, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BoardHeader = ({ board }) => {
  const { user } = useAuth();
  
  // Check if current user is owner
  const isOwner = board?.owner === user?._id || board?.owner?._id === user?._id;

  return (
    <div className="bg-black/20 backdrop-blur-md px-6 py-4 flex justify-between items-center text-white border-b border-white/10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold uppercase tracking-tight">{board?.title}</h1>
        {isOwner && (
          <span className="flex items-center gap-1 text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold">
            <ShieldCheck size={12} /> ADMIN
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Only show Invite/Delete if user is the owner */}
        {isOwner ? (
          <>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-red-500 rounded text-sm transition-all group">
              <Trash2 size={16} className="group-hover:scale-110" />
              Delete Board
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded text-sm font-bold shadow-lg transition-all">
              <Users size={16} />
              Invite Team
            </button>
          </>
        ) : (
          <div className="text-xs text-white/60">View Only Mode</div>
        )}
      </div>
    </div>
  );
};

export default BoardHeader;