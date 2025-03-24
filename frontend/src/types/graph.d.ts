export interface GraphPatient {
  pid: string;
  wallet?: string;
  sex: string;
  dob: Date;
  ethnic: string;
  reg_province: string;
  reg_district: string;
  reg_commune: string;
}

export interface GraphHealthcareProvider {
  wallet?: string;
  name: string;
  type: string;
}

export interface GraphVaccination {
  pid: string;
  name: string;
  date: Date;
  type: string;
  data_hash?: string;
  tx_hash?: string;
}

export interface GraphNode {
  id: string;
  type: "Patient" | "HealthcareProvider" | "Vaccination";
  data: GraphPatient | GraphHealthcareProvider | GraphVaccination;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
