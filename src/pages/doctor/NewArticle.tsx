import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function NewArticle() {
  const { currentUser, addArticle } = useStore();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (currentUser?.role !== 'doctor') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      addArticle({
        id: Math.random().toString(36).substring(7),
        doctorId: currentUser.id,
        title,
        content,
        createdAt: new Date().toISOString()
      });
      navigate(`/doctors/${currentUser.id}`);
    }, 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Новая статья</h1>
          <p className="text-slate-500 mt-1">Поделитесь своим опытом и знаниями с пациентами и коллегами</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
        <div className="p-6 border-b border-slate-200 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок статьи..."
            required
            className="w-full text-2xl font-bold text-slate-900 placeholder-slate-300 border-none focus:ring-0 p-0"
          />
        </div>
        
        {/* Simple Toolbar */}
        <div className="px-6 py-2 border-b border-slate-200 bg-slate-50 flex gap-2">
          <button type="button" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Добавить изображение (Markdown)">
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="text-xs text-slate-400 flex items-center ml-auto">
            Поддерживается Markdown разметка
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Напишите вашу статью здесь... Вы можете использовать Markdown для форматирования текста, добавления списков и ссылок на изображения."
            required
            className="flex-1 w-full resize-none border-none focus:ring-0 p-0 text-slate-700 leading-relaxed"
          />
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm disabled:opacity-70"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
