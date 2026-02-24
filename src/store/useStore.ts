import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'doctor' | 'patient';

export interface PatientProfile {
  fullName: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other' | '';
  bloodType: string;
  allergies: string;
  chronicDiseases: string;
  avatarUrl?: string;
  documents: { id: string; name: string; url: string; date: string }[];
}

export interface User {
  id: string;
  email: string;
  role: Role;
  tokens: number;
  // Patient specific
  name?: string;
  patientProfile?: PatientProfile;
  // Doctor specific
  doctorProfile?: DoctorProfile;
}

export interface DoctorProfile {
  // Private
  fullName: string;
  phone: string;
  country: string;
  city: string;
  diplomaUrl?: string;
  documents?: { id: string; name: string; url: string; type: string; date: string }[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  
  // Public
  publicName: string; // e.g., "Алексей К."
  specialization: string;
  experience: string; // e.g., "> 10 лет"
  workplace: string; // e.g., "Городская больница (Москва)"
  avatarUrl?: string;
  bio?: string;
  education?: string;
  awards?: string;
  surgeriesCount?: number;
  consultationsCount?: number;
  price?: number;
  languages?: string;
  rating: number;
  reviewsCount: number;
}

export interface Case {
  id: string;
  patientId: string;
  title: string;
  description: string;
  documents: string[]; // URLs or base64
  status: 'open' | 'in_progress' | 'closed';
  createdAt: string;
  isAnonymous: boolean;
  aiAnalysis?: string;
  assignedDoctorId?: string; // If requested specific doctor
}

export interface Consultation {
  id: string;
  caseId: string;
  doctorId: string;
  patientId: string;
  status: 'requested' | 'accepted' | 'declined' | 'completed';
  price: number; // in tokens
  messages: Message[];
  review?: Review;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Review {
  id: string;
  patientId: string;
  doctorId: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Article {
  id: string;
  doctorId: string;
  title: string;
  content: string;
  createdAt: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  cases: Case[];
  consultations: Consultation[];
  reviews: Review[];
  articles: Article[];
  
  login: (email: string, role: Role) => void;
  logout: () => void;
  register: (user: User) => void;
  updateUser: (user: User) => void;
  
  addCase: (newCase: Case) => void;
  updateCase: (updatedCase: Case) => void;
  
  requestConsultation: (consultation: Consultation) => void;
  updateConsultation: (consultation: Consultation) => void;
  
  addReview: (review: Review) => void;
  addArticle: (article: Article) => void;
  
  spendTokens: (userId: string, amount: number) => boolean;
  earnTokens: (userId: string, amount: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        {
          id: 'admin1',
          email: 'admin@medconnect.pro',
          role: 'admin',
          tokens: 0,
        },
        {
          id: 'doc1',
          email: 'doctor@test.com',
          role: 'doctor',
          tokens: 100,
          doctorProfile: {
            fullName: 'Иванов Иван Иванович',
            phone: '+79991234567',
            country: 'Россия',
            city: 'Москва',
            verificationStatus: 'verified',
            publicName: 'Иван И.',
            specialization: 'Онколог',
            experience: '> 10 лет',
            workplace: 'Городская больница (Москва)',
            bio: 'Врач-онколог высшей категории. Занимаюсь диагностикой и лечением злокачественных новообразований.',
            education: 'МГМУ им. И.М. Сеченова (2010)\nОрдинатура по онкологии (2012)',
            awards: 'Лучший врач 2020 года\nЧлен Европейского общества медицинской онкологии (ESMO)',
            surgeriesCount: 1500,
            consultationsCount: 3400,
            price: 2000,
            languages: 'Русский, Английский',
            rating: 4.8,
            reviewsCount: 12,
            documents: []
          }
        },
        {
          id: 'pat1',
          email: 'patient@test.com',
          role: 'patient',
          tokens: 500,
          name: 'Алексей Смирнов',
          patientProfile: {
            fullName: 'Смирнов Алексей Викторович',
            phone: '+79990001122',
            birthDate: '1985-05-15',
            gender: 'male',
            bloodType: 'A(II) Rh+',
            allergies: 'Пенициллин',
            chronicDiseases: 'Гипертония 1 степени',
            documents: []
          }
        }
      ],
      cases: [],
      consultations: [],
      reviews: [
        {
          id: 'rev1',
          patientId: 'pat1',
          doctorId: 'doc1',
          rating: 5,
          comment: 'Отличный врач, все подробно объяснил и назначил лечение. Рекомендую!',
          isAnonymous: false,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 'rev2',
          patientId: 'pat2',
          doctorId: 'doc1',
          rating: 4,
          comment: 'Консультация прошла хорошо, врач внимательный.',
          isAnonymous: true,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        }
      ],
      articles: [
        {
          id: 'art1',
          doctorId: 'doc1',
          title: 'Современные методы диагностики онкологических заболеваний',
          content: 'В последние годы диагностика шагнула далеко вперед. Использование ПЭТ-КТ и жидкостной биопсии позволяет выявлять изменения на самых ранних стадиях...',
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        }
      ],

      login: (email, role) => {
        const user = get().users.find(u => u.email === email && u.role === role);
        if (user) {
          set({ currentUser: user });
        } else {
          // Auto register for demo purposes if not found
          const newUser: User = {
            id: Math.random().toString(36).substring(7),
            email,
            role,
            tokens: role === 'patient' ? 100 : 0,
            ...(role === 'doctor' ? {
              doctorProfile: {
                fullName: '',
                phone: '',
                country: '',
                city: '',
                verificationStatus: 'pending',
                publicName: 'Доктор',
                specialization: 'Терапевт',
                experience: 'Менее 5 лет',
                workplace: 'Не указано',
                surgeriesCount: 0,
                consultationsCount: 0,
                price: 1500,
                languages: 'Русский',
                rating: 0,
                reviewsCount: 0,
                documents: []
              }
            } : { 
              name: email.split('@')[0],
              patientProfile: {
                fullName: '',
                phone: '',
                birthDate: '',
                gender: '',
                bloodType: '',
                allergies: '',
                chronicDiseases: '',
                documents: []
              }
            })
          };
          set(state => ({
            users: [...state.users, newUser],
            currentUser: newUser
          }));
        }
      },
      logout: () => set({ currentUser: null }),
      register: (user) => set(state => ({ users: [...state.users, user], currentUser: user })),
      updateUser: (user) => set(state => ({
        users: state.users.map(u => u.id === user.id ? user : u),
        ...(state.currentUser?.id === user.id ? { currentUser: user } : {})
      })),
      
      addCase: (newCase) => set(state => ({ cases: [...state.cases, newCase] })),
      updateCase: (updatedCase) => set(state => ({
        cases: state.cases.map(c => c.id === updatedCase.id ? updatedCase : c)
      })),
      
      requestConsultation: (consultation) => set(state => ({
        consultations: [...state.consultations, consultation]
      })),
      updateConsultation: (consultation) => set(state => ({
        consultations: state.consultations.map(c => c.id === consultation.id ? consultation : c)
      })),
      
      addReview: (review) => set(state => {
        const newReviews = [...state.reviews, review];
        // Update doctor rating
        const doctor = state.users.find(u => u.id === review.doctorId);
        if (doctor && doctor.doctorProfile) {
          const docReviews = newReviews.filter(r => r.doctorId === doctor.id);
          const avgRating = docReviews.reduce((acc, r) => acc + r.rating, 0) / docReviews.length;
          
          const updatedDoc: User = {
            ...doctor,
            doctorProfile: {
              ...doctor.doctorProfile,
              rating: avgRating,
              reviewsCount: docReviews.length
            }
          };
          
          return {
            reviews: newReviews,
            users: state.users.map(u => u.id === updatedDoc.id ? updatedDoc : u),
            ...(state.currentUser?.id === updatedDoc.id ? { currentUser: updatedDoc } : {})
          };
        }
        return { reviews: newReviews };
      }),
      
      addArticle: (article) => set(state => ({ articles: [...state.articles, article] })),
      
      spendTokens: (userId, amount) => {
        const user = get().users.find(u => u.id === userId);
        if (user && user.tokens >= amount) {
          get().updateUser({ ...user, tokens: user.tokens - amount });
          return true;
        }
        return false;
      },
      earnTokens: (userId, amount) => {
        const user = get().users.find(u => u.id === userId);
        if (user) {
          get().updateUser({ ...user, tokens: user.tokens + amount });
        }
      }
    }),
    {
      name: 'medconnect-storage',
    }
  )
);
