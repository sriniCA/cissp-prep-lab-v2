// CISSP Question Bank
// Source: CISSP Official Practice Tests, 3rd Edition (Chapple & Seidl, Wiley/Sybex, 2021)
//         CISSP Practice Exams, 5th Edition (Harris & Ham, McGraw-Hill, 2019)
// For personal study use only.
// Format: { id, domain, domainLabel, text, choices[4], correctIndex(0-3), hard, explanation }

window.CISSP_BANK = [

  // ─────────────────────────────────────────────────────────────
  // DOMAIN 1 – Security and Risk Management
  // ─────────────────────────────────────────────────────────────
  {
    id: "d1-01", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Gavin is creating a report on the results of his most recent risk assessment. He wants to identify the remaining level of risk to the organization after adopting security controls. What term best describes this level of risk?",
    choices: ["Inherent risk", "Residual risk", "Control risk", "Mitigated risk"],
    correctIndex: 1, hard: false,
    explanation: "Residual risk is the risk that remains after controls are applied. Inherent risk is the risk before any controls are in place."
  },
  {
    id: "d1-02", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Francine is a security specialist for a U.S. online service provider. She received a claim from a copyright holder that a user is storing infringing content on her service. What law governs the actions she must take?",
    choices: ["Copyright Act", "Lanham Act", "Digital Millennium Copyright Act", "Gramm-Leach-Bliley Act"],
    correctIndex: 2, hard: false,
    explanation: "The DMCA establishes safe harbor for ISPs and requires them to respond to valid takedown notices from copyright holders."
  },
  {
    id: "d1-03", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "FlyAway Travel has offices in both the EU and the United States. An EU customer requests that their account be terminated and data erased. Under GDPR, which principle applies?",
    choices: ["The right to access", "Privacy by design", "The right to be forgotten", "The right of data portability"],
    correctIndex: 2, hard: false,
    explanation: "The GDPR's 'right to be forgotten' (Article 17) allows individuals to request deletion of their personal data."
  },
  {
    id: "d1-04", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "After conducting a qualitative risk assessment, Sally recommends purchasing cybersecurity breach insurance. What type of risk response is she recommending?",
    choices: ["Accept", "Transfer", "Reduce", "Reject"],
    correctIndex: 1, hard: false,
    explanation: "Purchasing insurance shifts the financial impact of a risk to a third party—this is risk transference."
  },
  {
    id: "d1-05", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Renee is speaking to her board of directors about their cybersecurity responsibilities. What rule requires that senior executives take personal responsibility for information security matters?",
    choices: ["Due diligence rule", "Personal liability rule", "Prudent man rule", "Due process rule"],
    correctIndex: 2, hard: false,
    explanation: "The prudent man rule requires executives to act with the same level of care as any reasonable, prudent person under the same circumstances."
  },
  {
    id: "d1-06", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Wanda's U.S.-based organization is facilitating customer data exchange with an EU business partner. What is the best method to ensure GDPR compliance for this transfer?",
    choices: ["Binding corporate rules", "Privacy Shield", "Standard contractual clauses", "Safe harbor"],
    correctIndex: 2, hard: true,
    explanation: "Standard contractual clauses (SCCs) issued by the EU are the preferred mechanism for cross-border data transfers between separate companies. Privacy Shield was invalidated, and binding corporate rules apply within the same corporate group."
  },
  {
    id: "d1-07", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Yolanda is the chief privacy officer for a financial institution and is researching privacy requirements related to customer checking accounts. Which law is most likely to apply?",
    choices: ["GLBA", "SOX", "HIPAA", "FERPA"],
    correctIndex: 0, hard: false,
    explanation: "The Gramm-Leach-Bliley Act (GLBA) governs the privacy of customer financial information at financial institutions."
  },
  {
    id: "d1-08", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Tim's organization recently received a government contract. What law now likely applies to the information systems involved?",
    choices: ["FISMA", "PCI DSS", "HIPAA", "GISRA"],
    correctIndex: 0, hard: false,
    explanation: "FISMA (Federal Information Security Management Act) applies to federal agencies and their contractors."
  },
  {
    id: "d1-09", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Chris is advising travelers about export control compliance. Which technology is most likely to trigger these regulations?",
    choices: ["Memory chips", "Office productivity applications", "Hard drives", "Encryption software"],
    correctIndex: 3, hard: false,
    explanation: "U.S. export control laws specifically regulate the export of strong encryption software to certain countries."
  },
  {
    id: "d1-10", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Bobbi is investigating an incident where an attacker began with a normal user account but exploited a system vulnerability to gain administrative rights. Under STRIDE, what type of attack occurred?",
    choices: ["Spoofing", "Repudiation", "Tampering", "Elevation of privilege"],
    correctIndex: 3, hard: false,
    explanation: "In elevation of privilege, an attacker transforms a limited account into one with greater privileges. Spoofing falsifies identity; tampering alters data integrity; repudiation denies accountability."
  },
  {
    id: "d1-11", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "You have decided to accept a risk after completing your business continuity planning effort. What should you do next?",
    choices: ["Implement new security controls to reduce the risk", "Design a disaster recovery plan", "Repeat the business impact assessment", "Document your decision-making process"],
    correctIndex: 3, hard: false,
    explanation: "Whenever you accept a risk, you must maintain detailed documentation of the acceptance decision to satisfy auditors and demonstrate due diligence."
  },
  {
    id: "d1-12", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Tony is developing a business continuity plan and has difficulty combining information about tangible and intangible assets. What risk assessment approach would be most effective?",
    choices: ["Quantitative risk assessment", "Qualitative risk assessment", "Neither quantitative nor qualitative", "Combination of quantitative and qualitative"],
    correctIndex: 3, hard: false,
    explanation: "Quantitative assessment handles financial/tangible risk well; qualitative handles intangibles like reputation. Combining both provides the most complete picture."
  },
  {
    id: "d1-13", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Vincent believes a former employee stole trade secret information and took it to a competitor. Under what law could he pursue charges?",
    choices: ["Copyright law", "Lanham Act", "Glass-Steagall Act", "Economic Espionage Act"],
    correctIndex: 3, hard: false,
    explanation: "The Economic Espionage Act imposes criminal penalties on anyone found guilty of stealing trade secrets from U.S. companies."
  },
  {
    id: "d1-14", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Which principle imposes a standard of care upon an individual that is equivalent to what would be expected from a reasonable person under the circumstances?",
    choices: ["Due diligence", "Separation of duties", "Due care", "Least privilege"],
    correctIndex: 2, hard: false,
    explanation: "Due care is the broad standard requiring individuals to act as a reasonable person would. Due diligence is the specific component requiring individuals to exercise due care when completing assigned responsibilities."
  },
  {
    id: "d1-15", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Keenan Systems developed a new manufacturing process for microprocessors. The company wants to license the technology but prevent unauthorized use. What type of intellectual property protection is best suited?",
    choices: ["Patent", "Trade secret", "Copyright", "Trademark"],
    correctIndex: 0, hard: false,
    explanation: "A patent is appropriate when the organization wants to license the technology to others. A trade secret would not be viable once the process is licensed to third parties."
  },
  {
    id: "d1-16", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "What are the key control categories that accurately describe a fence around a facility? (Select the best answer.)",
    choices: ["Detective and compensating", "Corrective and deterrent", "Physical, deterrent, and preventive", "Administrative and technical"],
    correctIndex: 2, hard: false,
    explanation: "A fence is a physical control that deters would-be intruders and prevents unauthorized access. It does not have detective capability on its own."
  },
  {
    id: "d1-17", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Mike recently implemented an intrusion prevention system designed to block common network attacks. What type of risk management strategy is Mike pursuing?",
    choices: ["Risk acceptance", "Risk avoidance", "Risk mitigation", "Risk transference"],
    correctIndex: 2, hard: false,
    explanation: "Risk mitigation reduces the likelihood or impact of a risk. An IPS reduces the probability of a successful attack."
  },
  {
    id: "d1-18", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Carl is a federal agent investigating a computer crime case. He wants to pursue a case that will lead to imprisonment. What standard of proof must Carl meet?",
    choices: ["Beyond the shadow of a doubt", "Preponderance of the evidence", "Beyond a reasonable doubt", "Majority of the evidence"],
    correctIndex: 2, hard: false,
    explanation: "Criminal cases require the 'beyond a reasonable doubt' standard to secure a conviction and imprisonment. Civil cases use preponderance of the evidence."
  },
  {
    id: "d1-19", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "The Acme Widgets Company is concerned that a rogue accountant could create a false vendor and issue unauthorized checks. What security control best prevents this?",
    choices: ["Mandatory vacation", "Separation of duties", "Defense in depth", "Job rotation"],
    correctIndex: 1, hard: false,
    explanation: "Separation of duties ensures that one person cannot perform both the creation and approval of a payment, preventing a single rogue employee from committing fraud."
  },
  {
    id: "d1-20", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "HAL Systems decided to stop offering public NTP services because of a fear that its servers would be used in amplification DDoS attacks. What risk management strategy did HAL pursue?",
    choices: ["Risk mitigation", "Risk acceptance", "Risk transference", "Risk avoidance"],
    correctIndex: 3, hard: false,
    explanation: "Risk avoidance eliminates the risk by altering business activities. HAL avoided the NTP amplification risk entirely by stopping the service."
  },
  {
    id: "d1-21", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Ben is designing a messaging system for a bank and wants a feature that allows the recipient to prove to a third party that the message came from the purported originator. What goal is Ben trying to achieve?",
    choices: ["Authentication", "Authorization", "Integrity", "Nonrepudiation"],
    correctIndex: 3, hard: false,
    explanation: "Nonrepudiation allows a recipient to prove to a third party that a message came from a specific sender—the sender cannot deny sending it."
  },
  {
    id: "d1-22", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "What principle of information security states that an organization should implement overlapping security controls whenever possible?",
    choices: ["Least privilege", "Separation of duties", "Defense in depth", "Security through obscurity"],
    correctIndex: 2, hard: false,
    explanation: "Defense in depth uses multiple, overlapping security controls to meet the same objective, providing protection if any single control fails."
  },
  {
    id: "d1-23", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Helen is the owner of a U.S. website for middle and high school students. She wants her privacy policy to comply with COPPA. What is the cutoff age below which parental consent is required?",
    choices: ["13", "15", "17", "18"],
    correctIndex: 0, hard: false,
    explanation: "COPPA (Children's Online Privacy Protection Act) requires verifiable parental consent before collecting personal information from children under 13."
  },
  {
    id: "d1-24", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Tom considers locating a business in a 100-year flood plain. What is the annualized rate of occurrence (ARO) of a flood in this area?",
    choices: ["100", "1", "0.1", "0.01"],
    correctIndex: 3, hard: false,
    explanation: "An ARO is how often a risk is expected to occur per year. A 100-year flood is expected once every 100 years, or 1/100 = 0.01 times per year."
  },
  {
    id: "d1-25", domain: "security_and_risk_management", domainLabel: "Security and Risk Management",
    text: "Alan is performing threat modeling by breaking a system into its core elements: trust boundaries, data flow paths, input points, privileged operations, and security control details. What tool is he using?",
    choices: ["Vulnerability assessment", "Fuzzing", "Reduction analysis", "Data modeling"],
    correctIndex: 2, hard: true,
    explanation: "Reduction analysis (system decomposition) breaks the system into these five core elements to identify threats. It is a foundational step in threat modeling."
  },

  // ─────────────────────────────────────────────────────────────
  // DOMAIN 2 – Asset Security
  // ─────────────────────────────────────────────────────────────
  {
    id: "d2-01", domain: "asset_security", domainLabel: "Asset Security",
    text: "Angela is an information security architect at a bank tasked with ensuring that all transactions are secure as they traverse the network. She recommends TLS. What threat is she most likely stopping, and what method is she using?",
    choices: ["Man-in-the-middle, VPN", "Packet injection, encryption", "Sniffing, encryption", "Sniffing, TEMPEST"],
    correctIndex: 2, hard: false,
    explanation: "TLS encrypts data in transit, primarily protecting against passive sniffing attacks. TEMPEST prevents electromagnetic emanation eavesdropping, not network sniffing."
  },
  {
    id: "d2-02", domain: "asset_security", domainLabel: "Asset Security",
    text: "Nadia needs to apply security policies to cloud services and report on exceptions. What type of tool is best suited to this purpose?",
    choices: ["A next-generation firewall (NGFW)", "A cloud access security broker (CASB)", "An intrusion detection system (IDS)", "A SOAR platform"],
    correctIndex: 1, hard: false,
    explanation: "A CASB sits between users and cloud environments, providing monitoring and policy enforcement across cloud services—exactly what Nadia needs."
  },
  {
    id: "d2-03", domain: "asset_security", domainLabel: "Asset Security",
    text: "When media is labeled based on the classification of the data it contains, what rule is typically applied?",
    choices: ["Labeled based on its integrity requirements", "Labeled based on the highest classification level of data it contains", "Labeled with all levels of classification of its data", "Labeled with the lowest level of classification"],
    correctIndex: 1, hard: false,
    explanation: "Media is always labeled at the highest classification level it contains. This prevents data from being handled at a lower classification than it requires."
  },
  {
    id: "d2-04", domain: "asset_security", domainLabel: "Asset Security",
    text: "Which administrative process assists organizations in assigning appropriate levels of security control to sensitive information?",
    choices: ["Data classification", "Remanence", "Transmitting data", "Clearing"],
    correctIndex: 0, hard: false,
    explanation: "Data classification identifies the sensitivity of information and ensures that appropriate security controls are applied based on that classification."
  },
  {
    id: "d2-05", domain: "asset_security", domainLabel: "Asset Security",
    text: "Staff in an IT department who are delegated responsibility for day-to-day tasks hold what data role?",
    choices: ["Business owner", "User", "Data processor", "Custodian"],
    correctIndex: 3, hard: false,
    explanation: "Data custodians handle day-to-day technical tasks like backups, access control, and monitoring. They are delegated operational responsibilities by the data owner."
  },
  {
    id: "d2-06", domain: "asset_security", domainLabel: "Asset Security",
    text: "Helen's company uses a simple data lifecycle. What stage should come first?",
    choices: ["Data policy creation", "Data labeling", "Data collection", "Data analysis"],
    correctIndex: 2, hard: false,
    explanation: "Data collection is the first phase of the data lifecycle. Data can only be analyzed, used, retained, or destroyed after it has been collected."
  },
  {
    id: "d2-07", domain: "asset_security", domainLabel: "Asset Security",
    text: "Ben has been tasked with identifying security controls for systems covered by his organization's data classification system. Why might Ben use a security baseline?",
    choices: ["It applies in all circumstances, allowing consistent security controls", "They are approved by standards bodies, preventing liability", "They provide a good starting point that can be tailored to organizational needs", "They ensure systems are always in a secure state"],
    correctIndex: 2, hard: false,
    explanation: "Security baselines provide a starting point and are then scoped and tailored to meet specific organizational or system requirements."
  },
  {
    id: "d2-08", domain: "asset_security", domainLabel: "Asset Security",
    text: "Megan wants to prepare media to allow for reuse in an environment operating at the same sensitivity level. Which option best meets her needs?",
    choices: ["Clearing", "Erasing", "Purging", "Sanitization"],
    correctIndex: 0, hard: false,
    explanation: "Clearing overwrites all addressable locations on media with unclassified data, making it suitable for reuse at the same sensitivity level. Purging is more intensive and used for reuse at lower sensitivity levels."
  },
  {
    id: "d2-09", domain: "asset_security", domainLabel: "Asset Security",
    text: "Mikayla wants to identify sensitive data such as Social Security numbers and credit card numbers already in her environment. What type of tool is best suited?",
    choices: ["Manual searching", "A sensitive data scanning tool", "An asset metadata search tool", "A data loss prevention system"],
    correctIndex: 1, hard: false,
    explanation: "Sensitive data scanning tools are specifically designed to identify known-format data types (SSNs, credit cards) using pattern matching across stored data."
  },
  {
    id: "d2-10", domain: "asset_security", domainLabel: "Asset Security",
    text: "What issue is common to spare sectors, bad sectors on hard drives, and overprovisioned space on modern SSDs?",
    choices: ["They can be used to hide data", "They can only be degaussed", "They are not addressable, resulting in data remanence", "They may not be cleared when a drive is wiped, resulting in data remanence"],
    correctIndex: 3, hard: true,
    explanation: "These areas may not be overwritten by standard wiping utilities, leaving potentially sensitive data accessible through specialized tools."
  },
  {
    id: "d2-11", domain: "asset_security", domainLabel: "Asset Security",
    text: "What term best describes data that is resident in system memory?",
    choices: ["Data at rest", "Buffered data", "Data in use", "Data in motion"],
    correctIndex: 2, hard: false,
    explanation: "Data in use refers to data that is actively being processed, including data loaded into RAM. Data at rest is in storage; data in transit is moving across a network."
  },
  {
    id: "d2-12", domain: "asset_security", domainLabel: "Asset Security",
    text: "What technique could you use to mark trade secret information so it can be identified if released or stolen?",
    choices: ["Classification", "Symmetric encryption", "Watermarks", "Metadata"],
    correctIndex: 2, hard: false,
    explanation: "Digital watermarks embed an invisible marker in data to prove ownership and identify the source of unauthorized copies."
  },
  {
    id: "d2-13", domain: "asset_security", domainLabel: "Asset Security",
    text: "What type of encryption is best for protecting data on file servers, and what should protect it when in motion?",
    choices: ["TLS at rest and AES in motion", "AES at rest and TLS in motion", "VPN at rest and TLS in motion", "DES at rest and AES in motion"],
    correctIndex: 1, hard: false,
    explanation: "AES (symmetric encryption) is appropriate for data at rest. TLS (using asymmetric key exchange + symmetric session key) is appropriate for data in transit."
  },
  {
    id: "d2-14", domain: "asset_security", domainLabel: "Asset Security",
    text: "Chris is responsible for workstations used to handle proprietary and trade secret information. What should happen to these workstations at end of life?",
    choices: ["Erasing", "Clearing", "Sanitization", "Destruction"],
    correctIndex: 3, hard: false,
    explanation: "For highly sensitive data like trade secrets, destruction is the safest option. It ensures that no data can ever be recovered."
  },
  {
    id: "d2-15", domain: "asset_security", domainLabel: "Asset Security",
    text: "Fred wants to classify his organization's data. Which label should be applied to the highest classification level based on common commercial practice?",
    choices: ["Private", "Sensitive", "Public", "Proprietary"],
    correctIndex: 3, hard: false,
    explanation: "In commercial data classification, proprietary (or confidential) is typically the highest sensitivity level, representing data that is most critical to protect."
  },
  {
    id: "d2-16", domain: "asset_security", domainLabel: "Asset Security",
    text: "The CIS benchmarks are an example of what security practice?",
    choices: ["Conducting a risk assessment", "Implementing data labeling", "Proper system ownership", "Using security baselines"],
    correctIndex: 3, hard: false,
    explanation: "The CIS benchmarks provide hardening guidelines for various systems—they are a classic example of security baselines."
  },
  {
    id: "d2-17", domain: "asset_security", domainLabel: "Asset Security",
    text: "Adjusting CIS benchmarks to your organization's specific IT systems and mission involves what two processes?",
    choices: ["Scoping and selection", "Scoping and tailoring", "Baselining and tailoring", "Tailoring and selection"],
    correctIndex: 1, hard: false,
    explanation: "Scoping selects only the controls appropriate for your systems. Tailoring adjusts the selected controls to match your organization's specific mission and needs."
  },
  {
    id: "d2-18", domain: "asset_security", domainLabel: "Asset Security",
    text: "Henry's company sends customer data to a third-party company for analysis. What term best describes the third-party analysis company under GDPR?",
    choices: ["The data controller", "The data owner", "The data subject", "The data processor"],
    correctIndex: 3, hard: false,
    explanation: "A data processor processes personal data on behalf of a data controller. Henry's company is the controller; the third-party analyzer is the processor."
  },
  {
    id: "d2-19", domain: "asset_security", domainLabel: "Asset Security",
    text: "What information security risk to data at rest would result in the greatest reputational impact on an organization?",
    choices: ["Improper classification", "Data breach", "Decryption", "An intentional insider threat"],
    correctIndex: 1, hard: false,
    explanation: "A data breach—especially of sensitive customer data—typically causes the most severe reputational damage, customer loss, and regulatory consequences."
  },
  {
    id: "d2-20", domain: "asset_security", domainLabel: "Asset Security",
    text: "Full disk encryption like BitLocker protects data in what state?",
    choices: ["Data in transit", "Data at rest", "Unlabeled data", "Labeled data"],
    correctIndex: 1, hard: false,
    explanation: "Full disk encryption protects stored (at rest) data. It does not protect data while it is being transmitted over a network."
  },
  {
    id: "d2-21", domain: "asset_security", domainLabel: "Asset Security",
    text: "What is the primary purpose of data classification?",
    choices: ["It quantifies the cost of a data breach", "It prioritizes IT expenditures", "It allows compliance with breach notification laws", "It identifies the value of the data to the organization"],
    correctIndex: 3, hard: false,
    explanation: "Data classification identifies the sensitivity and value of data, enabling appropriate security controls to be applied and helping prioritize protection efforts."
  },
  {
    id: "d2-22", domain: "asset_security", domainLabel: "Asset Security",
    text: "What security measure best protects against a data breach if backup tapes are stolen or lost?",
    choices: ["Keep multiple copies of the tapes", "Replace tape media with hard drives", "Use appropriate security labels", "Use AES-256 encryption"],
    correctIndex: 3, hard: false,
    explanation: "Encrypting the tapes with AES-256 ensures that even if they are stolen, the data cannot be read without the encryption key."
  },
  {
    id: "d2-23", domain: "asset_security", domainLabel: "Asset Security",
    text: "Steve is concerned about employees who were privy to proprietary information leaving the organization. Which control is most effective against this threat?",
    choices: ["Sanitization", "NDAs", "Clearing", "Encryption"],
    correctIndex: 1, hard: false,
    explanation: "Non-disclosure agreements (NDAs) legally bind employees to maintain confidentiality about proprietary information, even after leaving the organization."
  },
  {
    id: "d2-24", domain: "asset_security", domainLabel: "Asset Security",
    text: "Alex works for a government agency that must meet U.S. federal requirements. He must ensure data is identifiable by its classification level when created. What should he do?",
    choices: ["Classify the data", "Encrypt the data", "Label the data", "Apply DRM to the data"],
    correctIndex: 2, hard: false,
    explanation: "Labeling places a visible or machine-readable marking on data to indicate its classification level at the time of creation, per federal requirements."
  },
  {
    id: "d2-25", domain: "asset_security", domainLabel: "Asset Security",
    text: "According to NIST SP 800-88, if media classified at a moderate security level will be sold as surplus, what process should Ben follow?",
    choices: ["Destroy, validate, document", "Clear, purge, document", "Purge, document, validate", "Purge, validate, document"],
    correctIndex: 3, hard: true,
    explanation: "NIST SP 800-88 requires that moderate-level media leaving organizational control be purged, the purge validated, and the process documented before reuse or disposal."
  },

  // ─────────────────────────────────────────────────────────────
  // DOMAIN 3 – Security Architecture and Engineering
  // ─────────────────────────────────────────────────────────────
  {
    id: "d3-01", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "What concept describes the degree of confidence that an organization has that its controls satisfy security requirements?",
    choices: ["Trust", "Credentialing", "Verification", "Assurance"],
    correctIndex: 3, hard: false,
    explanation: "Assurance is the level of confidence that security controls are correctly designed, implemented, and operating as intended."
  },
  {
    id: "d3-02", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "What type of security vulnerability are developers most likely to introduce when they create easy access paths for their own testing purposes?",
    choices: ["Maintenance hook", "Cross-site scripting", "SQL injection", "Buffer overflow"],
    correctIndex: 0, hard: false,
    explanation: "Maintenance hooks (backdoors) are intentionally introduced by developers for testing but pose a serious vulnerability if left in production code."
  },
  {
    id: "d3-03", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "In the Biba integrity model, Sally (Secret clearance) is blocked from reading a file with a Confidential classification. What principle is being enforced?",
    choices: ["Simple Security Property", "Simple Integrity Property", "*-Security Property", "*-Integrity Property"],
    correctIndex: 1, hard: true,
    explanation: "Biba's Simple Integrity Property (no read down) prevents a subject from reading data at a lower integrity level than their own clearance, preserving integrity by avoiding contamination."
  },
  {
    id: "d3-04", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Tom is responsible for maintaining security of systems that control industrial processes in a power plant. What term describes these systems?",
    choices: ["POWER", "SCADA", "HAVAL", "COBOL"],
    correctIndex: 1, hard: false,
    explanation: "SCADA (Supervisory Control and Data Acquisition) systems control and gather data from industrial processes such as power plants and utilities."
  },
  {
    id: "d3-05", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Sonia moved an encrypted drive to a new laptop after hardware failure and cannot access encrypted content despite knowing the password. What hardware feature is likely causing this?",
    choices: ["TCB", "TPM", "NIACAP", "RSA"],
    correctIndex: 1, hard: false,
    explanation: "A TPM (Trusted Platform Module) chip ties encryption keys to the specific motherboard. Moving an encrypted drive to a different system breaks the key binding."
  },
  {
    id: "d3-06", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "If Alice wants to send Bob a message encrypted for confidentiality using asymmetric cryptography, what key does she use to encrypt?",
    choices: ["Alice's public key", "Alice's private key", "Bob's public key", "Bob's private key"],
    correctIndex: 2, hard: false,
    explanation: "To encrypt a message for Bob, Alice uses Bob's public key. Only Bob's private key can decrypt it, ensuring confidentiality."
  },
  {
    id: "d3-07", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Alice wants to digitally sign a message to Bob. What key should she use to create the digital signature?",
    choices: ["Alice's public key", "Alice's private key", "Bob's public key", "Bob's private key"],
    correctIndex: 1, hard: false,
    explanation: "Alice creates a digital signature using her own private key. Bob (or anyone else) can verify the signature using Alice's publicly available public key."
  },
  {
    id: "d3-08", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "What name is given to the random value added to a password before hashing, in order to defeat rainbow table attacks?",
    choices: ["Hash", "Salt", "Extender", "Rebar"],
    correctIndex: 1, hard: false,
    explanation: "A salt is a random value prepended to a password before hashing. This ensures that even identical passwords produce different hash values, defeating precomputed rainbow tables."
  },
  {
    id: "d3-09", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Which is NOT an attribute of a hashing algorithm?",
    choices: ["They require a cryptographic key", "They are irreversible", "It is very difficult to find two messages with the same hash value", "They take variable-length input"],
    correctIndex: 0, hard: false,
    explanation: "Hash functions do NOT use cryptographic keys. They are keyless, one-way functions. Encryption algorithms use keys; hash algorithms do not."
  },
  {
    id: "d3-10", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "What type of fire suppression system fills with water after initial fire detection and then requires a sprinkler head heat activation before dispensing water?",
    choices: ["Wet pipe", "Dry pipe", "Deluge", "Preaction"],
    correctIndex: 3, hard: false,
    explanation: "A preaction system uses two stages: pipes fill with water at the first sign of fire detection, then heat sensors on sprinkler heads trigger water release."
  },
  {
    id: "d3-11", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Florian and Tobias want to begin communicating using a symmetric cryptosystem but have no pre-arranged key and cannot meet in person. What algorithm can they use to securely exchange the secret key?",
    choices: ["IDEA", "Diffie-Hellman", "RSA", "MD5"],
    correctIndex: 1, hard: false,
    explanation: "The Diffie-Hellman algorithm allows two parties to securely establish a shared symmetric key over an insecure public channel without a prior shared secret."
  },
  {
    id: "d3-12", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Carl's organization underwent a user access review, and auditors noted several cases of privilege creep. What security principle was violated?",
    choices: ["Fail securely", "Keep it simple", "Trust but verify", "Least privilege"],
    correctIndex: 3, hard: false,
    explanation: "Privilege creep—accumulating permissions beyond what is needed—violates the least privilege principle, which states employees should have only the minimum access required."
  },
  {
    id: "d3-13", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Matt's organization adopted a zero-trust network architecture. Which of the following criteria would be LEAST appropriate for granting a subject access?",
    choices: ["Password", "Two-factor authentication", "IP address", "Biometric scan"],
    correctIndex: 2, hard: true,
    explanation: "In zero trust, access decisions should never be based on network location. IP addresses indicate network position, not identity, and are therefore the least appropriate criterion."
  },
  {
    id: "d3-14", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "What cryptographic principle stands behind the idea that cryptographic algorithms should be open to public inspection?",
    choices: ["Security through obscurity", "Kerckhoffs' principle", "Defense in depth", "Heisenberg principle"],
    correctIndex: 1, hard: false,
    explanation: "Kerckhoffs' principle states that a cryptosystem should be secure even if everything about it—except the key—is public knowledge."
  },
  {
    id: "d3-15", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "In the ring protection model, what ring contains the operating system's kernel?",
    choices: ["Ring 0", "Ring 1", "Ring 2", "Ring 3"],
    correctIndex: 0, hard: false,
    explanation: "Ring 0 is the innermost ring with the highest privilege level—the kernel runs here. Ring 3 is the outermost ring where user applications run."
  },
  {
    id: "d3-16", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "In a SaaS cloud environment, who is normally responsible for ensuring appropriate firewall controls are in place to protect the application?",
    choices: ["Customer's security team", "Vendor", "Customer's networking team", "Customer's infrastructure management team"],
    correctIndex: 1, hard: false,
    explanation: "In SaaS, the vendor manages the entire application stack and underlying infrastructure, including firewall controls, under the cloud shared responsibility model."
  },
  {
    id: "d3-17", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "In a virtualized computing environment, what component is responsible for enforcing separation between guest machines?",
    choices: ["Guest operating system", "Hypervisor", "Kernel", "Protection manager"],
    correctIndex: 1, hard: false,
    explanation: "The hypervisor coordinates access to physical hardware and enforces isolation between different virtual machines running on the same physical platform."
  },
  {
    id: "d3-18", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Rick is a Python developer who provides his code to a vendor who executes it on their server environment. What type of cloud service is this?",
    choices: ["SaaS", "PaaS", "IaaS", "CaaS"],
    correctIndex: 1, hard: false,
    explanation: "PaaS (Platform as a Service) provides a platform for customers to deploy and run their own code without managing the underlying infrastructure."
  },
  {
    id: "d3-19", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "A hacker waited until James verified a file's integrity hash, then modified the file before James read it. What type of attack occurred?",
    choices: ["Social engineering", "TOCTOU", "Data diddling", "Parameter checking"],
    correctIndex: 1, hard: true,
    explanation: "TOCTOU (Time of Check to Time of Use) attacks exploit the time gap between when a security check is performed and when the protected resource is used."
  },
  {
    id: "d3-20", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "A shipping clerk totaled all individual sales records to determine total sales volume—information that was restricted. What type of attack occurred?",
    choices: ["Social engineering", "Inference", "Aggregation", "Data diddling"],
    correctIndex: 2, hard: true,
    explanation: "In an aggregation attack, combining individual pieces of non-sensitive data produces information at a higher sensitivity level than any individual piece."
  },
  {
    id: "d3-21", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "What physical security control broadcasts false emanations constantly to mask the presence of true electromagnetic emanations from computing equipment?",
    choices: ["Faraday cage", "Copper-infused windows", "Shielded cabling", "White noise"],
    correctIndex: 3, hard: false,
    explanation: "White noise generators create false EM signals that jam or mask real emanations from electronic equipment, making eavesdropping impractical."
  },
  {
    id: "d3-22", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Todd wants to add a compromised digital certificate to the certificate revocation list (CRL). What element of the certificate goes on the CRL?",
    choices: ["Serial number", "Public key", "Digital signature", "Private key"],
    correctIndex: 0, hard: false,
    explanation: "The CRL contains the serial numbers of certificates that have been revoked by the issuing CA. Private keys are never stored in certificates or CRLs."
  },
  {
    id: "d3-23", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Sherry found the MD5 algorithm in use within her organization. What should she do about it?",
    choices: ["Replace MD5, as it is no longer secure", "Keep AES, as it is still secure", "Keep PGP in use", "Upgrade to WPA3"],
    correctIndex: 0, hard: false,
    explanation: "MD5 has known intentional collision vulnerabilities and is no longer considered secure for cryptographic purposes. It should be replaced with a stronger hash like SHA-256."
  },
  {
    id: "d3-24", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "In TLS, what type of key is used to encrypt the actual content of communications between a web server and a client?",
    choices: ["Ephemeral session key", "Client's public key", "Server's public key", "Server's private key"],
    correctIndex: 0, hard: true,
    explanation: "TLS uses an ephemeral symmetric session key for encrypting bulk data. The asymmetric keys are only used during the handshake to establish this shared session key."
  },
  {
    id: "d3-25", domain: "security_architecture_engineering", domainLabel: "Security Architecture and Engineering",
    text: "Carl is deploying video sensors in remote locations. He wants to perform as much computation as possible on the device itself before sending results to the cloud. What computing model best meets his needs?",
    choices: ["Serverless computing", "Edge computing", "IaaS computing", "SaaS computing"],
    correctIndex: 1, hard: false,
    explanation: "Edge computing places processing power at the data source, minimizing the amount of data that must be sent back to the cloud—ideal for bandwidth-limited remote deployments."
  },

  // ─────────────────────────────────────────────────────────────
  // DOMAIN 4 – Communication and Network Security
  // ─────────────────────────────────────────────────────────────
  {
    id: "d4-01", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Which email security solution provides signed messages (integrity, authentication, nonrepudiation) and enveloped message mode (integrity, authentication, confidentiality)?",
    choices: ["S/MIME", "MOSS", "PEM", "DKIM"],
    correctIndex: 0, hard: false,
    explanation: "S/MIME (Secure/Multipurpose Internet Mail Extensions) provides both signed and encrypted email capabilities, supporting digital signatures and message encryption."
  },
  {
    id: "d4-02", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Selah wants to provide port-based authentication on her network so that clients must authenticate before using the network. What technology is appropriate?",
    choices: ["802.11a", "802.3", "802.15.1", "802.1x"],
    correctIndex: 3, hard: false,
    explanation: "IEEE 802.1X provides port-based network access control, requiring devices to authenticate before being granted network access."
  },
  {
    id: "d4-03", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "SMTP, HTTP, and SNMP all operate at what layer of the OSI model?",
    choices: ["Layer 4", "Layer 5", "Layer 6", "Layer 7"],
    correctIndex: 3, hard: false,
    explanation: "SMTP, HTTP, and SNMP are Application layer (Layer 7) protocols. They communicate directly with user-facing applications."
  },
  {
    id: "d4-04", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Ben is designing a WiFi network and has been asked to choose the most secure option. Which wireless security standard should he choose?",
    choices: ["WPA2", "WPA", "WEP", "WPA3"],
    correctIndex: 3, hard: false,
    explanation: "WPA3 is the most current and secure Wi-Fi security standard. WEP is broken, WPA has vulnerabilities, and WPA2 has some weaknesses addressed in WPA3."
  },
  {
    id: "d4-05", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Melissa uses the ping utility during a penetration test. If she does not want to see her own ping packets in her sniffer, what protocol should she filter out?",
    choices: ["UDP", "TCP", "IP", "ICMP"],
    correctIndex: 3, hard: false,
    explanation: "Ping uses ICMP (Internet Control Message Protocol) echo request and echo reply messages. Filtering ICMP removes ping traffic from the capture."
  },
  {
    id: "d4-06", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Which converged protocol allows storage mounts over TCP and is frequently used as a lower-cost alternative to Fibre Channel?",
    choices: ["MPLS", "SDN", "VoIP", "iSCSI"],
    correctIndex: 3, hard: false,
    explanation: "iSCSI encapsulates SCSI commands in TCP/IP packets, enabling storage area network (SAN) functionality over standard IP networks at lower cost than Fibre Channel."
  },
  {
    id: "d4-07", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "The Address Resolution Protocol (ARP) and Reverse Address Resolution Protocol (RARP) operate at what OSI layer?",
    choices: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
    correctIndex: 1, hard: false,
    explanation: "ARP and RARP operate at the Data Link layer (Layer 2), mapping between hardware MAC addresses and network IP addresses."
  },
  {
    id: "d4-08", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Mark is concerned about the physical security of his network cables. What type of connection would be hardest to tap without specialized equipment?",
    choices: ["WiFi", "Bluetooth", "Cat5/Cat6 twisted pair", "Fiber optic"],
    correctIndex: 3, hard: false,
    explanation: "Fiber optic cables transmit light rather than electrical signals, making them extremely difficult to tap without specialized equipment and usually causing detectable signal disruption."
  },
  {
    id: "d4-09", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "What type of address is 127.0.0.1?",
    choices: ["A public IP address", "An RFC 1918 address", "An APIPA address", "A loopback address"],
    correctIndex: 3, hard: false,
    explanation: "127.0.0.1 is the IPv4 loopback address, used to test network functionality on the local machine without sending packets over the network."
  },
  {
    id: "d4-10", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Segmentation, sequencing, and error checking all occur at what OSI layer that is associated with SSL, TLS, and UDP?",
    choices: ["The Transport layer", "The Network layer", "The Session layer", "The Presentation layer"],
    correctIndex: 0, hard: false,
    explanation: "The Transport layer (Layer 4) handles segmentation, sequencing, error checking, and flow control. SSL/TLS and UDP operate at this layer."
  },
  {
    id: "d4-11", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "WPA2's Counter Mode Cipher Block Chaining Message Authentication Code Protocol (CCMP) is based on which common encryption scheme?",
    choices: ["DES", "3DES", "AES", "TLS"],
    correctIndex: 2, hard: false,
    explanation: "CCMP is based on the AES block cipher operating in Counter Mode, providing both data confidentiality and integrity for WPA2."
  },
  {
    id: "d4-12", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "What is the maximum speed that Category 5e cable is rated for?",
    choices: ["5 Mbps", "10 Mbps", "100 Mbps", "1000 Mbps"],
    correctIndex: 3, hard: false,
    explanation: "Category 5e cable is rated for up to 1000 Mbps (1 Gbps) Ethernet connections, making it suitable for gigabit networks."
  },
  {
    id: "d4-13", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "What function does VXLAN perform in a data center environment?",
    choices: ["It removes distance limitations for Ethernet cables", "It allows multiple subnets in the same IP space with duplicate addresses", "It tunnels layer 2 connections over a layer 3 network, stretching them across the underlying network", "All of the above"],
    correctIndex: 2, hard: true,
    explanation: "VXLAN (Virtual Extensible LAN) encapsulates Layer 2 Ethernet frames in UDP packets, allowing Layer 2 segments to span across Layer 3 networks in data center environments."
  },
  {
    id: "d4-14", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Valerie enables port security on the switches on her network. What type of attack is she most likely trying to prevent?",
    choices: ["IP spoofing", "MAC aggregation", "CAM table flooding", "VLAN hopping"],
    correctIndex: 2, hard: true,
    explanation: "CAM table flooding involves sending frames with many fake MAC addresses to exhaust the switch's address table, causing the switch to flood all traffic. Port security limits the number of MAC addresses per port."
  },
  {
    id: "d4-15", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Ben wants to use multiple ISPs to connect to his cloud VPC to ensure reliable access. What technology can he use to manage and optimize those connections?",
    choices: ["FCoE", "VXLAN", "SDWAN", "LiFi"],
    correctIndex: 2, hard: false,
    explanation: "SD-WAN (Software-Defined Wide Area Network) intelligently routes traffic across multiple WAN links, including multiple ISPs, optimizing performance and availability."
  },
  {
    id: "d4-16", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Angela discovered that her network suffered from broadcast storms and that contractors, guests, and administrative staff were on the same network segment. What design change should she recommend?",
    choices: ["Require encryption for all users", "Install a firewall at the network border", "Enable spanning tree loop detection", "Segment the network based on functional requirements"],
    correctIndex: 3, hard: false,
    explanation: "Segmenting the network (e.g., with VLANs) separates different user groups, reduces broadcast domain size, and improves both performance and security."
  },
  {
    id: "d4-17", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "ICMP, RIP, and network address translation all occur at what OSI layer?",
    choices: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
    correctIndex: 2, hard: false,
    explanation: "These are all Network layer (Layer 3) protocols/functions. They deal with logical addressing and routing between networks."
  },
  {
    id: "d4-18", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Ben needs to ensure that VM-to-VM traffic in his cloud IaaS environment is secure and cannot be captured. What can he do to fully ensure this?",
    choices: ["Prevent installation of a packet sniffer on all hosts", "Disable promiscuous mode for all virtual interfaces", "Disallow virtual taps", "Encrypt all traffic between hosts"],
    correctIndex: 3, hard: true,
    explanation: "Encrypting all traffic ensures that even if it is captured (by the hypervisor, a compromised host, etc.), the content remains confidential."
  },
  {
    id: "d4-19", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Which OSI layer includes electrical specifications, protocols, and interface standards?",
    choices: ["The Transport layer", "The Device layer", "The Physical layer", "The Data Link layer"],
    correctIndex: 2, hard: false,
    explanation: "The Physical layer (Layer 1) deals with the physical transmission of data—electrical signals, optical signals, radio waves, and the hardware specifications that govern them."
  },
  {
    id: "d4-20", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "What speed and frequency range does 802.11n support?",
    choices: ["5 GHz only", "900 MHz and 2.4 GHz", "2.4 GHz and 5 GHz", "2.4 GHz only"],
    correctIndex: 2, hard: false,
    explanation: "802.11n (Wi-Fi 4) operates in both the 2.4 GHz and 5 GHz bands, offering up to 600 Mbps throughput."
  },
  {
    id: "d4-21", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Susan wants to configure IPsec to provide confidentiality for the content of packets. What IPsec component provides this capability?",
    choices: ["AH", "ESP", "IKE", "ISAKMP"],
    correctIndex: 1, hard: false,
    explanation: "ESP (Encapsulating Security Payload) encrypts packet payloads to provide confidentiality. AH (Authentication Header) provides integrity but not confidentiality."
  },
  {
    id: "d4-22", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Derek wants to deploy redundant core routers and needs the greatest throughput from the cluster. What HA model should he use?",
    choices: ["Active/active", "Line interactive", "Active/passive", "Nearline"],
    correctIndex: 0, hard: false,
    explanation: "Active/active clustering has all nodes processing traffic simultaneously, maximizing throughput. Active/passive has one node on standby, wasting its capacity."
  },
  {
    id: "d4-23", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "What are two primary advantages that 5G networks have over 4G networks? (Select the best answer.)",
    choices: ["Anti-jamming features and DDoS protection", "Enhanced subscriber identity protection and mutual authentication capabilities", "Multifactor authentication and end-to-end encryption", "Lower latency and increased bandwidth only"],
    correctIndex: 1, hard: true,
    explanation: "5G introduces enhanced subscriber identity protection (SUPI replaces IMSI) and mutual authentication between the device and the network, addressing key 4G vulnerabilities."
  },
  {
    id: "d4-24", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "During a wireless penetration test, Susan runs aircrack-ng with a password file. Running WPA2 in what mode would cause her cracking efforts to fail?",
    choices: ["Using WPA2 encryption", "Running WPA2 in Enterprise mode", "Using WEP encryption", "Running WPA2 in PSK mode"],
    correctIndex: 1, hard: true,
    explanation: "WPA2 Enterprise uses individual user credentials via RADIUS authentication (802.1X/EAP), not a shared pre-shared key. Without a PSK to attack, password-based cracking tools are ineffective."
  },
  {
    id: "d4-25", domain: "communication_network_security", domainLabel: "Communication and Network Security",
    text: "Chris sets up a hotel network where systems in each room/suite can connect to each other but not to other suites, while all systems can reach the internet. What is the most effective solution?",
    choices: ["Per-room VPNs", "VLANs", "Port security", "Firewalls"],
    correctIndex: 1, hard: false,
    explanation: "VLANs logically segment the network so devices in different VLANs cannot directly communicate, while a Layer 3 device can route all VLANs to the internet."
  },

  // ─────────────────────────────────────────────────────────────
  // DOMAIN 5 – Identity and Access Management
  // ─────────────────────────────────────────────────────────────
  {
    id: "d5-01", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Alex has held many positions at his company over a decade. An audit discovers he has access from all his former roles. What issue has his company encountered?",
    choices: ["Excessive provisioning", "Unauthorized access", "Privilege creep", "Account review"],
    correctIndex: 2, hard: false,
    explanation: "Privilege creep occurs when a user accumulates access permissions over time without old access being revoked. It violates the principle of least privilege."
  },
  {
    id: "d5-02", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "The access control scheme in the table uses labels and classifications (Highly Sensitive/Confidential/Internal/Public) mapped to compartments. What access control model is this?",
    choices: ["RBAC", "DAC", "MAC", "TBAC"],
    correctIndex: 2, hard: false,
    explanation: "Mandatory Access Control (MAC) uses security labels on both subjects and objects, with classifications like Confidential and Highly Sensitive, enforced by the OS."
  },
  {
    id: "d5-03", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "When a subject claims an identity, what process is occurring?",
    choices: ["Login", "Identification", "Authorization", "Token presentation"],
    correctIndex: 1, hard: false,
    explanation: "Identification is the act of claiming an identity (e.g., providing a username). Authentication proves the claim (e.g., providing a password). Authorization grants permissions."
  },
  {
    id: "d5-04", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Susan's organization wants to use the strongest possible passwords. What password requirement will have the highest impact in preventing brute-force attacks?",
    choices: ["Change max age from 1 year to 180 days", "Increase minimum password length from 8 to 16 characters", "Increase complexity to require 3 character classes", "Retain a history of at least 4 passwords"],
    correctIndex: 1, hard: false,
    explanation: "Password length has the greatest impact on brute-force resistance. Each additional character exponentially increases the search space. Length beats complexity."
  },
  {
    id: "d5-05", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Which event should concern Alaina most during a review of service accounts?",
    choices: ["An interactive login for the service account", "A password change for the service account", "Limitations placed on the service account's rights", "Local use of the service account"],
    correctIndex: 0, hard: true,
    explanation: "Service accounts should not be used for interactive logins. An interactive login for a service account may indicate misuse, compromise, or unauthorized privilege escalation."
  },
  {
    id: "d5-06", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Alex is implementing SAML integration with a third-party partner. He is concerned about eavesdropping AND forged assertions. What should he do to prevent both?",
    choices: ["Use SAML's secure mode", "Implement TLS using a strong cipher suite only", "Implement TLS using a strong cipher suite and digital signatures", "Implement TLS and message hashing"],
    correctIndex: 2, hard: true,
    explanation: "TLS protects against eavesdropping (confidentiality in transit). Digital signatures on SAML assertions protect against forgery (integrity and authentication)."
  },
  {
    id: "d5-07", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Jessica needs to send information about services she is provisioning to a third-party organization. What standards-based markup language should she use?",
    choices: ["SAML", "SOAP", "SPML", "XACML"],
    correctIndex: 2, hard: true,
    explanation: "SPML (Service Provisioning Markup Language) is specifically designed for provisioning user accounts and access rights across different systems and organizations."
  },
  {
    id: "d5-08", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "During a penetration test, Chris recovers a file containing hashed passwords. What type of attack is most likely to succeed?",
    choices: ["A brute-force attack", "A pass-the-hash attack", "A rainbow table attack", "A salt recovery attack"],
    correctIndex: 2, hard: false,
    explanation: "Rainbow table attacks use precomputed hash values to quickly reverse hash values back to passwords. They are highly effective against unsalted hashes."
  },
  {
    id: "d5-09", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Google's identity integration across many different organizations and applications is an example of which concept?",
    choices: ["PKI", "Federation", "Single sign-on", "Provisioning"],
    correctIndex: 1, hard: false,
    explanation: "Federation allows identity information to be shared across different organizational domains and trust boundaries, as Google does across its ecosystem."
  },
  {
    id: "d5-10", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "The company Cameron works for allows users to request privileged access temporarily. Once done, rights are removed. What type of system is he using?",
    choices: ["Zero trust", "Federated identity management", "Single sign-on", "Just-in-time access"],
    correctIndex: 3, hard: false,
    explanation: "Just-in-time (JIT) access grants temporary elevated privileges only when needed, then revokes them—minimizing standing privileges and reducing the attack surface."
  },
  {
    id: "d5-11", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "In a federation, when Susan wants to use a service at a partner site, which identity provider is used?",
    choices: ["Susan's home organization's identity provider", "The service provider's identity provider", "Both identity providers", "The service provider creates a new identity"],
    correctIndex: 0, hard: false,
    explanation: "In a federated identity system, the user's home organization identity provider (IdP) authenticates them, and the service provider (SP) accepts that assertion."
  },
  {
    id: "d5-12", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "A new customer scans his fingerprint and is logged into another customer's account. What type of biometric factor error occurred?",
    choices: ["A registration error", "A Type 1 error", "A Type 2 error", "A time of use error"],
    correctIndex: 2, hard: false,
    explanation: "A Type 2 error (False Acceptance Rate/FAR) occurs when the biometric system incorrectly authenticates an unauthorized person. A Type 1 error (FRR) is a false rejection."
  },
  {
    id: "d5-13", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "What type of access control is typically used by firewalls?",
    choices: ["Discretionary access controls", "Rule-based access controls", "Task-based access control", "Mandatory access controls"],
    correctIndex: 1, hard: false,
    explanation: "Firewalls use rule-based access control, making allow/deny decisions based on predefined rules (e.g., source/destination IP, port, protocol)."
  },
  {
    id: "d5-14", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "When you input a user ID and password, you are performing what IAM activity?",
    choices: ["Authorization", "Validation", "Authentication", "Login"],
    correctIndex: 2, hard: false,
    explanation: "Authentication verifies the claimed identity. Providing a user ID is identification; providing a password proves that identity—together they form authentication."
  },
  {
    id: "d5-15", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "In a MAC model, which objects and subjects have labels?",
    choices: ["Only Confidential/Secret/TS objects", "All objects have labels; all subjects have compartments", "All objects and subjects have labels", "All subjects have labels; all objects have compartments"],
    correctIndex: 2, hard: false,
    explanation: "In MAC, every object (file, resource) and every subject (user, process) has a security label. The system enforces access based on comparing these labels."
  },
  {
    id: "d5-16", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "What type of attack is the creation and exchange of state tokens in OAuth 2.0 flows intended to prevent?",
    choices: ["XSS", "CSRF", "SQL injection", "XACML injection"],
    correctIndex: 1, hard: true,
    explanation: "CSRF (Cross-Site Request Forgery) attacks trick a user's browser into making unauthorized requests. State tokens ensure that OAuth callback responses correspond to requests from the same session."
  },
  {
    id: "d5-17", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Ben's organization has had unauthorized access to applications during lunch when employees are away from their desks. What session management solutions best address this?",
    choices: ["Use session IDs and verify IP addresses", "Set session timeouts for applications and use password-protected screensavers with inactivity timeouts", "Use session IDs and password-protected screensavers", "Set session timeouts and verify IP addresses"],
    correctIndex: 1, hard: false,
    explanation: "Session timeouts for applications and password-protected screensavers with inactivity timeouts together address both web application sessions and workstation physical access."
  },
  {
    id: "d5-18", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Ben uses a software-based token that changes its code every minute. What type of token is he using?",
    choices: ["Asynchronous", "Smart card", "Synchronous", "Static"],
    correctIndex: 2, hard: false,
    explanation: "A synchronous token generates codes based on time intervals (e.g., every 30-60 seconds) synchronized with the authentication server—like TOTP used in authenticator apps."
  },
  {
    id: "d5-19", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Jim wants an access control scheme that prevents users from delegating access and is enforced at the OS level. What mechanism best fits?",
    choices: ["Role-based access control", "Discretionary access control", "Mandatory access control", "Attribute-based access control"],
    correctIndex: 2, hard: false,
    explanation: "MAC is enforced by the operating system/security kernel and users cannot change permissions or delegate access—it is non-discretionary."
  },
  {
    id: "d5-20", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Susan's workstation is configured to allow her to log in only during her work hours. What type of access control describes this limitation?",
    choices: ["Constrained interface", "Context-dependent control", "Content-dependent control", "Least privilege"],
    correctIndex: 1, hard: true,
    explanation: "Context-dependent controls use environmental context (like time of day or location) to grant or deny access, regardless of the user's credentials."
  },
  {
    id: "d5-21", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "During a review of support tickets, Ben found that password changes accounted for more than a quarter of help desk cases. Which option would most likely decrease this number significantly?",
    choices: ["Two-factor authentication", "Biometric authentication", "Self-service password reset", "Passphrases"],
    correctIndex: 2, hard: false,
    explanation: "Self-service password reset allows users to reset their own passwords without involving the help desk, directly reducing the volume of password-related support tickets."
  },
  {
    id: "d5-22", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Jim wants to allow cloud-based applications to act on his behalf to access information from other sites without sharing his password. What tool enables this?",
    choices: ["Kerberos", "OAuth", "OpenID", "LDAP"],
    correctIndex: 1, hard: false,
    explanation: "OAuth 2.0 is the authorization framework designed to allow applications to act on a user's behalf without sharing credentials."
  },
  {
    id: "d5-23", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "Susan is troubleshooting Kerberos authentication problems with invalid TGTs, despite correct configuration, credentials, and network connectivity. What is the most likely issue?",
    choices: ["The Kerberos server is offline", "There is a protocol mismatch", "The client's TGTs have been de-authorized", "The Kerberos server and client clocks are not synchronized"],
    correctIndex: 3, hard: true,
    explanation: "Kerberos requires time synchronization (typically within 5 minutes) between the KDC and clients. Clock skew greater than this threshold causes Kerberos tickets to be rejected."
  },
  {
    id: "d5-24", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "The bank that Aaron works for wants to create accounts when users download an app and first try to log in. What provisioning model has he suggested?",
    choices: ["JIT", "OpenID", "OAuth", "Kerberos"],
    correctIndex: 0, hard: false,
    explanation: "JIT (Just-in-Time) provisioning automatically creates user accounts the first time a user authenticates, eliminating the need for pre-provisioning all accounts."
  },
  {
    id: "d5-25", domain: "identity_access_management", domainLabel: "Identity and Access Management",
    text: "What authentication technology can be paired with OAuth to perform identity verification and obtain user profile information via a RESTful API?",
    choices: ["SAML", "Shibboleth", "OpenID Connect", "Higgins"],
    correctIndex: 2, hard: false,
    explanation: "OpenID Connect is an identity layer built on top of OAuth 2.0. It adds authentication to OAuth's authorization framework and provides user profile info via a RESTful API."
  },

  // ─────────────────────────────────────────────────────────────
  // DOMAIN 6 – Security Assessment and Testing
  // ─────────────────────────────────────────────────────────────
  {
    id: "d6-01", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "During a port scan, Naomi found TCP port 443 open. Which tool is best suited to scanning the service most likely running on that port?",
    choices: ["zzuf", "Nikto", "Metasploit", "sqlmap"],
    correctIndex: 1, hard: false,
    explanation: "TCP 443 is HTTPS. Nikto is a web server vulnerability scanner specifically designed to identify vulnerabilities in web servers and applications."
  },
  {
    id: "d6-02", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "What message logging standard is commonly used by network devices, Linux/Unix systems, and enterprise devices?",
    choices: ["Syslog", "Netlog", "Eventlog", "Remote Log Protocol (RLP)"],
    correctIndex: 0, hard: false,
    explanation: "Syslog (RFC 5424) is the standard logging protocol used across network devices, Unix/Linux systems, and many enterprise appliances for centralized log management."
  },
  {
    id: "d6-03", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Alex wants to use an automated tool to fill web application forms to test for format string vulnerabilities. What type of tool should he use?",
    choices: ["A black box", "A brute-force tool", "A fuzzer", "A static analysis tool"],
    correctIndex: 2, hard: false,
    explanation: "A fuzzer automatically sends unexpected, random, or malformed input to applications to discover vulnerabilities like format string flaws, buffer overflows, and input validation issues."
  },
  {
    id: "d6-04", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Susan needs to scan a system for vulnerabilities using an open source tool remotely. Which tool meets these requirements?",
    choices: ["Nmap", "OpenVAS", "MBSA", "Nessus"],
    correctIndex: 1, hard: false,
    explanation: "OpenVAS (Open Vulnerability Assessment Scanner) is a fully open source vulnerability scanner. Nmap is a port scanner; MBSA is Microsoft-only; Nessus is commercial."
  },
  {
    id: "d6-05", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Morgan is implementing a vulnerability management system and needs to provide standardized severity scores for vulnerabilities. Which is most commonly used?",
    choices: ["CCE", "CVSS", "CPE", "OVAL"],
    correctIndex: 1, hard: false,
    explanation: "CVSS (Common Vulnerability Scoring System) is the industry standard for rating the severity of security vulnerabilities, providing scores from 0.0 to 10.0."
  },
  {
    id: "d6-06", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Jim has been contracted to perform a penetration test where he has been given no information about the target other than its name and address. What type of test is this?",
    choices: ["A crystal-box test", "A gray-box test", "A black-box test", "A white-box test"],
    correctIndex: 2, hard: false,
    explanation: "A black-box test gives the tester no prior knowledge of the system, simulating an external attacker who has done only public reconnaissance."
  },
  {
    id: "d6-07", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Susan received an SSAE 18 SOC report and wants a report that includes operating effectiveness detail. What should she request and why?",
    choices: ["A SOC 2 Type II report, because Type I does not cover operating effectiveness", "A SOC 1 Type I report, because SOC 2 doesn't cover operating effectiveness", "A SOC 2 Type I report, because SOC 2 Type II doesn't cover it", "A SOC 3 report, because SOC 1 and 2 are outdated"],
    correctIndex: 0, hard: true,
    explanation: "SOC 2 Type I reports on controls at a point in time (design). SOC 2 Type II reports on the operating effectiveness of controls over a period of time—that's what Susan needs."
  },
  {
    id: "d6-08", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Jennifer needs to ensure all Windows systems provide identical logging information to the SIEM. How can she best ensure all Windows desktops have the same log settings?",
    choices: ["Perform periodic configuration audits", "Use Group Policy", "Use Local Policy", "Deploy a Windows syslog client"],
    correctIndex: 1, hard: false,
    explanation: "Group Policy allows centralized, consistent application of security and logging settings across all Windows domain machines—ideal for ensuring uniform configuration."
  },
  {
    id: "d6-09", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "What technology should an organization use across all devices shown in a logging infrastructure to ensure logs can be time-sequenced?",
    choices: ["Syslog", "NTP", "Logsync", "SNAP"],
    correctIndex: 1, hard: false,
    explanation: "NTP (Network Time Protocol) ensures all devices have synchronized clocks, making it possible to accurately correlate events across multiple log sources."
  },
  {
    id: "d6-10", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "During a penetration test, Michelle hasn't gained sufficient access to generate raw packets. What type of scan should she run to verify the most open services?",
    choices: ["A TCP connect scan", "A TCP SYN scan", "A UDP scan", "An ICMP scan"],
    correctIndex: 0, hard: false,
    explanation: "A TCP connect scan uses the OS's connect() call, which doesn't require raw packet privileges. It completes the full three-way handshake to verify open ports."
  },
  {
    id: "d6-11", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "During a nmap port scan, Joseph discovers ports 21/open and 23/open. What services are likely running?",
    choices: ["SSH and FTP", "FTP and Telnet", "SMTP and Telnet", "POP3 and SMTP"],
    correctIndex: 1, hard: false,
    explanation: "Port 21 is FTP (File Transfer Protocol) and port 23 is Telnet—both insecure legacy protocols that transmit data in cleartext."
  },
  {
    id: "d6-12", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Testing that is focused on functions that a system should NOT allow is an example of what type of testing?",
    choices: ["Use case testing", "Manual testing", "Misuse case testing", "Dynamic testing"],
    correctIndex: 2, hard: false,
    explanation: "Misuse case testing (negative testing) verifies that the system correctly prevents unauthorized or unintended actions—the opposite of use case (positive) testing."
  },
  {
    id: "d6-13", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "What type of monitoring uses simulated traffic to a website to continuously monitor performance?",
    choices: ["Log analysis", "Synthetic monitoring", "Passive monitoring", "Simulated transaction analysis"],
    correctIndex: 1, hard: false,
    explanation: "Synthetic monitoring uses scripted transactions that simulate user behavior to continuously test application availability and performance before real users encounter problems."
  },
  {
    id: "d6-14", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "What term describes software testing intended to uncover new bugs introduced by patches or configuration changes?",
    choices: ["Nonregression testing", "Evolution testing", "Smoke testing", "Regression testing"],
    correctIndex: 3, hard: false,
    explanation: "Regression testing reruns previous test cases after changes to ensure the changes haven't introduced new defects or broken existing functionality."
  },
  {
    id: "d6-15", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Susan needs to predict high-risk areas and track risk trends over time using metrics. What should she do?",
    choices: ["Perform yearly risk assessments", "Hire a penetration testing firm", "Identify and track key risk indicators", "Monitor logs using a SIEM"],
    correctIndex: 2, hard: false,
    explanation: "Key risk indicators (KRIs) are quantitative metrics that provide early warning of increasing risk exposure, enabling proactive risk management."
  },
  {
    id: "d6-16", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "During penetration test planning, what is the most important task to accomplish in Phase 1?",
    choices: ["Building a test lab", "Getting authorization", "Gathering appropriate tools", "Determining if the test is white, black, or gray box"],
    correctIndex: 1, hard: false,
    explanation: "Getting proper written authorization is the most critical planning step. Penetration testing without authorization is illegal, regardless of intent."
  },
  {
    id: "d6-17", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "What does using unique user IDs for all users provide when reviewing logs?",
    choices: ["Confidentiality", "Integrity", "Availability", "Accountability"],
    correctIndex: 3, hard: false,
    explanation: "Unique user IDs ensure that every action in logs can be attributed to a specific individual, providing accountability for actions taken on the system."
  },
  {
    id: "d6-18", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "During a penetration test, Selah calls the help desk posing as a senior officer's assistant and persuades them to reset a password. What type of attack has she completed?",
    choices: ["Zero knowledge", "Help desk spoofing", "Social engineering", "Black box"],
    correctIndex: 2, hard: false,
    explanation: "Social engineering manipulates people into performing actions or divulging information. Impersonating an executive to get a password reset is a classic social engineering attack."
  },
  {
    id: "d6-19", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Michelle wants to compare vulnerabilities based on exploitability, existence of exploit code, and remediation difficulty. What scoring system should she use?",
    choices: ["CSV", "NVD", "VSS", "CVSS"],
    correctIndex: 3, hard: false,
    explanation: "CVSS (Common Vulnerability Scoring System) scores vulnerabilities on multiple factors including exploitability metrics, impact metrics, and temporal metrics like exploit availability."
  },
  {
    id: "d6-20", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "During a port scan, Alex finds many hosts responding on TCP ports 80, 443, 515, and 9100. What type of devices is Alex likely discovering?",
    choices: ["Web servers", "File servers", "Wireless access points", "Printers"],
    correctIndex: 3, hard: false,
    explanation: "Port 515 (Line Printer Daemon/LPD) and 9100 (raw printing/JetDirect) are printer-specific ports. Combined with 80 and 443 for web management, these strongly indicate printers."
  },
  {
    id: "d6-21", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Nikto, Burp Suite, and Wapiti are all examples of what type of security tool?",
    choices: ["Web application vulnerability scanners", "Code review tools", "Vulnerability scanners", "Port scanners"],
    correctIndex: 0, hard: false,
    explanation: "Nikto, Burp Suite, and Wapiti are all specifically designed to scan and analyze web applications for security vulnerabilities."
  },
  {
    id: "d6-22", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Jim is working with a penetration testing contractor who proposes using Metasploit. What should Jim expect to occur?",
    choices: ["Systems will be scanned for vulnerabilities", "Systems will have known vulnerabilities exploited", "Services will be probed for unknown flaws", "Systems will be tested for zero-day exploits"],
    correctIndex: 1, hard: false,
    explanation: "Metasploit is an exploitation framework that contains exploit code for known vulnerabilities. It is used to actually exploit systems, not just scan them for vulnerabilities."
  },
  {
    id: "d6-23", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Robin recently found a critical vulnerability on a server handling sensitive information. What should Robin do next?",
    choices: ["Patching", "Reporting", "Remediation", "Validation"],
    correctIndex: 1, hard: false,
    explanation: "After identifying a critical vulnerability, the next step is reporting it to the appropriate stakeholders. Remediation planning and patching follow the reporting step."
  },
  {
    id: "d6-24", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Which NIST special publication covers the assessment of security and privacy controls?",
    choices: ["800-12", "800-53A", "800-34", "800-86"],
    correctIndex: 1, hard: true,
    explanation: "NIST SP 800-53A provides procedures for assessing the security and privacy controls defined in NIST SP 800-53. SP 800-34 is for contingency planning."
  },
  {
    id: "d6-25", domain: "security_assessment_testing", domainLabel: "Security Assessment and Testing",
    text: "Which type of code review is NOT typically performed by a human?",
    choices: ["Software inspections", "Pair programming", "Static program analysis", "Software walk-throughs"],
    correctIndex: 2, hard: false,
    explanation: "Static program analysis uses automated tools to analyze source code without executing it. The other three (inspections, pair programming, walk-throughs) all involve human reviewers."
  },

  // ─────────────────────────────────────────────────────────────
  // DOMAIN 7 – Security Operations
  // ─────────────────────────────────────────────────────────────
  {
    id: "d7-01", domain: "security_operations", domainLabel: "Security Operations",
    text: "As Gary decides what access permissions to grant to each user, what principle should guide his decisions about default permissions?",
    choices: ["Separation of duties", "Least privilege", "Aggregation", "Separation of privileges"],
    correctIndex: 1, hard: false,
    explanation: "Least privilege grants users only the minimum permissions needed to perform their job functions. Overly permissive defaults create unnecessary risk."
  },
  {
    id: "d7-02", domain: "security_operations", domainLabel: "Security Operations",
    text: "Gary uses a matrix that shows potential areas of conflict between roles and tasks. What information security principle does this matrix directly help enforce?",
    choices: ["Segregation of duties", "Aggregation", "Two-person control", "Defense in depth"],
    correctIndex: 0, hard: false,
    explanation: "A conflict-of-interest matrix helps design segregation of duties by identifying task combinations that no single individual should be able to perform."
  },
  {
    id: "d7-03", domain: "security_operations", domainLabel: "Security Operations",
    text: "Gary is preparing to create an account for a new user and assign privileges to the HR database. What two elements must he verify before granting access?",
    choices: ["Credentials and need to know", "Clearance and need to know", "Password and clearance", "Password and biometric scan"],
    correctIndex: 1, hard: false,
    explanation: "Two conditions must be met for access: the appropriate security clearance (eligibility) AND a legitimate need to know the specific information."
  },
  {
    id: "d7-04", domain: "security_operations", domainLabel: "Security Operations",
    text: "Gary is developing controls for root encryption keys. What security principle, specifically designed for very sensitive operations, should he apply?",
    choices: ["Least privilege", "Defense in depth", "Security through obscurity", "Two-person control"],
    correctIndex: 3, hard: false,
    explanation: "Two-person control (dual control) requires two authorized individuals to be present and participate for highly sensitive operations, preventing any single person from acting alone."
  },
  {
    id: "d7-05", domain: "security_operations", domainLabel: "Security Operations",
    text: "What term is often used to describe a collection of unrelated patches released in a large collection?",
    choices: ["Hotfix", "Update", "Security fix", "Service pack"],
    correctIndex: 3, hard: false,
    explanation: "A service pack is a large bundled release of patches, updates, and fixes. A hotfix is an urgent single-issue patch. Updates are routine incremental improvements."
  },
  {
    id: "d7-06", domain: "security_operations", domainLabel: "Security Operations",
    text: "Tonya is collecting evidence from systems and a colleague suggests using a forensic disk controller. What is the function of this device?",
    choices: ["Masking error conditions reported by the storage device", "Transmitting write commands to the storage device", "Intercepting and discarding write commands sent to the storage device", "Preventing data from being returned by read operations"],
    correctIndex: 2, hard: false,
    explanation: "A forensic disk controller (write blocker) intercepts write commands before they reach the storage device, ensuring the original evidence is not modified during investigation."
  },
  {
    id: "d7-07", domain: "security_operations", domainLabel: "Security Operations",
    text: "Lydia is reviewing an access request where the user has the required security clearance but no business justification. She denies the request. What security principle is she following?",
    choices: ["Need to know", "Least privilege", "Separation of duties", "Two-person control"],
    correctIndex: 0, hard: false,
    explanation: "Need to know requires that even authorized users (with the right clearance) must have a legitimate business reason to access specific information. Clearance alone is insufficient."
  },
  {
    id: "d7-08", domain: "security_operations", domainLabel: "Security Operations",
    text: "Helen is implementing controls to deter fraudulent insider activity. Which mechanism would be LEAST useful?",
    choices: ["Job rotation", "Mandatory vacations", "Incident response", "Two-person control"],
    correctIndex: 2, hard: false,
    explanation: "Incident response is reactive—it responds after an event has occurred. Job rotation, mandatory vacations, and two-person control are proactive deterrents to insider fraud."
  },
  {
    id: "d7-09", domain: "security_operations", domainLabel: "Security Operations",
    text: "Matt wants to ensure critical network traffic is prioritized over web browsing. What technology can he use?",
    choices: ["VLANs", "QoS", "VPN", "ISDN"],
    correctIndex: 1, hard: false,
    explanation: "QoS (Quality of Service) allows administrators to prioritize different types of network traffic, ensuring critical business applications receive bandwidth over lower-priority traffic."
  },
  {
    id: "d7-10", domain: "security_operations", domainLabel: "Security Operations",
    text: "Tom is responding to a security incident and needs information about the approval process for a recent modification to a system's security settings. Where would he most likely find this?",
    choices: ["Change log", "System log", "Security log", "Application log"],
    correctIndex: 0, hard: false,
    explanation: "Change logs record all approved modifications to systems, including the approval chain, change details, and who made the change—exactly what Tom needs."
  },
  {
    id: "d7-11", domain: "security_operations", domainLabel: "Security Operations",
    text: "Susan's staff often travel internationally and may be targeted for corporate espionage. What network connection practice should she advise?",
    choices: ["Only connect to public WiFi", "Use a VPN for all connections", "Only use websites that support TLS", "Do not connect to networks while traveling"],
    correctIndex: 1, hard: false,
    explanation: "Using a VPN for all connections encrypts all traffic and routes it securely through the organization's network, protecting against eavesdropping on untrusted networks."
  },
  {
    id: "d7-12", domain: "security_operations", domainLabel: "Security Operations",
    text: "Ricky is seeking a list of information security vulnerabilities in applications, devices, and operating systems. Which threat intelligence source would be most useful?",
    choices: ["OWASP", "Bugtraq", "Microsoft Security Bulletins", "CVE"],
    correctIndex: 3, hard: false,
    explanation: "CVE (Common Vulnerabilities and Exposures) is a comprehensive, vendor-neutral database of publicly known information security vulnerabilities across all systems."
  },
  {
    id: "d7-13", domain: "security_operations", domainLabel: "Security Operations",
    text: "Glenda wants to conduct a disaster recovery test allowing review of the plan with no disruption to normal activities and minimal time commitment. What type of test should she choose?",
    choices: ["Tabletop exercise", "Parallel test", "Full interruption test", "Checklist review"],
    correctIndex: 3, hard: false,
    explanation: "A checklist review involves team members reviewing the DR plan independently to check for gaps and completeness. It requires the least time and causes no disruption."
  },
  {
    id: "d7-14", domain: "security_operations", domainLabel: "Security Operations",
    text: "Which one of the following is NOT an example of a backup tape rotation scheme?",
    choices: ["Grandfather/Father/Son", "Meet in the middle", "Tower of Hanoi", "Six Cartridge Weekly"],
    correctIndex: 1, hard: false,
    explanation: "'Meet in the middle' is a cryptanalytic attack, not a backup rotation scheme. Grandfather/Father/Son, Tower of Hanoi, and Six Cartridge Weekly are all valid backup rotation schemes."
  },
  {
    id: "d7-15", domain: "security_operations", domainLabel: "Security Operations",
    text: "Helen designs a process where both the employee's manager AND the accounting manager must approve administrative access to the accounting system. What principle is she enforcing?",
    choices: ["Least privilege", "Two-person control", "Job rotation", "Separation of duties"],
    correctIndex: 1, hard: false,
    explanation: "Two-person control (dual control) requires that two authorized people must both approve or participate in sensitive operations, preventing unilateral action."
  },
  {
    id: "d7-16", domain: "security_operations", domainLabel: "Security Operations",
    text: "Frank is considering evidence for an upcoming criminal matter. Which is NOT a requirement for evidence to be admissible?",
    choices: ["The evidence must be relevant", "The evidence must be material", "The evidence must be tangible", "The evidence must be competently acquired"],
    correctIndex: 2, hard: true,
    explanation: "Admissible evidence must be relevant, material, and competently acquired. There is no requirement that it be tangible—digital/electronic evidence is routinely admitted."
  },
  {
    id: "d7-17", domain: "security_operations", domainLabel: "Security Operations",
    text: "Harold recently completed leading the postmortem review of a security incident. What documentation should he prepare next?",
    choices: ["A lessons learned document", "A risk assessment", "A remediation list", "A mitigation checklist"],
    correctIndex: 0, hard: false,
    explanation: "After an incident postmortem, a lessons learned document captures what was discovered and recommendations to prevent recurrence—the primary output of the review process."
  },
  {
    id: "d7-18", domain: "security_operations", domainLabel: "Security Operations",
    text: "Sam performs full backups every Monday at 9 p.m. and differential backups on other days. How many files will be copied in Wednesday's differential backup? (See: Mon creates files 1-4, Tue creates file 5 and modifies 1-2, Wed modifies file 3 and creates file 6.)",
    choices: ["2", "3", "5", "6"],
    correctIndex: 2, hard: true,
    explanation: "A differential backup copies ALL changes since the last full backup. Changes since Monday's full: Tue (files 1,2,5) + Wed (files 3,6) = files 1,2,3,5,6 = 5 files total."
  },
  {
    id: "d7-19", domain: "security_operations", domainLabel: "Security Assessment and Testing",
    text: "Which one of the following security tools is NOT capable of generating an active response to a security event?",
    choices: ["IPS", "Firewall", "IDS", "Antivirus software"],
    correctIndex: 2, hard: false,
    explanation: "An IDS (Intrusion Detection System) only detects and alerts on security events—it cannot actively block or respond. An IPS can actively block traffic."
  },
  {
    id: "d7-20", domain: "security_operations", domainLabel: "Security Operations",
    text: "Scott should avoid which disposal option for hard drives containing highly sensitive data from a SAN?",
    choices: ["Destroy them physically", "Sign a contract with the SAN vendor requiring appropriate disposal", "Reformat each drive before it leaves", "Use a secure wipe tool like DBAN"],
    correctIndex: 2, hard: false,
    explanation: "Reformatting only removes the file system structure; data can be recovered with forensic tools. Physical destruction or cryptographic erasure provides much stronger assurance for highly sensitive data."
  },
  {
    id: "d7-21", domain: "security_operations", domainLabel: "Security Operations",
    text: "What term is used to describe the default set of privileges assigned to a user when a new account is created?",
    choices: ["Aggregation", "Transitivity", "Baseline", "Entitlement"],
    correctIndex: 3, hard: false,
    explanation: "Entitlement refers to the permissions and rights that have been assigned to a user. Default entitlements should follow the principle of least privilege."
  },
  {
    id: "d7-22", domain: "security_operations", domainLabel: "Security Operations",
    text: "During what phase of the incident response process do administrators take action to limit the effect or scope of an incident?",
    choices: ["Detection", "Response", "Mitigation", "Recovery"],
    correctIndex: 2, hard: false,
    explanation: "The mitigation phase involves containing the incident to limit its spread or impact. This may include isolating affected systems, blocking traffic, or disabling accounts."
  },
  {
    id: "d7-23", domain: "security_operations", domainLabel: "Security Operations",
    text: "Ann's IDS alerts on an unusually high volume of inbound traffic on UDP port 53. What service typically uses this port?",
    choices: ["DNS", "SSH/SCP", "SSL/TLS", "HTTP"],
    correctIndex: 0, hard: false,
    explanation: "UDP port 53 is used by DNS (Domain Name System). A large volume of DNS responses may indicate a DNS amplification DDoS attack."
  },
  {
    id: "d7-24", domain: "security_operations", domainLabel: "Security Operations",
    text: "Florian wants to determine the maximum time a particular IT service may be down without causing serious business damage. What variable is he calculating?",
    choices: ["RTO", "MTD", "RPO", "SLA"],
    correctIndex: 1, hard: false,
    explanation: "MTD (Maximum Tolerable Downtime) is the maximum time a system or service can be unavailable before unacceptable consequences result. RTO is the target time to restore."
  },
  {
    id: "d7-25", domain: "security_operations", domainLabel: "Security Operations",
    text: "Patrick was charged with implementing a threat hunting program. What is the basic assumption that should guide his planning?",
    choices: ["Security controls were designed using defense-in-depth", "Audits may uncover control deficiencies", "Attackers may already be present on the network", "Defense mechanisms may contain unpatched vulnerabilities"],
    correctIndex: 2, hard: true,
    explanation: "Threat hunting operates on the assumption that adversaries may have already breached the network and that traditional security controls may have failed to detect them."
  },

  // ─────────────────────────────────────────────────────────────
  // DOMAIN 8 – Software Development Security
  // ─────────────────────────────────────────────────────────────
  {
    id: "d8-01", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Which database key is used to enforce referential integrity relationships between tables?",
    choices: ["Primary key", "Candidate key", "Foreign key", "Master key"],
    correctIndex: 2, hard: false,
    explanation: "A foreign key references the primary key in another table, enforcing referential integrity—ensuring that relationships between records in different tables remain consistent."
  },
  {
    id: "d8-02", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Carrie analyzes logs and sees the string '../../../../../../../../../etc/passwd'. What type of attack was attempted?",
    choices: ["Command injection", "Session hijacking", "Directory traversal", "Brute-force"],
    correctIndex: 2, hard: false,
    explanation: "Directory traversal attacks use '../' sequences to navigate outside the web root and access sensitive system files like /etc/passwd."
  },
  {
    id: "d8-03", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "When should a design review take place in an SDLC approach?",
    choices: ["After the code review", "After user acceptance testing", "After the development of functional requirements", "After the completion of unit testing"],
    correctIndex: 2, hard: false,
    explanation: "In the SDLC, the design review occurs after functional requirements are established but before coding begins, allowing design flaws to be identified early."
  },
  {
    id: "d8-04", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Tracy wants to ensure a patch didn't introduce new flaws by comparing previous responses to the same input against those produced by the patched application. What type of testing is she planning?",
    choices: ["Unit testing", "Acceptance testing", "Regression testing", "Vulnerability testing"],
    correctIndex: 2, hard: false,
    explanation: "Regression testing reruns existing test cases after code changes to ensure the changes haven't introduced new defects or altered previously correct behavior."
  },
  {
    id: "d8-05", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "What term describes the level of confidence that software is free from vulnerabilities and functions as intended?",
    choices: ["Validation", "Accreditation", "Confidence interval", "Assurance"],
    correctIndex: 3, hard: false,
    explanation: "Software assurance is the level of confidence that software is free from vulnerabilities and operates as intended throughout its lifecycle."
  },
  {
    id: "d8-06", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Victor's database access logs show that a user pulled all individual sales records for a quarter and calculated the total sales volume (which was restricted). What issue did Victor identify?",
    choices: ["Inference", "SQL injection", "Multilevel security", "Aggregation"],
    correctIndex: 3, hard: true,
    explanation: "Aggregation: combining multiple individually accessible pieces of data to derive a more sensitive value that should be restricted."
  },
  {
    id: "d8-07", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Ron's team frequently re-creates code that performs common functions. What software development tool best addresses this?",
    choices: ["Code repositories", "Code libraries", "IDEs", "DAST"],
    correctIndex: 1, hard: false,
    explanation: "Code libraries contain reusable functions and modules that developers can call, avoiding duplication of common functionality across projects."
  },
  {
    id: "d8-08", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Greg's malware samples show code changing slightly between infections, making antivirus less effective. What type of malware should he suspect?",
    choices: ["Stealth virus", "Polymorphic virus", "Multipartite virus", "Encrypted virus"],
    correctIndex: 1, hard: false,
    explanation: "Polymorphic viruses mutate their code with each infection, changing their signature to evade signature-based antivirus detection."
  },
  {
    id: "d8-09", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Linda finds the code `<script>alert('Alert');</script>` in a user forum post and a dialog box pops up on her screen. What vulnerability definitely exists?",
    choices: ["Cross-site scripting", "Cross-site request forgery", "SQL injection", "Improper authentication"],
    correctIndex: 0, hard: false,
    explanation: "The execution of injected JavaScript via a user-supplied forum post is a classic cross-site scripting (XSS) vulnerability."
  },
  {
    id: "d8-10", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Linda communicates with the vendor and no patch is available for the XSS vulnerability. Which device would best help defend the application?",
    choices: ["VPN", "WAF", "DLP", "IDS"],
    correctIndex: 1, hard: false,
    explanation: "A Web Application Firewall (WAF) can detect and block XSS payloads at the application layer, providing protection when a code-level fix is unavailable."
  },
  {
    id: "d8-11", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "What technique would be most effective in mitigating XSS vulnerability at the code level?",
    choices: ["Bounds checking", "Peer review", "Input validation", "OS patching"],
    correctIndex: 2, hard: false,
    explanation: "Input validation (including output encoding) prevents XSS by ensuring user-supplied content is treated as data, not executable code."
  },
  {
    id: "d8-12", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Christine is nearing final testing stages. Which type of testing usually occurs last and is executed against defined test scenarios?",
    choices: ["Unit testing", "Integration testing", "User acceptance testing", "System testing"],
    correctIndex: 2, hard: false,
    explanation: "User acceptance testing (UAT) is the final phase where end users validate that the system meets business requirements before deployment."
  },
  {
    id: "d8-13", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Alyssa's team implemented a new system that gathers logs from various sources, analyzes them, and triggers automated playbooks in response to security events. What best describes this technology?",
    choices: ["SIEM", "Log repositories", "IPS", "SOAR"],
    correctIndex: 3, hard: false,
    explanation: "SOAR (Security Orchestration, Automation and Response) platforms combine log aggregation/analysis (like SIEM) with automated response capabilities via playbooks."
  },
  {
    id: "d8-14", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Chris reviews the code: `int myarray[10]; myarray[10] = 8;`. What type of vulnerability exists?",
    choices: ["Mismatched data types", "Overflow", "SQL injection", "Covert channel"],
    correctIndex: 1, hard: true,
    explanation: "The array myarray has valid indices 0-9. Writing to index 10 is an off-by-one buffer overflow, writing beyond the allocated memory boundary."
  },
  {
    id: "d8-15", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Which database concurrency issue occurs when one transaction writes a value that overwrites a value needed by earlier transactions?",
    choices: ["Dirty read", "Incorrect summary", "Lost update", "SQL injection"],
    correctIndex: 2, hard: true,
    explanation: "A lost update occurs when two transactions read and then update the same value, with the second write overwriting the first—losing the first update."
  },
  {
    id: "d8-16", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "In a software configuration management program, what is the primary role of the CAB (Change Advisory Board)?",
    choices: ["Approve developer credentials", "Facilitate lessons learned sessions", "Review and approve/reject code changes", "Prioritize software development efforts"],
    correctIndex: 2, hard: false,
    explanation: "The CAB reviews proposed changes to the production environment, assessing risk and business impact, and then approves or rejects each change request."
  },
  {
    id: "d8-17", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Harry sees a web server log entry: `CARROT'&1=1;--`. What type of attack was attempted?",
    choices: ["Buffer overflow", "Cross-site scripting", "SQL injection", "Cross-site request forgery"],
    correctIndex: 2, hard: false,
    explanation: "The single quote, boolean condition (1=1), and double-dash comment sequence are classic SQL injection indicators, attempting to manipulate the database query."
  },
  {
    id: "d8-18", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Which is NOT an effective control against SQL injection attacks?",
    choices: ["Escaping", "Client-side input validation", "Parameterization", "Limiting database permissions"],
    correctIndex: 1, hard: false,
    explanation: "Client-side input validation can be easily bypassed by an attacker who modifies the request directly. Server-side controls (escaping, parameterization, limiting DB permissions) are effective."
  },
  {
    id: "d8-19", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Which approach to failure management is the most conservative from a security perspective?",
    choices: ["Fail open", "Fail mitigation", "Fail clear", "Fail closed"],
    correctIndex: 3, hard: false,
    explanation: "Fail closed (fail secure) denies all access when a security control fails. Fail open allows all activity—the opposite of conservative. Fail closed prioritizes security over availability."
  },
  {
    id: "d8-20", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "What software development model is characterized by multiple iterations, each including risk analysis, prototyping, and planning?",
    choices: ["Waterfall", "Agile", "Lean", "Spiral"],
    correctIndex: 3, hard: false,
    explanation: "The Spiral model combines iterative development with systematic risk analysis. Each spiral includes: determine objectives, identify risks, develop and test, and plan the next iteration."
  },
  {
    id: "d8-21", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Teagan wants to protect against database inference attacks. Which technique is an effective countermeasure?",
    choices: ["Input validation", "Parameterization", "Polyinstantiation", "Server-side validation"],
    correctIndex: 2, hard: true,
    explanation: "Polyinstantiation stores multiple versions of data at different classification levels, preventing users from inferring the existence or content of classified records by observing what is absent."
  },
  {
    id: "d8-22", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Lucas suspects that a fired employee planted malicious code that activates after his departure. What type of attack should Lucas suspect?",
    choices: ["Privilege escalation", "SQL injection", "Logic bomb", "Remote code execution"],
    correctIndex: 2, hard: false,
    explanation: "A logic bomb is malicious code that lies dormant until specific trigger conditions are met (like a certain date or the absence of a specific employee in the system)."
  },
  {
    id: "d8-23", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Which one of the following Agile principles would NOT be favored—the Agile Manifesto values the right side of each contrast?",
    choices: ["Processes and tools over individuals and interactions", "Working software over comprehensive documentation", "Customer collaboration over contract negotiations", "Responding to change over following a plan"],
    correctIndex: 0, hard: false,
    explanation: "Agile values individuals and interactions over processes and tools—the opposite of the first answer. The other three correctly represent Agile values (right side of each)."
  },
  {
    id: "d8-24", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "Which type of artificial intelligence attempts to use complex computations to replicate the partial function of the human mind?",
    choices: ["Decision support systems", "Expert systems", "Knowledge bank", "Neural networks"],
    correctIndex: 3, hard: false,
    explanation: "Neural networks use interconnected nodes inspired by biological neurons to model complex patterns, partially replicating aspects of human cognitive processing."
  },
  {
    id: "d8-25", domain: "software_development_security", domainLabel: "Software Development Security",
    text: "At which level of the SW-CMM does an organization introduce basic lifecycle management processes?",
    choices: ["Initial", "Repeatable", "Defined", "Managed"],
    correctIndex: 1, hard: false,
    explanation: "At SW-CMM Level 2 (Repeatable), organizations introduce basic project lifecycle management—requirements management, planning, tracking, QA, and configuration management."
  }

]; // end of CISSP_BANK
