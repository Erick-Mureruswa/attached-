import urllib.request
import json

API = "http://localhost:5000/api"

def call(method, path, body=None, token=None):
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{API}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return json.loads(e.read())

def register(name, email, password):
    d = call("POST", "/auth/register", {"name": name, "email": email, "password": password, "role": "employer"})
    if "token" in d:
        print(f"  + {name}")
        return d["token"]
    if d.get("message") == "Email already registered":
        d2 = call("POST", "/auth/login", {"email": email, "password": password})
        if "token" in d2:
            print(f"  ~ {name} (existing)")
            return d2["token"]
    print(f"  ! {name}: {d}")
    return None

def post_job(token, title, location, jtype, category, salary, desc):
    d = call("POST", "/jobs", {"title": title, "location": location, "type": jtype,
              "category": category, "salary": salary, "description": desc}, token)
    if "id" in d:
        print(f"    -> {title}")
    else:
        print(f"    !! {title}: {d}")

employers = [
    ("Econet Wireless Zimbabwe",    "hr@econet.co.zw",    "Econet2024!"),
    ("CBZ Holdings",                "hr@cbz.co.zw",       "CBZBank2024!"),
    ("ZESA Holdings",               "hr@zesa.co.zw",      "Zesa2024!"),
    ("Delta Corporation Zimbabwe",  "hr@delta.co.zw",     "Delta2024!"),
    ("Dairibord Zimbabwe",          "hr@dairibord.co.zw", "Dairy2024!"),
    ("Old Mutual Zimbabwe",         "hr@oldmutual.co.zw", "OldMut2024!"),
    ("NetOne Cellular",             "hr@netone.co.zw",    "NetOne2024!"),
    ("NMB Bank Zimbabwe",           "hr@nmbz.co.zw",      "NMBBank2024!"),
    ("Seedco International",        "hr@seedco.co.zw",    "Seedco2024!"),
    ("Stanbic Bank Zimbabwe",       "hr@stanbic.co.zw",   "Stanb2024!"),
]

