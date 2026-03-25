import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CrmDeal, CrmStage } from '@/data/mockData';

interface NewDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stages: CrmStage[];
  onSave: (deal: CrmDeal) => void;
}

export default function NewDealDialog({ open, onOpenChange, stages, onSave }: NewDealDialogProps) {
  const [form, setForm] = useState({
    name: '',
    loc: '',
    valor: '',
    tel: '',
    email: '',
    temp: 'morno',
    stage: stages[0]?.id || 'lead',
    resp: 'Bulinha',
    notes: '',
  });

  const respOptions = [
    { n: 'Bulinha', i: 'B' },
    { n: 'Peralta', i: 'P' },
    { n: 'Leo', i: 'L' },
  ];

  function handleSave() {
    if (!form.name.trim()) return;
    const respObj = respOptions.find(r => r.n === form.resp) || respOptions[0];
    const deal: CrmDeal = {
      id: Date.now(),
      stage: form.stage,
      name: form.name,
      loc: form.loc,
      valor: Number(form.valor) || 0,
      tel: form.tel,
      email: form.email,
      temp: form.temp as 'quente' | 'morno' | 'frio',
      resp: respObj,
      dias: 0,
      lastInteract: new Date().toLocaleDateString('pt-BR'),
      notes: form.notes,
      timeline: [{ type: 'Criação', date: new Date().toLocaleDateString('pt-BR'), text: 'Negócio criado no CRM.' }],
    };
    onSave(deal);
    onOpenChange(false);
    setForm({ name: '', loc: '', valor: '', tel: '', email: '', temp: 'morno', stage: stages[0]?.id || 'lead', resp: 'Bulinha', notes: '' });
  }

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Novo Negócio</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Nome / Fazenda *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Fazenda Aurora" className="h-9 text-xs bg-surface-2 border-border" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Localização</Label>
              <Input value={form.loc} onChange={e => set('loc', e.target.value)} placeholder="Ex: Goiânia, GO" className="h-9 text-xs bg-surface-2 border-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Valor estimado (R$)</Label>
              <Input type="number" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="350000" className="h-9 text-xs bg-surface-2 border-border" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Telefone</Label>
              <Input value={form.tel} onChange={e => set('tel', e.target.value)} placeholder="(62) 99812-3456" className="h-9 text-xs bg-surface-2 border-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Email</Label>
              <Input value={form.email} onChange={e => set('email', e.target.value)} placeholder="contato@fazenda.com" className="h-9 text-xs bg-surface-2 border-border" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Etapa</Label>
              <Select value={form.stage} onValueChange={v => set('stage', v)}>
                <SelectTrigger className="h-9 text-xs bg-surface-2 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.filter(s => s.id !== 'perdido').map(s => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Temperatura</Label>
              <Select value={form.temp} onValueChange={v => set('temp', v)}>
                <SelectTrigger className="h-9 text-xs bg-surface-2 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quente" className="text-xs">🔥 Quente</SelectItem>
                  <SelectItem value="morno" className="text-xs">🌤 Morno</SelectItem>
                  <SelectItem value="frio" className="text-xs">❄️ Frio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Responsável</Label>
              <Select value={form.resp} onValueChange={v => set('resp', v)}>
                <SelectTrigger className="h-9 text-xs bg-surface-2 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {respOptions.map(r => (
                    <SelectItem key={r.n} value={r.n} className="text-xs">{r.n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold text-muted-foreground">Observações</Label>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Detalhes sobre o negócio..." className="text-xs bg-surface-2 border-border min-h-[60px] resize-none" />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-xs">Cancelar</Button>
          <Button onClick={handleSave} disabled={!form.name.trim()} className="text-xs">
            <span className="material-symbols-outlined text-[16px]">add</span> Criar Negócio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
