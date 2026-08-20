/**
 * Future Mail — Open Source Project
 * Released under the MIT License.
 * Copyright (c) 2026 DaiAiTienTon
 */

import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { fetchEmail, cancelEmail, type ScheduledEmail } from '../lib/api';
import { format } from 'date-fns';
import { ArrowLeft, Ban, CheckCircle2, Clock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function EmailDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<ScheduledEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Check if we just created this email
  const showSuccessMessage = location.state?.success;

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadDetail = (isInitial = false) => {
      if (isInitial) {
        setLoading(true);
        setError(null);
      }
      fetchEmail(id)
        .then(data => {
          if (!isMounted) return;
          setEmail(data);
          setError(null);
        })
        .catch(err => {
          if (!isMounted) return;
          if (isInitial) {
            setError(err.message);
          }
        })
        .finally(() => {
          if (isMounted && isInitial) {
            setLoading(false);
          }
        });
    };

    loadDetail(true);

    // Tự động kiểm tra và cập nhật dữ liệu ngầm mỗi 3 giây nếu thư đang chờ gửi
    const interval = setInterval(() => {
      setEmail((current) => {
        if (current && (current.status === 'SCHEDULED' || current.status === 'SENDING')) {
          fetchEmail(id)
            .then(data => {
              if (isMounted) setEmail(data);
            })
            .catch(() => {});
        }
        return current;
      });
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  const handleCancel = async () => {
    if (!id) return;
    setCancelling(true);
    setCancelError(null);
    try {
      const updated = await cancelEmail(id);
      setEmail(updated);
      setShowCancelConfirm(false);
    } catch (err: any) {
      setCancelError(err.message || 'Hủy gửi thư thất bại');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Đang tải">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-800 animate-spin" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-sans font-semibold text-stone-800 mb-2">Không tìm thấy thư</h2>
        <p className="text-stone-500 mb-8">{error || "Chúng tôi không thể tìm thấy bức thư bạn đang tìm kiếm."}</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-700 rounded-full font-medium transition-all">
          Quay về màn hình chính
        </button>
      </div>
    );
  }

  const getStatusDisplay = () => {
    switch (email.status) {
      case 'SCHEDULED': return { icon: <Clock className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'SENDING': return { icon: <Loader2 className="w-5 h-5 animate-spin" />, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'SENT': return { icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'FAILED': return { icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600 bg-red-50 border-red-200' };
      case 'CANCELLED': return { icon: <Ban className="w-5 h-5" />, color: 'text-stone-600 bg-stone-100 border-stone-200' };
      default: return { icon: <Mail className="w-5 h-5" />, color: 'text-stone-600 bg-stone-50 border-stone-200' };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-8 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Quay về màn hình chính
      </Link>

      {showSuccessMessage && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-4 rounded-2xl mb-8 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <p className="font-medium text-sm">Thư của bạn đã được lên lịch thành công.</p>
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-serif text-stone-900 mb-2 break-words">{email.subject}</h1>
            <p className="text-stone-500 text-sm flex items-center gap-2">
              Tới: <span className="text-stone-800 font-medium">{email.recipient}</span>
            </p>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusDisplay.color}`}>
            {statusDisplay.icon}
            <span className="text-sm font-medium capitalize">{email.status.toLowerCase()}</span>
          </div>
        </div>

        <div className="h-px bg-stone-100 w-full mb-10" />

        <div className="prose prose-stone max-w-none mb-12">
          <p className="whitespace-pre-wrap leading-relaxed text-stone-700">
            {email.content}
          </p>
        </div>

        <div className="bg-[#FDFBF7] rounded-2xl p-6 space-y-4 text-sm border border-stone-100">
          <div className="flex justify-between items-center pb-4 border-b border-stone-100">
            <span className="text-stone-500">Được lên lịch vào</span>
            <span className="font-medium text-stone-800 text-right">
              {format(new Date(email.scheduledAt), 'MMMM d, yyyy h:mm a')}
              <br/>
              <span className="text-xs text-stone-400 font-normal">{email.timezone}</span>
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-stone-100">
            <span className="text-stone-500">Tạo ngày</span>
            <span className="font-medium text-stone-800">
              {format(new Date(email.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>
          {email.sentAt && (
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <span className="text-stone-500">Gửi ngày</span>
              <span className="font-medium text-stone-800">
                {format(new Date(email.sentAt), 'MMMM d, yyyy h:mm a')}
              </span>
            </div>
          )}
          {email.errorMessage && (
            <div className="flex flex-col gap-1 pt-2" role="alert">
              <span className="text-red-600 font-medium text-sm">Chi tiết lỗi</span>
              <span className="text-red-700 text-sm break-words">{email.errorMessage}</span>
            </div>
          )}
        </div>

        {email.status === 'SCHEDULED' && (
          <div className="mt-8 pt-8 border-t border-stone-100">
            {cancelError && (
              <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {cancelError}
              </div>
            )}
            {showCancelConfirm ? (
              <div className="flex items-center justify-end gap-3">
                <p className="text-sm text-stone-600">Xác nhận hủy gửi thư này?</p>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={cancelling}
                  className="px-4 py-2 text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-medium transition-all disabled:opacity-50"
                >
                  Không
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all disabled:opacity-50"
                >
                  {cancelling ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null}
                  Xác nhận hủy
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 active:scale-[0.98] rounded-full font-medium transition-all text-sm"
                >
                  <Ban className="w-4 h-4" aria-hidden="true" />
                  Hủy gửi thư
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
