'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiVideo,
  FiBookOpen,
  FiSearch,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiLayers,
  FiExternalLink,
  FiRefreshCw,
  FiLock,
  FiList,
  FiDollarSign,
  FiPlay,
} from 'react-icons/fi';
import { HiSparkles, HiAcademicCap } from 'react-icons/hi2';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Course Modal state (Create & Edit)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnailUrl: '',
  });
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [courseModalError, setCourseModalError] = useState(null);

  // Delete Course Confirmation Modal state
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Lecture Management Modal state
  const [managingCourse, setManagingCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [lecturesLoading, setLecturesLoading] = useState(false);
  const [isLectureFormOpen, setIsLectureFormOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [lectureFormData, setLectureFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
  });
  const [lectureSubmitting, setLectureSubmitting] = useState(false);
  const [lectureError, setLectureError] = useState(null);

  // Delete Lecture Confirmation Modal state
  const [deletingLecture, setDeletingLecture] = useState(null);
  const [deleteLectureSubmitting, setDeleteLectureSubmitting] = useState(false);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:5000/api/courses');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setCourses(data.data);
      } else {
        setError(data.message || 'Failed to load courses from backend');
      }
    } catch (err) {
      setError('Unable to reach backend server on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    } else if (isAuthenticated && user?.role === 'admin') {
      fetchCourses();
    }
  }, [isAuthenticated, user, authLoading, router]);

  // Load lectures for a course
  const openLectureManager = async (course) => {
    setManagingCourse(course);
    setIsLectureFormOpen(false);
    setEditingLecture(null);
    setLectureError(null);
    try {
      setLecturesLoading(true);
      const res = await fetch(`http://localhost:5000/api/courses/${course._id}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setLectures(data.data.lectures || []);
      }
    } catch (err) {
      console.error('Failed to load lectures:', err);
    } finally {
      setLecturesLoading(false);
    }
  };

  // Filtered courses based on search
  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const query = search.toLowerCase().trim();
    return courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
    );
  }, [courses, search]);

  // Calculated Stats
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalLectures = courses.reduce(
      (acc, c) => acc + (c.lecturesCount || 0),
      0
    );
    const freeCourses = courses.filter((c) => Number(c.price) === 0).length;
    const paidCourses = totalCourses - freeCourses;
    return { totalCourses, totalLectures, freeCourses, paidCourses };
  }, [courses]);

  // Handle Course Modal Open (Create or Edit)
  const openCreateCourseModal = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: '',
      description: '',
      price: 0,
      thumbnailUrl: '',
    });
    setCourseModalError(null);
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl,
    });
    setCourseModalError(null);
    setIsCourseModalOpen(true);
  };

  // Submit Course (Create or Update)
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setCourseModalError(null);

    if (!courseFormData.title.trim()) {
      setCourseModalError('Course title is required');
      return;
    }

    try {
      setCourseSubmitting(true);
      const isEdit = Boolean(editingCourse);
      const url = isEdit
        ? `http://localhost:5000/api/courses/${editingCourse._id}`
        : 'http://localhost:5000/api/courses';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseFormData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsCourseModalOpen(false);
        fetchCourses();
      } else {
        setCourseModalError(data.message || 'Operation failed. Please try again.');
      }
    } catch (err) {
      setCourseModalError('Network error connecting to backend API');
    } finally {
      setCourseSubmitting(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;
    try {
      setDeleteSubmitting(true);
      const res = await fetch(
        `http://localhost:5000/api/courses/${deletingCourse._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingCourse(null);
        fetchCourses();
      } else {
        alert(data.message || 'Failed to delete course');
      }
    } catch (err) {
      alert('Network error while deleting course');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Lecture Form Open (Create or Edit)
  const openCreateLectureForm = () => {
    setEditingLecture(null);
    setLectureFormData({
      title: '',
      description: '',
      videoUrl: '',
    });
    setLectureError(null);
    setIsLectureFormOpen(true);
  };

  const openEditLectureForm = (lecture) => {
    setEditingLecture(lecture);
    setLectureFormData({
      title: lecture.title,
      description: lecture.description || '',
      videoUrl: lecture.videoUrl,
    });
    setLectureError(null);
    setIsLectureFormOpen(true);
  };

  // Submit Lecture
  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    setLectureError(null);

    if (!lectureFormData.title.trim() || !lectureFormData.videoUrl.trim()) {
      setLectureError('Lecture title and video URL are required');
      return;
    }

    try {
      setLectureSubmitting(true);
      const isEdit = Boolean(editingLecture);
      const url = isEdit
        ? `http://localhost:5000/api/lectures/${editingLecture._id}`
        : 'http://localhost:5000/api/lectures';
      const method = isEdit ? 'PUT' : 'POST';

      const bodyPayload = isEdit
        ? lectureFormData
        : { ...lectureFormData, courseId: managingCourse._id };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsLectureFormOpen(false);
        // Refresh lectures list
        openLectureManager(managingCourse);
        fetchCourses(); // update lecture counts
      } else {
        setLectureError(data.message || 'Failed to save lecture');
      }
    } catch (err) {
      setLectureError('Network error connecting to backend API');
    } finally {
      setLectureSubmitting(false);
    }
  };

  // Confirm Delete Lecture via Customized Modal
  const confirmDeleteLecture = async () => {
    if (!deletingLecture) return;
    try {
      setDeleteLectureSubmitting(true);
      const res = await fetch(`http://localhost:5000/api/lectures/${deletingLecture._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingLecture(null);
        openLectureManager(managingCourse);
        fetchCourses();
      } else {
        alert(data.message || 'Failed to delete lecture');
      }
    } catch (err) {
      alert('Error deleting lecture');
    } finally {
      setDeleteLectureSubmitting(false);
    }
  };

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500">Verifying Admin Permissions...</p>
        </div>
      </div>
    );
  }

  // Not Authorized Screen
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-white dark:bg-slate-950 p-6">
        <div className="max-w-md w-full text-center space-y-5 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <FiLock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Admin Privileges Required</h2>
            <p className="text-xs text-slate-500">Please sign in with your administrative account to access this panel.</p>
          </div>
          <Button href="/login" variant="primary" size="md" className="w-full">
            Go to Admin Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* TOP BAR: Dashboard Welcome & Primary CTA                  */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 dark:bg-sky-400/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300 mb-2">
              <FiShield className="w-3.5 h-3.5 text-sky-500" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Curriculum & Course Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Create, edit, and organize bootcamps, courses, and sequential video lessons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCourses}
              title="Refresh Data"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-sky-500 hover:border-sky-400/50 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Button
              onClick={openCreateCourseModal}
              variant="primary"
              size="md"
              className="shadow-md shadow-sky-400/20"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create New Course</span>
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STATS OVERVIEW CARDS                                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Total Courses */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Courses</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats.totalCourses}</p>
              <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">{stats.freeCourses} Community Free</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-500">
              <FiBookOpen className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Lectures */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Video Lectures</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats.totalLectures}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Active Classrooms</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <FiVideo className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Paid Bootcamps */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Paid Bootcamps</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats.paidCourses}</p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Premium Tracks</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <FiLayers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COURSES TABLE CARD                                        */}
        {/* ========================================================= */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">All Academy Curriculums</h2>
              <p className="text-xs text-slate-500">Manage courses and access their associated video lessons.</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Lectures</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      <div className="inline-block w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mb-2" />
                      <p>Loading course catalog...</p>
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      <FiBookOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className="font-bold">No courses found matching your query.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Course Thumbnail & Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                            {course.thumbnailUrl ? (
                              <Image
                                src={course.thumbnailUrl}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <FiBookOpen className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/courses/${course._id}`}
                              target="_blank"
                              className="font-black text-sm text-slate-900 dark:text-white hover:text-sky-500 transition-colors flex items-center gap-1.5 truncate"
                            >
                              <span>{course.title}</span>
                              <FiExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </Link>
                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-md">
                              {course.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center font-bold px-2.5 py-0.5 rounded-full text-[11px] bg-sky-400/10 border border-sky-400/20 text-sky-700 dark:text-sky-300">
                          {formatPrice(course.price)}
                        </span>
                      </td>

                      {/* Lectures Count & Button */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                          <FiVideo className="w-3.5 h-3.5 text-sky-500" />
                          <span>{course.lecturesCount ?? 0} Lessons</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openLectureManager(course)}
                            title="Manage Video Lectures"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-sky-400/30 bg-sky-400/10 text-sky-700 dark:text-sky-300 hover:bg-sky-400/20 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <FiList className="w-3.5 h-3.5" />
                            <span>Lectures</span>
                          </button>

                          <button
                            onClick={() => openEditCourseModal(course)}
                            title="Edit Course Details"
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 hover:border-sky-400/50 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingCourse(course)}
                            title="Delete Course"
                            className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CREATE OR EDIT COURSE                            */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill in the details for the bootcamp curriculum.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Error Alert */}
              {courseModalError && (
                <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-bold text-red-500 flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{courseModalError}</span>
                </div>
              )}

              {/* Course Form */}
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.title}
                    onChange={(e) =>
                      setCourseFormData({ ...courseFormData, title: e.target.value })
                    }
                    placeholder="e.g. Full-Stack MERN Development Bootcamp"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={courseFormData.description}
                    onChange={(e) =>
                      setCourseFormData({ ...courseFormData, description: e.target.value })
                    }
                    placeholder="Describe what students will learn in this curriculum..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Price (BDT, 0 = FREE)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={courseFormData.price}
                      onChange={(e) =>
                        setCourseFormData({ ...courseFormData, price: Number(e.target.value) })
                      }
                      placeholder="0"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Thumbnail Image URL
                    </label>
                    <input
                      type="url"
                      value={courseFormData.thumbnailUrl}
                      onChange={(e) =>
                        setCourseFormData({ ...courseFormData, thumbnailUrl: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                    />
                  </div>
                </div>

                {/* Live Thumbnail Preview */}
                {courseFormData.thumbnailUrl && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-950 flex items-center gap-3">
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={courseFormData.thumbnailUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-bold truncate">
                      Thumbnail Preview
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={courseSubmitting}
                  >
                    {courseSubmitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: DELETE COURSE CONFIRMATION                       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {deletingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <FiTrash2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Delete Course?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to permanently delete <span className="font-bold text-slate-700 dark:text-slate-200">&ldquo;{deletingCourse.title}&rdquo;</span>? All associated video lectures will also be deleted.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCourse(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCourse}
                  disabled={deleteSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50"
                >
                  {deleteSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: LECTURE MANAGEMENT DRAWER/MODAL                  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {managingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-500">
                    <FiLayers className="w-3.5 h-3.5" />
                    <span>Curriculum Manager</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white truncate max-w-lg">
                    {managingCourse.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {!isLectureFormOpen && (
                    <Button
                      onClick={openCreateLectureForm}
                      variant="primary"
                      size="sm"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Lecture</span>
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => setManagingCourse(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Form to Add / Edit Lecture */}
                {isLectureFormOpen ? (
                  <form
                    onSubmit={handleLectureSubmit}
                    className="p-5 rounded-2xl border border-sky-400/30 bg-sky-50/50 dark:bg-sky-950/20 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        {editingLecture ? 'Edit Lecture' : 'Add New Video Lecture'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsLectureFormOpen(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>

                    {lectureError && (
                      <div className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-bold text-red-500">
                        {lectureError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Lecture Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={lectureFormData.title}
                        onChange={(e) =>
                          setLectureFormData({ ...lectureFormData, title: e.target.value })
                        }
                        placeholder="e.g. 01. Understanding REST APIs & MVC"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Video URL (YouTube Watch or Embed) *
                      </label>
                      <input
                        type="url"
                        required
                        value={lectureFormData.videoUrl}
                        onChange={(e) =>
                          setLectureFormData({ ...lectureFormData, videoUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Overview / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={lectureFormData.description}
                        onChange={(e) =>
                          setLectureFormData({ ...lectureFormData, description: e.target.value })
                        }
                        placeholder="Brief summary of what this lecture covers..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsLectureFormOpen(false)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={lectureSubmitting}
                      >
                        {lectureSubmitting ? 'Saving...' : editingLecture ? 'Update Lecture' : 'Save Lecture'}
                      </Button>
                    </div>
                  </form>
                ) : null}

                {/* Lectures List */}
                {lecturesLoading ? (
                  <div className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold">Loading curriculum lectures...</p>
                  </div>
                ) : lectures.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
                    <FiVideo className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-bold text-xs">No lectures have been added to this course yet.</p>
                    <p className="text-[11px] text-slate-400">Click &ldquo;Add Lecture&rdquo; above to attach video lessons.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {lectures.map((lecture, idx) => (
                      <div
                        key={lecture._id || idx}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-sky-400/10 text-sky-500 flex items-center justify-center font-black text-xs shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {lecture.title}
                            </h5>
                            <p className="text-[11px] text-slate-400 truncate max-w-md">
                              {lecture.videoUrl}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => openEditLectureForm(lecture)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors cursor-pointer"
                            title="Edit Lecture"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingLecture(lecture)}
                            className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Lecture"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ========================================================= */}
      {/* MODAL 4: DELETE LECTURE CONFIRMATION                      */}
      {/* ========================================================= */}
      <AnimatePresence>
        {deletingLecture && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <FiTrash2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Delete Video Lecture?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-200">&ldquo;{deletingLecture.title}&rdquo;</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingLecture(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteLecture}
                  disabled={deleteLectureSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                >
                  {deleteLectureSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

