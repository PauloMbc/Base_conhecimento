
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Note, Theme, Category, LearningStep } from './types';
import { INITIAL_NOTES, INITIAL_LEARNING_STEPS } from './constants';
import { NoteCard } from './components/NoteCard';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [learningPath, setLearningPath] = useState<LearningStep[]>(INITIAL_LEARNING_STEPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'HOME' | 'PRIVATE' | 'LEARNING' | 'SETTINGS'>('HOME');
  const [selectedLearningTag, setSelectedLearningTag] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Persistence
  useEffect(() => {
    const savedNotes = localStorage.getItem('ancient_codex_notes_v12');
    const savedPath = localStorage.getItem('ancient_codex_path_v12');
    const savedTheme = localStorage.getItem('ancient_codex_theme_v12');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedPath) setLearningPath(JSON.parse(savedPath));
    if (savedTheme) setTheme(savedTheme as Theme);
  }, []);

  useEffect(() => {
    localStorage.setItem('ancient_codex_notes_v12', JSON.stringify(notes));
    localStorage.setItem('ancient_codex_path_v12', JSON.stringify(learningPath));
    localStorage.setItem('ancient_codex_theme_v12', theme);
  }, [notes, learningPath, theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const progress = useMemo(() => {
    const completed = learningPath.filter(s => s.isCompleted).length;
    return Math.round((completed / learningPath.length) * 100);
  }, [learningPath]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            n.content.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'PRIVATE') return n.isPrivate && matchesSearch;
      if (activeTab === 'HOME') return !n.isPrivate && matchesSearch;
      return matchesSearch;
    });
  }, [notes, searchQuery, activeTab]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    learningPath.forEach(step => step.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [learningPath]);

  const filteredLearningSteps = useMemo(() => {
    return learningPath.filter(step => 
      (!selectedLearningTag || step.tags.includes(selectedLearningTag)) &&
      (step.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       step.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [learningPath, selectedLearningTag, searchQuery]);

  const toggleStepCompletion = (id: string) => {
    setLearningPath(path => path.map(step => 
      step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
    ));
  };

  const startNewNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      category: activeTab === 'PRIVATE' ? 'PRIVADO' : 'BIBLIOTECA',
      isPrivate: activeTab === 'PRIVATE',
      timestamp: 'Novo Pergaminho',
      isArchived: false,
      icon: activeTab === 'PRIVATE' ? 'lock' : 'ink_pen'
    };
    setEditingNote(note);
    setIsShareMenuOpen(false);
  };

  const saveEditedNote = () => {
    if (!editingNote) return;
    const finalContent = editorRef.current?.innerHTML || '';
    const updatedNote = { ...editingNote, content: finalContent, title: editingNote.title || 'Fragmento Sem Título' };
    if (notes.find(n => n.id === updatedNote.id)) {
      setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    } else {
      setNotes([updatedNote, ...notes]);
    }
    setEditingNote(null);
  };

  const exec = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handlePrint = () => {
    setIsShareMenuOpen(false);
    window.print();
  };

  const handleWhatsApp = () => {
    if (!editingNote) return;
    const text = `*${editingNote.title}*\n\n${editorRef.current?.innerText || ''}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    setIsShareMenuOpen(false);
  };

  const handleNotionCopy = () => {
    if (!editingNote) return;
    const title = editingNote.title || 'Sem Título';
    const content = editorRef.current?.innerText || '';
    const notionFormat = `# ${title}\n\n${content}`;
    navigator.clipboard.writeText(notionFormat);
    alert('Conteúdo copiado em formato Markdown para o Notion!');
    setIsShareMenuOpen(false);
  };

  return (
    <div className={`${theme} transition-colors duration-1000 min-h-screen bg-[#0c0606] flex justify-center selection:bg-gold-bright/30`}>
      <div className={`
        relative flex h-screen w-full flex-col overflow-hidden transition-all duration-1000
        md:max-w-6xl md:my-2 md:rounded-2xl md:shadow-[0_40px_150px_rgba(0,0,0,1)]
        ${isDark ? 'bg-leather-950 text-gold-faded leather-texture vignette-dark' : 'bg-sepia-50 text-sepia-900 parchment-texture vignette'}
        border-x md:border-8 ${isDark ? 'border-leather-900/60' : 'border-sepia-800/15'}
      `}>
        
        {/* HEADER PRINCIPAL */}
        <header className="px-6 md:px-10 pt-8 pb-4 z-20 flex items-center justify-between no-print">
          <div className="flex flex-col">
            <h1 className={`font-display tracking-[0.5em] uppercase transition-all ${isDark ? 'text-2xl font-bold text-gold-bright' : 'text-xl text-sepia-900 drop-shadow-sm'}`}>
              {activeTab === 'LEARNING' ? 'Jornada' : (isDark ? 'Códice' : 'O Arquivo')}
            </h1>
            <p className="font-script text-2xl opacity-40 -mt-2">{activeTab === 'LEARNING' ? 'Mapa do Conhecimento' : 'Volume de Memórias'}</p>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className={`size-11 rounded-full border flex items-center justify-center transition-all shadow-lg ${isDark ? 'bg-gold-faded/5 border-gold-faded/20 text-gold-bright hover:bg-gold-faded/10' : 'bg-sepia-100 border-sepia-800/20 text-sepia-900 hover:bg-white'}`}>
                <span className="material-symbols-outlined text-2xl">{isDark ? 'dark_mode' : 'light_mode'}</span>
             </button>
          </div>
        </header>

        {/* SEARCH FLOATER */}
        <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 z-30 no-print">
            <div className={`flex items-center px-5 h-11 w-72 transition-all rounded-full border shadow-xl backdrop-blur-md ${isDark ? 'bg-black/40 border-gold-faded/10' : 'bg-sepia-100/60 border-sepia-800/10'}`}>
                <span className="material-symbols-outlined text-[18px] opacity-40 mr-2">search</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full text-xs font-serif italic placeholder:opacity-30"
                  placeholder="Escaneie glifos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
        </div>

        {/* MAIN AREA */}
        <main className="flex-1 overflow-y-auto px-6 md:px-10 py-6 scroll-smooth custom-scrollbar relative">
          {activeTab === 'HOME' || activeTab === 'PRIVATE' ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
              {filteredNotes.map(note => (
                  <NoteCard key={note.id} note={note} theme={theme} onDelete={(id) => setNotes(notes.filter(n => n.id !== id))} onEdit={setEditingNote} />
              ))}
            </div>
          ) : activeTab === 'LEARNING' ? (
            <div className="max-w-3xl mx-auto py-8">
                <div className={`sticky top-0 z-40 mb-16 p-8 border rounded-xl shadow-2xl backdrop-blur-xl ${isDark ? 'bg-leather-950/90 border-gold-faded/20' : 'bg-sepia-100/80 border-sepia-800/20 shadow-sepia-800/5'}`}>
                    <div className="flex justify-between items-end mb-4">
                        <span className="font-display text-[11px] uppercase tracking-[0.3em] opacity-60 italic">Nível de Ascensão</span>
                        <span className="font-display text-2xl text-gold-faded">{progress}%</span>
                    </div>
                    <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-black/40' : 'bg-sepia-800/10'}`}>
                        <div className="h-full bg-gradient-to-r from-gold-faded to-gold-bright transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="space-y-32">
                  {filteredLearningSteps.map((step, idx) => (
                    <div key={step.id} className={`flex items-center w-full ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className="w-1/2 flex justify-center">
                        <div onClick={() => toggleStepCompletion(step.id)} className={`size-24 rounded-full border-2 flex items-center justify-center cursor-pointer ${step.isCompleted ? 'bg-moss border-moss text-white' : 'bg-current/5 border-current/20'}`}>
                          <span className="material-symbols-outlined text-4xl">{step.isCompleted ? 'check_circle' : step.icon}</span>
                        </div>
                      </div>
                      <div className="w-1/2 p-4">
                        <h3 className="font-display text-sm uppercase font-bold">{step.title}</h3>
                        <p className="font-serif italic text-xs opacity-60">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          ) : (
            <div className="w-full max-w-xl mt-8 mx-auto space-y-4">
                <h2 className="font-display text-lg mb-8 uppercase tracking-widest border-b border-current/20 pb-2 text-center">Configurações</h2>
                <SettingRow label="Selo de Segurança" theme={theme} active />
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full mt-12 py-5 border border-red-900/30 text-red-900/60 font-display text-[11px] uppercase tracking-[0.4em]">Incinerar Registros</button>
            </div>
          )}
          <div className="h-48"></div> 
        </main>

        {/* BOTTOM NAV */}
        <nav className={`relative z-30 px-6 pt-6 pb-12 flex items-center justify-between border-t no-print ${isDark ? 'bg-black/70 backdrop-blur-2xl border-gold-faded/10' : 'bg-sepia-50/95 backdrop-blur-md border-sepia-800/15 shadow-[0_-15px_50px_rgba(61,43,31,0.08)]'}`}>
          <div className="flex flex-1 justify-around items-center max-w-2xl mx-auto">
            <BottomTab icon="menu_book" label="Grimório" active={activeTab === 'HOME'} onClick={() => setActiveTab('HOME')} theme={theme} />
            <BottomTab icon="map" label="Jornada" active={activeTab === 'LEARNING'} onClick={() => setActiveTab('LEARNING')} theme={theme} />
            <div className="relative -top-14 flex flex-col items-center">
                <button onClick={startNewNote} className={`size-18 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 z-50 ${isDark ? 'bg-gold-bright text-leather-950 shadow-gold-bright/30' : 'bg-sepia-900 text-sepia-50 shadow-sepia-900/40 border-4 border-white/10'}`}><span className="material-symbols-outlined text-4xl">ink_pen</span></button>
            </div>
            <BottomTab icon="lock" label="Segredos" active={activeTab === 'PRIVATE'} onClick={() => setActiveTab('PRIVATE')} theme={theme} />
            <BottomTab icon="settings" label="Relíquias" active={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')} theme={theme} />
          </div>
        </nav>

        {/* EDITOR MODAL (Refactored to match provided design image) */}
        {editingNote && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/98 backdrop-blur-xl animate-in fade-in duration-500 modal-overlay-bg">
                <div className={`w-full max-w-5xl h-full md:h-[94vh] flex flex-col shadow-2xl relative overflow-hidden modal-content ${isDark ? 'bg-[#120909] text-gold-faded' : 'bg-[#F4EBD0] text-sepia-900 parchment-texture deckled-edge'}`}>
                    
                    {/* MODAL HEADER */}
                    <div className={`px-8 py-8 flex items-center justify-between no-print ${isDark ? 'bg-transparent' : 'bg-sepia-100/40'}`}>
                        <div className="flex items-center gap-4 flex-1">
                            <span className="material-symbols-outlined text-gold-faded/40 text-2xl">history_edu</span>
                            <input 
                                className={`bg-transparent border-none focus:ring-0 text-xl md:text-3xl font-display uppercase tracking-[0.2em] w-full p-0 ${isDark ? 'placeholder:text-gold-faded/20 text-gold-faded' : 'placeholder:text-sepia-900/20 text-sepia-900'}`}
                                placeholder="MANUSCRIPT TITLE..."
                                autoFocus
                                value={editingNote.title}
                                onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                            />
                        </div>
                        <div className="flex items-center gap-4 relative">
                            {/* BOTÃO COMPARTILHAR (Ex-Publish) */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                                    className={`flex items-center gap-3 px-6 py-2.5 rounded-full border border-gold-faded/30 font-display text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-gold-faded/10 ${isDark ? 'text-gold-faded' : 'text-sepia-900 border-sepia-800/30 bg-white/40'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">share</span>
                                    COMPARTILHAR
                                </button>
                                
                                {isShareMenuOpen && (
                                    <div className={`absolute top-full mt-3 right-0 w-56 rounded-xl shadow-2xl border p-2 z-[110] animate-in slide-in-from-top-2 ${isDark ? 'bg-[#1a0f0f] border-gold-faded/20' : 'bg-sepia-50 border-sepia-800/30'}`}>
                                        <ShareOption icon="picture_as_pdf" label="PDF / Imprimir" onClick={handlePrint} theme={theme} />
                                        <ShareOption icon="chat" label="WhatsApp" onClick={handleWhatsApp} theme={theme} />
                                        <ShareOption icon="description" label="Copiar p/ Notion" onClick={handleNotionCopy} theme={theme} />
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setEditingNote(null)} className="opacity-40 hover:opacity-100 transition-opacity ml-2">
                                <span className="material-symbols-outlined text-3xl">close</span>
                            </button>
                        </div>
                    </div>

                    {/* TOOLBAR - Matching 4 groups in image */}
                    <div className={`px-8 py-5 flex flex-wrap gap-4 items-center border-t border-b border-current/5 no-print ${isDark ? 'bg-transparent' : 'bg-sepia-100/60'}`}>
                        {/* Group 1: Style */}
                        <ToolGroup theme={theme}>
                            <ToolbarBtn theme={theme} label="B" title="Bold" onClick={() => exec('bold')} />
                            <ToolbarBtn theme={theme} label="I" title="Italic" onClick={() => exec('italic')} />
                            <ToolbarBtn theme={theme} label="U" title="Underline" onClick={() => exec('underline')} />
                            <ToolbarBtn theme={theme} label="S" title="Strikethrough" onClick={() => exec('strikeThrough')} />
                        </ToolGroup>

                        {/* Group 2: Structure */}
                        <ToolGroup theme={theme}>
                            <ToolbarBtn theme={theme} label="H1" title="H1" onClick={() => exec('formatBlock', 'H1')} />
                            <ToolbarBtn theme={theme} label="H2" title="H2" onClick={() => exec('formatBlock', 'H2')} />
                            <ToolbarBtn theme={theme} icon="format_list_bulleted" title="List" onClick={() => exec('insertUnorderedList')} />
                            <ToolbarBtn theme={theme} label="99" title="Quote" onClick={() => exec('formatBlock', 'BLOCKQUOTE')} />
                        </ToolGroup>

                        {/* Group 3: Media */}
                        <ToolGroup theme={theme}>
                            <ToolbarBtn theme={theme} icon="image" title="Image" onClick={() => {
                              const url = prompt("Link do Pergaminho (URL):");
                              if(url) exec('insertHTML', `<img src="${url}" class="max-w-full my-8 rounded shadow-2xl border-2 border-current/10" />`);
                            }} />
                            <ToolbarBtn theme={theme} icon="table_chart" title="Table" onClick={() => exec('insertHTML', '<table border="1" style="width:100%; border-collapse: collapse; margin: 10px 0;"><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table>')} />
                            <ToolbarBtn theme={theme} icon="code" title="Code" onClick={() => exec('formatBlock', 'PRE')} />
                        </ToolGroup>

                        {/* Group 4: Signaling */}
                        <ToolGroup theme={theme}>
                            <ToolbarBtn theme={theme} icon="star" title="Sacred" onClick={() => {}} />
                            <ToolbarBtn theme={theme} icon="favorite" title="Heart" onClick={() => {}} />
                            <ToolbarBtn theme={theme} icon="warning" title="Warning" onClick={() => {}} />
                        </ToolGroup>
                    </div>

                    {/* EDITOR BODY */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative editor-container">
                        <div 
                            ref={editorRef}
                            contentEditable
                            dangerouslySetInnerHTML={{ __html: editingNote.content }}
                            className={`p-10 md:p-24 focus:outline-none text-2xl md:text-3xl leading-relaxed italic font-serif min-h-full ${isDark ? 'text-gold-faded/60' : 'text-sepia-900/90'}`}
                            onFocus={(e) => {
                              if (e.currentTarget.innerHTML === '') e.currentTarget.innerHTML = '';
                            }}
                        />
                        {(!editingNote.content || editingNote.content === '') && (
                          <div className={`absolute top-10 md:top-24 left-10 md:left-24 pointer-events-none text-2xl md:text-3xl font-serif italic opacity-20 no-print ${isDark ? 'text-gold-faded' : 'text-sepia-900'}`}>
                            Begin your inscription...
                          </div>
                        )}
                    </div>

                    {/* EDITOR FOOTER */}
                    <div className={`px-10 py-10 flex flex-col md:flex-row gap-8 justify-between items-center border-t no-print ${isDark ? 'border-gold-faded/10 bg-black/10' : 'border-sepia-800/15'}`}>
                        <label className="flex items-center gap-5 cursor-pointer group">
                            <input type="checkbox" className="hidden" checked={editingNote.isPrivate} onChange={() => setEditingNote({...editingNote, isPrivate: !editingNote.isPrivate, category: !editingNote.isPrivate ? 'PRIVADO' : 'BIBLIOTECA'})} />
                            <div className={`size-7 border-2 flex items-center justify-center rounded transition-all ${editingNote.isPrivate ? 'bg-red-800 border-red-800' : 'border-current opacity-30'}`}>
                                {editingNote.isPrivate && <span className="material-symbols-outlined text-sm text-white">lock</span>}
                            </div>
                            <span className="text-sm font-display uppercase tracking-[0.2em] opacity-40">Privado</span>
                        </label>
                        <button onClick={saveEditedNote} className={`w-full md:w-auto px-20 py-5 font-display uppercase tracking-[0.4em] text-sm transition-all hover:translate-y-[-3px] active:scale-95 ${isDark ? 'bg-gold-bright text-leather-950' : 'bg-sepia-900 text-sepia-50 shadow-sepia-900/30'}`}>
                            Selar no Códice
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const ShareOption: React.FC<{ icon: string; label: string; onClick: () => void; theme: Theme }> = ({ icon, label, onClick, theme }) => {
    const isDark = theme === 'dark';
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all text-left ${isDark ? 'hover:bg-gold-faded/10 text-gold-faded/80 hover:text-gold-bright' : 'hover:bg-sepia-900/5 text-sepia-900/80 hover:text-sepia-900'}`}>
            <span className="material-symbols-outlined text-lg">{icon}</span>
            <span className="font-display text-[10px] uppercase tracking-wider font-bold">{label}</span>
        </button>
    );
};

const ToolGroup: React.FC<{ children: React.ReactNode, theme: Theme }> = ({ children, theme }) => (
    <div className={`flex items-center p-1 rounded-md gap-1 ${theme === 'dark' ? 'bg-[#0f0909] border border-gold-faded/10' : 'bg-sepia-800/5 border border-sepia-800/10'}`}>
        {children}
    </div>
);

const ToolbarBtn: React.FC<{ theme: Theme; icon?: string; label?: string; title: string; onClick: () => void }> = ({ theme, icon, label, title, onClick }) => {
  const isDark = theme === 'dark';
  return (
    <button onClick={(e) => { e.preventDefault(); onClick(); }} title={title} className={`size-10 flex items-center justify-center rounded-sm transition-all hover:scale-105 active:scale-95 ${isDark ? 'text-gold-faded/40 hover:text-gold-bright' : 'text-sepia-900/40 hover:text-sepia-900'}`}>
        {icon ? <span className="material-symbols-outlined text-[18px]">{icon}</span> : <span className="font-display text-xs font-bold">{label}</span>}
    </button>
  );
};

const BottomTab: React.FC<{ icon: string; label: string; active?: boolean; onClick: () => void; theme: Theme }> = ({ icon, label, active, onClick, theme }) => {
  const isDark = theme === 'dark';
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-2 transition-all group relative ${active ? 'scale-110 opacity-100' : 'opacity-30 hover:opacity-100'}`}>
      <span className={`material-symbols-outlined text-3xl md:text-4xl transition-all ${active ? 'fill-[1]' : ''}`}>{icon}</span>
      <span className={`font-display text-[10px] tracking-[0.2em] uppercase mt-1.5`}>{label}</span>
      {active && <div className={`absolute -bottom-4 w-8 h-1 rounded-full ${isDark ? 'bg-gold-bright shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'bg-sepia-900'}`}></div>}
    </button>
  );
};

const SettingRow: React.FC<{ label: string; theme: Theme; active?: boolean }> = ({ label, theme, active }) => (
    <div className={`flex items-center justify-between p-6 border rounded-xl transition-all ${theme === 'dark' ? 'bg-black/20 border-gold-faded/10' : 'bg-sepia-100 border-sepia-800/10 hover:bg-white'}`}>
        <span className="font-display text-[11px] tracking-[0.2em] uppercase opacity-70 italic">{label}</span>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${active ? (theme === 'dark' ? 'bg-gold-bright' : 'bg-moss') : 'bg-gray-500/20'}`}>
            <div className={`size-4 bg-white rounded-full transition-transform transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
    </div>
);

export default App;
