export interface VaccinationAddress {
  patient: string;
  healthcareProvider: string;
}

export interface VaccinationData {
  name: string;
  date: Date;
  type: string;
}

export interface VaccinationRecord {
  pid: string;
  vacname: string;
  vactype: string;
  vacdate: Date;
  vacplace: string;
}
