import React, { useEffect, useState } from 'react';
import { getAllProgress, updateProgress, deleteProgress, ProgressDTO } from '@/api/api-progress';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Clock, 
  Calendar, 
  Share2, 
  Edit, 
  Trash, 
  Upload,
  Award,
  FileText,
  Search
} from 'lucide-react';

const ViewProgress: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posted' | 'drafts'>('posted');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const data = await getAllProgress();
        setProgressData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch progress data.');
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const handleUpdatePost = (id: string) => {
    const progressToUpdate = progressData.find(p => p.id === id);
    if (progressToUpdate) {
      navigate('/progress/update', { state: { progress: progressToUpdate } });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteProgress(id);
      setProgressData(prevData => prevData.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete progress:', err);
      setError('Failed to delete progress.');
    }
  };

  const handlePublishPost = async (id: string) => {
    try {
      const progressToPublish = progressData.find(p => p.id === id);
      if (progressToPublish) {
        const updatedProgress = { ...progressToPublish, shared: true };
        await updateProgress(id, updatedProgress);
        setProgressData(prevData => 
          prevData.map(item => item.id === id ? { ...item, shared: true } : item)
        );
      }
    } catch (err) {
      console.error('Failed to publish progress:', err);
      setError('Failed to publish progress.');
    }
  };

  
  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-100 py-3 mt-8 w-full border-t border-gray-200">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-gray-600">© 2025 SkillNexus. All rights reserved.</p>
      </div>
    </footer>
  );

  if (loading) {
    return (
      <>
        
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
       
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-100 text-red-700 p-4 rounded flex items-center gap-2">
            <span className="text-red-500">⚠️</span> {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const postedItems = progressData.filter(progress => progress.shared);
  const draftItems = progressData.filter(progress => !progress.shared);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">SkillNexus</h1>
          <p className="text-blue-100">Connect. Learn. Grow.</p>
        </div>
      </header>
      
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center text-gray-800">
              <Award className="mr-2 text-blue-600" size={24} />
              Progress Updates
            </h1>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
            onClick={() => navigate('/plans')}
            >
              Back to My Plans
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium flex items-center ${
                activeTab === 'posted' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('posted')}
            >
              <Share2 size={18} className="mr-2" />
              Posted
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center ${
                activeTab === 'drafts' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('drafts')}
            >
              <FileText size={18} className="mr-2" />
              Drafts
            </button>
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'posted' ? (
              postedItems.length > 0 ? (
                postedItems.map((progress) => (
                  <div key={progress.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                    {/* Header */}
                    <div className="bg-blue-50 px-5 py-3 flex justify-between items-center border-b border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-800">{progress.title}</h3>
                      <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded-full">
                        <Check size={16} className="mr-1" />
                        Completed
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <p className="text-gray-700 mb-4">{progress.content}</p>
                      
                      {/* Dates */}
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1 text-blue-600" />
                          <span>Started: {new Date(progress.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Check size={16} className="mr-1 text-green-500" />
                          <span>Completed: {new Date(progress.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center flex-1 justify-center transition-colors"
                          onClick={() => progress.id && handleUpdatePost(progress.id)}
                        >
                          <Edit size={16} className="mr-2" />
                          Update
                        </button>
                        <button 
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center flex-1 justify-center transition-colors"
                          onClick={() => progress.id && handleDeletePost(progress.id)}
                        >
                          <Trash size={16} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Share2 size={36} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">No posted updates yet.</p>
                </div>
              )
            ) : (
              draftItems.length > 0 ? (
                draftItems.map((progress) => (
                  <div key={progress.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                    {/* Header */}
                    <div className="bg-blue-50 px-5 py-3 flex justify-between items-center border-b border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-800">{progress.title}</h3>
                      <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium py-1 px-2 rounded-full">
                        <Clock size={16} className="mr-1" />
                        Draft
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <p className="text-gray-700 mb-4">{progress.content}</p>
                      
                      {/* Dates */}
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1 text-blue-600" />
                          <span>Started: {new Date(progress.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Check size={16} className="mr-1 text-green-500" />
                          <span>Completed: {new Date(progress.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center flex-1 justify-center transition-colors"
                          onClick={() => progress.id && handlePublishPost(progress.id)}
                        >
                          <Upload size={16} className="mr-2" />
                          Publish
                        </button>
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center flex-1 justify-center transition-colors"
                          onClick={() => progress.id && handleUpdatePost(progress.id)}
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </button>
                        <button 
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center flex-1 justify-center transition-colors"
                          onClick={() => progress.id && handleDeletePost(progress.id)}
                        >
                          <Trash size={16} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <FileText size={36} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">No drafts available.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ViewProgress;