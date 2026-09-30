import React, { useState } from 'react';
import { SystemLink } from '../types';
import { saveLink, removeLink } from '../services/linksService';
import { NSTPBrandLogo } from './NSTPLogo';
import {
  X,
  ExternalLink,
  Plus,
  Trash2,
  Bookmark,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CreditCard,
  Building,
} from 'lucide-react';

interface SystemLinksModalProps {
  links: SystemLink[];
  onClose: () => void;
  onShowToast: (msg: string) => void;
  canManage?: boolean;
}

export const SystemLinksModal: React.FC<SystemLinksModalProps> = ({
  links,
  onClose,
  onShowToast,
  canManage = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [showAddForm, setShowAddForm] = useState(false);

  // New link form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<SystemLink['category']>('Pekeliling');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Semua',
    'Pekeliling',
    'Resit & TNG',
    'Editorial',
    'Kewangan & Bank',
    'HR',
    'Lain-lain',
  ];

  const filteredLinks = links.filter((link) => {
    const matchesCategory =
      selectedCategory === 'Semua' || link.category === selectedCategory;
    const matchesSearch =
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const linkId = `link-${Date.now()}`;
      const linkItem: SystemLink = {
        id: linkId,
        title: newTitle.trim(),
        url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
        category: newCategory,
        description: newDesc.trim() || undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };

      await saveLink(linkItem);
      onShowToast('Pautan baharu berjaya disimpan dalam Firebase Firestore.');
      setNewTitle('');
      setNewUrl('');
      setNewDesc('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add link:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Adakah anda pasti mahu memadamkan pautan "${title}" daripada Firebase?`)) {
      try {
        await removeLink(id);
        onShowToast('Pautan dipadamkan daripada Firebase.');
      } catch (err) {
        console.error('Failed to delete link:', err);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pekeliling':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'Resit & TNG':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'Editorial':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'Kewangan & Bank':
        return <Building className="w-4 h-4 text-amber-600" />;
      default:
        return <Bookmark className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-[8px] max-w-3xl w-full p-6 shadow-2xl border border-slate-300 relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3.5 border-b border-slate-200">
          <NSTPBrandLogo size="md" />
          <div className="border-l border-slate-200 pl-3">
            <h2 className="text-base font-extrabold text-[#0B2545] flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              Direktori Pautan Rasmi & Rujukan Sistem
            </h2>
            <p className="text-xs text-slate-500">
              Semua pautan pekeliling, portal TNG, dan rujukan disimpan secara langsung dalam Cloud Firestore
            </p>
          </div>
        </div>

        {/* Featured Official Portal Link & GitHub README Banner */}
        <div className="mt-3 p-3.5 rounded-[6px] bg-gradient-to-r from-[#0B2545] to-[#001026] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Pautan Umum &amp; GitHub README
              </span>
              <span className="text-xs font-mono font-bold text-sky-300">
                https://stringer.ai.studio
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Kongsi pautan rasmi ini supaya semua pengguna (Stringer, HOD &amp; HR) boleh membuka portal terus dari pelayar.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('https://stringer.ai.studio');
                onShowToast('Pautan https://stringer.ai.studio berjaya disalin!');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer"
            >
              Salin URL
            </button>
            <a
              href="https://stringer.ai.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[4px] text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>Buka Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Action Bar: Search, Category Filter, Add Button */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pautan atau pekeliling..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[4px] focus:outline-hidden focus:border-[#0B2545] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded transition-colors font-medium whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#001026] text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {canManage && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2545] hover:bg-[#001026] text-white rounded-[4px] text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Tutup Borang' : 'Tambah Pautan'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Add Link Form Collapsible */}
        {showAddForm && (
          <form
            onSubmit={handleAddLink}
            className="p-3.5 my-2 bg-blue-50/50 border border-blue-200 rounded-[6px] text-xs space-y-2.5 animate-slide-down"
          >
            <div className="font-bold text-[#0B2545] text-xs flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Daftar Pautan Baharu ke Firebase Firestore</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tajuk Pautan / Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Surat Pekeliling Kewangan Bil 02/2024"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white focus:outline-hidden focus:border-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white focus:outline-hidden focus:border-blue-600 text-xs"
                >
                  <option value="Pekeliling">Pekeliling</option>
                  <option value="Resit & TNG">Resit & TNG</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Kewangan & Bank">Kewangan & Bank</option>
                  <option value="HR">HR</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  URL Pautan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://tngportal.touchngo.com.my/..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white focus:outline-hidden focus:border-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Penerangan Ringkas
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Nota atau fungsi pautan ini..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white focus:outline-hidden focus:border-blue-600 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#001026] hover:bg-[#0B2545] text-white rounded-[4px] font-semibold text-xs shadow-xs"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan ke Firestore'}
              </button>
            </div>
          </form>
        )}

        {/* Links List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2 mt-2 divide-y divide-slate-100">
          {filteredLinks.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tiada pautan ditemui untuk carian atau kategori ini.
            </div>
          ) : (
            filteredLinks.map((link) => (
              <div
                key={link.id}
                className="pt-2 pb-1.5 first:pt-0 flex items-start justify-between gap-3 hover:bg-slate-50/80 p-2 rounded transition-colors group"
              >
                <div className="flex items-start gap-2.5 flex-1">
                  <div className="p-1.5 rounded bg-slate-100 mt-0.5 shrink-0">
                    {getCategoryIcon(link.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#0B2545] hover:text-blue-600 flex items-center gap-1 group-hover:underline"
                      >
                        <span>{link.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                      </a>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                        {link.category}
                      </span>
                    </div>

                    {link.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {link.description}
                      </p>
                    )}

                    <div className="text-[10px] text-slate-400 font-mono mt-1 truncate max-w-lg">
                      {link.url}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded transition-colors flex items-center gap-1"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {canManage && (
                    <button
                      onClick={() => handleDelete(link.id, link.title)}
                      className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors"
                      title="Padam Pautan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disegerakkan dengan Cloud Firestore (ai-studio-stringerclaimpor)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-[4px] text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
