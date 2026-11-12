import React from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { useBooking } from '../../context/BookingContext';
import { Passenger } from '../../types';
import { Users, Plus, Trash2, CheckCircle2 } from 'lucide-react';

// Zod validation schema for individual passenger
const passengerSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(40, 'Name must be under 40 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, and periods'),
  title: z.enum(['Mr', 'Ms', 'Mrs', 'Dr'] as const),
  type: z.enum(['Adult', 'Child'] as const),
  assignedSeatId: z.string().nullable(),
  selectedMealId: z.string().nullable()
});

// Zod schema for the entire form
const formSchema = z.object({
  passengers: z
    .array(passengerSchema)
    .min(1, 'At least 1 passenger is required')
    .max(9, 'Maximum 9 passengers allowed per booking')
});

type FormValues = z.infer<typeof formSchema>;

interface PassengerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PassengerFormModal: React.FC<PassengerFormModalProps> = ({
  isOpen,
  onClose
}) => {
  const { passengers, updatePassengers } = useBooking();

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      passengers: passengers.map((p) => ({ ...p }))
    },
    validate: (values) => {
      try {
        formSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.issues.forEach((issue) => {
            const path = issue.path.join('.');
            errors[path] = issue.message;
          });
          return errors;
        }
        return {};
      }
    },
    onSubmit: (values) => {
      updatePassengers(values.passengers);
      onClose();
    }
  });

  const handleAddPassenger = () => {
    if (formik.values.passengers.length >= 9) return;
    const nextNum = formik.values.passengers.length + 1;
    const newPassenger: Passenger = {
      id: `p-${nextNum}-${Date.now().toString().slice(-4)}`,
      name: `Passenger ${nextNum}`,
      title: 'Mr',
      type: 'Adult',
      assignedSeatId: null,
      selectedMealId: null
    };
    formik.setFieldValue('passengers', [...formik.values.passengers, newPassenger]);
  };

  const handleRemovePassenger = (index: number) => {
    if (formik.values.passengers.length <= 1) return;
    const updated = formik.values.passengers.filter((_, idx) => idx !== index);
    formik.setFieldValue('passengers', updated);
  };

  const getFieldError = (path: string): string | undefined => {
    const errorMap = formik.errors as Record<string, any>;
    return typeof errorMap[path] === 'string' ? errorMap[path] : undefined;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Travelers & Passenger Details"
      subtitle="Configure passenger count and update personal information (Formik + Zod Validated)"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Count Header & Quick Adjust */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-white text-sm">
                Total Travelers: {formik.values.passengers.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select between 1 and 9 passengers for this booking.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddPassenger}
            disabled={formik.values.passengers.length >= 9}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Passenger</span>
          </button>
        </div>

        {/* Passenger Fields List */}
        <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
          {formik.values.passengers.map((passenger, index) => {
            const nameError = getFieldError(`passengers.${index}.name`);

            return (
              <div
                key={passenger.id}
                className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Traveler #{index + 1}
                  </span>

                  {formik.values.passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(index)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      title="Remove this passenger"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Title Select */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Title
                    </label>
                    <select
                      name={`passengers[${index}].title`}
                      value={passenger.title}
                      onChange={formik.handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Mr">Mr.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Dr">Dr.</option>
                    </select>
                  </div>

                  {/* Full Name Input */}
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name={`passengers[${index}].name`}
                      value={passenger.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. John Doe"
                      className={`w-full bg-slate-900 border ${
                        nameError ? 'border-red-500' : 'border-slate-700'
                      } rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500`}
                    />
                    {nameError && (
                      <p className="text-[10px] text-red-400 mt-1">{nameError}</p>
                    )}
                  </div>

                  {/* Passenger Type */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      name={`passengers[${index}].type`}
                      value={passenger.type}
                      onChange={formik.handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Adult">Adult (12+ yrs)</option>
                      <option value="Child">Child (2-11 yrs)</option>
                    </select>
                  </div>
                </div>

                {/* Retained seat & meal tags */}
                {(passenger.assignedSeatId || passenger.selectedMealId) && (
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-3 text-[11px] text-slate-400">
                    {passenger.assignedSeatId && (
                      <span>
                        Assigned Seat: <strong className="text-emerald-400">{passenger.assignedSeatId}</strong>
                      </span>
                    )}
                    {passenger.selectedMealId && (
                      <span>
                        Meal Selected: <strong className="text-blue-400">Yes</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Apply Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
