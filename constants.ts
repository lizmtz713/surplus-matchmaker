
import { Buyer } from './types';

export const BUYERS: Buyer[] = [
  // --- POWER GENERATION (Generators & Engines) ---
  {
    id: "GS-01",
    name: "Generator Source",
    preferences: "Commercial & Industrial Diesel/Gas Generators (20kW - 4000kW)",
    location: "Brighton, CO",
    brand: "Caterpillar, Cummins, Kohler",
    contact: "purchasing@generatorsource.com | www.generatorsource.com"
  },
  {
    id: "DP-02",
    name: "Depco Power Systems (Dick)",
    preferences: "Marine Engines, Power Units, Generator Sets, Transmissions",
    location: "Houston, TX",
    brand: "Caterpillar, Detroit Diesel",
    contact: "dick@depco.com | justin@depco.com | www.depco.com"
  },
  {
    id: "WP-03",
    name: "Woodstock Power Company (Roy)",
    preferences: "Used Generators, HVAC Equipment, Data Center Decom",
    location: "Bala Cynwyd, PA",
    contact: "Roy@woodstockpower.com | sales@woodstockpower.com"
  },
  {
    id: "DSS-04",
    name: "Diesel Service & Supply",
    preferences: "Diesel Engines, Low Hour Generators",
    location: "Brighton, CO",
    contact: "purchasing@dieselserviceandsupply.com"
  },
  {
    id: "CS-05",
    name: "Compression Source (Steve)",
    preferences: "Natural Gas Compressors, Gensets",
    location: "USA",
    contact: "steve@compressionsource.com"
  },
  {
    id: "TS-06",
    name: "Turbine Spec (JW)",
    preferences: "Gas Turbines, Power Generation Parts",
    location: "USA",
    contact: "jw@turbinespec.com"
  },
  {
    id: "GPS-68",
    name: "Griffith Power Systems (Shane Blackwood)",
    preferences: "Power Generation, Industrial Engines",
    location: "USA",
    contact: "shane.blackwood@griffithpowersystems.com"
  },
  {
    id: "CPP-124",
    name: "Critical Power Products (Petra)",
    preferences: "Backup Power, UPS Systems, Generators",
    location: "Post Falls, ID",
    contact: "PetraT@criticalpower.com"
  },

  // --- ELECTRICAL SWITCHGEAR & TRANSFORMERS ---
  {
    id: "MT-10",
    name: "Maddox Transformer (Patrick Livesay)",
    preferences: "New & Surplus Transformers, Padmounts, Substations",
    location: "Simpsonville, SC",
    condition: "New / Reconditioned",
    contact: "patrick.livesay@maddoxtransformer.com"
  },
  {
    id: "RESA-11",
    name: "RESA Power (Steve Maddox)",
    preferences: "Electrical Life Extension, Transformers, Switchgear",
    location: "Houston, TX",
    contact: "Steve.maddox@resapower.com | SellToUs@resapower.com"
  },
  {
    id: "SE-12",
    name: "Southland Electrical Supply (J. Reynolds)",
    preferences: "Circuit Breakers, Motor Controls, Switchgear",
    location: "Burlington, NC",
    contact: "jreynolds@southlandelectrical.com"
  },
  {
    id: "EM-13",
    name: "EMSCO (Brett Bullock)",
    preferences: "Used Circuit Breakers, Switchgear, Bus Plugs",
    location: "Minneapolis, MN",
    contact: "bbullock@emscomn.com | twhite@emscomn.com"
  },
  {
    id: "BP-14",
    name: "Bay Power",
    preferences: "Circuit Breakers, Motor Control, Panelboards",
    location: "San Jose, CA",
    contact: "purchasing@baypower.com"
  },
  {
    id: "CBW-15",
    name: "Circuit Breaker Warehouse",
    preferences: "Molded Case Breakers, Obsolete Electrical",
    location: "California",
    contact: "Support@CircuitBreakerWarehouse.com"
  },
  {
    id: "CES-16",
    name: "Capital Electric Supply (Kevin)",
    preferences: "Breakers, Electrical Surplus",
    location: "USA",
    contact: "SALES@CAPITALELECTRICSUPPLYBREAKERS.COM | KEVIN@CESBREAKERS.COM"
  },
  {
    id: "JCL-17",
    name: "JCL Energy (McLune)",
    preferences: "Transformers, Switchgear, Padmounts",
    location: "Sharon, PA",
    contact: "mclune@jcl.energy"
  },
  {
    id: "AE-18",
    name: "Apollo Electric",
    preferences: "Electrical Surplus, Generators, Wire",
    location: "Brea, CA",
    contact: "sales@apolloelectric.net"
  },
  {
    id: "NPE-50",
    name: "National Power Equipment (NPE)",
    preferences: "Used/Remanufactured Switchgear, Circuit Breakers",
    location: "Berea, OH",
    contact: "info@npeinc.com"
  },
  {
    id: "SCB-51",
    name: "Sierra Circuit Breaker",
    preferences: "Molded Case Breakers, Motor Controls",
    location: "California",
    contact: "info@sierracircuitbreaker.com"
  },
  {
    id: "BCS-52",
    name: "BCS Switchgear (Buddy)",
    preferences: "Industrial Switchgear, Breakers, Hardware",
    location: "Sanger, TX",
    contact: "buddy@bcsswitchgear.com"
  },
  {
    id: "CCB-53",
    name: "Coastside Circuit Breakers",
    preferences: "Circuit Breakers, Electrical Surplus",
    location: "Fairfield, CA",
    contact: "webuybreakers@coastsidecircuitbreakers.com"
  },
  {
    id: "CBB-54",
    name: "Circuit Breaker Buyers",
    preferences: "All Circuit Breakers, Electrical Distribution",
    location: "National",
    contact: "sales@circuitbreakerbuyers.com"
  },
  {
    id: "ACB-55",
    name: "ACB Source",
    preferences: "Air Circuit Breakers, Switchgear",
    location: "National",
    contact: "sales@acbsource.com"
  },
  {
    id: "BB-56",
    name: "Bullock Breakers (Jason)",
    preferences: "Circuit Breakers, Electrical Equipment",
    location: "USA",
    contact: "jason@bullockbreakers.com"
  },
  {
    id: "ELT-71",
    name: "Elliott Electric Supply",
    preferences: "Electrical Distribution, Breakers",
    location: "USA",
    contact: "HelpDesk@elliottelectric.com"
  },
  {
    id: "ALA-123",
    name: "Alaric Corp (Charles)",
    preferences: "Electrical Surplus, Circuit Breakers",
    location: "USA",
    contact: "Charles@alaric1.com"
  },
  {
    id: "TSV-125",
    name: "Transformer Service (Gregg)",
    preferences: "Transformers, High Voltage Equipment",
    location: "USA",
    contact: "greggb@transformer-svc.com"
  },
  {
    id: "AEA-126",
    name: "AEAMC (R. Roumillat)",
    preferences: "Electrical & Mechanical Apparatus, Switchgear",
    location: "USA",
    contact: "RRoumillat@aeamc.com"
  },
  {
    id: "HH-129",
    name: "H&H Purchasing",
    preferences: "Electrical Surplus, Breakers",
    location: "USA",
    contact: "Purchasing@HandH.net"
  },
  {
    id: "TCB-130",
    name: "The Circuit Breaker Source",
    preferences: "Circuit Breakers, Electrical Distribution",
    location: "USA",
    contact: "Thecircuitbreakersource@gmail.com | jora652@gmail.com"
  },

  // --- INDUSTRIAL AUTOMATION & MRO ---
  {
    id: "RAD-20",
    name: "Radwell International (Brian Klimp)",
    preferences: "Industrial Automation, MRO, PLCs, Motors, Drives",
    location: "Willingboro, NJ",
    contact: "bklimp@radwell.com | jcella@radwell.com"
  },
  {
    id: "NRI-21",
    name: "NRI Industrial (Steve Stipanovich)",
    preferences: "Industrial Parts, Energy & Paper Mill Decommissioning",
    location: "Delta, OH",
    contact: "s.stipanovich@nri-isd.com | commerce@nriparts.com"
  },
  {
    id: "AX-22",
    name: "AX Control",
    preferences: "Industrial Drives, Circuit Boards, PLCs",
    location: "Raleigh, NC",
    contact: "sales@axcontrol.com"
  },
  {
    id: "IER-23",
    name: "IER (Oscar Galindo)",
    preferences: "Circuit Breakers, Motor Controls",
    location: "Houston, TX",
    contact: "oscar.galindo@ier-online.com"
  },
  {
    id: "IC-70",
    name: "IC Spares (M. Napoli)",
    preferences: "Turbine Parts, Control Systems, GE Speedtronic",
    location: "USA",
    contact: "mnapoli@ic-spares.com"
  },
  {
    id: "CC-24",
    name: "Control Concepts (Braven)",
    preferences: "Industrial Controls, Automation",
    location: "USA",
    contact: "braven@controlconcepts.com"
  },
  {
    id: "CSL-25",
    name: "Control System Labs (R. Murray)",
    preferences: "Control Systems, Lab Equipment",
    location: "USA",
    contact: "rmurray@controlsystemlabs.com"
  },
  {
    id: "SEC-121",
    name: "SE Controls (Chane)",
    preferences: "Industrial Controls, Automation Parts",
    location: "USA",
    contact: "Chane@secontrolsinc.com"
  },
  {
    id: "IAP-122",
    name: "IAP Sales (T. Stewart)",
    preferences: "Industrial Automation Parts, Surplus MRO",
    location: "USA",
    contact: "tstewart@iap-sales.com"
  },
  {
    id: "AFI-128",
    name: "All Fields Industrial",
    preferences: "Industrial MRO, Surplus Parts",
    location: "USA",
    contact: "Services@AllFieldsIndustrial.com"
  },

  // --- WIRE, CABLE & METALS ---
  {
    id: "SW-30",
    name: "Southwire (Jay Stewart)",
    preferences: "Scrap Wire, Copper, Aluminum, Reels",
    location: "Carrollton, GA",
    contact: "Jay.Stewart@Southwire.com"
  },
  {
    id: "NNC-31",
    name: "Nassau National Cable (Sam)",
    preferences: "Wire, Cable, Electrical Surplus",
    location: "Great Neck, NY",
    contact: "samd@nassaunationalcable.com | nassaucable@gmail.com"
  },
  {
    id: "MW-32",
    name: "Metro Wire & Cable (D. McCoy)",
    preferences: "Electrical Wire, Cable",
    location: "Detroit, MI",
    contact: "dmccoy@metrowire.net"
  },
  {
    id: "OK-33",
    name: "Okonite (L. Blanton)",
    preferences: "High Voltage Cable, Scrap Cable",
    location: "Ramsey, NJ",
    contact: "L.blanton@okonite.com"
  },
  {
    id: "SA-34",
    name: "SA Recycling (Lisa Mayfield)",
    preferences: "Scrap Metal, Ferrous & Non-Ferrous",
    location: "Orange, CA",
    contact: "LMayfield@sarecycling.com"
  },
  {
    id: "ANX-62",
    name: "Anixter (Robert Catney)",
    preferences: "Wire, Cable, Networking, Security",
    location: "Glenview, IL",
    contact: "Robert.Catney@anixter.com"
  },
  {
    id: "PRY-63",
    name: "Prysmian Group (David Brogdon)",
    preferences: "High Voltage Cable, Wire, Energy Cables",
    location: "Highland Heights, KY",
    contact: "David.brogdon@prysmiangroup.com | Tom.Lewnard@prysmiangroup.com"
  },
  {
    id: "SWR-64",
    name: "Service Wire (Matt Shumway)",
    preferences: "Copper Wire, Bare Copper, Cable",
    location: "Culloden, WV",
    contact: "matt.shumway@servicewire.com"
  },
  {
    id: "PWC-65",
    name: "Priority Wire & Cable (C. Myers)",
    preferences: "Aluminum Wire, Copper Wire",
    location: "Little Rock, AR",
    contact: "cmyers@prioritywire.com"
  },
  {
    id: "LM-60",
    name: "Lombard Metals (Marc Levin)",
    preferences: "Steel, Coils, Flat Rolled Steel",
    location: "Bala Cynwyd, PA",
    contact: "mlevin@lombardmetals.com"
  },
  {
    id: "USM-66",
    name: "United Scrap Metal (Dane Zumbahlen)",
    preferences: "Industrial Scrap Metal, Copper, Steel",
    location: "Cicero, IL",
    contact: "dzumbahlen@unitedscrap.com"
  },

  // --- GENERAL SURPLUS & LIQUIDATION ---
  {
    id: "HGR-40",
    name: "HGR Industrial Surplus",
    preferences: "CNC Machinery, Robots, Industrial MRO",
    location: "Euclid, OH",
    contact: "dfrancis@hgrinc.com | buy@hgrinc.com"
  },
  {
    id: "AEQ-41",
    name: "Aaron Equipment (B. Cohen)",
    preferences: "Process Equipment, Chemical, Packaging, Pharmaceutical",
    location: "Bensenville, IL",
    contact: "bcohen@aaronequipment.com | jbersh@aaronauctions.com"
  },
  {
    id: "RPM-42",
    name: "Repurposed Materials (Damon Carson)",
    preferences: "Industrial Byproducts, Conveyor Belting, Tanks, Lumber",
    location: "Denver, CO",
    contact: "damon@repurposedmaterialsinc.com | rpmcorpllc@gmail.com"
  },
  {
    id: "YTA-43",
    name: "Yellow Tag Auctions (Terri Hester)",
    preferences: "Industrial Auctions, Surplus Management",
    location: "Spartanburg, SC",
    contact: "thester@yellowtagauctions.com"
  },
  {
    id: "EN-44",
    name: "EquipNet",
    preferences: "Asset Management, Biotech, Lab Equipment",
    location: "Canton, MA",
    contact: "sales@equipnet.com"
  },
  {
    id: "TPC-45",
    name: "The Park Company",
    preferences: "Process Equipment, Heavy Machinery",
    location: "USA",
    contact: "mpc@theparkcompany.com"
  },
  {
    id: "SR-46",
    name: "Surplus Record",
    preferences: "Machinery Listings, Dealer Network",
    location: "Chicago, IL",
    contact: "surplus@surplusrecord.com"
  },
  {
    id: "SIS-57",
    name: "Surplus Industrial Supply (Jeff)",
    preferences: "MRO, Industrial Parts, Valves",
    location: "Muscle Shoals, AL",
    contact: "jeff@surplusindustrialsupply.com | sales@surplusindustrialsupply.com"
  },
  {
    id: "ISW-58",
    name: "Industrial Surplus World (Gino Parker)",
    preferences: "General Industrial, MRO, Machinery",
    location: "USA",
    contact: "gp@industrialsurplusworld.com"
  },
  {
    id: "HR-59",
    name: "Heartland Recovery (Paul)",
    preferences: "Industrial Asset Recovery, Plant Cleanouts",
    location: "Iowa",
    contact: "paul@heartlandrecoveryinc.com"
  },
  {
    id: "AMS-61",
    name: "AMS Group (David Hess)",
    preferences: "Marine, Defense, Industrial Parts",
    location: "USA",
    contact: "david@amsgroupinc.com | inquiry@amsgroupinc.com"
  },
  {
    id: "TGR-67",
    name: "Texas Global Resources (Robert John)",
    preferences: "Industrial Surplus, Energy Equipment",
    location: "Texas",
    contact: "rob@texasglobalresources.com"
  },
  {
    id: "S&L-69",
    name: "S&L Surplus (Steve)",
    preferences: "Valves, Industrial Surplus",
    location: "USA",
    contact: "Steve@SandLSurplus.com"
  },
  {
    id: "FRM-72",
    name: "Framatome (Greg Cambeis)",
    preferences: "Nuclear Parts, Energy Equipment",
    location: "Lynchburg, VA",
    contact: "Greg.cambeis@framatome.com"
  },

  // --- DATA CENTERS & CRITICAL INFRASTRUCTURE ---
  {
    id: "ADC-80",
    name: "Aligned Data Centers",
    preferences: "Data Center Power, Generators, Cooling Infrastructure",
    location: "Plano, TX (HQ)",
    contact: "sales@aligneddc.com"
  },
  {
    id: "CC-81",
    name: "ColoCapacity",
    preferences: "Colocation Space, Power Equipment",
    location: "USA",
    contact: "info@colocapacity.com"
  },
  {
    id: "DCB-90",
    name: "DC Blox",
    preferences: "Data Center Infrastructure, Generators, Cooling",
    location: "Atlanta, GA",
    contact: "marketing@dcblox.com"
  },
  {
    id: "DOC-91",
    name: "DigitalOcean (B. Saha)",
    preferences: "Server Hardware, Data Center Infrastructure",
    location: "New York, NY",
    contact: "BSaha@digitalocean.com"
  },
  {
    id: "EC-92",
    name: "Element Critical",
    preferences: "Critical Power, Cooling, Data Center Gear",
    location: "Vienna, VA",
    contact: "sales@elementcritical.com | corporate@elementcritical.com"
  },
  {
    id: "MG-93",
    name: "Markley Group",
    preferences: "Mission Critical Infrastructure, Telecommunications",
    location: "Boston, MA",
    contact: "sales@markleygroup.com | servicedesk@markleygroup.com"
  },
  {
    id: "QTS-94",
    name: "QTS Data Centers",
    preferences: "Data Center Facilities, Power & Cooling",
    location: "Overland Park, KS",
    contact: "sales@qtsdatacenters.com"
  },
  {
    id: "CYR-95",
    name: "CyrusOne (J. Hatem)",
    preferences: "Enterprise Data Centers, High Density Computing",
    location: "Dallas, TX",
    contact: "jhatem@cyrusone.com"
  },
  {
    id: "NTT-96",
    name: "NTT Global",
    preferences: "Global Data Center Equipment, IT Infrastructure",
    location: "Global",
    contact: "info@nttglobal.net"
  },
  {
    id: "DR-97",
    name: "Digital Realty",
    preferences: "Colocation, Scale Data Centers, Power Systems",
    location: "Austin, TX",
    contact: "sales@digitalrealty.com | customercare@digitalrealty.com"
  },
  {
    id: "DB-98",
    name: "Databricks (Andy Kofoid)",
    preferences: "IT Infrastructure, Server Equipment",
    location: "San Francisco, CA",
    contact: "Andy.Kofoid@databricks.com"
  },

  // --- GENERAL CONTRACTORS & CONSTRUCTION ---
  {
    id: "DD-82",
    name: "DeAngelis Diamond",
    preferences: "Construction Equipment, Generators, Building Materials",
    location: "Naples, FL",
    contact: "info@deangelisdiamond.com"
  },
  {
    id: "RB-83",
    name: "Rodgers Builders (J. Money)",
    preferences: "Commercial Construction, Heavy Equipment",
    location: "Charlotte, NC",
    contact: "jmoney@rodgersbuilders.com"
  },
  {
    id: "WC-84",
    name: "Wagman",
    preferences: "Heavy Civil Construction, Geotechnical",
    location: "York, PA",
    contact: "info@wagman.com"
  },
  {
    id: "CLC-85",
    name: "Crossland Construction",
    preferences: "General Construction, Steel, Heavy Machinery",
    location: "Columbus, KS",
    contact: "info@crossland.com"
  },
  {
    id: "CGS-86",
    name: "CG Schmidt (Nicole Snyder)",
    preferences: "Construction Management, Industrial Equipment",
    location: "Milwaukee, WI",
    contact: "nicole.snyder@cgschmidt.com"
  },
  {
    id: "MC-87",
    name: "Miron Construction",
    preferences: "Industrial Construction, Heavy Equipment",
    location: "Neenah, WI",
    contact: "business.development@miron-construction.com | estimating@miron-construction.com"
  },
  {
    id: "TBG-88",
    name: "The Beck Group (Chad/Mark)",
    preferences: "Architecture, Construction, Design-Build",
    location: "Dallas, TX",
    contact: "chadschieber@beckgroup.com | MARKSTENSON@beckarchitecture.com"
  },
  {
    id: "CAD-89",
    name: "Caddell Construction",
    preferences: "Government Projects, International Construction, Generators",
    location: "Montgomery, AL",
    contact: "info@caddell.com"
  },
  {
    id: "BEI-100",
    name: "BEI Construction",
    preferences: "Renewable Energy Construction, Electrical Infrastructure",
    location: "USA",
    contact: "info@beiconstruction.com"
  },
  {
    id: "FAP-101",
    name: "FA Peinado",
    preferences: "Industrial Construction, Tilt-Wall",
    location: "Frisco, TX",
    contact: "info@fapeinado.com"
  },
  {
    id: "ECS-102",
    name: "EcoSteel",
    preferences: "Steel Building Systems, Metal Surplus",
    location: "Laguna Niguel, CA",
    contact: "info@ecosteel.com"
  },
  {
    id: "MET-103",
    name: "Metromont",
    preferences: "Precast Concrete, Construction Materials",
    location: "Greenville, SC",
    contact: "bartowpurchasing@metromont.com"
  },
  {
    id: "DPR-104",
    name: "DPR Construction (Jason)",
    preferences: "Advanced Tech Construction, Biopharma, Data Centers",
    location: "Redwood City, CA",
    contact: "jasonmi@dpr.com | info@dpr.com"
  },
  {
    id: "FLU-105",
    name: "Fluor Corporation",
    preferences: "Energy, Urban Solutions, Mission Solutions",
    location: "Irving, TX",
    contact: "info@fluor.com"
  },
  {
    id: "MCD-106",
    name: "M.C. Dean",
    preferences: "Electrical Systems, Electronic Security, Instrumentation",
    location: "Tysons, VA",
    contact: "purchasing@mcdean.com"
  },
  {
    id: "AEC-107",
    name: "AECOM",
    preferences: "Infrastructure Consulting, Civil Construction",
    location: "Dallas, TX",
    contact: "general.inquiries@aecom.com"
  },
  {
    id: "VOG-108",
    name: "Vogel Bros. Building Co.",
    preferences: "Construction Services, Waste Water Treatment",
    location: "Madison, WI",
    contact: "sales@vogelbldg.com | dvogel@aol.com"
  },
  {
    id: "WEI-109",
    name: "The Weitz Company",
    preferences: "Industrial Construction, Supply Chain",
    location: "Des Moines, IA",
    contact: "info@weitz.com"
  },
  {
    id: "HP-110",
    name: "Hensel Phelps (R. Martorano)",
    preferences: "General Contracting, Aviation, Government",
    location: "Greeley, CO",
    contact: "r.martorano@henselphelps.com"
  },
  {
    id: "NAB-111",
    name: "Nabholz (Sara Williams)",
    preferences: "Construction, Industrial Services, Machinery",
    location: "Conway, AR",
    contact: "sara.williams@nabholz.com"
  },
  {
    id: "FOR-112",
    name: "Fortis Construction",
    preferences: "Data Center Construction, Higher Ed",
    location: "Portland, OR",
    contact: "info@fortisconstruction.com | info@fortisinc.com"
  },
  {
    id: "HOF-113",
    name: "Hoffman Construction (Justin Paterson)",
    preferences: "High-Tech Construction, Manufacturing Plants",
    location: "Portland, OR",
    contact: "justin-paterson@hoffmancorp.com"
  },
  {
    id: "HOL-114",
    name: "Holder Construction",
    preferences: "Data Center Construction, Corporate Interiors",
    location: "Atlanta, GA",
    contact: "licenses@holder.com"
  },
  {
    id: "TUR-115",
    name: "Turner Construction",
    preferences: "General Building, Green Building",
    location: "New York, NY",
    contact: "turner@tcco.com"
  },
  {
    id: "SAU-116",
    name: "Saunders Construction (J. MacKinnon)",
    preferences: "Commercial Building, Infrastructure",
    location: "Englewood, CO",
    contact: "j.mackinnon@saundersinc.com"
  },
  {
    id: "MYC-117",
    name: "MYCON General Contractors (J. Arrieta)",
    preferences: "Retail, Industrial, Office Construction",
    location: "Dallas, TX",
    contact: "jarrieta@mycon.com"
  },
  {
    id: "CLK-118",
    name: "Clark Construction (Byron Smith)",
    preferences: "Civil, Building, Asset Lifecycle",
    location: "Bethesda, MD",
    contact: "Byron.smith@clarkconstruction.com | lance.smith@clarkconstruction.com"
  },
  {
    id: "JRM-119",
    name: "JRM Construction",
    preferences: "Construction Management, General Contracting",
    location: "New York, NY",
    contact: "jrmny@jrmcm.com"
  },
  {
    id: "CHT-120",
    name: "Chetu (Purchasing)",
    preferences: "IT Equipment, Office Surplus",
    location: "Plantation, FL",
    contact: "purchasing@chetu.com"
  },
  {
    id: "TWB-127",
    name: "Triple W Backhoe",
    preferences: "Heavy Equipment, Excavators, Backhoes",
    location: "USA",
    contact: "triplewbackhoe@hotmail.com"
  },
  // --- NEW ADDITIONS ---
  {
    id: "ATE-131",
    name: "Air Tool Equipment (Warner Williams)",
    preferences: "Pneumatic Tools, Industrial Air Equipment",
    location: "Houston, TX",
    address: "6824 Long Dr, Houston, TX 77087",
    contact: "warner@airtoolequipment.com | (713) 641-3434"
  },
  {
    id: "WWF-132",
    name: "Worldwide Forklifts (Peter Vaz)",
    preferences: "Forklifts, Material Handling Equipment",
    location: "Fort Lauderdale, FL",
    address: "268 SW 32nd Ct, Fort Lauderdale, FL 33315",
    contact: "petervaz@aol.com | (954) 768-9875"
  },
  {
    id: "MSR-133",
    name: "Market Street Recycling (Jesse Pennington)",
    preferences: "Scrap Metal, Industrial Recycling, Demolition Scrap",
    location: "Houston, TX",
    address: "8700 Market Street, Houston, TX 77029",
    contact: "jesse.pennington@mktstrrec.com | 713-676-2621 | www.marketstreetrecycling.com"
  },
  {
    id: "BBC-134",
    name: "Bullock Breakers (Chase)",
    preferences: "Circuit Breakers, Switchgear, Electrical Surplus",
    location: "Annandale, MN",
    address: "475 Annandale Blvd, Annandale, MN 55302",
    contact: "sales@bullockbreakers.com | 320-293-4429"
  },
  {
    id: "SBS-135",
    name: "Sunbelt Solomon (Dan Sweeney)",
    preferences: "Transformers, Electrical Distribution, Regulators",
    location: "Temple, TX",
    address: "1922 S MLK Jr Dr, Temple, TX 76504",
    contact: "Dan.Sweeney@sunbeltsolomon.com | +1.724.813.8518 | ap@sunbeltsolomon.com"
  }
];

export const MAX_IMAGE_SIZE_MB = 5;
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];