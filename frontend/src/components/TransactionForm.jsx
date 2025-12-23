import { PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TransactionForm = ({ 
  form, 
  setForm, 
  categorias, 
  onSave, 
  onAddCategoria 
}) => {
  const { theme } = useTheme();
  const [mostraFormCategoria, setMostraFormCategoria] = useState(false);
  const [novoNomeCategoria, setNovoNomeCategoria] = useState('');
  const [tipoCategoria, setTipoCategoria] = useState('despesa');

  const styles = {
    formContainer: { 
      marginBottom: '30px', 
      padding: '20px', 
      backgroundColor: theme.surface, 
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'background-color 0.3s ease'
    },
    form: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
    input: { 
      padding: '10px', 
      borderRadius: '6px', 
      border: `1px solid ${theme.border}`, 
      backgroundColor: theme.inputBg,
      color: theme.text,
      flex: 1, 
      minWidth: '150px',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    button: { 
      padding: '10px 20px', 
      color: 'white', 
      border: 'none', 
      borderRadius: '6px', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '5px', 
      fontWeight: 'bold' 
    }
  };

  const handleCreateCategoria = async () => {
    const sucesso = await onAddCategoria(novoNomeCategoria, tipoCategoria);
    if (sucesso) {
      setNovoNomeCategoria('');
      setMostraFormCategoria(false);
    }
  };

  return (
    <section style={styles.formContainer}>
      <h3 style={{ marginBottom: '15px', color: theme.text }}>
        {form.id_transacao ? 'Editar Transação' : 'Nova Transação'}
      </h3>
      <form onSubmit={onSave} style={styles.form}>
        <input 
          style={styles.input} 
          type="text" 
          placeholder="Descrição" 
          value={form.descricao} 
          onChange={e => setForm({...form, descricao: e.target.value})} 
          required 
        />
        <input 
          style={styles.input} 
          type="number" 
          step="0.01" 
          placeholder="Valor" 
          value={form.valor} 
          onChange={e => setForm({...form, valor: e.target.value})} 
          required 
        />
        <input 
          style={{...styles.input, colorScheme: theme.isDarkMode ? 'dark' : 'light'}} 
          type="date" 
          value={form.data} 
          onChange={e => setForm({...form, data: e.target.value})} 
          required 
        />
        
        <div style={{ display: 'flex', gap: '5px', flex: 1, minWidth: '200px' }}>
          <select 
            style={styles.input} 
            value={form.id_categoria} 
            onChange={e => setForm({...form, id_categoria: e.target.value})} 
            required
          >
            <option value="" style={{backgroundColor: theme.inputBg}}>Categoria...</option>
            {categorias.map(cat => (
              <option 
                key={cat.id_categoria} 
                value={cat.id_categoria}
                style={{backgroundColor: theme.inputBg}}
              >
                {cat.nome} ({cat.tipo})
              </option>
            ))}
          </select>
          <button 
            type="button" 
            onClick={() => setMostraFormCategoria(!mostraFormCategoria)}
            style={{ ...styles.button, backgroundColor: '#6366f1', padding: '10px' }}
            title="Nova Categoria"
          >
            <PlusCircle size={20} />
          </button>
        </div>

        <button type="submit" style={{ ...styles.button, backgroundColor: form.id_transacao ? '#f59e0b' : '#2563eb' }}>
          {form.id_transacao ? <><CheckCircle size={20} /> Atualizar</> : <><PlusCircle size={20} /> Adicionar</>}
        </button>
      </form>

      {mostraFormCategoria && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          border: `1px dashed ${theme.cardSaldo}`, 
          borderRadius: '8px', 
          display: 'flex', 
          gap: '10px', 
          flexWrap: 'wrap',
          backgroundColor: theme.background
        }}>
          <input 
            style={styles.input} 
            placeholder="Nome da categoria" 
            value={novoNomeCategoria} 
            onChange={e => setNovoNomeCategoria(e.target.value)} 
          />
          <select 
            style={{ ...styles.input, maxWidth: '150px' }} 
            value={tipoCategoria} 
            onChange={e => setTipoCategoria(e.target.value)}
          >
            <option value="despesa" style={{backgroundColor: theme.inputBg}}>Despesa</option>
            <option value="receita" style={{backgroundColor: theme.inputBg}}>Receita</option>
          </select>
          <button type="button" onClick={handleCreateCategoria} style={{ ...styles.button, backgroundColor: '#6366f1' }}>
            Salvar Categoria
          </button>
          <button type="button" onClick={() => setMostraFormCategoria(false)} style={{ ...styles.button, backgroundColor: '#94a3b8' }}>
            <XCircle size={18}/>
          </button>
        </div>
      )}
    </section>
  );
};

export default TransactionForm;