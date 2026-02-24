import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ShieldCheck, Star, MessageSquare, BookOpen, Clock, MapPin, Award, User, Plus, Activity, Stethoscope, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';

export default function DoctorPublicProfile() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, users, reviews, articles } = useStore();
  
  const doctor = users.find(u => u.id === id && u.role === 'doctor');
  
  if (!doctor || !doctor.doctorProfile) {
    return <div className="p-12 text-center text-slate-500">Врач не найден</div>;
  }

  const profile = doctor.doctorProfile;
  const docReviews = reviews.filter(r => r.doctorId === doctor.id);
  const docArticles = articles.filter(a => a.doctorId === doctor.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center text-indigo-600 font-bold text-3xl border-4 border-white overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.publicName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                profile.publicName.charAt(0)
              )}
            </div>
            {currentUser?.role === 'patient' && (
              <Link
                to={`/cases/new?doctorId=${doctor.id}`}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                <MessageSquare className="w-5 h-5" />
                Запросить консультацию
              </Link>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              {profile.publicName}
              {profile.verificationStatus === 'verified' && (
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              )}
            </h1>
            <p className="text-lg font-medium text-indigo-600 mt-1">{profile.specialization}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Рейтинг</p>
                <p className="font-semibold text-slate-900">{profile.rating.toFixed(1)} <span className="text-slate-400 font-normal text-sm">({profile.reviewsCount})</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Стаж работы</p>
                <p className="font-semibold text-slate-900">{profile.experience}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Место работы</p>
                <p className="font-semibold text-slate-900">{profile.workplace}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Операций</p>
                <p className="font-semibold text-slate-900">{profile.surgeriesCount || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Консультаций</p>
                <p className="font-semibold text-slate-900">{profile.consultationsCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Bio Section */}
          {(profile.bio || profile.education || profile.awards) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
              {profile.bio && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">О враче</h3>
                  <p className="text-slate-700 whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}
              
              {profile.education && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Образование и курсы</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    {profile.education.split('\n').map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.awards && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Регалии и награды
                  </h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    {profile.awards.split('\n').map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.documents && profile.documents.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Документы и сертификаты
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.documents.map(doc => (
                      <a 
                        key={doc.id} 
                        href={doc.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-500">
                            {doc.type === 'diploma' ? 'Диплом' : doc.type === 'certificate' ? 'Сертификат' : 'Документ'} • {doc.date}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Отзывы пациентов
              <span className="bg-slate-100 text-slate-600 text-sm py-0.5 px-2.5 rounded-full font-medium">
                {docReviews.length}
              </span>
            </h2>
          
            {docReviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
                <p className="text-slate-500">У этого врача пока нет отзывов.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {docReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((review, i) => {
                  const reviewer = users.find(u => u.id === review.patientId);
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={review.id} 
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {review.isAnonymous ? 'Анонимный пациент' : reviewer?.name || 'Пациент'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {format(new Date(review.createdAt), 'd MMMM yyyy', { locale: ru })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700">{review.comment}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Articles */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Статьи
            </h2>
            {currentUser?.id === doctor.id && (
              <Link
                to="/articles/new"
                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Написать
              </Link>
            )}
          </div>
          
          {docArticles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
              <p className="text-slate-500">Врач еще не публиковал статьи.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {docArticles.map((article, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={article.id} 
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="text-sm text-slate-600 line-clamp-3 mb-3 prose prose-sm prose-slate">
                    <Markdown>{article.content}</Markdown>
                  </div>
                  <p className="text-xs text-slate-400">
                    {format(new Date(article.createdAt), 'd MMM yyyy', { locale: ru })}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
