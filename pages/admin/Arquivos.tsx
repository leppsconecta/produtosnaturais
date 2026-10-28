import React, { useState, useEffect, useMemo } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  Download,
  Eye,
  Trash2,
  FileText,
  Barcode,
  Table as TableIcon,
  Tag,
  Upload,
  X,
  ExternalLink,
  Check,
  Copy,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import Modal from '../../components/UI/Modal';
import { useAuth } from '../../context/AuthContext';
import { ArquivoItem } from '../../types';

export default function ArquivosPage() {
  const { token } = useAuth();
  const [arquivos, setArquivos] = useState<ArquivoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState<'solapa_adesivos' | 'cod_barras_tabelas'>('solapa_adesivos');
  const [activeSubcat, setActiveSubcat] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<ArquivoItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    pasta: 'solapa_adesivos' as 'solapa_adesivos' | 'cod_barras_tabelas',
    subcategoria: 'Solapa',
    nome: '',
    descricao: '',
    arquivo_url: '',
    formato: 'JPG',
    tamanho: '350 KB'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchArquivos();
  }, []);

  const fetchArquivos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/arquivos');
      if (res.ok) {
        const data = await res.json();
        setArquivos(data);
      }
    } catch (err) {
      console.error('Erro ao carregar arquivos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArquivo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) return alert('Preencha o nome do arquivo.');

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('pasta', formData.pasta);
      payload.append('subcategoria', formData.subcategoria);
      payload.append('nome', formData.nome);
      payload.append('descricao', formData.descricao);
      payload.append('formato', formData.formato);
      payload.append('tamanho', formData.tamanho);

      if (selectedFile) {
        payload.append('file', selectedFile);
      } else if (formData.arquivo_url) {
        payload.append('arquivo_url', formData.arquivo_url);
      } else {
        alert('Selecione um arquivo ou informe a URL da imagem.');
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/arquivos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: payload
      });

      if (res.ok) {
        await fetchArquivos();
        setIsNewModalOpen(false);
        setSelectedFile(null);
        setFormData({
          pasta: activeFolder,
          subcategoria: activeFolder === 'solapa_adesivos' ? 'Solapa' : 'Código de Barras',
          nome: '',
          descricao: '',
          arquivo_url: '',
          formato: 'JPG',
          tamanho: '350 KB'
        });
      } else {
        alert('Erro ao salvar arquivo.');
      }
    } catch (err) {
      console.error('Erro ao criar arquivo:', err);
      alert('Erro na comunicação com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este arquivo?')) return;

    try {
      setIsDeletingId(id);
      const res = await fetch(`/api/arquivos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setArquivos(prev => prev.filter(item => item.id !== id));
        if (viewingItem?.id === id) setViewingItem(null);
      } else {
        alert('Erro ao excluir arquivo.');
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Counts
  const countSolapaAdesivos = arquivos.filter(a => a.pasta === 'solapa_adesivos').length;
  const countCodBarrasTabelas = arquivos.filter(a => a.pasta === 'cod_barras_tabelas').length;

  // Filtered files
  const filteredArquivos = useMemo(() => {
    return arquivos.filter(item => {
      if (item.pasta !== activeFolder) return false;
      if (activeSubcat !== 'todos' && item.subcategoria.toLowerCase() !== activeSubcat.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          item.nome.toLowerCase().includes(term) ||
          (item.descricao && item.descricao.toLowerCase().includes(term)) ||
          item.subcategoria.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [arquivos, activeFolder, activeSubcat, searchTerm]);

  // Subcategories available for active folder
  const subcategories = activeFolder === 'solapa_adesivos'
    ? [
        { id: 'todos', label: 'Todos' },
        { id: 'Solapa', label: 'Solapas' },
        { id: 'Adesivo', label: 'Adesivos' }
      ]
    : [
        { id: 'todos', label: 'Todos' },
        { id: 'Código de Barras', label: 'Códigos de Barras' },
        { id: 'Tabela Nutricional', label: 'Tabelas Nutricionais' }
      ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5A1788] dark:text-purple-300">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Módulo de Arquivos
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Organização central de solapas, adesivos, códigos de barra e tabelas nutricionais
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({
              pasta: activeFolder,
              subcategoria: activeFolder === 'solapa_adesivos' ? 'Solapa' : 'Código de Barras',
              nome: '',
              descricao: '',
              arquivo_url: '',
              formato: 'JPG',
              tamanho: '350 KB'
            });
            setIsNewModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#5A1788] hover:bg-[#48126e] text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all hover:scale-105 shrink-0"
        >
          <Plus size={18} />
          Novo Arquivo
        </button>
      </div>

      {/* Main Folders Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pasta 1: Solapa e Adesivos */}
        <button
          onClick={() => {
            setActiveFolder('solapa_adesivos');
            setActiveSubcat('todos');
          }}
          className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 ${
            activeFolder === 'solapa_adesivos'
              ? 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-900 border-[#5A1788] shadow-md ring-2 ring-[#5A1788]/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700 shadow-sm'
          }`}
        >
          <div className={`p-4 rounded-2xl shrink-0 ${
            activeFolder === 'solapa_adesivos'
              ? 'bg-[#5A1788] text-white shadow-lg shadow-purple-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            <Tag size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#5A1788] dark:text-purple-400">
                Pasta 01
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#5A1788] dark:text-purple-300">
                {countSolapaAdesivos} {countSolapaAdesivos === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              Solapa e Adesivos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Solapas de embalagens pouch, selos de garantia e adesivos frontais de produtos.
            </p>
          </div>
        </button>

        {/* Pasta 2: Cod. Barras e Tabelas */}
        <button
          onClick={() => {
            setActiveFolder('cod_barras_tabelas');
            setActiveSubcat('todos');
          }}
          className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 ${
            activeFolder === 'cod_barras_tabelas'
              ? 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-900 border-[#5A1788] shadow-md ring-2 ring-[#5A1788]/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700 shadow-sm'
          }`}
        >
          <div className={`p-4 rounded-2xl shrink-0 ${
            activeFolder === 'cod_barras_tabelas'
              ? 'bg-[#5A1788] text-white shadow-lg shadow-purple-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            <Barcode size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#5A1788] dark:text-purple-400">
                Pasta 02
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#5A1788] dark:text-purple-300">
                {countCodBarrasTabelas} {countCodBarrasTabelas === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              Cód. Barras e Tabelas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Códigos EAN-13 oficiais e tabelas nutricionais normatizadas pela ANVISA.
            </p>
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Subcategory Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {subcategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveSubcat(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeSubcat.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-[#5A1788] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar arquivos..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A1788]/20 focus:border-[#5A1788] text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A1788]" />
        </div>
      ) : filteredArquivos.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/40 text-[#5A1788] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderArchive size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            Nenhum arquivo encontrado
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Não há arquivos cadastrados para esta pasta ou filtro no momento.
          </p>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A1788] text-white text-xs font-bold"
          >
            <Plus size={16} />
            Adicionar Primeiro Arquivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArquivos.map(item => (
            <div
              key={item.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              {/* Image Preview Box */}
              <div
                onClick={() => setViewingItem(item)}
                className="relative h-48 bg-slate-100 dark:bg-slate-800/80 cursor-pointer overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800"
              >
                <img
                  src={item.arquivo_url}
                  alt={item.nome}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Subcategory Badge */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-[#5A1788] dark:text-purple-300 shadow-sm border border-black/5">
                  {item.subcategoria}
                </div>

                {/* Format Badge */}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
                  {item.formato || 'JPG'}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#5A1788]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="bg-white dark:bg-slate-900 text-[#5A1788] dark:text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5">
                    <Eye size={14} />
                    Ver Detalhes
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-1" title={item.nome}>
                    {item.nome}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {item.descricao || 'Arquivo técnico pronto para produção e rotulagem.'}
                  </p>
                </div>

                {/* Card Footer Info & Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-400">
                    {item.tamanho || '350 KB'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingItem(item)}
                      title="Visualizar"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#5A1788] hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <a
                      href={item.arquivo_url}
                      download={item.nome}
                      title="Download"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <Download size={16} />
                    </a>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeletingId === item.id}
                      title="Excluir"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Visualizar Arquivo em Alta Resolução */}
      {viewingItem && (
        <div
          onClick={() => setViewingItem(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5A1788] dark:text-purple-400">
                  {viewingItem.subcategoria}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {viewingItem.nome}
                </h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image Box */}
            <div className="bg-slate-100 dark:bg-slate-950 p-6 flex items-center justify-center max-h-[420px] overflow-hidden">
              <img
                src={viewingItem.arquivo_url}
                alt={viewingItem.nome}
                className="max-h-[380px] w-auto max-w-full object-contain rounded-xl shadow-md border border-black/5"
              />
            </div>

            {/* Modal Body Info */}
            <div className="p-6 space-y-4">
              {viewingItem.descricao && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Descrição:</span>
                  {viewingItem.descricao}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Formato</span>
                  <span className="font-black text-slate-800 dark:text-white">{viewingItem.formato || 'JPG'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tamanho</span>
                  <span className="font-black text-slate-800 dark:text-white">{viewingItem.tamanho || '350 KB'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pasta</span>
                  <span className="font-black text-slate-800 dark:text-white truncate">
                    {viewingItem.pasta === 'solapa_adesivos' ? 'Solapa/Adesivos' : 'Cód. Barras/Tabelas'}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => copyToClipboard(viewingItem.arquivo_url)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedUrl ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  {copiedUrl ? 'Link Copiado!' : 'Copiar Link'}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={viewingItem.arquivo_url}
                    download={viewingItem.nome}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A1788] hover:bg-[#48126e] text-white text-xs font-bold shadow-md transition-all hover:scale-105"
                  >
                    <Download size={16} />
                    Baixar Arquivo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Arquivo */}
      {isNewModalOpen && (
        <div
          onClick={() => setIsNewModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus size={20} className="text-[#5A1788]" />
                Cadastrar Novo Arquivo
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateArquivo} className="p-6 space-y-4 text-xs">
              {/* Pasta Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[11px]">
                  Pasta de Destino
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pasta: 'solapa_adesivos', subcategoria: 'Solapa' })}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      formData.pasta === 'solapa_adesivos'
                        ? 'border-[#5A1788] bg-purple-50 dark:bg-purple-950/40 text-[#5A1788] dark:text-purple-300 ring-2 ring-[#5A1788]/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Solapa e Adesivos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pasta: 'cod_barras_tabelas', subcategoria: 'Código de Barras' })}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      formData.pasta === 'cod_barras_tabelas'
                        ? 'border-[#5A1788] bg-purple-50 dark:bg-purple-950/40 text-[#5A1788] dark:text-purple-300 ring-2 ring-[#5A1788]/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Cód. Barras e Tabelas
                  </button>
                </div>
              </div>

              {/* Subcategoria */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[11px]">
                  Subcategoria
                </label>
                <select
                  value={formData.subcategoria}
                  onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A1788]"
                >
                  {formData.pasta === 'solapa_adesivos' ? (
                    <>
                      <option value="Solapa">Solapa</option>
                      <option value="Adesivo">Adesivo</option>
                    </>
                  ) : (
                    <>
                      <option value="Código de Barras">Código de Barras</option>
                      <option value="Tabela Nutricional">Tabela Nutricional</option>
                    </>
                  )}
                </select>
              </div>

              {/* Nome */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[11px]">
                  Nome do Arquivo / Produto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Código de Barras EAN-13 Castanhas"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A1788]"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[11px]">
                  Descrição ou Observações Técnicas
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalhes sobre dimensões, homologação ou aplicação..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A1788]"
                />
              </div>

              {/* Upload de Arquivo ou URL */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[11px]">
                  Arquivo de Imagem / Arte
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-100 dark:file:bg-purple-900/40 file:text-[#5A1788] dark:file:text-purple-300 hover:file:bg-purple-200 mb-2 cursor-pointer"
                />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ou cole a URL direta da imagem..."
                    value={formData.arquivo_url}
                    onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#5A1788] hover:bg-[#48126e] text-white font-bold flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Arquivo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
