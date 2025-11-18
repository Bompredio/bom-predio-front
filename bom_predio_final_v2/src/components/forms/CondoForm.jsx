import React, { useState } from 'react'
import styles from './CondoForm.module.css'
import { supabase } from '../../services/supabase' // usa o supabase existente (pode ser null)

export default function CondoForm({ onSubmit }) {
  const [condoName, setCondoName] = useState('')
  const [city, setCity] = useState('')
  const [factionsTotal, setFactionsTotal] = useState('')
  const [factionsResidential, setFactionsResidential] = useState('')
  const [factionsCommercial, setFactionsCommercial] = useState('')
  const [garages, setGarages] = useState('')
  const [blocks, setBlocks] = useState('')
  const [elevators, setElevators] = useState('')
  const [hasPool, setHasPool] = useState(false)
  const [hasGarden, setHasGarden] = useState(false)
  const [hasCCTV, setHasCCTV] = useState(false)
  const [hasAutomaticGate, setHasAutomaticGate] = useState(false)
  const [hasWaterPumps, setHasWaterPumps] = useState(false)
  const [hasCleaning, setHasCleaning] = useState(false)
  const [hasMaintenanceContract, setHasMaintenanceContract] = useState(false)
  const [hasLiftContract, setHasLiftContract] = useState(false)
  const [hasInsurance, setHasInsurance] = useState(false)
  const [hasConcierge, setHasConcierge] = useState(false)
  const [debtExists, setDebtExists] = useState('no')
  const [approxDebtors, setApproxDebtors] = useState('')
  const [reserveFund, setReserveFund] = useState('unknown')
  const [recentAssembly, setRecentAssembly] = useState('unknown')
  const [conflict, setConflict] = useState('no')
  const [priorities, setPriorities] = useState({
    price: false,
    transparency: false,
    erp: false,
    visits: false,
    support24: false,
    communication: false,
    preventive: false,
    debtCollection: false
  })
  const [currentBudget, setCurrentBudget] = useState('')
  const [desiredBudget, setDesiredBudget] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const togglePriority = (key) => {
    setPriorities(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function validate() {
    if (!condoName.trim()) return 'Nome do condomínio é obrigatório'
    if (!city.trim()) return 'Cidade é obrigatória'
    if (!factionsTotal || Number(factionsTotal) <= 0) return 'Número total de frações inválido'
    if (!contactEmail.trim() || contactEmail.indexOf('@') === -1) return 'E-mail de contacto inválido'
    if (!contactPhone.trim()) return 'Telefone de contacto é obrigatório'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) { setError(v); return }
    setLoading(true)
    setSuccess(false)

    const payload = {
      condo_name: condoName.trim(),
      city: city.trim(),
      blocks_number: blocks ? Number(blocks) : null,
      fractions_total: Number(factionsTotal),
      fractions_residential: factionsResidential ? Number(factionsResidential) : null,
      fractions_commercial: factionsCommercial ? Number(factionsCommercial) : null,
      garages_number: garages ? Number(garages) : null,
      elevators_number: elevators ? Number(elevators) : null,
      has_pool: Boolean(hasPool),
      has_garden: Boolean(hasGarden),
      has_cctv: Boolean(hasCCTV),
      has_automatic_gate: Boolean(hasAutomaticGate),
      has_water_pumps: Boolean(hasWaterPumps),
      has_cleaning_contract: Boolean(hasCleaning),
      has_maintenance_contract: Boolean(hasMaintenanceContract),
      has_lift_contract: Boolean(hasLiftContract),
      has_insurance: Boolean(hasInsurance),
      has_concierge: Boolean(hasConcierge),
      debt_exists: debtExists,
      approx_debtors: approxDebtors ? Number(approxDebtors) : null,
      reserve_fund: reserveFund,
      recent_assembly: recentAssembly,
      internal_conflict: conflict,
      priorities: Object.keys(priorities).filter(p => priorities[p]),
      current_budget_per_fraction: currentBudget ? Number(currentBudget) : null,
      desired_budget_per_fraction: desiredBudget ? Number(desiredBudget) : null,
      contact_name: contactName.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim(),
      notes: notes.trim(),
      created_at: new Date().toISOString()
    }

    try {
      // tentativa de gravar no Supabase (se estiver configurado)
      if (supabase && typeof supabase.from === 'function') {
        const { data, error: sbErr } = await supabase.from('leads').insert([payload])
        if (sbErr) {
          console.warn('Supabase insert error', sbErr)
          // não falha completamente — envia para onSubmit
        } else {
          setSuccess(true)
        }
      } else {
        // supabase não disponível — apenas log
        console.info('Supabase não disponível — payload:', payload)
      }
    } catch (err) {
      console.error('Erro ao gravar lead', err)
      setError('Erro ao gravar dados (Serviço). Tenta novamente.')
    } finally {
      setLoading(false)
      // notifica o parent para executar match/local processing
      if (typeof onSubmit === 'function') {
        try { await onSubmit(payload) } catch(e){ console.warn('onSubmit handler error', e) }
      }
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h3>1. Identificação</h3>
        <label>Nome do condomínio *</label>
        <input value={condoName} onChange={e=>setCondoName(e.target.value)} placeholder="Ex.: Edifício Sol" />

        <label>Cidade / Freguesia *</label>
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Ex.: Lisboa" />

        <div className={styles.row}>
          <div>
            <label>Nº total de frações *</label>
            <input type="number" value={factionsTotal} onChange={e=>setFactionsTotal(e.target.value)} placeholder="Ex.: 24" />
          </div>
          <div>
            <label>Nº residenciais</label>
            <input type="number" value={factionsResidential} onChange={e=>setFactionsResidential(e.target.value)} placeholder="opcional" />
          </div>
          <div>
            <label>Nº comerciais</label>
            <input type="number" value={factionsCommercial} onChange={e=>setFactionsCommercial(e.target.value)} placeholder="opcional" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>2. Estrutura física</h3>
        <div className={styles.row}>
          <div>
            <label>Nº blocos</label>
            <input type="number" value={blocks} onChange={e=>setBlocks(e.target.value)} placeholder="Ex.: 1" />
          </div>
          <div>
            <label>Nº elevadores</label>
            <input type="number" value={elevators} onChange={e=>setElevators(e.target.value)} placeholder="Ex.: 2" />
          </div>
          <div>
            <label>Nº garagens/boxes</label>
            <input type="number" value={garages} onChange={e=>setGarages(e.target.value)} placeholder="opcional" />
          </div>
        </div>

        <div className={styles.checkboxRow}>
          <label><input type="checkbox" checked={hasPool} onChange={e=>setHasPool(e.target.checked)} /> Piscina</label>
          <label><input type="checkbox" checked={hasGarden} onChange={e=>setHasGarden(e.target.checked)} /> Jardim</label>
          <label><input type="checkbox" checked={hasCCTV} onChange={e=>setHasCCTV(e.target.checked)} /> CCTV</label>
          <label><input type="checkbox" checked={hasAutomaticGate} onChange={e=>setHasAutomaticGate(e.target.checked)} /> Portão automático</label>
          <label><input type="checkbox" checked={hasWaterPumps} onChange={e=>setHasWaterPumps(e.target.checked)} /> Bombas de água</label>
        </div>
      </div>

      <div className={styles.section}>
        <h3>3. Situação administrativa</h3>
        <div className={styles.row}>
          <div>
            <label>Existe dívida de condóminos?</label>
            <select value={debtExists} onChange={e=>setDebtExists(e.target.value)}>
              <option value="no">Não</option>
              <option value="yes">Sim</option>
              <option value="unknown">Desconhecido</option>
            </select>
          </div>
          <div>
            <label>Nº aproximado de devedores</label>
            <input type="number" value={approxDebtors} onChange={e=>setApproxDebtors(e.target.value)} placeholder="opcional" />
          </div>
          <div>
            <label>Fundo de reserva</label>
            <select value={reserveFund} onChange={e=>setReserveFund(e.target.value)}>
              <option value="unknown">Desconhecido</option>
              <option value="no">Não</option>
              <option value="yes">Sim</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <label>Assembleia recente?</label>
            <select value={recentAssembly} onChange={e=>setRecentAssembly(e.target.value)}>
              <option value="unknown">Desconhecido</option>
              <option value="no">Não</option>
              <option value="yes">Sim</option>
            </select>
          </div>
          <div>
            <label>Conflitos internos?</label>
            <select value={conflict} onChange={e=>setConflict(e.target.value)}>
              <option value="no">Não</option>
              <option value="yes">Sim</option>
              <option value="unknown">Desconhecido</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>4. Serviços existentes</h3>
        <div className={styles.checkboxRow}>
          <label><input type="checkbox" checked={hasCleaning} onChange={e=>setHasCleaning(e.target.checked)} /> Limpeza</label>
          <label><input type="checkbox" checked={hasMaintenanceContract} onChange={e=>setHasMaintenanceContract(e.target.checked)} /> Manutenção contratada</label>
          <label><input type="checkbox" checked={hasLiftContract} onChange={e=>setHasLiftContract(e.target.checked)} /> Contrato elevadores</label>
          <label><input type="checkbox" checked={hasInsurance} onChange={e=>setHasInsurance(e.target.checked)} /> Seguro</label>
          <label><input type="checkbox" checked={hasConcierge} onChange={e=>setHasConcierge(e.target.checked)} /> Porteiro / Zelador</label>
        </div>
      </div>

      <div className={styles.section}>
        <h3>5. Prioridades (marcar até 3)</h3>
        <div className={styles.prioritiesGrid}>
          {[
            ['price','Preço'],
            ['transparency','Transparência / relatórios'],
            ['erp','ERP / acesso digital'],
            ['visits','Visitas frequentes'],
            ['support24','Suporte 24/7'],
            ['communication','Comunicação rápida'],
            ['preventive','Manutenção preventiva'],
            ['debtCollection','Cobrança de devedores']
          ].map(([key,label]) => (
            <button key={key} type="button" className={`${styles.pill} ${priorities[key] ? styles.pillActive : ''}`} onClick={()=>togglePriority(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>6. Orçamento e contacto</h3>
        <div className={styles.row}>
          <div>
            <label>Orçamento atual / fração (€/ano) — opcional</label>
            <input type="number" value={currentBudget} onChange={e=>setCurrentBudget(e.target.value)} placeholder="Ex.: 1200" />
          </div>
          <div>
            <label>Orçamento desejado / fração (€/ano) — opcional</label>
            <input type="number" value={desiredBudget} onChange={e=>setDesiredBudget(e.target.value)} placeholder="Ex.: 1000" />
          </div>
        </div>

        <label>Contacto do representante *</label>
        <input value={contactName} onChange={e=>setContactName(e.target.value)} placeholder="Nome completo" />
        <div className={styles.row}>
          <input value={contactEmail} onChange={e=>setContactEmail(e.target.value)} placeholder="email@exemplo.com" />
          <input value={contactPhone} onChange={e=>setContactPhone(e.target.value)} placeholder="+351 9..." />
        </div>

        <label>Observações</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Informações adicionais..." />

      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Lead gravada com sucesso — as administradoras serão notificadas.</div>}

      <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:12}}>
        <button type="submit" className="btn" disabled={loading} style={{background:'var(--brand-secondary)',color:'var(--brand-primary)'}}>
          {loading ? 'A enviar...' : 'Encontrar administradoras'}
        </button>
      </div>
    </form>
  )
}
