import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Tag,
  Barcode,
  Folder,
  Search,
  Plus,
  Download,
  Eye,
  Trash2,
  X,
  Check,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ArquivoItem, PastaItem } from '../types';

export default function ArquivosPage() {
  const { token } = useAuth();
  const [pastas, setPastas] = useState<PastaItem[]>([]);
  const [arquivos, setArquivos] = useState<ArquivoItem[]>([]);
  const [selectedPastaSlug, setSelectedPastaSlug] = useState<string>('solapa_adesivos');
  const [activeSubcat, setActiveSubcat] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Inline category creation
  const [isCreatingPasta, setIsCreatingPasta] = useState(false);
  const [newPastaNome, setNewPastaNome] = useState('');
  const newFolderInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [isNewArquivoModalOpen, setIsNewArquivoModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<ArquivoItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Form State for new file
  const [formData, setFormData] = useState({
    subcategoria: 'Geral',
    nome: '',
    descricao: '',
    arquivo_url: '',
    formato: 'JPG',
    tamanho: '350 KB'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isCreatingPasta && newFolderInputRef.current) {
      newFolderInputRef.current.focus();
    }
  }, [isCreatingPasta]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pastasRes, arquivosRes] = await Promise.all([
        fetch('/api/pastas'),
        fetch('/api/arquivos')
      ]);

      if (pastasRes.ok) {
        const pastasData = await pastasRes.json();
        setPastas(pastasData);
        if (pastasData.length > 0 && !selectedPastaSlug) {
          setSelectedPastaSlug(pastasData[0].slug);
        }
      }

      if (arquivosRes.ok) {
        const arquivosData = await arquivosRes.json();
        setArquivos(arquivosData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmNewPasta = async () => {
    if (!newPastaNome.trim()) {
      setIsCreatingPasta(false);
      return;
    }

    try {
      const res = await fetch('/api/pastas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome: newPastaNome.trim() })
      });

      if (res.ok) {
        const newPasta = await res.json();
        setPastas(prev => [...prev, newPasta]);
        setSelectedPastaSlug(newPasta.slug);
        setActiveSubcat('todos');
        setNewPastaNome('');
        setIsCreatingPasta(false);
      } else {
        alert('Erro ao criar categoria.');
      }
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
      alert('Erro na comunicação com o servidor.');
    }
  };

  const handleDeletePasta = async (e: React.MouseEvent, id: number, slug: string) => {
    e.stopPropagation();
    if (!confirm('Deseja excluir esta categoria e todos os seus arquivos?')) return;

    try {
      const res = await fetch(`/api/pastas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setPastas(prev => prev.filter(p => p.id !== id));
        setArquivos(prev => prev.filter(a => a.pasta !== slug));
        if (selectedPastaSlug === slug) {
          const remaining = pastas.filter(p => p.id !== id);
          if (remaining.length > 0) {
            setSelectedPastaSlug(remaining[0].slug);
            setActiveSubcat('todos');
          }
        }
      }
    } catch (err) {
      console.error('Erro ao excluir categoria:', err);
    }
  };

  const handleCreateArquivo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) return alert('Preencha o nome do arquivo.');

    try {
      setIsSubmittingFile(true);
      const payload = new FormData();
      payload.append('pasta', selectedPastaSlug);
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
        setIsSubmittingFile(false);
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
        const newArq = await res.json();
        setArquivos(prev => [newArq, ...prev]);
        setPastas(prev => prev.map(p => p.slug === selectedPastaSlug ? { ...p, total_arquivos: (p.total_arquivos || 0) + 1 } : p));
        setIsNewArquivoModalOpen(false);
        setSelectedFile(null);
        setFormData({
          subcategoria: 'Geral',
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
      setIsSubmittingFile(false);
    }
  };

  const handleDeleteArquivo = async (id: number) => {
    if (!confirm('Deseja realmente excluir este arquivo?')) return;

    try {
      setIsDeletingId(id);
      const res = await fetch(`/api/arquivos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setArquivos(prev => prev.filter(item => item.id !== id));
        setPastas(prev => prev.map(p => p.slug === selectedPastaSlug ? { ...p, total_arquivos: Math.max(0, (p.total_arquivos || 1) - 1) } : p));
        if (viewingItem?.id === id) setViewingItem(null);
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

  // Subcategories dynamically available based on active category
  const subcategories = useMemo(() => {
    if (selectedPastaSlug === 'solapa_adesivos') {
      return [
        { id: 'todos', label: 'Todos' },
        { id: 'Solapa', label: 'Solapas' },
        { id: 'Adesivo', label: 'Adesivos' }
      ];
    }
    if (selectedPastaSlug === 'cod_barras_tabelas') {
      return [
        { id: 'todos', label: 'Todos' },
        { id: 'Código de Barras', label: 'Códigos de Barras' },
        { id: 'Tabela Nutricional', label: 'Tabelas Nutricionais' }
      ];
    }
    // For custom categories, list unique subcategories present in that folder
    const uniqueSubs = Array.from(new Set(
      arquivos.filter(a => a.pasta === selectedPastaSlug && a.subcategoria).map(a => a.subcategoria)
    ));
    if (uniqueSubs.length > 0) {
      return [{ id: 'todos', label: 'Todos' }, ...uniqueSubs.map(s => ({ id: s, label: s }))];
    }
    return [];
  }, [selectedPastaSlug, arquivos]);

  // Filtered files for the currently selected category
  const filteredArquivos = useMemo(() => {
    return arquivos.filter(item => {
      if (item.pasta !== selectedPastaSlug) return false;
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
  }, [arquivos, selectedPastaSlug, activeSubcat, searchTerm]);

  const currentPasta = pastas.find(p => p.slug === selectedPastaSlug) || pastas[0];

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Linha Primária: Categorias, Nova Categoria, Busca e Adicionar Arquivo */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Categorias em Linha Primária */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {pastas.map((cat) => {
            const isSelected = selectedPastaSlug === cat.slug;
            return (
              <div key={cat.id} className="relative group shrink-0">
                <button
                  onClick={() => {
                    setSelectedPastaSlug(cat.slug);
                    setActiveSubcat('todos');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#5A1788] text-white shadow-md shadow-purple-500/20 ring-2 ring-[#5A1788]/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.slug === 'solapa_adesivos' ? (
                    <Tag size={15} className={isSelected ? 'text-white' : 'text-[#5A1788] dark:text-purple-400'} />
                  ) : cat.slug === 'cod_barras_tabelas' ? (
                    <Barcode size={15} className={isSelected ? 'text-white' : 'text-[#5A1788] dark:text-purple-400'} />
                  ) : (
                    <Folder size={15} className={isSelected ? 'text-white' : 'text-amber-500'} />
                  )}

                  <span>{cat.nome}</span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {cat.total_arquivos ?? 0}
                  </span>
                </button>

                {/* Opção de excluir categoria personalizada */}
                {cat.slug !== 'solapa_adesivos' && cat.slug !== 'cod_barras_tabelas' && (
                  <button
                    onClick={(e) => handleDeletePasta(e, cat.id, cat.slug)}
                    title="Excluir Categoria"
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Criar Nova Categoria na Linha Primária */}
          {isCreatingPasta ? (
            <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950/40 p-1 rounded-xl border border-[#5A1788] shrink-0 animate-in fade-in duration-150">
              <input
                ref={newFolderInputRef}
                type="text"
                value={newPastaNome}
                onChange={(e) => setNewPastaNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmNewPasta();
                  if (e.key === 'Escape') {
                    setIsCreatingPasta(false);
                    setNewPastaNome('');
                  }
                }}
                placeholder="Nome da categoria..."
                className="text-xs px-2.5 py-1.5 rounded-lg border-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none w-36 font-semibold"
              />
              <button
                onClick={handleConfirmNewPasta}
                className="p-1.5 rounded-lg bg-[#5A1788] text-white hover:bg-[#48126e]"
                title="Salvar"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => {
                  setIsCreatingPasta(false);
                  setNewPastaNome('');
                }}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                title="Cancelar"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsCreatingPasta(true);
                setNewPastaNome('');
              }}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#5A1788] hover:text-[#5A1788] text-xs font-bold transition-colors whitespace-nowrap shrink-0"
              title="Nova Categoria"
            >
              <Plus size={14} />
              Nova Categoria
            </button>
          )}
        </div>

        {/* Lado Direito: Busca e Botão de Adicionar Arquivo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar arquivos..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A1788]/20 focus:border-[#5A1788] text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={() => setIsNewArquivoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A1788] hover:bg-[#48126e] text-white font-bold text-xs shadow-sm transition-all hover:scale-105 shrink-0"
          >
            <Plus size={15} />
            Adicionar Arquivo
          </button>
        </div>
      </div>

      {/* Subcategorias / Filtros rápidos dentro da Categoria Ativa */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1">
          {subcategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveSubcat(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeSubcat.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Grade de Arquivos da Categoria Selecionada (Ao selecionar a categoria, já aparece tudo) */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A1788]" />
        </div>
      ) : filteredArquivos.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <Tag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Nenhum arquivo em {currentPasta?.nome || 'nesta categoria'}.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Envie sua arte final, código de barras ou tabela nutricional para começar.
          </p>
          <button
            onClick={() => setIsNewArquivoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A1788] text-white text-xs font-bold shadow-sm"
          >
            <Plus size={15} />
            Adicionar Arquivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredArquivos.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Imagem Preview */}
              <div
                onClick={() => setViewingItem(item)}
                className="relative h-44 bg-slate-100 dark:bg-slate-800/80 cursor-pointer overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800"
              >
                <img
                  src={item.arquivo_url}
                  alt={item.nome}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                />

                {/* Tag de Subcategoria */}
                <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-black uppercase text-[#5A1788] dark:text-purple-300 shadow-sm border border-black/5">
                  {item.subcategoria}
                </div>

                {/* Formato */}
                <div className="absolute top-2.5 right-2.5 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
                  {item.formato || 'JPG'}
                </div>

                {/* Overlay no Hover */}
                <div className="absolute inset-0 bg-[#5A1788]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white dark:bg-slate-900 text-[#5A1788] dark:text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5">
                    <Eye size={14} />
                    Visualizar
                  </span>
                </div>
              </div>

              {/* Informações e Ações do Card */}
              <div className="p-3.5 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-1 line-clamp-1" title={item.nome}>
                    {item.nome}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                    {item.descricao || 'Arquivo técnico pronto para produção.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-medium text-slate-400">
                    {item.tamanho || '350 KB'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingItem(item)}
                      title="Visualizar"
                      className="p-1 rounded-lg text-slate-500 hover:text-[#5A1788] hover:bg-purple-50 dark:hover:bg-purple-950/40"
                    >
                      <Eye size={15} />
                    </button>
                    <a
                      href={item.arquivo_url}
                      download={item.nome}
                      title="Download"
                      className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    >
                      <Download size={15} />
                    </a>
                    <button
                      onClick={() => handleDeleteArquivo(item.id)}
                      disabled={isDeletingId === item.id}
                      title="Excluir"
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 size={15} />
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
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5A1788] dark:text-purple-400">
                  {viewingItem.subcategoria}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {viewingItem.nome}
                </h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Imagem */}
            <div className="bg-slate-100 dark:bg-slate-950 p-6 flex items-center justify-center max-h-[420px] overflow-hidden">
              <img
                src={viewingItem.arquivo_url}
                alt={viewingItem.nome}
                className="max-h-[380px] w-auto max-w-full object-contain rounded-xl shadow-md border border-black/5"
              />
            </div>

            {/* Detalhes e Ações */}
            <div className="p-5 space-y-3">
              {viewingItem.descricao && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {viewingItem.descricao}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => copyToClipboard(viewingItem.arquivo_url)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {copiedUrl ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copiedUrl ? 'Link Copiado!' : 'Copiar Link'}
                </button>

                <a
                  href={viewingItem.arquivo_url}
                  download={viewingItem.nome}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A1788] hover:bg-[#48126e] text-white text-xs font-bold shadow-md"
                >
                  <Download size={14} />
                  Baixar Arquivo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Arquivo */}
      {isNewArquivoModalOpen && (
        <div
          onClick={() => setIsNewArquivoModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus size={18} className="text-[#5A1788]" />
                Adicionar em {currentPasta?.nome}
              </h3>
              <button
                onClick={() => setIsNewArquivoModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateArquivo} className="p-5 space-y-3.5 text-xs">
              {/* Categoria de Destino */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                  Categoria de Destino
                </label>
                <select
                  value={selectedPastaSlug}
                  onChange={(e) => setSelectedPastaSlug(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#5A1788]"
                >
                  {pastas.map(p => (
                    <option key={p.id} value={p.slug}>{p.nome}</option>
                  ))}
                </select>
              </div>

              {/* Subcategoria */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                  Subcategoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Solapa, Adesivo, Código de Barras, Tabela..."
                  value={formData.subcategoria}
                  onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#5A1788]"
                />
              </div>

              {/* Nome */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                  Nome do Arquivo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rótulo Frontal Mix 200g"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#5A1788]"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  placeholder="Observações técnicas..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#5A1788]"
                />
              </div>

              {/* Arquivo ou URL */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                  Arquivo ou Imagem
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-100 dark:file:bg-purple-900/40 file:text-[#5A1788] mb-2 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Ou informe a URL..."
                  value={formData.arquivo_url}
                  onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-xs"
                />
              </div>

              {/* Botões */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewArquivoModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFile}
                  className="px-4 py-2 rounded-xl bg-[#5A1788] hover:bg-[#48126e] text-white font-bold disabled:opacity-50 shadow-md"
                >
                  {isSubmittingFile ? 'Salvando...' : 'Salvar Arquivo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
