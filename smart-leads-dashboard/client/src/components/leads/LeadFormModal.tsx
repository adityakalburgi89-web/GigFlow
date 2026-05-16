import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { leads as leadsApi } from '../../services/api';
import { LeadStatus, LeadSource } from '../../types';
import type { Lead, CreateLeadPayload, UpdateLeadPayload } from '../../types';

interface LeadFormModalProps {
  mode: 'create' | 'edit';
  lead?: Lead;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  name: string;
  email: string;
  status: string;
  source: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

function validate(state: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!state.name.trim()) errors.name = 'Name is required';
  if (!state.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) errors.email = 'Invalid email format';
  if (!state.source) errors.source = 'Source is required';
  return errors;
}

const selectClass =
  'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500';

export function LeadFormModal({ mode, lead, onClose, onSuccess }: LeadFormModalProps) {
  const [form, setForm] = useState<FormState>({
    name: lead?.name || '',
    email: lead?.email || '',
    status: lead?.status || LeadStatus.New,
    source: lead?.source || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await leadsApi.create(form as CreateLeadPayload);
      } else if (lead) {
        const payload: UpdateLeadPayload = {};
        if (form.name !== lead.name) payload.name = form.name;
        if (form.email !== lead.email) payload.email = form.email;
        if (form.status !== lead.status) payload.status = form.status as CreateLeadPayload['status'];
        if (form.source !== lead.source) payload.source = form.source as CreateLeadPayload['source'];
        await leadsApi.update(lead._id, payload);
      }
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Something went wrong';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={mode === 'create' ? 'New Lead' : 'Edit Lead'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{apiError}</div>}
        <Input label="Name" name="name" placeholder="Lead name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" placeholder="lead@example.com" value={form.email} onChange={handleChange} error={errors.email} />
        <div className="space-y-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange} className={selectClass}>
            {Object.values(LeadStatus).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
          <select id="source" name="source" value={form.source} onChange={handleChange} className={selectClass}>
            <option value="">Select source</option>
            {Object.values(LeadSource).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.source && <p className="text-sm text-red-600">{errors.source}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{mode === 'create' ? 'Create Lead' : 'Save Changes'}</Button>
        </div>
      </form>
    </Modal>
  );
}
