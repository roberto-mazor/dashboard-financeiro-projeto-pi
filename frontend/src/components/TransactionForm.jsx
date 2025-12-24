import { PlusCircle, CheckCircle, XCircle, Edit2, Settings } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TransactionForm = ({ 
  form, 
  setForm, 
  categorias, 
  onSave, 
  onAddCategoria,
  onUpdateCategoria // Certifique-se de passar essa função no Dashboard
}) => {
  const { theme, isDarkMode } = useTheme();
  const [mostraPainelCategoria, setMostraPainelCategoria] = useState(false);
  const [novoNomeCategoria, setNovoNomeCategoria] = useState('');
  const [tipoCategoria, setTipoCategoria] = useState('despesa');
  
  // Estado para edição de categoria existente
  const [editandoCat, setEditandoCat] = useState(null);
  const [nomeEditado, setNomeEditado] = useState('');

  const handleCreateCategoria = async () => {
    if (!novoNomeCategoria.trim()) return;
    const sucesso = await onAddCategoria(novoNomeCategoria, tipoCategoria);
    if (sucesso) {
      setNovoNomeCategoria('');
    }
  };

  const iniciarEdicao = (cat) => {
    setEditandoCat(cat.id_categoria);
    setNomeEditado(cat.nome);
  };

  const salvarEdicao = async (id) => {
    // Chamada para a nova função de atualização que faremos no dashboard
    const sucesso = await onUpdateCategoria(id, nomeEditado);
    if (sucesso) setEditandoCat(null);
  };

  return (
    <section 
      className="mb-8 p-5 rounded-xl shadow-md transition-all duration-300 border"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
        {form.id_transacao ? <Edit2 size={20} className="text-amber-500" /> : <PlusCircle size={20} className="text-blue-500" />}
        {form.id_transacao ? 'Editar Transação' : 'Nova Transação'}
      </h3>

      <form onSubmit={onSave} className="flex flex-wrap gap-3 items-center">
        <input 
          className="flex-1 min-w-45 p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
          type="text" 
          placeholder="Descrição (ex: Aluguel)" 
          value={form.descricao} 
          onChange={e => setForm({...form, descricao: e.target.value})} 
          required 
        />
        <input 
          className="w-32 p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
          type="number" 
          step="0.01" 
          placeholder="Valor" 
          value={form.valor} 
          onChange={e => setForm({...form, valor: e.target.value})} 
          required 
        />
        <input 
          className="p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border, colorScheme: isDarkMode ? 'dark' : 'light' }}
          type="date" 
          value={form.data} 
          onChange={e => setForm({...form, data: e.target.value})} 
          required 
        />
        
        <div className="flex gap-2 flex-1 min-w-55">
          <select 
            className="flex-1 p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
            style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
            value={form.id_categoria} 
            onChange={e => setForm({...form, id_categoria: e.target.value})} 
            required
          >
            <option value="">Selecione a Categoria</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nome} ({cat.tipo})
              </option>
            ))}
          </select>
          <button 
            type="button" 
            onClick={() => setMostraPainelCategoria(!mostraPainelCategoria)}
            className="p-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
            title="Gerenciar Categorias"
          >
            <Settings size={22} />
          </button>
        </div>

        <button 
          type="submit" 
          className="p-2.5 px-6 rounded-lg text-white font-bold flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: form.id_transacao ? '#f59e0b' : '#2563eb' }}
        >
          {form.id_transacao ? <CheckCircle size={20} /> : <PlusCircle size={20} />}
          {form.id_transacao ? 'Atualizar' : 'Lançar'}
        </button>
      </form>

      {/* PAINEL DE GESTÃO DE CATEGORIAS */}
      {mostraPainelCategoria && (
        <div 
          className="mt-5 p-4 rounded-xl border border-dashed animate-in slide-in-from-top-2 duration-300" 
          style={{ backgroundColor: theme.background, borderColor: theme.cardSaldo }}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold" style={{ color: theme.text }}>Gerenciar Categorias</h4>
            <button onClick={() => setMostraPainelCategoria(false)}><XCircle size={20} className="text-gray-400 hover:text-red-500" /></button>
          </div>

          {/* Criar Nova */}
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-700/20">
            <input 
              className="flex-1 p-2 rounded-lg border outline-none text-sm"
              style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
              placeholder="Novo nome..." 
              value={novoNomeCategoria} 
              onChange={e => setNovoNomeCategoria(e.target.value)} 
            />
            <select 
              className="p-2 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
              value={tipoCategoria} 
              onChange={e => setTipoCategoria(e.target.value)}
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
            <button onClick={handleCreateCategoria} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors">
              Criar
            </button>
          </div>

          {/* Lista para Edição */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
            {categorias.map(cat => (
              <div key={cat.id_categoria} className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-transparent hover:border-indigo-500/30 transition-all">
                {editandoCat === cat.id_categoria ? (
                  <div className="flex gap-1 w-full">
                    <input 
                      autoFocus
                      className="flex-1 p-1 rounded border text-sm"
                      style={{ backgroundColor: theme.inputBg, color: theme.text }}
                      value={nomeEditado}
                      onChange={e => setNomeEditado(e.target.value)}
                    />
                    <button onClick={() => salvarEdicao(cat.id_categoria)} className="text-emerald-500 p-1"><CheckCircle size={18} /></button>
                    <button onClick={() => setEditandoCat(null)} className="text-red-500 p-1"><XCircle size={18} /></button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm opacity-90" style={{ color: theme.text }}>{cat.nome} <small className="opacity-50 text-[10px] uppercase">({cat.tipo})</small></span>
                    <button onClick={() => iniciarEdicao(cat)} className="text-indigo-400 hover:text-indigo-600 p-1 transition-colors">
                      <Edit2 size={16} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TransactionForm;