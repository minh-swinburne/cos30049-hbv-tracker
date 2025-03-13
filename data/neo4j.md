### Insert patients:
```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/minh-swinburne/cos30049-hbv-tracker/refs/heads/full/data/data/cleaned_data.csv' AS row
MERGE (p:Patient {pid: row.pid})
SET p.sex = row.sex, p.dob = row.dob, p.ethnic = row.ethnic
```
Created 86719 nodes, set 347629 properties, added 86719 labels
Completed after 54 minutes 39 seconds

### Insert vaccination:
```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/minh-swinburne/cos30049-hbv-tracker/refs/heads/full/data/data/cleaned_data.csv' AS row
MERGE (v:Vaccination {name: row.vacname, date: row.vacdate, type: row.vactype})
```
Added 15668 labels, created 15668 nodes, set 47004 properties, completed after 1087287 ms.

### Insert healthcare providers:
```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/minh-swinburne/cos30049-hbv-tracker/refs/heads/full/data/data/cleaned_data.csv' AS row
MERGE (h:HealthcareProvider {name: row.vacplace, type: row.vacplace_type})
```
Added 9910 labels, created 9910 nodes, set 19820 properties, completed after 756838 ms.

### Insert geographic regions:
```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/minh-swinburne/cos30049-hbv-tracker/refs/heads/full/data/data/cleaned_data.csv' AS row
MERGE (r:Region {province: row.province_reg, district: row.district_reg, commune: row.commune_reg})
```

### Create relationships:
```
MATCH (p:Patient), (v:Vaccination)
WHERE p.pid = v.pid
MERGE (p)-[:RECEIVED]->(v);

MATCH (v:Vaccination), (h:HealthcareProvider)
WHERE v.vacplace = h.name
MERGE (v)-[:ADMINISTERED_BY]->(h);

MATCH (h:HealthcareProvider), (r:Region)
WHERE h.name = r.commune
MERGE (h)-[:LOCATED_IN]->(r);

MATCH (r:Region), (g:Government)
MERGE (r)-[:REGULATED_BY]->(g);

MATCH (g:Government)
MERGE (g)-[:HAS_ACCESS_TO]->(:AnonymizedData);
```
