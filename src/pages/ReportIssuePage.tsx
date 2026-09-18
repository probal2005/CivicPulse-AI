import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  MapPin,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { complaintService } from '@/services/complaintService';
import {
  CATEGORY_LABELS,
  type ComplaintCategory,
  type Complaint,
} from '@/types/complaint';

const categories = Object.entries(CATEGORY_LABELS) as [ComplaintCategory, string][];

interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
  location?: string;
  reporterName?: string;
  reporterContact?: string;
}

export function ReportIssuePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '' as ComplaintCategory | '',
    description: '',
    location: '',
    lat: '',
    lng: '',
    reporterName: '',
    reporterContact: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Complaint | null>(null);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!formData.title.trim()) e.title = 'Please enter a short title';
    if (!formData.category) e.category = 'Please select a category';
    if (!formData.description.trim()) e.description = 'Please describe the problem';
    if (!formData.location.trim()) e.location = 'Please enter the location';
    if (!formData.reporterName.trim()) e.reporterName = 'Please enter your name';
    if (!formData.reporterContact.trim()) e.reporterContact = 'Please enter an email or phone';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Image must be under 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function clearImage() {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await complaintService.create({
        title: formData.title.trim(),
        category: formData.category as ComplaintCategory,
        description: formData.description.trim(),
        location: formData.location.trim(),
        lat: formData.lat ? parseFloat(formData.lat) : undefined,
        lng: formData.lng ? parseFloat(formData.lng) : undefined,
        imageUrl: imagePreview ?? undefined,
        reporterName: formData.reporterName.trim(),
        reporterContact: formData.reporterContact.trim(),
      });
      setSuccess(result);
    } catch {
      setSubmitError('Something went wrong while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-50">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900">Report Submitted Successfully</h2>
          <p className="mt-3 text-slate-500">
            Thank you for reporting this issue. Your report has been received and will be reviewed by the admin team.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-500">Your Report ID</p>
            <p className="mt-1 text-xl font-mono font-bold text-teal-600">{success.id}</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-left">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-400">Category</p>
              <p className="text-sm font-semibold text-navy-800">{CATEGORY_LABELS[success.category]}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-400">Priority</p>
              <p className="text-sm font-semibold text-navy-800 capitalize">{success.priority}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/dashboard">View Dashboard</Button>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(null);
                setFormData({ title: '', category: '', description: '', location: '', lat: '', lng: '', reporterName: '', reporterContact: '' });
                setImagePreview(null);
              }}
            >
              Report Another Issue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Report a Civic Issue</h1>
      <p className="mt-2 text-slate-500">Fill out the details below. All fields marked with * are required.</p>

      {submitError && (
        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Title */}
        <Card className="p-6">
          <label className="block">
            <span className="text-sm font-semibold text-navy-800">Issue Title *</span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Large pothole near MG Road junction"
              className={`mt-2 w-full px-4 py-2.5 rounded-lg border ${errors.title ? 'border-red-300' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors text-sm`}
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>}
          </label>
        </Card>

        {/* Category */}
        <Card className="p-6">
          <label className="block">
            <span className="text-sm font-semibold text-navy-800">Problem Category *</span>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: value })}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.category === value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.category && <p className="mt-2 text-xs text-red-600">{errors.category}</p>}
          </label>
        </Card>

        {/* Description */}
        <Card className="p-6">
          <label className="block">
            <span className="text-sm font-semibold text-navy-800">Description *</span>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe the problem in detail. When did you notice it? How severe is it? Is it causing any danger?"
              className={`mt-2 w-full px-4 py-2.5 rounded-lg border ${errors.description ? 'border-red-300' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors text-sm resize-none`}
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>}
          </label>
        </Card>

        {/* Image Upload */}
        <Card className="p-6">
          <span className="text-sm font-semibold text-navy-800">Image Upload (optional)</span>
          <p className="text-xs text-slate-400 mt-1">Upload a photo of the issue. Max 5 MB.</p>
          {imagePreview ? (
            <div className="mt-4 relative">
              <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl border border-slate-200" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 shadow hover:bg-white text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all"
            >
              <Upload className="w-8 h-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500 font-medium">Click to upload an image</p>
              <p className="text-xs text-slate-400 mt-0.5">PNG, JPG up to 5 MB</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </Card>

        {/* Location */}
        <Card className="p-6">
          <span className="text-sm font-semibold text-navy-800">Location *</span>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., MG Road Junction, near Signal 12, Bengaluru"
            className={`mt-2 w-full px-4 py-2.5 rounded-lg border ${errors.location ? 'border-red-300' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors text-sm`}
          />
          {errors.location && <p className="mt-1.5 text-xs text-red-600">{errors.location}</p>}

          <div className="mt-5">
            <span className="text-sm font-semibold text-navy-800">GPS Coordinates (optional)</span>
            <p className="text-xs text-slate-400 mt-1">If you know the exact latitude and longitude, add them here.</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-slate-500">Latitude</span>
                <input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  placeholder="12.9716"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Longitude</span>
                <input
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  placeholder="77.5946"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors text-sm"
                />
              </label>
            </div>
          </div>
        </Card>

        {/* Reporter Info */}
        <Card className="p-6">
          <span className="text-sm font-semibold text-navy-800">Your Information</span>
          <div className="mt-3 grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-slate-500">Name *</span>
              <input
                type="text"
                value={formData.reporterName}
                onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                placeholder="Your full name"
                className={`mt-1 w-full px-3 py-2.5 rounded-lg border ${errors.reporterName ? 'border-red-300' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors text-sm`}
              />
              {errors.reporterName && <p className="mt-1 text-xs text-red-600">{errors.reporterName}</p>}
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">Email or Phone *</span>
              <input
                type="text"
                value={formData.reporterContact}
                onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
                placeholder="you@example.com"
                className={`mt-1 w-full px-3 py-2.5 rounded-lg border ${errors.reporterContact ? 'border-red-300' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors text-sm`}
              />
              {errors.reporterContact && <p className="mt-1 text-xs text-red-600">{errors.reporterContact}</p>}
            </label>
          </div>
        </Card>

        {submitError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
