import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchEmails, type ScheduledEmail } from '../lib/api';
import { Mail, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [emails, setEmails] = useState<ScheduledEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmails = () => {
    setLoading(true);
    setError(null);
    fetchEmails()
      .then((data) => {
        setEmails(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEmails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Đang tải">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-800 animate-spin" aria-hidden="true" />
          <p className="text-stone-500 font-medium text-sm">Đang tải dòng thời gian...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-900 p-6 rounded-2xl flex flex-col items-center text-center gap-2">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" aria-hidden="true" />
        <h3 className="font-medium text-lg">Không thể tải dòng thời gian</h3>
        <p className="text-red-700 max-w-sm text-sm">{error}</p>
        <button 
          onClick={loadEmails}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-full transition-colors text-sm font-medium"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const scheduledEmails = emails.filter(e => e.status === 'SCHEDULED' || e.status === 'SENDING');
  const pastEmails = emails.filter(e => e.status === 'SENT' || e.status === 'FAILED' || e.status === 'CANCELLED');

  const stats = {
    scheduled: scheduledEmails.length,
    sent: emails.filter(e => e.status === 'SENT').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
      case 'SENDING':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'SENT':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Mail className="w-4 h-4 text-stone-400" />;
    }
  };

  const EmailList = ({ items, title, emptyMessage }: { items: ScheduledEmail[], title: string, emptyMessage: string }) => {
    if (items.length === 0) {
      return (
        <div className="mt-8">
          <h2 className="text-xl font-serif font-medium text-stone-800 mb-4">{title}</h2>
          <div className="border border-dashed border-stone-200 rounded-2xl p-12 text-center">
            <p className="text-stone-500">{emptyMessage}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-12">
        <h2 className="text-xl font-serif font-medium text-stone-800 mb-4">{title}</h2>
        <ul className="grid gap-4">
          {items.map((email, i) => (
            <motion.li 
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link 
                to={`/emails/${email.id}`}
              className="group bg-white border border-stone-100 hover:border-stone-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4"
            >
              <div className="flex flex-col gap-1 w-full sm:w-auto min-w-0">
                <h3 className="font-medium text-stone-900 group-hover:text-stone-700 transition-colors truncate max-w-md">
                  {email.subject}
                </h3>
                <p className="text-sm text-stone-500 flex items-center gap-2">
                  <span className="truncate max-w-[240px]">{email.recipient}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600">
                  {getStatusIcon(email.status)}
                  <span className="capitalize">{email.status.toLowerCase()}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-stone-700">
                    {format(new Date(email.scheduledAt), 'MMM d, yyyy')}
                  </div>
                  <div className="text-xs text-stone-400">
                    {format(new Date(email.scheduledAt), 'h:mm a')}
                  </div>
                </div>
              </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-700">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 gap-4 mb-16"
      >
        <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-stone-200 flex flex-col justify-between aspect-[4/3] md:aspect-auto md:h-72">
          <span className="text-stone-500 text-sm font-medium">Đã lên lịch</span>
          <span className="text-7xl md:text-9xl font-serif text-stone-900 tracking-display mt-4">{stats.scheduled}</span>
        </div>
        <div className="bg-stone-900 p-6 md:p-10 rounded-[2rem] shadow-lg shadow-stone-900/20 border border-stone-800 flex flex-col justify-between aspect-[4/3] md:aspect-auto md:h-72">
          <span className="text-stone-400 text-sm font-medium">Lưu trữ</span>
          <span className="text-7xl md:text-9xl font-serif text-stone-50 tracking-display mt-4">{stats.sent}</span>
        </div>
      </motion.div>

      {emails.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-stone-400" />
          </div>
          <h2 className="text-2xl font-serif text-stone-800 mb-3">Hộp thời gian của bạn đang trống</h2>
          <p className="text-stone-500 max-w-sm mx-auto mb-8">
            Bạn chưa lên lịch gửi lá thư nào cho tương lai. Hãy dành chút thời gian viết cho chính mình.
          </p>
          <Link 
            to="/create"
            className="inline-flex items-center justify-center px-6 py-3 bg-stone-800 hover:bg-stone-900 active:scale-[0.98] text-stone-50 rounded-full font-medium transition-all"
          >
            Viết thư
          </Link>
        </div>
      ) : (
        <>
          <EmailList 
            title="Sắp gửi đi" 
            items={scheduledEmails} 
            emptyMessage="Không có thư nào sắp gửi. Phiên bản tương lai của bạn đang chờ đấy." 
          />
          <EmailList 
            title="Lưu trữ gần đây" 
            items={pastEmails} 
            emptyMessage="Không tìm thấy thư cũ." 
          />
        </>
      )}
    </div>
  );
}
