import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    type: string;
    title: string;
    content: React.ReactNode;
    maxWidth?: string;
    confirmText?: string;
    hideFooter?: boolean;
    onConfirm?: () => void;
    onClose: () => void;
}

export default function Modal({ isOpen, title, content, maxWidth = 'max-w-lg', confirmText = 'Confirmar', hideFooter = false, onConfirm, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white shadow-sm rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {content}
                </div>
                {!hideFooter && onConfirm && (
                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 font-bold">Cancelar</button>
                        <button onClick={onConfirm} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md">{confirmText}</button>
                    </div>
                )}
            </div>
        </div>
    );
}
