// CISSP Key Concepts — Domain-wise Study Notes
// For personal study use only.
// Structure: { domain, num, label, topics: [{ title, points[] }] }

window.CISSP_CONCEPTS = [

  // ─────────────────────────────────────────────────────────────────────
  // D1 – Security and Risk Management
  // ─────────────────────────────────────────────────────────────────────
  {
    domain: "security_and_risk_management", num: "D1",
    label: "Security and Risk Management",
    topics: [
      {
        title: "CIA Triad & Core Principles",
        points: [
          "Confidentiality — preventing unauthorized disclosure of information (encryption, access controls).",
          "Integrity — ensuring data is accurate and unaltered (hashing, digital signatures, checksums).",
          "Availability — ensuring authorized users can access systems and data (redundancy, backups, DDoS protection).",
          "Non-repudiation — proof that a party cannot deny an action (digital signatures, audit logs).",
          "Authenticity — verifying the identity of a subject or object.",
          "AAA Framework: Authentication, Authorization, Accounting.",
          "Defense in Depth — multiple overlapping layers of security controls.",
          "Least Privilege — grant only the minimum access necessary for a task.",
          "Separation of Duties — no single person controls an entire critical process.",
          "Need to Know — access limited to information required for a specific role."
        ]
      },
      {
        title: "Risk Management Fundamentals",
        points: [
          "Risk = Threat × Vulnerability × Asset Value.",
          "Threat — any potential cause of an unwanted incident (natural, human, environmental).",
          "Vulnerability — a weakness that can be exploited by a threat.",
          "Exposure — the degree to which an asset is open to threats.",
          "Control / Safeguard — countermeasure that reduces risk.",
          "Inherent Risk — risk before any controls are applied.",
          "Residual Risk — risk remaining after controls are implemented.",
          "Risk Appetite — the level of risk an organization is willing to accept.",
          "Risk Tolerance — the acceptable variance around risk appetite.",
          "Risk Treatment Options: Accept (retain), Transfer (insurance), Mitigate (reduce), Avoid (eliminate).",
          "Total Risk = Threats × Vulnerabilities × Asset Value; Residual Risk = Total Risk − Countermeasure Value."
        ]
      },
      {
        title: "Quantitative Risk Analysis",
        points: [
          "Asset Value (AV) — monetary value of the asset.",
          "Exposure Factor (EF) — percentage of asset lost in a single incident (0–100%).",
          "Single Loss Expectancy (SLE) = AV × EF.",
          "Annual Rate of Occurrence (ARO) — estimated frequency of a threat per year.",
          "Annual Loss Expectancy (ALE) = SLE × ARO.",
          "Safeguard Value = ALE before control − ALE after control − Annual cost of control.",
          "Qualitative analysis uses subjective rankings (High/Medium/Low) — faster but less precise.",
          "Quantitative analysis uses dollar figures — more precise but time-consuming.",
          "Most real-world assessments blend both approaches (semi-quantitative)."
        ]
      },
      {
        title: "Security Governance & Frameworks",
        points: [
          "COBIT — IT governance framework focused on aligning IT with business goals.",
          "ISO/IEC 27001 — international standard for an ISMS (Information Security Management System).",
          "ISO/IEC 27002 — best-practice code of practice for security controls.",
          "NIST CSF — Cybersecurity Framework: Identify, Protect, Detect, Respond, Recover.",
          "NIST SP 800-37 — Risk Management Framework (RMF) for federal systems.",
          "ITIL — IT service management best practices (not security-specific).",
          "Due Diligence — researching and understanding risks before acting.",
          "Due Care — taking reasonable action to address known risks (the 'prudent person' rule).",
          "Security Policy: high-level management directives (mandatory).",
          "Standards: mandatory specific requirements derived from policies.",
          "Baselines: minimum acceptable security configuration.",
          "Guidelines: recommended (non-mandatory) actions.",
          "Procedures: step-by-step instructions for specific tasks."
        ]
      },
      {
        title: "Legal, Regulatory & Compliance",
        points: [
          "GDPR — EU regulation protecting personal data; requires lawful basis for processing, right to erasure, breach notification within 72 hours.",
          "HIPAA — U.S. law protecting Protected Health Information (PHI); Security Rule, Privacy Rule, Breach Notification Rule.",
          "SOX (Sarbanes-Oxley) — U.S. law requiring financial reporting controls and audit trails.",
          "PCI-DSS — Payment Card Industry standard for cardholder data protection (12 requirements).",
          "FISMA — U.S. Federal Information Security Modernization Act; requires NIST RMF for federal agencies.",
          "Computer Fraud and Abuse Act (CFAA) — U.S. federal law on unauthorized computer access.",
          "DMCA — Digital Millennium Copyright Act; governs digital copyright protection.",
          "Privacy Shield (invalidated) → replaced by Standard Contractual Clauses (SCCs) and adequacy decisions for EU-US data transfers.",
          "Criminal law: beyond reasonable doubt. Civil law: preponderance of evidence.",
          "Safe harbor: provisions protecting entities from liability under certain conditions."
        ]
      },
      {
        title: "Business Continuity & Disaster Recovery",
        points: [
          "BCP (Business Continuity Plan) — keeps business functions running during/after a disruption.",
          "DRP (Disaster Recovery Plan) — restores IT systems after a disaster; a subset of BCP.",
          "BIA (Business Impact Analysis) — identifies critical functions and acceptable downtime.",
          "Maximum Tolerable Downtime (MTD) — longest outage an organization can survive.",
          "Recovery Time Objective (RTO) — target time to restore systems after disruption.",
          "Recovery Point Objective (RPO) — maximum acceptable data loss (measured in time).",
          "RTO and RPO must always be less than MTD.",
          "Work Recovery Time (WRT) — time to restore data and verify system integrity after RTO.",
          "MTD = RTO + WRT.",
          "Hot site: fully operational duplicate facility; fastest recovery.",
          "Warm site: partially configured; moderate cost and recovery time.",
          "Cold site: empty space with utilities; cheapest but slowest to activate.",
          "Reciprocal agreement: two organizations agree to host each other's operations.",
          "BCP testing types: checklist review, structured walk-through, tabletop exercise, simulation, parallel test, full interruption test."
        ]
      },
      {
        title: "Personnel Security",
        points: [
          "Background checks, reference checks, and security clearances before hiring.",
          "Separation of duties prevents fraud and errors by splitting critical tasks.",
          "Job rotation reduces risk of fraud and provides cross-training.",
          "Mandatory vacation (forced leave) helps detect ongoing fraud.",
          "Least privilege: minimum access needed to perform job function.",
          "Need to know: access limited to information required for specific tasks.",
          "NDA (Non-Disclosure Agreement) — legally binding confidentiality agreement.",
          "Acceptable Use Policy (AUP) — defines permitted use of company resources.",
          "Security awareness training is the most cost-effective security control.",
          "Termination procedures: exit interview, account revocation, badge collection, knowledge transfer.",
          "Insider threats are the greatest risk to most organizations."
        ]
      },
      {
        title: "(ISC)² Code of Ethics",
        points: [
          "Protect society, the common good, necessary public trust and confidence, and the infrastructure.",
          "Act honorably, honestly, justly, responsibly, and legally.",
          "Provide diligent and competent service to principals.",
          "Advance and protect the profession.",
          "Canons are listed in priority order — societal good comes before client interest.",
          "Ethical decision making: when in doubt, choose the option that protects the most people."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // D2 – Asset Security
  // ─────────────────────────────────────────────────────────────────────
  {
    domain: "asset_security", num: "D2",
    label: "Asset Security",
    topics: [
      {
        title: "Data Classification",
        points: [
          "Government classification levels (U.S.): Top Secret, Secret, Confidential, Unclassified.",
          "Commercial classification levels: Confidential/Proprietary, Private, Sensitive, Public.",
          "Classification is assigned by the data owner based on sensitivity and business impact.",
          "Data is classified at the highest level of sensitivity it contains.",
          "Reclassification and declassification procedures must be defined in policy.",
          "The more sensitive the data, the more controls required — and the higher the cost.",
          "Compartmentalization limits access within the same classification level (need-to-know)."
        ]
      },
      {
        title: "Asset Ownership & Roles",
        points: [
          "Data Owner — management level; responsible for classification, policy, and overall data protection.",
          "Data Custodian — IT/operational level; responsible for day-to-day protection (backups, access controls).",
          "Data User — individual who accesses data to perform job duties.",
          "Data Controller (GDPR) — determines the purpose and means of processing personal data.",
          "Data Processor (GDPR) — processes data on behalf of the controller.",
          "Data Steward — maintains data quality and metadata.",
          "System Owner — responsible for a specific information system (may differ from data owner).",
          "The owner defines policy; the custodian implements it."
        ]
      },
      {
        title: "Data States & Lifecycle",
        points: [
          "Data at Rest — stored data (databases, file servers, backups); protect with encryption at rest (AES-256).",
          "Data in Transit — data moving across a network; protect with TLS, IPSec, VPN.",
          "Data in Use — data being processed in memory; hardest to protect; protect with secure enclaves, DRM.",
          "Data Lifecycle: Create → Store → Use → Share → Archive → Destroy.",
          "Retention policy defines how long data must be kept before destruction.",
          "Legal holds supersede normal retention schedules.",
          "DRM (Digital Rights Management) — enforces usage rights on digital content."
        ]
      },
      {
        title: "Data Retention & Secure Destruction",
        points: [
          "Data remanence — residual data remaining after deletion or formatting.",
          "Overwriting — writing 0s/1s over data; effective for most magnetic media (DoD 5220.22-M).",
          "Degaussing — exposing media to a strong magnetic field; erases magnetic media; does NOT work on SSDs or optical media.",
          "Physical destruction — shredding, incineration, pulverizing; most secure method; required for highly classified data.",
          "Cryptographic erasure — destroying encryption keys makes ciphertext unrecoverable.",
          "Spare sectors, bad sectors, and SSD overprovisioned areas may not be cleared by standard wipes → use vendor secure erase or physical destruction.",
          "Data retention violations can result in regulatory fines and legal liability.",
          "NIST SP 800-88 — Guidelines for Media Sanitization."
        ]
      },
      {
        title: "Privacy Principles & Regulations",
        points: [
          "PII (Personally Identifiable Information) — any data that can identify an individual.",
          "PHI (Protected Health Information) — health data protected under HIPAA.",
          "Privacy by Design — embedding privacy into system design from the start.",
          "Data minimization — collect only the minimum data necessary.",
          "Purpose limitation — data collected for one purpose should not be used for another.",
          "Consent — individuals must agree to data collection and processing (GDPR requirement).",
          "Right to Erasure ('Right to be Forgotten') — individuals can request deletion of their data.",
          "Breach notification — GDPR requires notification within 72 hours; HIPAA within 60 days.",
          "OECD Privacy Principles: Collection Limitation, Data Quality, Purpose Specification, Use Limitation, Security Safeguards, Openness, Individual Participation, Accountability."
        ]
      },
      {
        title: "Data Security Controls & Scoping",
        points: [
          "Scoping — determining which security controls apply to a specific environment.",
          "Tailoring — modifying baseline controls to fit organizational needs.",
          "Compensating controls — alternative controls when standard controls cannot be implemented.",
          "Data Loss Prevention (DLP) — tools that monitor, detect, and block sensitive data exfiltration.",
          "Cloud data security: understand shared responsibility model — provider secures infrastructure; customer secures data.",
          "Tokenization — replacing sensitive data with a non-sensitive placeholder (token); used in payment systems.",
          "Data masking / obfuscation — replacing real data with fictional but realistic data for testing.",
          "Anonymization — removing all PII so individuals cannot be re-identified.",
          "Pseudonymization — replacing direct identifiers with pseudonyms; re-identification possible with key."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // D3 – Security Architecture and Engineering
  // ─────────────────────────────────────────────────────────────────────
  {
    domain: "security_architecture_engineering", num: "D3",
    label: "Security Architecture and Engineering",
    topics: [
      {
        title: "Formal Security Models",
        points: [
          "Bell-LaPadula (BLP) — focuses on CONFIDENTIALITY. 'No read up' (Simple Security Property) — subject cannot read data at higher classification. 'No write down' (*-Security Property) — subject cannot write to lower classification.",
          "Biba — focuses on INTEGRITY. 'No read down' (Simple Integrity Property) — subject cannot read lower-integrity data. 'No write up' (*-Integrity Property) — subject cannot write to higher-integrity level.",
          "Clark-Wilson — enforces integrity via well-formed transactions and separation of duties; uses CDIs (Constrained Data Items), UDIs, TPs (Transformation Procedures), and IVPs (Integrity Verification Procedures).",
          "Brewer-Nash (Chinese Wall) — prevents conflicts of interest; once you access data for one client, you're blocked from competing client data.",
          "Graham-Denning — defines eight protection rules for objects and subjects.",
          "Take-Grant model — uses a directed graph to define rights transfer between subjects.",
          "Lattice-based model — defines upper/lower bounds for access; used in MLS systems."
        ]
      },
      {
        title: "Trusted Computing Base & Security Architecture",
        points: [
          "Trusted Computing Base (TCB) — the totality of protection mechanisms (hardware, software, firmware) that enforce a security policy.",
          "Security Kernel — the hardware, firmware, and software that implement the reference monitor.",
          "Reference Monitor — abstract concept of access validation between every subject and object.",
          "Reference Validation Mechanism — implementation of the reference monitor; must be tamper-proof, always invoked, and verifiable.",
          "Trusted Path — secure communication channel between user and TCB.",
          "Assurance — confidence that a system enforces its security policy; gained through design, testing, and verification.",
          "Security Perimeter — boundary separating TCB from the rest of the system.",
          "Open vs Closed Systems: Open uses published standards (interoperable); Closed uses proprietary protocols.",
          "TCSEC (Orange Book) — U.S. DoD standard; ratings from D (minimal) to A1 (verified design).",
          "ITSEC — European equivalent of TCSEC.",
          "Common Criteria (CC) / ISO 15408 — international evaluation standard; defines EAL1–EAL7 assurance levels.",
          "Protection Profile (PP) — implementation-independent security requirements for a class of product.",
          "Security Target (ST) — vendor's claims about security properties of their specific product."
        ]
      },
      {
        title: "Cryptography Fundamentals",
        points: [
          "Symmetric encryption — same key for encrypt/decrypt; fast; key distribution is the challenge. Examples: DES (56-bit, broken), 3DES (168-bit, deprecated), AES (128/192/256-bit, current standard), Blowfish, RC4.",
          "Asymmetric encryption — different public/private key pair; solves key distribution; slower. Examples: RSA, ECC, Diffie-Hellman, El Gamal.",
          "Hybrid encryption — uses asymmetric to exchange symmetric session key; used in TLS/SSL.",
          "Confidentiality: encrypt with recipient's PUBLIC key; decrypt with recipient's PRIVATE key.",
          "Authentication/Non-repudiation: sign with sender's PRIVATE key; verify with sender's PUBLIC key.",
          "Hash functions — one-way; fixed output (digest). MD5: 128-bit (broken). SHA-1: 160-bit (deprecated). SHA-256/SHA-3: current standard.",
          "HMAC — hash-based message authentication code; provides integrity and authentication (uses shared secret).",
          "Digital signature — hash of message encrypted with sender's private key; provides integrity, authentication, non-repudiation.",
          "Key escrow — third party holds a copy of the encryption key.",
          "Diffie-Hellman — key exchange protocol; allows two parties to establish a shared secret over an insecure channel; vulnerable to MITM without authentication.",
          "ECC (Elliptic Curve Cryptography) — provides equivalent security to RSA with smaller key sizes; preferred for mobile/IoT.",
          "Steganography — hiding data within another file (image, audio); provides obscurity, not true confidentiality.",
          "Key stretching algorithms: PBKDF2, bcrypt, scrypt — increase computational cost of brute-force attacks against passwords."
        ]
      },
      {
        title: "Public Key Infrastructure (PKI)",
        points: [
          "PKI — framework for managing digital certificates and public-key encryption.",
          "Certificate Authority (CA) — trusted entity that issues and signs digital certificates.",
          "Registration Authority (RA) — verifies identity of certificate requesters; offloads work from CA.",
          "Certificate Revocation List (CRL) — published list of revoked certificates; checked periodically.",
          "OCSP (Online Certificate Status Protocol) — real-time certificate revocation checking.",
          "X.509 — standard format for public key certificates.",
          "Certificate Pinning — hardcoding the expected certificate into an application.",
          "Trust hierarchy: Root CA → Intermediate CA → End-entity certificate.",
          "Cross-certification — two CAs mutually trust each other.",
          "Web of Trust (PGP model) — decentralized; users vouch for each other's keys.",
          "Certificate lifecycle: Request → Verification → Issuance → Use → Renewal/Revocation → Destruction."
        ]
      },
      {
        title: "Physical Security",
        points: [
          "Crime Prevention Through Environmental Design (CPTED) — using physical environment to reduce crime.",
          "Defense in depth layers: Perimeter → Exterior → Interior → Target.",
          "Fencing: 3–4 ft deters casual intruders; 6–7 ft too high to easily climb; 8 ft + barbed wire deters determined intruders.",
          "Lighting — the most cost-effective physical deterrent.",
          "TEMPEST — standard for controlling electromagnetic emanations from electronic equipment; Faraday cage blocks EM signals.",
          "EMI (Electromagnetic Interference) shielding prevents eavesdropping via radiation.",
          "Mantrap (airlock) — two-door entry; ensures only one person enters at a time; prevents tailgating.",
          "Motion detectors: photoelectric (light beam), ultrasonic (sound), microwave (radar), passive infrared (PIR — heat).",
          "HVAC controls — temperature 60–75°F (15–23°C); humidity 40–60% to prevent static and corrosion.",
          "Data center physical security: raised floors, halon/FM-200/CO2 suppression, hot/cold aisle containment.",
          "Fire suppression: Class A (ordinary), B (flammable liquids), C (electrical), D (metals).",
          "Halon alternatives: FM-200 (HFC-227ea), CO2 (evacuate before use), INERGEN."
        ]
      },
      {
        title: "Cloud & Virtualization Security",
        points: [
          "Cloud service models: IaaS (infrastructure), PaaS (platform), SaaS (software).",
          "Shared Responsibility Model: provider manages physical/network security; customer manages data, identity, application security.",
          "Cloud deployment models: Public, Private, Hybrid, Community.",
          "Hypervisor Types: Type 1 (bare-metal, runs directly on hardware — VMware ESXi, Hyper-V); Type 2 (hosted, runs on OS — VirtualBox, VMware Workstation).",
          "VM Escape — attacker breaks out of a VM to access the hypervisor or other VMs; most serious virtualization threat.",
          "Elasticity — ability to scale resources up/down dynamically.",
          "Multi-tenancy — multiple customers share underlying infrastructure; isolation is critical.",
          "CASB (Cloud Access Security Broker) — enforces security policies between cloud users and providers.",
          "FedRAMP — U.S. government program for authorizing cloud services.",
          "CSA STAR — Cloud Security Alliance certification for cloud providers.",
          "Side-channel attacks — exploit physical implementation (power consumption, timing, electromagnetic); not prevented by logical controls."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // D4 – Communication and Network Security
  // ─────────────────────────────────────────────────────────────────────
  {
    domain: "communication_network_security", num: "D4",
    label: "Communication and Network Security",
    topics: [
      {
        title: "OSI & TCP/IP Models",
        points: [
          "OSI Layer 7 — Application: HTTP, FTP, DNS, SMTP, SNMP.",
          "OSI Layer 6 — Presentation: encryption, compression, format translation (SSL lives here conceptually).",
          "OSI Layer 5 — Session: establishes, manages, terminates sessions (NetBIOS, RPC).",
          "OSI Layer 4 — Transport: end-to-end delivery, segmentation. TCP (reliable), UDP (unreliable). Ports live here.",
          "OSI Layer 3 — Network: routing, logical addressing (IP). Devices: routers, Layer 3 switches.",
          "OSI Layer 2 — Data Link: MAC addresses, framing. Devices: switches, bridges. Protocols: ARP, PPP, 802.11.",
          "OSI Layer 1 — Physical: bits on wire; cables, hubs, repeaters.",
          "TCP/IP Model: Application → Transport → Internet → Network Access (Link).",
          "TCP Handshake: SYN → SYN-ACK → ACK (3-way). Teardown: FIN → FIN-ACK → ACK.",
          "IP addresses: IPv4 = 32-bit; IPv6 = 128-bit (also adds built-in IPSec, auto-configuration).",
          "Private IPv4 ranges: 10.x.x.x, 172.16–31.x.x, 192.168.x.x.",
          "CIDR notation: /24 = 256 addresses, /25 = 128, /16 = 65,536."
        ]
      },
      {
        title: "Key Network Protocols & Services",
        points: [
          "DNS (UDP/TCP 53) — resolves domain names to IPs; DNSSEC adds digital signatures to prevent cache poisoning.",
          "DHCP (UDP 67/68) — auto-assigns IP addresses; rogue DHCP attacks can redirect traffic.",
          "HTTP (TCP 80) / HTTPS (TCP 443) — web traffic; HTTPS uses TLS for encryption.",
          "FTP (TCP 20/21) — insecure file transfer; replace with SFTP (SSH, TCP 22) or FTPS (FTP over TLS).",
          "SSH (TCP 22) — secure remote shell; replaces Telnet (TCP 23, insecure).",
          "SMTP (TCP 25) — email sending; SMTPS uses TLS on port 465 or STARTTLS on 587.",
          "SNMP (UDP 161) — network device management; v1/v2 send community strings in clear text; SNMPv3 adds auth and encryption.",
          "LDAP (TCP 389) — directory services; LDAPS (TCP 636) uses TLS.",
          "Kerberos (TCP/UDP 88) — network authentication protocol; uses tickets and KDC.",
          "NTP (UDP 123) — time synchronization; critical for log correlation and Kerberos authentication.",
          "BGP (TCP 179) — internet routing protocol; BGP hijacking can redirect internet traffic.",
          "ICMP — ping and traceroute; can be used for reconnaissance or covert channels."
        ]
      },
      {
        title: "Network Devices & Security Components",
        points: [
          "Hub — broadcasts to all ports; creates collision domain; no security.",
          "Switch — forwards frames based on MAC address; creates separate collision domains; vulnerable to MAC flooding.",
          "Router — forwards packets based on IP address; connects different networks; primary tool for network segmentation.",
          "Firewall — filters traffic based on rules; types: packet filter, stateful inspection, application layer (proxy), NGFW.",
          "Stateful firewall — tracks connection state (established, related); smarter than simple packet filtering.",
          "WAF (Web Application Firewall) — filters HTTP/HTTPS traffic; protects against SQLi, XSS.",
          "IDS (Intrusion Detection System) — passive; detects and alerts. IPS (Intrusion Prevention System) — active; detects and blocks.",
          "NIDS/NIPS — network-based; monitors network traffic.",
          "HIDS/HIPS — host-based; monitors system calls, logs, file integrity.",
          "Proxy server — intermediates client requests; forward proxy hides client; reverse proxy hides server.",
          "Honeypot — decoy system to attract and study attackers.",
          "NAT (Network Address Translation) — hides internal IP addresses; breaks end-to-end connectivity.",
          "VLANs — logical network segmentation on switches; VLAN hopping attacks include switch spoofing and double-tagging."
        ]
      },
      {
        title: "Wireless Security",
        points: [
          "WEP (Wired Equivalent Privacy) — broken; uses RC4 with weak IV (24-bit); do not use.",
          "WPA (Wi-Fi Protected Access) — interim fix; uses TKIP; also deprecated.",
          "WPA2 — current standard; uses AES-CCMP; Personal (PSK) vs Enterprise (802.1X/RADIUS).",
          "WPA3 — latest standard; uses SAE (Simultaneous Authentication of Equals); prevents offline dictionary attacks.",
          "802.1X — port-based network access control; requires authentication before network access.",
          "EAP variants: EAP-TLS (certificates, most secure), PEAP (password + server cert), EAP-FAST, LEAP (Cisco, broken).",
          "Evil Twin attack — rogue AP mimics a legitimate AP to capture credentials.",
          "War driving — searching for open wireless networks from a vehicle.",
          "SSID hiding — obscurity, not real security; still discoverable via probe requests.",
          "MAC address filtering — easily bypassed by MAC spoofing.",
          "Bluetooth threats: Bluejacking (spam), Bluesnarfing (data theft), Bluebugging (full device control).",
          "WPS (Wi-Fi Protected Setup) — PIN brute-force vulnerability; disable it."
        ]
      },
      {
        title: "VPN & Tunneling",
        points: [
          "VPN — creates encrypted tunnel over untrusted network.",
          "IPSec — Layer 3 VPN; two modes: Transport (encrypts payload only) and Tunnel (encrypts entire packet).",
          "IPSec protocols: AH (Authentication Header — integrity/auth, no encryption); ESP (Encapsulating Security Payload — integrity, auth, AND encryption).",
          "IKE (Internet Key Exchange) — negotiates IPSec security associations (SAs).",
          "SSL/TLS VPN — Layer 7; uses browser or thin client; easier to deploy through firewalls (port 443).",
          "Split tunneling — only traffic for the corporate network goes through VPN; rest goes direct.",
          "PPTP — outdated, broken; uses MPPE for weak encryption.",
          "L2TP/IPSec — Layer 2 tunneling with IPSec for encryption; more secure.",
          "Full-tunnel VPN — all traffic routed through VPN; more secure but higher overhead.",
          "Site-to-site VPN — connects two networks permanently.",
          "Client-to-site VPN — connects individual users to the corporate network."
        ]
      },
      {
        title: "Network Attacks & Countermeasures",
        points: [
          "DoS (Denial of Service) — overwhelms a system with traffic; single source.",
          "DDoS (Distributed DoS) — attack from many sources (botnet); harder to block.",
          "SYN Flood — sends many SYN packets without completing handshake; fills connection table. Counter: SYN cookies.",
          "Smurf attack — spoofed ICMP echo to broadcast address; amplifies traffic against victim.",
          "Ping of Death — oversized ICMP packet causes buffer overflow (historical).",
          "Teardrop attack — sends overlapping fragmented packets; confuses reassembly.",
          "Man-in-the-Middle (MITM) — attacker intercepts communication between two parties. Counter: TLS, mutual auth, certificate pinning.",
          "ARP Poisoning — sends fake ARP replies to associate attacker's MAC with a legitimate IP. Counter: dynamic ARP inspection (DAI), static ARP entries.",
          "DNS Poisoning / Cache Poisoning — inserts fake DNS records to redirect traffic. Counter: DNSSEC.",
          "IP Spoofing — forges source IP address. Counter: ingress/egress filtering (BCP38).",
          "Session Hijacking — steals a valid session token after authentication. Counter: TLS, HSTS, secure cookies.",
          "CAM Table Flooding — overwhelms switch's MAC table, forcing it to broadcast all traffic. Counter: port security (limit MACs per port).",
          "VLAN Hopping — accessing VLANs you're not authorized for. Counter: disable auto trunking (DTP), native VLAN tagging."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // D5 – Identity and Access Management
  // ─────────────────────────────────────────────────────────────────────
  {
    domain: "identity_access_management", num: "D5",
    label: "Identity and Access Management",
    topics: [
      {
        title: "Identity, Authentication & Authorization",
        points: [
          "Identification — claiming an identity (username, card number); no proof required.",
          "Authentication — proving the claimed identity (password, certificate, biometric).",
          "Authorization — determining what an authenticated identity is allowed to do.",
          "Accounting / Auditing — tracking what authenticated users did (logs, trails).",
          "Identity lifecycle: Provisioning → Review → Modification → De-provisioning.",
          "Orphan accounts — accounts of employees who have left; major security risk.",
          "Account recertification (access review) — periodic review to ensure access is still appropriate.",
          "Privileged accounts — admin accounts requiring extra controls (MFA, PAM, just-in-time access)."
        ]
      },
      {
        title: "Authentication Factors",
        points: [
          "Type 1 — Something you KNOW: password, PIN, passphrase, security question.",
          "Type 2 — Something you HAVE: smart card, hardware token, mobile OTP, certificate.",
          "Type 3 — Something you ARE: biometrics (fingerprint, iris, retina, voice, face).",
          "Type 4 (emerging) — Somewhere you ARE: geolocation, GPS.",
          "Type 5 (emerging) — Something you DO: behavioral biometrics (typing rhythm, gait).",
          "MFA (Multi-Factor Authentication) — two or more different factor types required.",
          "OTP (One-Time Password): HOTP (event-based, HMAC-based) vs TOTP (time-based, 30-sec window).",
          "Knowledge-Based Authentication (KBA) — security questions; vulnerable to social engineering.",
          "Passwordless authentication — FIDO2/WebAuthn standard using passkeys."
        ]
      },
      {
        title: "Biometric Systems",
        points: [
          "False Rejection Rate (FRR) / Type I error — legitimate user rejected; affects usability.",
          "False Acceptance Rate (FAR) / Type II error — impostor accepted; affects security.",
          "Crossover Error Rate (CER) / Equal Error Rate (EER) — point where FRR = FAR; lower CER = better system.",
          "Fingerprint scanning — most common biometric; high accuracy; can be fooled by lifted prints.",
          "Retina scan — most accurate but intrusive; scans blood vessel pattern behind the eye.",
          "Iris scan — less intrusive; scans colored part of eye; high accuracy.",
          "Voice recognition — least accurate; affected by illness, background noise.",
          "Facial recognition — improving; susceptible to photos/masks in some systems.",
          "Biometric data is immutable — if compromised, cannot be changed unlike a password."
        ]
      },
      {
        title: "Access Control Models",
        points: [
          "DAC (Discretionary Access Control) — owner decides who can access; implemented via ACLs; flexible but risky (Trojan horse threat).",
          "MAC (Mandatory Access Control) — OS enforces access based on labels/clearances; used in high-security environments (military); inflexible.",
          "RBAC (Role-Based Access Control) — access based on job role; most common in enterprise.",
          "Rule-Based Access Control — access based on rules applied to all users (firewall ACLs).",
          "ABAC (Attribute-Based Access Control) — access based on attributes of user, resource, and environment; most granular and flexible.",
          "RBAC vs ABAC: RBAC uses roles (who you are); ABAC uses attributes (who you are + what resource + when + where).",
          "Access control matrix — table of subjects × objects × permissions.",
          "Capability table — subject-centric view of access rights.",
          "ACL (Access Control List) — object-centric view of access rights; attached to the object."
        ]
      },
      {
        title: "Identity Federation & SSO",
        points: [
          "SSO (Single Sign-On) — authenticate once, access multiple systems; reduces password fatigue.",
          "Kerberos — ticket-based SSO protocol; KDC issues TGT (Ticket-Granting Ticket); tickets have timestamps (requires NTP).",
          "Kerberos components: KDC (Key Distribution Center), AS (Authentication Service), TGS (Ticket Granting Service).",
          "SAML (Security Assertion Markup Language) — XML-based; used for web SSO between IdP and SP.",
          "SAML roles: Identity Provider (IdP) — authenticates users; Service Provider (SP) — provides service.",
          "OAuth 2.0 — authorization framework; grants limited access to resources without sharing credentials (delegated authorization).",
          "OpenID Connect (OIDC) — authentication layer on top of OAuth 2.0; provides ID token (JWT).",
          "JWT (JSON Web Token) — compact, URL-safe token format; header.payload.signature.",
          "SCIM (System for Cross-domain Identity Management) — automates user provisioning.",
          "LDAP — directory protocol for querying/modifying directory services (e.g., Active Directory).",
          "RADIUS — AAA protocol; used for VPN and Wi-Fi authentication; UDP.",
          "TACACS+ — Cisco proprietary AAA; TCP; encrypts entire packet (RADIUS only encrypts password)."
        ]
      },
      {
        title: "Privileged Access Management",
        points: [
          "PAM (Privileged Access Management) — controls, monitors, and audits privileged account usage.",
          "Just-In-Time (JIT) access — grant elevated privileges only when needed, automatically revoke after.",
          "Privileged Identity Management (PIM) — manages privileged accounts in Azure AD / enterprise environments.",
          "Principle of least privilege — applies especially to admin accounts.",
          "Admin accounts should not be used for day-to-day tasks; use standard accounts for routine work.",
          "Credential vaulting — stores privileged credentials in a secure vault; users check out credentials.",
          "Session recording — records all privileged user sessions for audit and forensic purposes.",
          "Pass-the-Hash attack — stealing NTLM hash and using it for authentication without knowing the password.",
          "Golden Ticket attack (Kerberos) — forging Kerberos TGT using stolen KRBTGT hash; gives persistent admin access.",
          "Mitigation: use dedicated PAM solutions, enforce MFA for all privileged access, monitor for anomalous admin activity."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // D6 – Security Assessment and Testing
  // ─────────────────────────────────────────────────────────────────────
  {
    domain: "security_assessment_testing", num: "D6",
    label: "Security Assessment and Testing",
    topics: [
      {
        title: "Vulnerability Assessment vs Penetration Testing",
        points: [
          "Vulnerability Assessment — identifies and prioritizes vulnerabilities; does NOT exploit them. Produces a list of findings.",
          "Penetration Test — attempts to exploit vulnerabilities to determine actual impact; simulates real attacker.",
          "Bug Bounty Program — incentivizes external researchers to responsibly disclose vulnerabilities.",
          "Pen Test phases: Reconnaissance → Scanning → Exploitation → Post-exploitation → Reporting.",
          "Black Box — tester has no prior knowledge of target (simulates external attacker).",
          "White Box — tester has full knowledge (source code, architecture); most thorough.",
          "Gray Box — partial knowledge (credentials, some documentation); most common.",
          "Rules of Engagement (ROE) — defines scope, constraints, and authorization for the test. MUST be obtained before testing.",
          "Passive reconnaissance — OSINT, WHOIS, DNS lookups; no direct target interaction.",
          "Active reconnaissance — port scanning, banner grabbing; direct target interaction.",
          "Always get written authorization before any penetration testing activity."
        ]
      },
      {
        title: "Testing Types & Methodologies",
        points: [
          "OWASP Top 10 (2021): Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable and Outdated Components, Identification and Authentication Failures, Software and Data Integrity Failures, Security Logging Failures, SSRF.",
          "SQL Injection — attacker inserts SQL code into input fields to manipulate database queries.",
          "Cross-Site Scripting (XSS) — injecting malicious scripts into web pages viewed by other users.",
          "CSRF (Cross-Site Request Forgery) — tricks authenticated users into submitting unintended requests.",
          "Fuzz testing (Fuzzing) — sending random/malformed inputs to find crashes or unexpected behavior.",
          "Regression testing — ensures new changes don't break existing functionality.",
          "Code review — manual or automated examination of source code for vulnerabilities.",
          "War dialing — scanning phone numbers for modems (historical); war driving for WiFi.",
          "Social engineering testing: phishing simulations, vishing, physical access attempts.",
          "Red team (attackers) vs Blue team (defenders) vs Purple team (collaborative)."
        ]
      },
      {
        title: "Audit Standards & Reports",
        points: [
          "SSAE 18 (SOC reports) — replaced SAS 70 in 2017.",
          "SOC 1 — internal controls over financial reporting; for financial auditors.",
          "SOC 2 — security, availability, processing integrity, confidentiality, and privacy (Trust Services Criteria).",
          "SOC 2 Type I — controls are suitably designed at a point in time.",
          "SOC 2 Type II — controls are suitably designed AND operating effectively over a period (typically 6–12 months); most valuable.",
          "SOC 3 — public summary of SOC 2; no detailed control testing.",
          "ISO 27001 audit — certifies that an ISMS meets international standard; requires independent auditor.",
          "PCI-DSS assessment: SAQ (Self-Assessment Questionnaire) for smaller merchants; QSA (Qualified Security Assessor) for larger merchants.",
          "FedRAMP Authorization: 3PAO (Third Party Assessment Organization) performs assessment.",
          "FISMA compliance requires annual assessments of federal information systems."
        ]
      },
      {
        title: "Software Testing Techniques",
        points: [
          "Unit testing — tests individual functions/modules in isolation.",
          "Integration testing — tests how modules work together.",
          "System testing — tests the complete integrated system.",
          "User Acceptance Testing (UAT) — end users verify the system meets requirements.",
          "Regression testing — re-tests after changes to ensure nothing is broken.",
          "SAST (Static Application Security Testing) — analyzes source code without running it (white box).",
          "DAST (Dynamic Application Security Testing) — tests running application from outside (black box).",
          "IAST (Interactive AST) — combines SAST and DAST; uses agents inside the running application.",
          "RASP (Runtime Application Self-Protection) — embedded protection that detects/blocks attacks in real time.",
          "Misuse case testing — designs tests based on how attackers would misuse the system.",
          "Mutation testing — introduces small code changes to verify tests can detect them.",
          "Interface testing — tests APIs, GUIs, and physical interfaces for security weaknesses."
        ]
      },
      {
        title: "Security Metrics & KPIs",
        points: [
          "MTTD (Mean Time to Detect) — average time from incident occurrence to detection; lower is better.",
          "MTTR (Mean Time to Respond/Repair) — average time to contain and remediate an incident.",
          "MTTF (Mean Time to Failure) — average operating time before a non-repairable system fails.",
          "MTBF (Mean Time Between Failures) — average time between failures for repairable systems.",
          "Availability = MTBF / (MTBF + MTTR). Five nines (99.999%) = ~5.26 minutes downtime/year.",
          "Patch management metrics: time to patch, percentage of systems patched, number of known unpatched vulnerabilities.",
          "Security awareness metrics: phishing simulation click rates, training completion rates.",
          "KRI (Key Risk Indicator) — early warning of increasing risk exposure.",
          "KPI (Key Performance Indicator) — measures effectiveness of security controls.",
          "Vulnerability scan frequency: critical systems should be scanned at least weekly."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // D7 – Security Operations
  // ─────────────────────────────────────────────────────────────────────
  {
    domain: "security_operations", num: "D7",
    label: "Security Operations",
    topics: [
      {
        title: "Incident Response",
        points: [
          "NIST SP 800-61 IR phases: Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity.",
          "SANS IR phases: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned.",
          "Preparation — the most important phase; includes policies, tools, training, and communication plans.",
          "Containment strategies: short-term (isolate system) vs long-term (rebuild/patch).",
          "Eradication — remove root cause (malware, accounts, vulnerabilities).",
          "Recovery — restore systems to normal operation; verify functionality before reconnecting.",
          "Lessons Learned (Post-Incident Review) — held within days; identifies what worked, what didn't, and improvements.",
          "Incident categorization: false positive, near miss, precursor, indicator, incident.",
          "CIRT (Computer Incident Response Team) / CSIRT — dedicated team for handling incidents.",
          "Escalation procedures — when to involve management, legal, law enforcement.",
          "Evidence must be preserved for potential legal proceedings — do not modify original evidence."
        ]
      },
      {
        title: "Digital Forensics",
        points: [
          "Order of Volatility (most to least volatile): CPU registers/cache → RAM → Swap/page file → Network connections → Running processes → Disk → Optical/removable media → Backups.",
          "Collect most volatile evidence first.",
          "Chain of Custody — documented record of who handled evidence, when, and how; must be maintained throughout.",
          "Locard's Exchange Principle — every contact leaves a trace.",
          "Forensic image — bit-for-bit copy of storage media; use write blockers to prevent modification.",
          "Hash verification — MD5/SHA-1/SHA-256 hash of image must match original to prove integrity.",
          "Network forensics — analyzing network traffic logs, PCAP files, NetFlow data.",
          "Anti-forensics techniques: data wiping, timestamp manipulation, steganography, encryption.",
          "Legal hold — obligation to preserve relevant data for litigation; overrides normal retention/deletion policies.",
          "eDiscovery — electronic discovery of data for legal proceedings.",
          "ACPO Principles (UK) — four principles for handling digital evidence in law enforcement."
        ]
      },
      {
        title: "Backup & Recovery",
        points: [
          "Full backup — copies ALL data every time; longest to perform but fastest to restore.",
          "Incremental backup — copies only data changed since the LAST backup (full or incremental); fastest to back up but slowest to restore (need full + all incrementals).",
          "Differential backup — copies only data changed since the LAST FULL backup; slower to back up than incremental but faster to restore (need full + last differential).",
          "3-2-1 Backup Rule: 3 copies, on 2 different media types, with 1 offsite copy.",
          "RTO (Recovery Time Objective) — maximum acceptable time to restore a system.",
          "RPO (Recovery Point Objective) — maximum acceptable data loss measured in time.",
          "Backup media rotation schemes: Grandfather-Father-Son (GFS), Tower of Hanoi.",
          "Tape rotation — move backup tapes offsite to protect against site disasters.",
          "Backup testing — periodically restore from backup to verify integrity (untested backups are unreliable).",
          "Cloud backup — offsite; consider encryption in transit and at rest, and access controls."
        ]
      },
      {
        title: "Disaster Recovery",
        points: [
          "Hot site — fully operational mirror site; immediate failover; most expensive.",
          "Warm site — partially configured; equipment present but data restoration required; moderate cost and recovery time.",
          "Cold site — empty facility with utilities; all equipment must be sourced; cheapest; slowest (days to weeks).",
          "Mobile site — self-contained trailer with equipment; can be deployed to disaster location.",
          "Reciprocal site agreement — two organizations agree to host each other during disasters; lowest cost but may not have capacity.",
          "Redundant Array of Inexpensive Disks (RAID): RAID 0 (striping, no redundancy); RAID 1 (mirroring); RAID 5 (striping with parity, survives 1 drive failure); RAID 6 (survives 2 failures); RAID 10 (1+0, mirrored stripes).",
          "Clustering — multiple servers act as one for high availability; automatic failover.",
          "Load balancing — distributes traffic across multiple servers for performance and availability.",
          "Failover testing — regularly test recovery procedures; a plan never tested is a plan that won't work.",
          "DR vs BC: DR focuses on restoring IT systems; BCP focuses on keeping business functions running."
        ]
      },
      {
        title: "Change & Configuration Management",
        points: [
          "Change Management — formal process for requesting, reviewing, approving, implementing, and reviewing changes to IT systems.",
          "Change Advisory Board (CAB) — committee that reviews and approves change requests.",
          "Emergency Change — expedited approval for urgent changes; reviewed after implementation.",
          "Configuration Management — maintaining a known good baseline configuration for all systems.",
          "CMDB (Configuration Management Database) — central repository of configuration items (CIs) and their relationships.",
          "Baseline configuration — approved standard configuration for a system type.",
          "Patch management — process for identifying, testing, and deploying security patches.",
          "Vulnerability disclosure timeline: vendor notified → fix developed → patch released → public disclosure (typically 90 days).",
          "Zero-day vulnerability — exploited before vendor is aware or patch exists.",
          "Hardening — removing unnecessary services, changing defaults, applying patches, implementing security controls.",
          "CIS Benchmarks and DISA STIGs provide hardening guidance for specific platforms."
        ]
      },
      {
        title: "Monitoring & SOC Operations",
        points: [
          "SIEM (Security Information and Event Management) — aggregates, correlates, and analyzes log data from multiple sources in real time.",
          "SOC (Security Operations Center) — centralized team monitoring and responding to security events.",
          "Continuous monitoring — ongoing observation of systems, networks, and users.",
          "Log management — collect, protect, retain, and review logs; timestamps must be synchronized (NTP).",
          "Alert fatigue — too many alerts desensitizes analysts; tune rules to reduce false positives.",
          "Threat hunting — proactive search for indicators of compromise (IOCs) that automated tools may miss.",
          "UEBA (User and Entity Behavior Analytics) — uses ML to detect anomalous behavior.",
          "Threat intelligence — information about current threats; helps prioritize defenses.",
          "IOCs (Indicators of Compromise): IP addresses, domains, file hashes, registry keys, URLs associated with malware.",
          "STIX/TAXII — standards for sharing threat intelligence (STIX = format; TAXII = transport).",
          "Need-to-know vs least privilege in operations: apply both when granting access to sensitive operational data."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // D8 – Software Development Security
  // ─────────────────────────────────────────────────────────────────────
  {
    domain: "software_development_security", num: "D8",
    label: "Software Development Security",
    topics: [
      {
        title: "SDLC & Secure Development",
        points: [
          "SDLC phases: Requirements → Design → Implementation (Coding) → Testing → Deployment → Maintenance.",
          "Security must be integrated at every phase — not bolted on at the end.",
          "Security requirements gathering — identify security requirements alongside functional requirements.",
          "Threat modeling (Design phase) — identify potential threats early; use STRIDE, DREAD, PASTA.",
          "STRIDE categories: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.",
          "Secure code review (Implementation) — manual or automated review of code for vulnerabilities.",
          "Security testing (Testing phase) — SAST, DAST, pen testing before deployment.",
          "Input validation — ALL user input must be validated; never trust input from the user.",
          "Output encoding — encode data before rendering to prevent XSS.",
          "Error handling — do not expose stack traces or system information in error messages.",
          "DevSecOps — integrates security into DevOps CI/CD pipeline; 'shift left' means testing earlier.",
          "Software Bill of Materials (SBOM) — inventory of all components and dependencies in software."
        ]
      },
      {
        title: "Software Development Models",
        points: [
          "Waterfall — sequential phases; requirements must be known upfront; poor at handling changes.",
          "Spiral — iterative with risk management at each cycle; good for large, complex projects.",
          "Agile — iterative sprints; flexible; requires security to be embedded in each sprint (not just at the end).",
          "Scrum — Agile framework; sprints (2–4 weeks); Product Owner, Scrum Master, Development Team.",
          "DevOps — breaks down silos between development and operations; automates deployment.",
          "DevSecOps — extends DevOps with security practices; automated security testing in CI/CD.",
          "RAD (Rapid Application Development) — prototypes, user feedback, fast iterations.",
          "CLEANROOM — formal mathematical verification; very high assurance; rarely used commercially.",
          "Continuous Integration (CI) — frequently merging code changes and running automated tests.",
          "Continuous Delivery/Deployment (CD) — automatically deploying tested code to production."
        ]
      },
      {
        title: "Common Vulnerabilities",
        points: [
          "SQL Injection — attacker injects SQL via input fields; can dump, modify, or delete database. Prevention: parameterized queries / prepared statements.",
          "Cross-Site Scripting (XSS) — reflected, stored, or DOM-based; injects scripts into pages. Prevention: output encoding, CSP headers.",
          "CSRF (Cross-Site Request Forgery) — forces authenticated user to submit malicious request. Prevention: CSRF tokens, SameSite cookies.",
          "Buffer Overflow — writing beyond allocated memory; can overwrite return addresses to execute arbitrary code. Prevention: bounds checking, ASLR, DEP/NX.",
          "Race Condition (TOCTOU) — Time of Check to Time of Use; attacker changes state between check and use. Prevention: atomic operations, locking.",
          "Insecure Direct Object Reference (IDOR) — accessing another user's data by manipulating IDs. Prevention: access control checks on every request.",
          "Path Traversal (Directory Traversal) — using ../ to access files outside intended directory. Prevention: input validation, canonical path checking.",
          "Command Injection — injecting OS commands through application input. Prevention: avoid shell calls; use parameterized APIs.",
          "XXE (XML External Entity) — exploiting XML parsers to read local files or SSRF. Prevention: disable external entity processing.",
          "Insecure Deserialization — exploiting object deserialization to execute arbitrary code. Prevention: validate serialized data, use safe deserializers.",
          "Aggregation — combining multiple low-sensitivity items to derive higher-sensitivity information.",
          "Inference — deducing sensitive information from non-sensitive data."
        ]
      },
      {
        title: "Database Security",
        points: [
          "Database views — restrict which data users can see; enforce need-to-know at the database layer.",
          "Polyinstantiation — storing different values for the same data at different classification levels; prevents inference attacks in MLS databases.",
          "Stored procedures — encapsulate SQL logic; reduce attack surface; can prevent SQLi if parameterized.",
          "Database activity monitoring (DAM) — real-time monitoring of database queries and responses.",
          "Data normalization — reduces redundancy; improves integrity; can complicate security controls.",
          "Aggregation attack — combining individually non-sensitive records to reveal sensitive information.",
          "Inference attack — deducing classified data from observable unclassified patterns.",
          "Concurrency and locking — prevent race conditions in multi-user environments.",
          "Backup and recovery — databases must be included in backup strategy; test restore regularly.",
          "Least privilege for database accounts — application accounts should only have SELECT/INSERT needed."
        ]
      },
      {
        title: "Capability Maturity Model (CMM)",
        points: [
          "SW-CMM (Software CMM) — measures maturity of software development process; 5 levels.",
          "Level 1 — Initial: chaotic; no processes defined; success depends on individual heroics.",
          "Level 2 — Repeatable: basic project management; requirements, planning, tracking, QA, configuration management established.",
          "Level 3 — Defined: processes documented, standardized, and integrated organization-wide.",
          "Level 4 — Managed (Quantitatively): processes measured and controlled with metrics.",
          "Level 5 — Optimizing: focus on continuous improvement; using metrics to drive change.",
          "CMMI (Capability Maturity Model Integration) — evolved successor to SW-CMM; applies to systems engineering and more.",
          "Higher maturity level = more predictable, higher-quality software.",
          "Most organizations operate at Level 2 or 3.",
          "Security requirements should be introduced at Level 2 (Repeatable) at a minimum."
        ]
      },
      {
        title: "API & Third-Party Security",
        points: [
          "API security — APIs are a major attack surface; implement authentication (OAuth, API keys), input validation, rate limiting, and TLS.",
          "OWASP API Security Top 10: Broken Object Level Authorization, Broken Authentication, Broken Object Property Level Authorization, Unrestricted Resource Consumption, Broken Function Level Authorization, Unrestricted Access to Sensitive Business Flows, Server-Side Request Forgery, Security Misconfiguration, Improper Inventory Management, Unsafe Consumption of APIs.",
          "Third-party libraries — regularly audit dependencies for known vulnerabilities (CVEs); use SCA tools.",
          "SCA (Software Composition Analysis) — identifies open-source components and their known vulnerabilities.",
          "Supply chain attacks — compromising a vendor's software before it reaches the customer (SolarWinds, XZ Utils).",
          "Code signing — signing compiled code with developer's certificate; verifies authenticity and integrity.",
          "Secure coding standards: OWASP, CERT, MISRA.",
          "Container security — scan container images for vulnerabilities; use minimal base images; run as non-root."
        ]
      }
    ]
  }

]; // end of CISSP_CONCEPTS
