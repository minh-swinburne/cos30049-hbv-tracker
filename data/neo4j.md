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

Created 10426 nodes, set 31278 properties, added 10426 labels
Completed after 9 minutes 54 seconds

### Create relationships:

```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/minh-swinburne/cos30049-hbv-tracker/refs/heads/full/data/data/cleaned_data.csv' AS row
MERGE (p:Patient {pid: row.pid})
MERGE (v:Vaccination {name: row.vacname, date: row.vacdate, type: row.vactype})
MERGE (h:HealthcareProvider {name: row.vacplace, type: row.vacplace_type})
MERGE (r:Region {province: row.province_reg, district: row.district_reg, commune: row.commune_reg})
MERGE (p)-[:RECEIVED]->(v)
MERGE (v)-[:ADMINISTERED_BY]->(h)
MERGE (h)-[:LOCATED_IN]->(r);
```

### Pid with most appearances:
- All: 115051720210154
- Sample: 807011120180150
