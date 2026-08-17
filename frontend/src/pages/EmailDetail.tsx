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

  // Check if we just created this email
  const showSuccessMessage = location.state?.success;

  useEffect(() => {
    if (!id) return;
    fetchEmail(id)
      .then(data => {
        setEmail(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!id || !window.confirm('Bạn có chắc chắn muốn hủy việc gửi thư này không?')) return;
    
    setCancelling(true);
    try {
      const updated = await cancelEmail(id);
      setEmail(updated);
    } catch (err: any) {
      alert(err.message || 'Hủy gửi thư thất bại');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-800 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-stone-800 mb-2">Không tìm thấy thư</h2>
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
            <h1 className="text-2xl font-serif text-stone-900 mb-2">{email.subject}</h1>
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
            <div className="flex justify-between items-center text-red-600">
              <span>Chi tiết lỗi</span>
              <span className="font-medium text-right max-w-xs truncate" title={email.errorMessage}>
                {email.errorMessage}
              </span>
            </div>
          )}
        </div>

        {email.status === 'SCHEDULED' && (
          <div className="mt-8 pt-8 border-t border-stone-100 flex justify-end">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-stone-200 hover:border-red-200 hover:bg-red-50 text-stone-700 hover:text-red-700 active:scale-[0.98] rounded-full font-medium transition-all text-sm disabled:opacity-50"
            >
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
              Hủy gửi thư
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
