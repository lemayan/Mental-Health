'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 py-4 first:pt-0 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between text-sm font-semibold text-neutral-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-neutral-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

export function FilterCheckbox({ label, checked, onChange, count }: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-neutral-400">({count})</span>
      )}
    </label>
  );
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  className?: string;
}

export interface FilterState {
  providerTypes: string[];
  organizationTypes: string[];
  serviceFormats: string[];
  paymentTypes: string[];
  ageGroups: string[];
}

const providerTypeOptions = [
  { value: 'therapist', label: 'Therapist' },
  { value: 'psychiatrist', label: 'Psychiatrist' },
  { value: 'psychologist', label: 'Psychologist' },
  { value: 'counselor', label: 'Counselor' },
  { value: 'social_worker', label: 'Social Worker' },
];

const organizationTypeOptions = [
  { value: 'community_mental_health_center', label: 'Community Center' },
  { value: 'support_group', label: 'Support Group' },
  { value: 'crisis_center', label: 'Crisis Center' },
  { value: 'nonprofit', label: 'Nonprofit' },
];

const serviceFormatOptions = [
  { value: 'in_person', label: 'In-person' },
  { value: 'telehealth', label: 'Online/Telehealth' },
];

const paymentTypeOptions = [
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'private_insurance', label: 'Private Insurance' },
  { value: 'sliding_scale', label: 'Sliding Scale' },
  { value: 'free', label: 'Free' },
];

const ageGroupOptions = [
  { value: 'adults', label: 'Adults' },
  { value: 'teens', label: 'Teens' },
  { value: 'children', label: 'Children' },
];

export function FilterSidebar({ filters, onChange, onClear, className }: FilterSidebarProps) {
  const toggleFilter = (
    category: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const current = filters[category];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onChange({ ...filters, [category]: updated });
  };

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

  return (
    <aside className={cn('rounded-xl border border-neutral-200 bg-white p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Provider Type">
        {providerTypeOptions.map((option) => (
          <FilterCheckbox
            key={option.value}
            label={option.label}
            checked={filters.providerTypes.includes(option.value)}
            onChange={(checked) =>
              toggleFilter('providerTypes', option.value, checked)
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Organization Type" defaultOpen={false}>
        {organizationTypeOptions.map((option) => (
          <FilterCheckbox
            key={option.value}
            label={option.label}
            checked={filters.organizationTypes.includes(option.value)}
            onChange={(checked) =>
              toggleFilter('organizationTypes', option.value, checked)
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Format">
        {serviceFormatOptions.map((option) => (
          <FilterCheckbox
            key={option.value}
            label={option.label}
            checked={filters.serviceFormats.includes(option.value)}
            onChange={(checked) =>
              toggleFilter('serviceFormats', option.value, checked)
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Cost & Insurance">
        {paymentTypeOptions.map((option) => (
          <FilterCheckbox
            key={option.value}
            label={option.label}
            checked={filters.paymentTypes.includes(option.value)}
            onChange={(checked) =>
              toggleFilter('paymentTypes', option.value, checked)
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Age Group">
        {ageGroupOptions.map((option) => (
          <FilterCheckbox
            key={option.value}
            label={option.label}
            checked={filters.ageGroups.includes(option.value)}
            onChange={(checked) =>
              toggleFilter('ageGroups', option.value, checked)
            }
          />
        ))}
      </FilterSection>
    </aside>
  );
}

// Mobile filter drawer
interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  resultCount: number;
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  onClear,
  resultCount,
}: FilterDrawerProps) {
  // Prevent scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 hover:bg-neutral-100"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(85vh-8rem)] overflow-y-auto p-4">
          <FilterSidebar
            filters={filters}
            onChange={onChange}
            onClear={onClear}
            className="border-0 p-0"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-4 safe-bottom">
          <Button onClick={onClose} fullWidth>
            Show {resultCount} results
          </Button>
        </div>
      </div>
    </>
  );
}
