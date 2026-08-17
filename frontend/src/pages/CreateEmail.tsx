import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createEmail } from '../lib/api';
import { format, parse } from 'date-fns';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const schema = z.object({
  recipient: z.string().email('Vui lòng nhập email hợp lệ'),
  subject: z.string().min(1, 'Chủ đề không được để trống'),
  content: z.string().min(1, 'Nội dung không được để trống'),
  date: z.string().min(1, 'Ngày gửi không được để trống'),
  time: z.string().min(1, 'Giờ gửi không được để trống'),
  timezone: z.string().min(1, 'Múi giờ không được để trống'),
}).refine((data) => {
  if (!data.date || !data.time) return true;
  const scheduledTime = new Date(`${data.date}T${data.time}`);
  return scheduledTime.getTime() > Date.now();
}, {
  message: 'Thời gian gửi phải ở tương lai',
  path: ['time'],
});

type FormData = z.infer<typeof schema>;

const TIMEZONES = Intl.supportedValuesOf('timeZone');
const DEFAULT_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function CreateEmail() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      timezone: DEFAULT_TZ,
      recipient: '',
      subject: '',
      content: '',
      date: '',
      time: ''
    }
  });

  const watchAll = watch();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const scheduledAt = new Date(`${data.date}T${data.time}`).toISOString();
      const result = await createEmail({
        recipient: data.recipient,
        subject: data.subject,
        content: data.content,
        timezone: data.timezone,
        scheduledAt,
      });
      navigate(`/emails/${result.id}`, { state: { success: true } });
    } catch (err: any) {
      setSubmitError(err.message || 'Lên lịch gửi thất bại');
      setIsSubmitting(false);
    }
  };

  const getPreviewDate = () => {
    if (!watchAll.date) return 'Chọn ngày';
    try {
      const parsed = parse(watchAll.date, 'yyyy-MM-dd', new Date());
      return format(parsed, 'MMMM d, yyyy');
    } catch {
      return 'Ngày không hợp lệ';
    }
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto grid md:grid-cols-[1.5fr_1fr] gap-12 lg:gap-24">
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-3xl font-serif text-stone-800 mb-2">Viết thư</h1>
        <p className="text-stone-500 mb-8">Gửi thông điệp cho chính bạn ở tương lai.</p>

        {submitError && (
          <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 text-sm">
            {submitError}
          </div>
        )}

        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Email người nhận</label>
            <input
              {...register('recipient')}
              type="email"
              placeholder="ban@example.com"
              className={cn(
                "w-full px-4 py-3 bg-white border rounded-xl outline-none transition-colors",
                errors.recipient ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-400"
              )}
            />
            {errors.recipient && <p className="text-red-500 text-xs">{errors.recipient.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Chủ đề</label>
            <input
              {...register('subject')}
              type="text"
              placeholder="Vài dòng gửi tôi của tương lai..."
              className={cn(
                "w-full px-4 py-3 bg-white border rounded-xl outline-none transition-colors",
                errors.subject ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-400"
              )}
            />
            {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Nội dung</label>
            <textarea
              {...register('content')}
              rows={8}
              placeholder="Gửi tôi của tương lai,"
              className={cn(
                "w-full px-4 py-3 bg-white border rounded-xl outline-none transition-colors resize-none leading-relaxed",
                errors.content ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-400"
              )}
            />
            {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Ngày gửi</label>
              <input
                {...register('date')}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className={cn(
                  "w-full px-4 py-3 bg-white border rounded-xl outline-none transition-colors",
                  errors.date ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-400"
                )}
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Giờ gửi</label>
              <input
                {...register('time')}
                type="time"
                className={cn(
                  "w-full px-4 py-3 bg-white border rounded-xl outline-none transition-colors",
                  errors.time ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-400"
                )}
              />
              {errors.time && <p className="text-red-500 text-xs">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Múi giờ</label>
            <select
              {...register('timezone')}
              className={cn(
                "w-full px-4 py-3 bg-white border rounded-xl outline-none transition-colors appearance-none",
                errors.timezone ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-400"
              )}
            >
              <option value="">Chọn múi giờ...</option>
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            {errors.timezone && <p className="text-red-500 text-xs">{errors.timezone.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
              className="w-full sm:w-1/3 px-6 py-4 bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-2/3 flex items-center justify-center gap-2 px-6 py-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 rounded-xl font-medium transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Lên lịch gửi
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Live Preview Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block sticky top-12 h-fit"
      >
        <div className="bg-stone-100 rounded-3xl p-8 border border-stone-200">
          <p className="text-stone-500 text-sm font-medium mb-6">Xem trước</p>
          <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-1">Gửi vào ngày</p>
              <p className="font-serif text-xl text-stone-800">{getPreviewDate()}</p>
              <p className="text-stone-500 text-sm mt-1">
                {watchAll.time || '00:00'} • {watchAll.timezone || 'UTC'}
              </p>
            </div>
            
            <div className="h-px bg-stone-100 w-full" />

            <div>
              <p className="font-medium text-stone-900 mb-2 truncate">
                {watchAll.subject || 'Chủ đề sẽ hiển thị ở đây'}
              </p>
              <p className="text-stone-600 text-sm leading-relaxed line-clamp-6 whitespace-pre-wrap">
                {watchAll.content || 'Nội dung thư sẽ hiển thị ở đây...'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
