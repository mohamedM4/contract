import React from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Calendar, User, ArrowLeft } from 'lucide-react';
import { createContract } from '../api/rest-service';
export default function AddContractForm({userId}) {
  // Properly initialize react-hook-form with default values
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      user_id: userId,
      title: '',
      counterpartyName: '',
      contractType: 'legal',
      contractStartDate: '',
      contractEndDate: '',
      status: 'Draft'
    }
  });
  const onSubmit = async (data) => {
    try {
      const response = await createContract(data);
      reset(); // Clears form on success
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      reset(); // Resets the form to its initial default state
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
      {/* Form Header */}
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Create New Contract
          </h2>
          <p className="text-sm text-slate-500 mt-1">Fill out the details below to add a contract to the system.</p>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Clear Form
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        
        {/* Contract Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contract Title *</label>
          <input
            type="text"
            placeholder="e.g., Q3 Software Licensing Agreement"
            {...register('title', { required: 'Contract title is required' })}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
              errors.title ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Counterparty & Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-4 h-4 text-slate-400" /> Counterparty Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Acme Corp"
              {...register('counterpartyName', { required: 'Counterparty name is required' })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
                errors.counterpartyName ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.counterpartyName && <p className="text-red-500 text-xs mt-1">{errors.counterpartyName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contract Type</label>
            <select
              {...register('contractType')}
              className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="legal">Legal / NDA</option>
              <option value="vendor">Vendor / Supplier</option>
              <option value="employment">Employment</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
        </div>

        {/* Start Date & Duration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" /> Start Date *
            </label>
            <input
              type="date"
              {...register('contractStartDate', { required: 'Start date is required' })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
                errors.contractStartDate ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.contractStartDate && <p className="text-red-500 text-xs mt-1">{errors.contractStartDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" /> End Date *
            </label>
            <input
              type="date"
              {...register('contractEndDate', { required: 'End date is required' })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
                errors.contractEndDate ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.contractEndDate && <p className="text-red-500 text-xs mt-1">{errors.contractEndDate.message}</p>}
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Initial Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-slate-300 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 !bg-green-700 text-sm font-medium text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Saving Contract...' : 'Add Contract'}
          </button>
        </div>
      </form>
    </div>
  );
}