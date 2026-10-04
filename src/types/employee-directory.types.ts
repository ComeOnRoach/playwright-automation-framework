// src/types/employee-directory.types.ts
import type { EmployeeColumn } from '../pages/AIPlaygroundPage/employee-directory.page';
import type { SortKind } from '../helpers/sort.helper';

export interface EmployeeFilter {
  term: string;
  column: EmployeeColumn;
  expectedValues: string[];
  smoke?: boolean;
}

export interface SortColumnConfig {
  column: EmployeeColumn;
  label: string;
  kind: SortKind;
}

export interface EmployeeDirectoryData {
  totalEmployees: number;
  filters: Record<string, EmployeeFilter>;
  noMatchTerm: string;
  filteredSort: {
    term: string;
    column: EmployeeColumn;
    expectedSalariesAscending: string[];
  };
  sortColumns: SortColumnConfig[];
  arrows: { asc: string; desc: string };
}