jobs = [
  # Econet (0)
  (0, "IT Software Development Attachment", "Harare", "Internship", "Technology", "ZWL 15,000 - 25,000/month",
   "Econet Wireless Zimbabwe invites suitably qualified students for an IT Software Development Attachment.\n\nRequirements:\n- BSc Computer Science, Software Engineering, or related ICT degree (at least 2 years completed)\n- Proficiency in Java, Python, or JavaScript\n- Basic understanding of databases (MySQL, PostgreSQL)\n- Good problem-solving and communication skills\n\nResponsibilities:\n- Assist in development and testing of internal software systems\n- Participate in agile development sprints\n- Write clean, maintainable code under supervision\n- Document technical processes and assist with bug fixing\n\nDuration: 6 months\nDeadline: 30 May 2026\nAttach CV, certified transcripts, and institution letter."),

  (0, "Network Engineering Attachment", "Harare", "Internship", "Technology", "ZWL 12,000 - 18,000/month",
   "Econet Wireless Zimbabwe is offering a Network Engineering Attachment for Telecommunications or Electrical Engineering students.\n\nRequirements:\n- 2nd or 3rd year student in Telecommunications, Electrical Engineering, or Computer Networks\n- Basic understanding of networking protocols (TCP/IP, OSPF, BGP)\n- Interest in mobile telecommunications infrastructure\n\nResponsibilities:\n- Assist network operations team in monitoring and maintaining the network\n- Support field engineers during site visits\n- Help generate network performance reports\n- Learn about 4G/LTE and fibre infrastructure\n\nDuration: 6 months | Location: Harare Head Office"),

  (0, "Data Analytics Attachment", "Harare", "Internship", "Technology", "ZWL 15,000 - 20,000/month",
   "Join Econet's Business Intelligence team as a Data Analytics Attachee.\n\nRequirements:\n- Studying Statistics, Data Science, Computer Science, or Mathematics\n- Familiarity with Excel and at least one of: Python, R, SQL\n- Strong analytical and numerical skills\n\nResponsibilities:\n- Assist in collecting, cleaning, and analysing large datasets\n- Help build dashboards and management reports\n- Support customer insights generation\n- Learn Power BI and Tableau\n\nDuration: 6 months"),

  # CBZ Holdings (1)
  (1, "Finance & Accounting Attachment", "Harare", "Internship", "Finance", "ZWL 12,000 - 18,000/month",
   "CBZ Holdings, Zimbabwe's largest financial services group, is offering Finance and Accounting attachment positions.\n\nRequirements:\n- Studying Accounting, Finance, Banking, or related business degree\n- Part 1 ACCA or equivalent an added advantage\n- Proficiency in Microsoft Excel\n- High level of integrity and attention to detail\n\nResponsibilities:\n- Assist in preparation of monthly management accounts\n- Support bank statement and general ledger reconciliations\n- Participate in budget preparation and variance analysis\n- Learn the core banking system (T24)\n\nDuration: 6 months"),

  (1, "Credit Analysis Attachment", "Bulawayo", "Internship", "Finance", "ZWL 12,000 - 15,000/month",
   "CBZ Bank is seeking Credit Analysis Attachees in the Retail and Corporate Lending divisions in Bulawayo.\n\nRequirements:\n- Studying Banking, Finance, Accounting, or Economics\n- Strong mathematical and analytical ability\n- Understanding of basic financial statements\n- Good report writing skills\n\nResponsibilities:\n- Assist credit officers in assessing loan applications\n- Help prepare credit appraisal reports\n- Support monitoring of loan portfolios\n- Learn credit risk assessment frameworks\n\nDuration: 6 months | Candidates based in Bulawayo preferred."),

  (1, "Human Resources Attachment", "Harare", "Internship", "Other", "ZWL 10,000 - 13,000/month",
   "CBZ Holdings is offering an HR attachment in its Group Human Capital division.\n\nRequirements:\n- Studying Human Resources Management, Psychology, or Business Administration\n- Good interpersonal and communication skills\n- Ability to handle confidential information with discretion\n\nResponsibilities:\n- Assist in recruitment, shortlisting, and onboarding\n- Support payroll administration and leave management\n- Help organise training programmes\n- Maintain HR records and update the HRIS system\n\nDuration: 6 months"),

  # ZESA (2)
  (2, "Electrical Engineering Attachment", "Harare", "Internship", "Engineering", "ZWL 15,000 - 22,000/month",
   "ZESA Holdings invites Electrical Engineering students for industrial attachment positions.\n\nRequirements:\n- Enrolled in Electrical Engineering or Power Systems Engineering (at least 2 years completed)\n- Basic understanding of power systems and electrical circuits\n- Willingness to work in power station environments (PPE provided)\n\nResponsibilities:\n- Assist engineers in maintenance of power generation equipment\n- Support electrical fault diagnosis and repair\n- Help prepare technical reports and engineering drawings\n- Learn about generation, transmission, and distribution systems\n\nDuration: 6 months\nPlacements at: Harare, Hwange, Kariba, and Bulawayo stations."),

  (2, "Civil Engineering Attachment", "Kariba", "Internship", "Engineering", "ZWL 14,000 - 20,000/month",
   "ZESA Holdings' Kariba Hydro Power Station is offering Civil Engineering attachment positions.\n\nRequirements:\n- Studying Civil Engineering or Structural Engineering\n- Basic understanding of structural design and construction\n- Proficiency in AutoCAD is an added advantage\n\nResponsibilities:\n- Assist the civil engineering team in infrastructure maintenance\n- Support dam safety monitoring activities\n- Help prepare site inspection reports\n- Participate in construction and maintenance works\n\nDuration: 6 months | Accommodation assistance provided.\nA rare opportunity to work on one of Africa's largest hydroelectric projects."),

  (2, "Instrumentation & Control Attachment", "Hwange", "Internship", "Engineering", "ZWL 14,000 - 19,000/month",
   "ZESA Holdings' Hwange Thermal Power Station is offering an Instrumentation and Control Engineering attachment.\n\nRequirements:\n- Studying Instrumentation Engineering, Electronic Engineering, or Mechatronics\n- Basic knowledge of PLCs and SCADA systems an advantage\n- Willingness to be based in Hwange\n\nResponsibilities:\n- Assist in calibration and maintenance of plant instruments\n- Support control system monitoring and fault finding\n- Help maintain instrument maintenance records\n- Participate in shutdown maintenance activities\n\nDuration: 6 months | Accommodation and meal stipend provided."),

  # Delta Corporation (3)
  (3, "Mechanical Engineering Attachment", "Harare", "Internship", "Engineering", "ZWL 15,000 - 20,000/month",
   "Delta Corporation, Zimbabwe's leading beverages manufacturer, is offering Mechanical Engineering attachment positions at its Harare Brewery.\n\nRequirements:\n- Studying Mechanical Engineering or Industrial Engineering (at least 2 years completed)\n- Practical mindset with interest in manufacturing\n- Good communication and teamwork skills\n\nResponsibilities:\n- Assist in planned and breakdown maintenance of brewing and packaging equipment\n- Support the engineering team in technical projects\n- Help prepare maintenance schedules and reports\n- Participate in Lean/Kaizen continuous improvement initiatives\n\nDuration: 6 months | Location: Delta Beverages Harare Works, Graniteside"),

  (3, "Sales & Marketing Attachment", "Harare", "Internship", "Marketing", "ZWL 10,000 - 15,000/month",
   "Delta Corporation Zimbabwe is offering Sales and Marketing attachment positions for Business and Marketing students.\n\nRequirements:\n- Studying Marketing, Business Studies, or Commerce\n- Outgoing personality with excellent communication skills\n- Valid driver's licence an added advantage\n\nResponsibilities:\n- Support sales representatives in trade visits and route coverage\n- Monitor competitor activity and pricing\n- Assist in compilation of sales reports and market intelligence\n- Participate in brand activation events and promotions\n- Learn about FMCG distribution and trade marketing\n\nDuration: 6 months"),

  (3, "Supply Chain & Logistics Attachment", "Harare", "Internship", "Other", "ZWL 11,000 - 16,000/month",
   "Delta Corporation Zimbabwe is offering a Supply Chain and Logistics attachment.\n\nRequirements:\n- Studying Supply Chain Management, Logistics, Business, or related\n- Proficiency in Microsoft Excel\n- Analytical mindset with attention to detail\n\nResponsibilities:\n- Assist in materials planning and inventory management\n- Support procurement of raw materials and packaging\n- Help coordinate inbound and outbound logistics\n- Participate in warehouse management activities\n- Learn SAP ERP system\n\nDuration: 6 months"),

  # Dairibord (4)
  (4, "Food Science & Quality Assurance Attachment", "Harare", "Internship", "Technology", "ZWL 12,000 - 17,000/month",
   "Dairibord Zimbabwe Limited is seeking Food Science and Quality Assurance attachees.\n\nRequirements:\n- Studying Food Science, Food Technology, Biochemistry, or related science\n- Laboratory skills and basic analytical chemistry knowledge\n- Attention to detail and high standards of hygiene\n\nResponsibilities:\n- Conduct routine quality checks on raw materials and finished products\n- Assist in microbiological and chemical laboratory testing\n- Help maintain quality records and document test results\n- Participate in food safety audits and HACCP processes\n- Support ISO 22000 compliance activities\n\nDuration: 6 months | Location: Glenroy and Raylton plants, Harare"),

  (4, "Agriculture & Raw Milk Procurement Attachment", "Harare", "Internship", "Other", "ZWL 10,000 - 14,000/month",
   "Dairibord Zimbabwe is offering an attachment in its Raw Milk Procurement and Farmer Development division.\n\nRequirements:\n- Studying Agriculture, Animal Science, Agribusiness, or related\n- Understanding of dairy farming practices an advantage\n- Good communication skills\n- Valid driver's licence preferred\n\nResponsibilities:\n- Assist in coordinating raw milk collection from contracted farmers\n- Support farmer development and extension activities\n- Help maintain farmer database and milk quality records\n- Participate in farm visits and quality assessments\n- Learn about dairy value chain management\n\nDuration: 6 months"),

  # Old Mutual (5)
  (5, "Actuarial Science Attachment", "Harare", "Internship", "Finance", "ZWL 20,000 - 30,000/month",
   "Old Mutual Zimbabwe is offering an Actuarial Science attachment.\n\nRequirements:\n- Enrolled in BSc Actuarial Science, Statistics, or Mathematics\n- Passed at least 2 IFoA or SOA exams an added advantage\n- Strong mathematical and statistical skills\n- Proficiency in Excel; R or Python a plus\n\nResponsibilities:\n- Assist actuaries in pricing and reserving models for life and short-term insurance\n- Support data analysis for mortality, morbidity, and lapse studies\n- Help prepare actuarial reports and regulatory submissions\n- Learn actuarial software (Prophet or MoSes)\n- Participate in product development workshops\n\nDuration: 6 months\nOne of the most sought-after actuarial attachments in Zimbabwe."),

  (5, "Investment & Asset Management Attachment", "Harare", "Internship", "Finance", "ZWL 16,000 - 24,000/month",
   "Old Mutual Investment Group Zimbabwe is offering an Investment Management attachment.\n\nRequirements:\n- Studying Finance, Economics, Investment Management, or CFA Level 1 candidate\n- Strong quantitative and analytical skills\n- Understanding of financial markets and investment instruments\n- Proficiency in Excel; Bloomberg knowledge an advantage\n\nResponsibilities:\n- Assist portfolio managers in equity and fixed income research\n- Help prepare investment research reports and market commentaries\n- Support the trading desk in monitoring market movements\n- Participate in investment committee meetings\n- Learn about portfolio construction and risk management\n\nDuration: 6 months | Exposure to the ZSE and VFEX."),

  # NetOne (6)
  (6, "Software Development Attachment", "Harare", "Internship", "Technology", "ZWL 14,000 - 20,000/month",
   "NetOne Cellular is offering Software Development attachment positions for ICT students.\n\nRequirements:\n- Studying Computer Science, Software Engineering, or Information Systems\n- Knowledge of PHP, Java, Python, or JavaScript\n- Understanding of REST APIs and databases\n\nResponsibilities:\n- Assist in development of internal web and mobile applications\n- Support testing and debugging of existing systems\n- Help document technical specifications\n- Participate in integration of value-added services (VAS)\n- Learn about telecoms OSS/BSS systems and USSD development\n\nDuration: 6 months | Location: NetOne House, Harare CBD"),

  (6, "Telecommunications Engineering Attachment", "Harare", "Internship", "Engineering", "ZWL 13,000 - 18,000/month",
   "NetOne Cellular is seeking Telecommunications Engineering attachees for its Network Operations Centre (NOC).\n\nRequirements:\n- Studying Telecommunications Engineering, Electronic Engineering, or Computer Networks (at least 2 years completed)\n- Interest in mobile network operations\n- Availability for rotational shifts\n\nResponsibilities:\n- Monitor network performance via the NOC dashboard\n- Assist in fault identification, escalation, and resolution\n- Support field engineers during site maintenance\n- Help prepare network performance reports\n- Learn about 2G, 3G, and 4G mobile network operations\n\nDuration: 6 months"),

  (6, "Cybersecurity Attachment", "Harare", "Internship", "Technology", "ZWL 15,000 - 21,000/month",
   "NetOne Cellular is offering a Cybersecurity attachment in its Information Security division.\n\nRequirements:\n- Studying Computer Science, Cybersecurity, or Information Technology\n- Knowledge of networking fundamentals (TCP/IP, firewalls, VPNs)\n- CompTIA Security+ or CEH knowledge an advantage\n\nResponsibilities:\n- Assist in monitoring SIEM alerts and security events\n- Support vulnerability scanning and patch management\n- Help create security awareness training materials\n- Participate in incident response drills\n- Learn about telecoms-specific security threats and controls\n\nDuration: 6 months"),

  # NMB Bank (7)
  (7, "Banking Operations Attachment", "Harare", "Internship", "Finance", "ZWL 12,000 - 16,000/month",
   "NMB Bank Zimbabwe is offering Banking Operations attachment positions.\n\nRequirements:\n- Studying Banking, Finance, Accounting, Business Studies, or Economics\n- Strong numerical skills and attention to detail\n- Customer-oriented mindset\n\nResponsibilities:\n- Support branch operations including account opening and transactions\n- Assist in back-office processing and reconciliations\n- Learn about EFT and RTGS operations\n- Help in trade finance documentation processing\n- Participate in customer service delivery\n\nDuration: 6 months\nPlacements available in: Harare, Mutare, Gweru, and Masvingo branches."),

  (7, "IT Systems Attachment", "Harare", "Internship", "Technology", "ZWL 13,000 - 17,000/month",
   "NMB Bank Zimbabwe is looking for an IT Systems Attachee to support its Information Technology division.\n\nRequirements:\n- Studying Computer Science, Information Technology, or Information Systems\n- Basic networking knowledge (CCNA level)\n- Interest in banking technology and fintech\n\nResponsibilities:\n- Assist the IT support team in helpdesk operations\n- Support server and network administration\n- Help maintain IT asset register and software licences\n- Assist in cybersecurity monitoring activities\n- Learn about core banking systems and mobile banking integration\n\nDuration: 6 months"),

  # Seedco (8)
  (8, "Agronomy Attachment", "Harare", "Internship", "Other", "ZWL 12,000 - 18,000/month",
   "Seedco International, Africa's largest seed company, is offering Agronomy attachment positions.\n\nRequirements:\n- Studying Agriculture, Crop Science, Agronomy, Plant Breeding, or related\n- Passion for African agriculture and food security\n- Willingness to travel and work in field conditions\n- Valid driver's licence an added advantage\n\nResponsibilities:\n- Assist agronomists in field trials for maize, sorghum, wheat, and soybean\n- Support data collection and recording in trial plots\n- Help prepare agronomic reports and variety recommendations\n- Participate in performance assessment of new seed varieties\n- Learn about seed production standards\n\nDuration: 6 months (aligned with main cropping season)\nPlacements: Harare, Kadoma, Marondera, and Triangle"),

  (8, "Plant Breeding Research Attachment", "Harare", "Internship", "Other", "ZWL 13,000 - 19,000/month",
   "Seedco International is offering a Plant Breeding Research attachment at Rattray Arnold Research Station.\n\nRequirements:\n- Studying Plant Science, Genetics, Biotechnology, Crop Science, or Agriculture\n- Strong interest in plant breeding and seed technology\n- Laboratory experience an advantage\n\nResponsibilities:\n- Assist plant breeders in hybridisation, pollination, and selection\n- Support data collection in breeding nurseries and field plots\n- Help with germplasm management and seed storage\n- Participate in marker-assisted selection laboratory work\n- Learn about commercial plant breeding pipelines\n\nDuration: 6 months\nA unique opportunity to work on cutting-edge seed research in Africa."),

  (8, "Agribusiness & Marketing Attachment", "Harare", "Internship", "Marketing", "ZWL 11,000 - 16,000/month",
   "Seedco International is offering an Agribusiness and Marketing attachment in its Commercial division.\n\nRequirements:\n- Studying Agribusiness, Agricultural Economics, Marketing, or Business\n- Understanding of Zimbabwean smallholder and commercial farming sectors\n- Good communication and presentation skills\n- Willingness to travel to farming areas\n\nResponsibilities:\n- Assist the sales team in farmer outreach and demonstration plots\n- Support market research on seed demand and competitor products\n- Help prepare sales reports and dealer performance analysis\n- Participate in agricultural shows and field days\n- Learn about seed marketing and distribution channels in Zimbabwe\n\nDuration: 6 months"),

  # Stanbic Bank (9)
  (9, "Risk Management Attachment", "Harare", "Internship", "Finance", "ZWL 16,000 - 24,000/month",
   "Stanbic Bank Zimbabwe, a member of the Standard Bank Group, is offering Risk Management attachment positions.\n\nRequirements:\n- Studying Finance, Risk Management, Statistics, Economics, or related\n- Strong analytical and quantitative skills\n- Understanding of financial markets and banking regulation\n- Proficiency in Excel; Python or R a plus\n\nResponsibilities:\n- Assist the Risk team in credit, market, and operational risk monitoring\n- Support preparation of risk reports for senior management and RBZ\n- Help build and test risk models and scorecards\n- Participate in stress testing and scenario analysis\n- Learn the Basel III regulatory framework in a local banking context\n\nDuration: 6 months"),

  (9, "Information Technology Attachment", "Harare", "Internship", "Technology", "ZWL 14,000 - 20,000/month",
   "Stanbic Bank Zimbabwe is seeking an IT Attachment candidate for its Technology and Operations division.\n\nRequirements:\n- Studying Computer Science, Information Technology, Cybersecurity, or related\n- Interest in banking technology, cloud computing, or cybersecurity\n- Basic programming skills (Python, SQL, or Java)\n\nResponsibilities:\n- Support the IT operations team in day-to-day system administration\n- Assist in application testing and user acceptance testing (UAT)\n- Help with IT documentation and process mapping\n- Participate in digital transformation and innovation projects\n- Learn about enterprise banking systems and cloud infrastructure\n\nDuration: 6 months | Exposure to Standard Bank Group's pan-African technology ecosystem."),

  (9, "Trade Finance Attachment", "Harare", "Internship", "Finance", "ZWL 14,000 - 20,000/month",
   "Stanbic Bank Zimbabwe is offering a Trade Finance attachment in its Global Transactional Services division.\n\nRequirements:\n- Studying Finance, Banking, International Trade, or Economics\n- Understanding of letters of credit, guarantees, and documentary collections\n- Good written communication skills\n- Attention to detail and accuracy\n\nResponsibilities:\n- Assist in processing import and export documentation\n- Support letter of credit issuance and advising workflows\n- Help prepare trade finance reports and client correspondence\n- Participate in client onboarding for trade facilities\n- Learn about SWIFT messaging and UCP 600 rules\n\nDuration: 6 months\nZimbabwe's gateway to Standard Bank Group's global trade finance network."),
]

print("=" * 55)
print("  Seeding: Zimbabwe Attachment Vacancies")
print("=" * 55)

print("\nRegistering employers...")
tokens = [register(n, e, p) for n, e, p in employers]

print(f"\nPosting {len(jobs)} attachment vacancies...")
for employer_idx, title, location, jtype, category, salary, desc in jobs:
    token = tokens[employer_idx]
    if token:
        post_job(token, title, location, jtype, category, salary, desc)

print("\n" + "=" * 55)
d = json.loads(urllib.request.urlopen(f"{API}/jobs?limit=1", timeout=10).read())
print(f"  Done! Total jobs in database: {d.get('total', '?')}")
print("=" * 55)
