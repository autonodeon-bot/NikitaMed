import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ShieldAlert, Sparkles, User, MessageSquare, CheckCircle, XCircle, Star } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

export default function CaseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, cases, users, consultations, requestConsultation, updateCase, updateConsultation, addReview, earnTokens } = useStore();
  
  const caseItem = cases.find(c => c.id === id);
  const patient = users.find(u => u.id === caseItem?.patientId);
  const assignedDoctor = users.find(u => u.id === caseItem?.assignedDoctorId);
  
  const [messageText, setMessageText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  if (!caseItem || !currentUser) {
    return <div className="p-12 text-center text-slate-500">Случай не найден</div>;
  }

  const isPatient = currentUser.role === 'patient';
  const isDoctor = currentUser.role === 'doctor';
  const isMyCase = isPatient && caseItem.patientId === currentUser.id;
  
  // Find active consultation for this case
  const consultation = consultations.find(c => c.caseId === caseItem.id);
  const isConsultingDoctor = consultation?.doctorId === currentUser.id;

  const handleAcceptCase = () => {
    if (!isDoctor) return;
    
    const newConsultation = {
      id: Math.random().toString(36).substring(7),
      caseId: caseItem.id,
      doctorId: currentUser.id,
      patientId: caseItem.patientId,
      status: 'accepted' as const,
      price: caseItem.assignedDoctorId ? 20 : 5,
      messages: []
    };
    
    requestConsultation(newConsultation);
    updateCase({ ...caseItem, status: 'in_progress' });
  };

  const handleDeclineCase = () => {
    if (!isDoctor || caseItem.assignedDoctorId !== currentUser.id) return;
    updateCase({ ...caseItem, status: 'closed', assignedDoctorId: undefined });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !consultation) return;

    const newMessage = {
      id: Math.random().toString(36).substring(7),
      senderId: currentUser.id,
      text: messageText,
      timestamp: new Date().toISOString()
    };

    updateConsultation({
      ...consultation,
      messages: [...consultation.messages, newMessage]
    });
    setMessageText('');
  };

  const handleCompleteConsultation = () => {
    if (!isDoctor || !consultation) return;
    
    updateConsultation({ ...consultation, status: 'completed' });
    updateCase({ ...caseItem, status: 'closed' });
    
    // Reward doctor
    earnTokens(currentUser.id, consultation.price);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPatient || !consultation || rating === 0) return;

    const review = {
      id: Math.random().toString(36).substring(7),
      patientId: currentUser.id,
      doctorId: consultation.doctorId,
      rating,
      comment: reviewComment,
      isAnonymous: caseItem.isAnonymous,
      createdAt: new Date().toISOString()
    };

    addReview(review);
    updateConsultation({ ...consultation, review });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{caseItem.title}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${caseItem.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                caseItem.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 
                'bg-emerald-100 text-emerald-800'}`}
            >
              {caseItem.status === 'open' ? 'Открыт' : caseItem.status === 'in_progress' ? 'В работе' : 'Закрыт'}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Создан {format(new Date(caseItem.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Case Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Описание проблемы</h2>
              {caseItem.isAnonymous && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  <ShieldAlert className="w-3 h-3" /> Анонимно
                </span>
              )}
            </div>
            <div className="p-6">
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-slate-700">{caseItem.description}</p>
              </div>
              
              {caseItem.documents.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Прикрепленные документы</h3>
                  <div className="flex flex-wrap gap-2">
                    {caseItem.documents.map((doc, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-indigo-600 hover:underline cursor-pointer">
                        Документ {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis */}
          {caseItem.aiAnalysis && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-200/50 bg-amber-100/30 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-semibold text-amber-900">Предварительный анализ ИИ</h2>
              </div>
              <div className="p-6">
                <div className="prose prose-amber max-w-none text-amber-900/80 text-sm">
                  <div className="markdown-body">
                    <Markdown>{caseItem.aiAnalysis}</Markdown>
                  </div>
                </div>
                <p className="mt-4 text-xs text-amber-700/70 italic">
                  Внимание: Данный анализ сгенерирован нейросетью и не является медицинским диагнозом. 
                  Обязательно проконсультируйтесь с врачом.
                </p>
              </div>
            </div>
          )}

          {/* Chat / Consultation Area */}
          {consultation && caseItem.status !== 'closed' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Консультация
                </h2>
                {consultation.status === 'completed' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3 h-3" /> Завершена
                  </span>
                )}
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
                {consultation.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                    <p>Начните диалог</p>
                  </div>
                ) : (
                  consultation.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    const sender = users.find(u => u.id === msg.senderId);
                    const senderName = sender?.role === 'doctor' 
                      ? sender.doctorProfile?.publicName 
                      : (caseItem.isAnonymous ? 'Пациент' : sender?.name);

                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-xs text-slate-500 mb-1 px-1">{senderName}</span>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                        }`}>
                          <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {format(new Date(msg.timestamp), 'HH:mm')}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {consultation.status !== 'completed' && (
                <div className="p-4 border-t border-slate-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Введите сообщение..."
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    >
                      Отправить
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Review Section */}
          {consultation?.status === 'completed' && isPatient && !consultation.review && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-900">Оставьте отзыв о враче</h2>
              </div>
              <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Оценка</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Комментарий</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Помогла ли вам консультация?"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={rating === 0 || !reviewComment.trim()}
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    Отправить отзыв
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patient Info (visible to doctor) */}
          {isDoctor && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Информация о пациенте</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {caseItem.isAnonymous ? 'Анонимный пациент' : patient?.name}
                  </p>
                  <p className="text-xs text-slate-500">ID: {patient?.id.substring(0, 6)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Actions */}
          {isDoctor && caseItem.status === 'open' && !consultation && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Действия</h3>
              
              {caseItem.assignedDoctorId === currentUser.id ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 mb-4">
                    Пациент запросил персональную консультацию у вас. Вы получите 20 токенов.
                  </p>
                  <button
                    onClick={handleAcceptCase}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Принять запрос
                  </button>
                  <button
                    onClick={handleDeclineCase}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors font-medium shadow-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Отклонить
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 mb-4">
                    Это общий запрос. Вы можете взять его в работу и получить 5 токенов.
                  </p>
                  <button
                    onClick={handleAcceptCase}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Взять в работу
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Complete Consultation Action */}
          {isConsultingDoctor && consultation.status !== 'completed' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Завершение</h3>
              <p className="text-sm text-slate-600 mb-4">
                Если вы ответили на все вопросы пациента, завершите консультацию для получения токенов.
              </p>
              <button
                onClick={handleCompleteConsultation}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Завершить консультацию
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
