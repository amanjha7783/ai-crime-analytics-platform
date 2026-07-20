# Karnataka Police Synthetic Crime Dataset - Data Dictionary

This document describes the structure and fields of the synthetic police crime database generated for the AI-Driven Crime Analytics & Visualization Platform.

## 1. Master Tables

### State
| Column | Type | Description |
|---|---|---|
| StateID | INT (PK) | Unique identifier for the state. |
| StateName | VARCHAR | Name of the state (e.g. Karnataka). |
| NationalityID | INT | Reference to nationality. |
| Active | INT | Flag (1=Active). |

### District
| Column | Type | Description |
|---|---|---|
| DistrictID | INT (PK) | Unique identifier for the district. |
| DistrictName | VARCHAR | Name of the district (e.g. Bengaluru Urban, Kodagu). |
| StateID | INT (FK) | Reference to State. |
| Active | INT | Flag (1=Active). |

### Unit
| Column | Type | Description |
|---|---|---|
| UnitID | INT (PK) | Unique identifier for the police unit (station). |
| UnitName | VARCHAR | Name of the police station. |
| TypeID | INT (FK) | Reference to UnitType. |
| DistrictID | INT (FK) | Reference to District. |

### Employee
| Column | Type | Description |
|---|---|---|
| EmployeeID | INT (PK) | Unique identifier for the police officer. |
| DistrictID | INT (FK) | District they are assigned to. |
| UnitID | INT (FK) | Police station they are assigned to. |
| RankID | INT (FK) | Rank of the officer (Constable, Inspector, etc.). |
| DesignationID | INT (FK) | Designation of the officer (SHO, IO). |

*(Similar structures for UnitType, Rank, Designation, Court, CaseCategory, GravityOffence, CaseStatusMaster, CrimeHead, CrimeSubHead, Act, Section, CrimeHeadActSection, OccupationMaster, ReligionMaster, CasteMaster)*

---

## 2. Transaction Tables

### CaseMaster (FIRs)
This is the core table representing all registered cases (FIRs).

| Column | Type | Description |
|---|---|---|
| CaseMasterID | INT (PK) | Unique identifier for the FIR. |
| CrimeNo | VARCHAR | Generated crime number combining Category, District, Unit, Year, and Serial. |
| CaseNo | VARCHAR | Case number. |
| CrimeRegisteredDate | DATE | Date the FIR was registered. |
| PolicePersonID | INT (FK) | Officer who registered the FIR. |
| PoliceStationID | INT (FK) | Station where the FIR is registered. |
| CaseCategoryID | INT (FK) | Category (FIR, UDR, etc.). |
| CrimeMajorHeadID | INT (FK) | Major crime head (e.g. Crimes Against Body, Cyber Crimes). |
| CrimeMinorHeadID | INT (FK) | Minor crime sub-head (e.g. Murder, Phishing). |
| CaseStatusID | INT (FK) | Status of the case (e.g. Under Investigation, Charge Sheeted). |
| CourtID | INT (FK) | Court handling the case. |
| IncidentFromDate | DATE | Date of the incident. |
| latitude, longitude | DECIMAL | GPS coordinates within Karnataka. |
| BriefFacts | TEXT | AI-generated summary of the incident. |
| **RiskScore** | INT | AI generated risk score (1-100). |
| **CrimeSeverity** | VARCHAR | AI calculated severity (Low, Medium, High, Critical). |
| **AI_PredictionLabel** | VARCHAR | AI assigned prediction label for future risk. |
| **HotspotScore** | DECIMAL | Statistical hotspot confidence score (0.00-1.00). |

### ComplainantDetails
| Column | Type | Description |
|---|---|---|
| ComplainantID | INT (PK) | Unique identifier. |
| CaseMasterID | INT (FK) | Linked FIR. |
| ComplainantName | VARCHAR | Generated name. |

### Victim
| Column | Type | Description |
|---|---|---|
| VictimMasterID | INT (PK) | Unique identifier. |
| CaseMasterID | INT (FK) | Linked FIR. |
| VictimName | VARCHAR | Generated name. |
| AgeYear | INT | Age of the victim. |

### Accused
| Column | Type | Description |
|---|---|---|
| AccusedMasterID | INT (PK) | Unique identifier. |
| CaseMasterID | INT (FK) | Linked FIR. |
| AccusedName | VARCHAR | Generated name. |
| PersonID | VARCHAR | Designation code for accused (A1, A2). |

### ArrestSurrender
| Column | Type | Description |
|---|---|---|
| ArrestSurrenderID | INT (PK) | Unique identifier. |
| CaseMasterID | INT (FK) | Linked FIR. |
| ArrestSurrenderDate | DATE | Date of arrest. |
| IOID | INT (FK) | Officer who made the arrest. |
| AccusedMasterID | INT (FK) | The arrested accused. |

### ChargesheetDetails
| Column | Type | Description |
|---|---|---|
| CSID | INT (PK) | Unique identifier. |
| CaseMasterID | INT (FK) | Linked FIR. |
| csdate | DATE | Date the charge sheet was filed. |

### ActSectionAssociation
| Column | Type | Description |
|---|---|---|
| CaseMasterID | INT (FK) | Linked FIR. |
| ActID | VARCHAR (FK) | Act Code (e.g. IPC, NDPS). |
| SectionID | VARCHAR | Section Code (e.g. 302, 307). |
