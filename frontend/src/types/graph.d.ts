export interface GraphPatient {
  pid: string;
  wallet?: string;
  sex: string;
  dob: Date;
  ethnic: string;
  regProvince: string;
  regDistrict: string;
  regCommune: string;
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
  dataHash?: string;
  txHash?: string;
}

export interface GraphNode {
  id: string;
  type: "Patient" | "HealthcareProvider" | "Vaccination";
  data: GraphPatient | GraphHealthcareProvider | GraphVaccination;
  x: number;
  y: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  root?: GraphNode;
}
