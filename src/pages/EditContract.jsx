import React from 'react';
import { useForm } from 'react-hook-form'; 
import { Save, X, Trash2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { updateContractById, deleteContractById } from '../api/rest-service';
import { useContract } from '../context/ContractContext';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function ContractEditRows() {
  const { contract } = useContract();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!contract) {
    return (
      <div className="p-8 text-center bg-white border border-neutral-200 rounded-lg shadow-sm max-w-md mx-auto my-8">
        <p className="text-sm text-neutral-500 mb-4">No active contract data found. Please return to the dashboard.</p>
        <button 
          onClick={() => navigate('/')}
          className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg transition hover:bg-neutral-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const formatToInputDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (e) {
      try {
        return format(new Date(dateString), 'yyyy-MM-dd');
      } catch (err) {
        return '';
      }
    }
  };

  const contractId = contract.CONTRACT_ID || contract.contractId || contract.id;
  const title = contract.TITLE || contract.title || '';
  const contractType = contract.CONTRACT_TYPE || contract.contractType || 'legal';
  const contractStartDate = formatToInputDate(contract.CONTRACT_START_DATE || contract.contractStartDate);
  const contractEndDate = formatToInputDate(contract.CONTRACT_END_DATE || contract.contractEndDate);
  const counterpartyName = contract.COUNTERPARTY_NAME || contract.counterpartyName || '';
  const status = (contract.STATUS || contract.status || 'draft');

  const {
    register,
    handleSubmit,
    watch,
    // 1. Destructured `isDirty` here to track if changes have occurred
    formState: { errors, isSubmitting, isDirty } 
  } = useForm({
    defaultValues: {
      id: contractId,
      title: title,
      contractType: contractType,
      contractStartDate: contractStartDate,
      contractEndDate: contractEndDate,
      counterpartyName: counterpartyName,
      status: status
    }
  });

  // Watch values to keep UI dynamic
  const watchedTitle = watch('title', title);
  const currentStatus = watch('status');

  const isProgress = currentStatus?.toLowerCase() === 'active' || currentStatus?.toLowerCase() === 'pending';

  // Dynamic colors for status badge
  const getStatusBadgeStyle = (statusVal) => {
    const s = statusVal?.toLowerCase();
    switch (s) {
      case 'active':
      case 'signed':
        return 'bg-green-50 text-green-800 ring-green-600/10';
      case 'pending':
      case 'in progress':
        return 'bg-amber-50 text-amber-800 ring-amber-600/10';
      case 'expired':
      case 'terminated':
        return 'bg-red-50 text-red-800 ring-red-600/10';
      default: // Draft
        return 'bg-neutral-100 text-neutral-800 ring-neutral-600/10';
    }
  };

  const onSubmit = async (data) => {
    // 2. Alert/Notify if form has not changed
    if (!isDirty) {
      alert("No changes made to the contract.");
      // Alternately, if using a toast library: toast.info("No changes made.");
      return;
    }

    try {
      const payload = {
        USER_ID: user?.id,
        CONTRACT_ID: data.id,
        TITLE: data.title,
        CONTRACT_TYPE: data.contractType,
        CONTRACT_START_DATE: data.contractStartDate,
        CONTRACT_END_DATE: data.contractEndDate,
        COUNTERPARTY_NAME: data.counterpartyName,
        STATUS: data.status
      };
      await updateContractById(payload);
      navigate(-1); 
    } catch (error) {
      console.error("Failed to update contract record:", error);
    }
  }; 

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        const userId = contract.USER_ID || contract.userId || user?.id;
        await deleteContractById(contractId, userId);
        navigate(-1); 
      } catch (error) {
        console.error("Failed to delete contract:", error);
      }
    }
  };

  const inputStyle = "w-full bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-sm text-neutral-800 focus:bg-white focus:border-neutral-400 focus:outline-none transition-all";
  const labelStyle = "block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      
      {/* 1. Mobile/Tablet Layout (Stacked Fields inside a Card) */}
      <div className="block md:hidden bg-white border border-neutral-200 rounded-lg shadow-sm p-5 space-y-4 max-w-xl mx-auto">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <span className="text-xs font-mono text-neutral-400">ID: #{contractId}</span>
          <input type="hidden" {...register('id')} />
          
          <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusBadgeStyle(currentStatus)}`}>
            {isProgress && (
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
            )}
            <select
              {...register('status')}
              className="bg-transparent border-none p-0 text-xs font-semibold focus:ring-0 cursor-pointer capitalize focus:outline-none text-current"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelStyle}>Contract Title</label>
          <input 
            type="text"
            {...register('title', { required: true })}
            className={inputStyle} 
          />
          {errors.title && <span className="text-xs text-red-500 block mt-1">Required</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>Contract Type</label>
            <select {...register('contractType')} className={inputStyle}>
              <option value="legal">legal</option>
              <option value="partnership">partnership</option>
              <option value="employment">employment</option>
              <option value="vendor">vendor</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Counterparty</label>
            <input 
              type="text"
              {...register('counterpartyName')}
              placeholder="N/A"
              className={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>Start Date</label>
            <input 
              type="date"
              {...register('contractStartDate')}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>End Date</label>
            <input 
              type="date"
              {...register('contractEndDate')}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Mobile Actions Stack */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-lg transition-all text-sm font-medium"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-white !bg-green-900 hover:bg-green-800 px-4 py-2.5 rounded-lg transition-all text-sm font-medium shadow-sm disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
          
          <button 
            type="button" 
            onClick={handleDelete}
            className="w-full inline-flex items-center justify-center gap-1.5 text-red-600 hover:text-white border border-red-200 hover:bg-red-600 px-4 py-2 rounded-lg transition-all text-xs font-medium"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Contract</span>
          </button>
        </div>
      </div>

      {/* 2. Desktop Table Layout (Visible on md and above) */}
      <div className="hidden md:block overflow-x-auto border border-neutral-200 rounded-lg shadow-sm bg-white">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 border-b border-neutral-200 text-left">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Title</th>
              <th scope="col" className="px-6 py-4 font-medium">ID</th>
              <th scope="col" className="px-6 py-4 font-medium">Contract Type</th>
              <th scope="col" className="px-6 py-4 font-medium">Start Date</th>
              <th scope="col" className="px-6 py-4 font-medium">End Date</th>
              <th scope="col" className="px-6 py-4 font-medium">Counterparty</th>
              <th scope="col" className="px-6 py-4 font-medium">Status</th>
              <th scope="col" className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-neutral-200">
            <tr className="hover:bg-neutral-50/50 transition-colors">
              {/* Dynamic Auto-Adjusting Title Column */}
              <td className="px-6 py-4">
                <label htmlFor="edit-title" className="sr-only">Contract Title</label>
                <div className="inline-grid min-w-[120px] max-w-[400px] vertical-align-middle">
                  <span className="invisible col-start-1 row-start-1 px-2 py-1 text-base font-medium whitespace-pre">
                    {watchedTitle || 'Contract Title'}
                  </span>
                  <input 
                    id="edit-title"
                    type="text"
                    {...register('title', { required: true })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-sm text-neutral-800 focus:bg-white focus:border-neutral-400 focus:outline-none transition-all col-start-1 row-start-1 text-base font-medium py-1" 
                  />
                </div>
                {errors.title && <span className="text-xs text-red-500 block mt-1">Required</span>}
              </td>
              
              {/* ID */}
              <td className="px-6 py-4 whitespace-nowrap text-neutral-600 text-sm">
                <span className="sr-only">Contract ID: </span> #{contractId}
                <input type="hidden" {...register('id')} />
              </td>
              
              {/* Contract Type Select */}
              <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                <label htmlFor="edit-type" className="sr-only">Contract Type</label>
                <select
                  id="edit-type"
                  {...register('contractType')}
                  className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-sm text-neutral-800 focus:bg-white focus:border-neutral-400 focus:outline-none transition-all"
                >
                  <option value="legal">legal</option>
                  <option value="partnership">partnership</option>
                  <option value="employment">employment</option>
                  <option value="vendor">vendor</option>
                </select>
              </td>
              
              {/* Start Date Input */}
              <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                <label htmlFor="edit-start-date" className="sr-only">Contract Start Date</label>
                <input 
                  id="edit-start-date"
                  type="date"
                  {...register('contractStartDate')}
                  className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-sm text-neutral-800 focus:bg-white focus:border-neutral-400 focus:outline-none transition-all"
                />
              </td>
              
              {/* End Date Input */}
              <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                <label htmlFor="edit-end-date" className="sr-only">Contract End Date</label>
                <input 
                  id="edit-end-date"
                  type="date"
                  {...register('contractEndDate')}
                  className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-sm text-neutral-800 focus:bg-white focus:border-neutral-400 focus:outline-none transition-all"
                />
              </td>

              {/* Counterparty Input */}
              <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                <label htmlFor="edit-counterparty" className="sr-only">Counterparty Name</label>
                <input 
                  id="edit-counterparty"
                  type="text"
                  {...register('counterpartyName')}
                  placeholder="N/A"
                  className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-sm text-neutral-800 focus:bg-white focus:border-neutral-400 focus:outline-none transition-all"
                />
              </td>
              
              {/* Dynamic Status Dropdown */}
              <td className="px-6 py-4 whitespace-nowrap">
                <label htmlFor="edit-status" className="sr-only">Contract Status</label>
                <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusBadgeStyle(currentStatus)}`}>
                  {isProgress && (
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                  )}
                  <select
                    id="edit-status"
                    {...register('status')}
                    className="bg-transparent border-none p-0 text-xs font-semibold focus:ring-0 cursor-pointer capitalize focus:outline-none text-current"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                    <option value="Pending">Pending</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </td>
              
              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex justify-center items-center gap-2">
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 text-red-700 hover:text-white border border-red-200 hover:bg-red-700 px-2.5 py-1.5 rounded-md transition-all font-medium"
                    title="Delete Contract"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <button 
                    type="button" 
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-neutral-700 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition-all font-medium"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>

                  {/* 3. OPTIONAL: Disable the Save button dynamically if no changes exist */}
                  <button 
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="inline-flex items-center gap-1.5 text-white !bg-green-700 !hover:bg-green-500 px-3 py-1.5 rounded-md transition-all font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </form>
  );
}