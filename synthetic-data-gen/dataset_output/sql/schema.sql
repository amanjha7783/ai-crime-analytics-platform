-- PostgreSQL Schema for Karnataka Police FIR System

CREATE TABLE State (
    StateID SERIAL PRIMARY KEY,
    StateName VARCHAR(100),
    NationalityID INT,
    Active INT
);

CREATE TABLE District (
    DistrictID SERIAL PRIMARY KEY,
    DistrictName VARCHAR(100),
    StateID INT REFERENCES State(StateID),
    Active INT
);

CREATE TABLE UnitType (
    UnitTypeID SERIAL PRIMARY KEY,
    UnitTypeName VARCHAR(100),
    CityDistState VARCHAR(50),
    Hierarchy INT,
    Active INT
);

CREATE TABLE Unit (
    UnitID SERIAL PRIMARY KEY,
    UnitName VARCHAR(200),
    TypeID INT REFERENCES UnitType(UnitTypeID),
    ParentUnit INT,
    NationalityID INT,
    StateID INT REFERENCES State(StateID),
    DistrictID INT REFERENCES District(DistrictID),
    Active INT
);

CREATE TABLE Rank (
    RankID SERIAL PRIMARY KEY,
    RankName VARCHAR(100),
    Hierarchy INT,
    Active INT
);

CREATE TABLE Designation (
    DesignationID SERIAL PRIMARY KEY,
    DesignationName VARCHAR(100),
    Active INT,
    SortOrder INT
);

CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    DistrictID INT REFERENCES District(DistrictID),
    UnitID INT REFERENCES Unit(UnitID),
    RankID INT REFERENCES Rank(RankID),
    DesignationID INT REFERENCES Designation(DesignationID),
    KGID VARCHAR(50),
    FirstName VARCHAR(100),
    EmployeeDOB DATE,
    GenderID INT,
    BloodGroupID INT,
    PhysicallyChallenged INT,
    AppointmentDate DATE
);

CREATE TABLE Court (
    CourtID SERIAL PRIMARY KEY,
    CourtName VARCHAR(200),
    DistrictID INT REFERENCES District(DistrictID),
    StateID INT REFERENCES State(StateID),
    Active INT
);

CREATE TABLE CaseCategory (
    CaseCategoryID SERIAL PRIMARY KEY,
    LookupValue VARCHAR(50)
);

CREATE TABLE GravityOffence (
    GravityOffenceID SERIAL PRIMARY KEY,
    LookupValue VARCHAR(50)
);

CREATE TABLE CaseStatusMaster (
    CaseStatusID SERIAL PRIMARY KEY,
    CaseStatusName VARCHAR(100)
);

CREATE TABLE CrimeHead (
    CrimeHeadID SERIAL PRIMARY KEY,
    CrimeGroupName VARCHAR(200),
    Active INT
);

CREATE TABLE CrimeSubHead (
    CrimeSubHeadID SERIAL PRIMARY KEY,
    CrimeHeadID INT REFERENCES CrimeHead(CrimeHeadID),
    CrimeHeadName VARCHAR(200),
    SeqID INT
);

CREATE TABLE Act (
    ActCode VARCHAR(50) PRIMARY KEY,
    ActDescription VARCHAR(500),
    ShortName VARCHAR(100),
    Active INT
);

CREATE TABLE Section (
    SectionCode VARCHAR(50),
    ActCode VARCHAR(50) REFERENCES Act(ActCode),
    SectionDescription VARCHAR(500),
    Active INT,
    PRIMARY KEY (SectionCode, ActCode)
);

CREATE TABLE CrimeHeadActSection (
    CrimeHeadID INT REFERENCES CrimeHead(CrimeHeadID),
    ActCode VARCHAR(50) REFERENCES Act(ActCode),
    SectionCode VARCHAR(50),
    PRIMARY KEY (CrimeHeadID, ActCode, SectionCode)
);

CREATE TABLE OccupationMaster (
    OccupationID SERIAL PRIMARY KEY,
    OccupationName VARCHAR(100)
);

CREATE TABLE ReligionMaster (
    ReligionID SERIAL PRIMARY KEY,
    ReligionName VARCHAR(100)
);

CREATE TABLE CasteMaster (
    caste_master_id SERIAL PRIMARY KEY,
    caste_master_name VARCHAR(100)
);

CREATE TABLE CaseMaster (
    CaseMasterID SERIAL PRIMARY KEY,
    CrimeNo VARCHAR(50),
    CaseNo VARCHAR(50),
    CrimeRegisteredDate DATE,
    PolicePersonID INT REFERENCES Employee(EmployeeID),
    PoliceStationID INT REFERENCES Unit(UnitID),
    CaseCategoryID INT REFERENCES CaseCategory(CaseCategoryID),
    GravityOffenceID INT REFERENCES GravityOffence(GravityOffenceID),
    CrimeMajorHeadID INT REFERENCES CrimeHead(CrimeHeadID),
    CrimeMinorHeadID INT REFERENCES CrimeSubHead(CrimeSubHeadID),
    CaseStatusID INT REFERENCES CaseStatusMaster(CaseStatusID),
    CourtID INT REFERENCES Court(CourtID),
    IncidentFromDate DATE,
    IncidentToDate DATE,
    InfoReceivedPSDate DATE,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    BriefFacts TEXT,
    RiskScore INT,
    CrimeSeverity VARCHAR(50),
    AI_PredictionLabel VARCHAR(200),
    HotspotScore DECIMAL(3, 2)
);

CREATE TABLE ComplainantDetails (
    ComplainantID SERIAL PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    ComplainantName VARCHAR(150),
    AgeYear INT,
    OccupationID INT REFERENCES OccupationMaster(OccupationID),
    ReligionID INT REFERENCES ReligionMaster(ReligionID),
    CasteID INT REFERENCES CasteMaster(caste_master_id),
    GenderID INT
);

CREATE TABLE Victim (
    VictimMasterID SERIAL PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    VictimName VARCHAR(150),
    AgeYear INT,
    GenderID INT,
    VictimPolice VARCHAR(10)
);

CREATE TABLE Accused (
    AccusedMasterID SERIAL PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    AccusedName VARCHAR(150),
    AgeYear INT,
    GenderID INT,
    PersonID VARCHAR(50)
);

CREATE TABLE ArrestSurrender (
    ArrestSurrenderID SERIAL PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    ArrestSurrenderTypeID INT,
    ArrestSurrenderDate DATE,
    ArrestSurrenderStateId INT REFERENCES State(StateID),
    ArrestSurrenderDistrictId INT REFERENCES District(DistrictID),
    PoliceStationID INT REFERENCES Unit(UnitID),
    IOID INT REFERENCES Employee(EmployeeID),
    CourtID INT REFERENCES Court(CourtID),
    AccusedMasterID INT REFERENCES Accused(AccusedMasterID),
    IsAccused INT,
    IsComplainantAccused INT
);

CREATE TABLE ChargesheetDetails (
    CSID SERIAL PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    csdate DATE,
    cstype CHAR(1),
    PolicePersonID INT REFERENCES Employee(EmployeeID)
);

CREATE TABLE ActSectionAssociation (
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    ActID VARCHAR(50) REFERENCES Act(ActCode),
    SectionID VARCHAR(50),
    ActOrderID INT,
    SectionOrderID INT,
    PRIMARY KEY (CaseMasterID, ActID, SectionID)
);
