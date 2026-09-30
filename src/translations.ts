import { Language, LenderType, BorrowerType, RepaymentFrequency, PeriodUnit } from './types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  departmentName: string;
  introText: string;
  
  // Fields
  loanGivenBy: string;
  loanGivenByDesc: string;
  loanTakenBy: string;
  loanTakenByDesc: string;
  loanGiverName: string;
  loanGiverNameDesc: string;
  loanGiverNamePlaceholder: string;
  loanReceiverName: string;
  loanReceiverNameDesc: string;
  loanReceiverNamePlaceholder: string;
  loanAmount: string;
  loanAmountDesc: string;
  loanAmountPlaceholder: string;
  annualInterestRate: string;
  loanDate: string;
  loanDateDesc: string;
  loanPeriod: string;
  loanPeriodDesc: string;
  repaymentFrequency: string;
  repaymentFrequencyDesc: string;
  firstInstalmentDate: string;
  firstInstalmentDateDesc: string;
  
  // Actions
  calculateBtn: string;
  downloadPdfBtn: string;
  previewPdfBtn: string;
  printBtn: string;
  newLoanBtn: string;
  backToFormBtn: string;
  generatingPdf: string;
  
  // New Loan Confirmation
  newLoanConfirmTitle: string;
  newLoanConfirmDesc: string;
  confirmBtn: string;
  cancelBtn: string;
  
  // Validation errors
  errGiverName: string;
  errReceiverName: string;
  errLoanAmount: string;
  errLoanPeriod: string;
  errFirstInstalmentDate: string;
  
  // Summary
  loanSummaryTitle: string;
  loanNumber: string;
  totalInstalments: string;
  instalmentAmount: string;
  totalPrincipal: string;
  totalInterest: string;
  totalRepayment: string;
  firstInstalment: string;
  lastInstalment: string;
  
  // Table headers
  colInstalmentNo: string;
  colDueDate: string;
  colInstalmentAmount: string;
  colInterest: string;
  colPrincipal: string;
  colRemainingBalance: string;
  
  // PDF specific
  pdfDocumentTitle: string;
  pdfDeclarationTitle: string;
  pdfDeclarationText: string;
  borrowerSignatureTitle: string;
  lenderSignatureTitle: string;
  witnessSignatureTitle: string;
  signatureName: string;
  signatureSign: string;
  signatureDate: string;
  pdfFooterGenerated: string;
  pdfFooterDocNo: string;
  pdfFooterPage: (current: number, total: number) => string;
  
  // Entities
  lenderOptions: Record<LenderType, string>;
  borrowerOptions: Record<BorrowerType, string>;
  frequencyOptions: Record<RepaymentFrequency, string>;
  periodUnitOptions: Record<PeriodUnit, string>;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "RAJ SAKHI LOAN",
    appSubtitle: "Simple Loan EMI & Official Document Generator",
    departmentName: "Rajasthan Grameen Aajeevika Vikas Parishad (Rajeevika)",
    introText: "Enter the loan details below. The app will automatically calculate the applicable interest, EMI/instalments, complete repayment schedule and generate an official printable PDF.",
    
    loanGivenBy: "Loan Given By",
    loanGivenByDesc: "Select the organization that is providing the loan.",
    loanTakenBy: "Loan Taken By",
    loanTakenByDesc: "Automatically set based on the selected lender.",
    loanGiverName: "Loan Giver Name",
    loanGiverNameDesc: "Enter the full name of the organization or person giving the loan.",
    loanGiverNamePlaceholder: "e.g. Ujala Sankul Sthayi Sansthan",
    loanReceiverName: "Loan Receiver Name",
    loanReceiverNameDesc: "Enter the full name of the organization or person receiving the loan.",
    loanReceiverNamePlaceholder: "e.g. Saraswati Mahila Gram Sangathan / Sunita Devi",
    loanAmount: "Loan Amount (₹)",
    loanAmountDesc: "Enter the total amount being given as loan.",
    loanAmountPlaceholder: "e.g. 50,000",
    annualInterestRate: "Annual Interest Rate",
    loanDate: "Loan Date",
    loanDateDesc: "Select the date on which the loan amount is being given.",
    loanPeriod: "Loan Period",
    loanPeriodDesc: "Enter the total period for which the loan is being given.",
    repaymentFrequency: "Repayment Frequency",
    repaymentFrequencyDesc: "Select how often the borrower will pay the instalment.",
    firstInstalmentDate: "First Instalment Date",
    firstInstalmentDateDesc: "Select the date on which the first instalment will be paid.",
    
    calculateBtn: "CALCULATE LOAN",
    downloadPdfBtn: "DOWNLOAD OFFICIAL PDF",
    previewPdfBtn: "PREVIEW OFFICIAL PDF",
    printBtn: "Print PDF",
    newLoanBtn: "NEW LOAN",
    backToFormBtn: "Edit Details",
    generatingPdf: "Generating Official PDF...",
    
    newLoanConfirmTitle: "Start New Loan?",
    newLoanConfirmDesc: "Make sure you have downloaded the current PDF before starting a new loan.",
    confirmBtn: "Start New Loan",
    cancelBtn: "Cancel",
    
    errGiverName: "Please enter the loan giver's name.",
    errReceiverName: "Please enter the loan receiver's name.",
    errLoanAmount: "Please enter a valid loan amount.",
    errLoanPeriod: "Please enter a valid loan period.",
    errFirstInstalmentDate: "Please select a valid first instalment date.",
    
    loanSummaryTitle: "Loan Summary",
    loanNumber: "Loan Number",
    totalInstalments: "Number of Instalments",
    instalmentAmount: "Instalment Amount",
    totalPrincipal: "Total Principal",
    totalInterest: "Total Interest",
    totalRepayment: "Total Repayment",
    firstInstalment: "First Instalment Date",
    lastInstalment: "Last Instalment Date",
    
    colInstalmentNo: "Instalment No.",
    colDueDate: "Due Date",
    colInstalmentAmount: "Instalment Amount",
    colInterest: "Interest",
    colPrincipal: "Principal",
    colRemainingBalance: "Remaining Balance",
    
    pdfDocumentTitle: "LOAN AGREEMENT & REPAYMENT SCHEDULE",
    pdfDeclarationTitle: "Official Declaration",
    pdfDeclarationText: "I/We acknowledge receipt of the above-mentioned loan amount and agree to repay the loan according to the repayment schedule and applicable interest rate mentioned in this document.",
    borrowerSignatureTitle: "LOAN RECEIVER / BORROWER",
    lenderSignatureTitle: "LOAN PROVIDER / LENDER",
    witnessSignatureTitle: "WITNESS",
    signatureName: "Name",
    signatureSign: "Signature",
    signatureDate: "Date",
    pdfFooterGenerated: "Generated Loan Document",
    pdfFooterDocNo: "Document No.",
    pdfFooterPage: (current, total) => `Page ${current} of ${total}`,
    
    lenderOptions: {
      CLF: "Sankul Sthayi Sansthan (CLF)",
      VO: "Village Organization (VO)",
      SHG: "Self Help Group (SHG)"
    },
    borrowerOptions: {
      VO: "Village Organization (VO)",
      SHG: "Self Help Group (SHG)",
      MEMBER: "Member"
    },
    frequencyOptions: {
      monthly: "Monthly",
      quarterly: "Quarterly",
      half_yearly: "Half-Yearly",
      yearly: "Yearly"
    },
    periodUnitOptions: {
      months: "Months",
      years: "Years"
    }
  },
  hi: {
    appName: "RAJ SAKHI LOAN",
    appSubtitle: "सरल ऋण ईएमआई एवं आधिकारिक दस्तावेज जनरेटर",
    departmentName: "राजस्थान ग्रामीण आजीविका विकास परिषद (राजीविका)",
    introText: "नीचे ऋण की जानकारी दर्ज करें। ऐप स्वतः लागू ब्याज, ईएमआई/किस्त, पूरी किस्त अनुसूची की गणना करेगा और प्रिंट योग्य आधिकारिक PDF तैयार करेगा।",
    
    loanGivenBy: "ऋण देने वाला",
    loanGivenByDesc: "यहाँ उस संस्था का चयन करें जो ऋण दे रही है।",
    loanTakenBy: "ऋण लेने वाला",
    loanTakenByDesc: "ऋणदाता के अनुसार स्वतः निर्धारित।",
    loanGiverName: "ऋण देने वाले का नाम",
    loanGiverNameDesc: "यहाँ ऋण देने वाली संस्था या व्यक्ति का पूरा नाम दर्ज करें।",
    loanGiverNamePlaceholder: "उदा. उजाला संकुल स्तरीय संगठन",
    loanReceiverName: "ऋण लेने वाले का नाम",
    loanReceiverNameDesc: "यहाँ ऋण लेने वाली संस्था या व्यक्ति का पूरा नाम दर्ज करें।",
    loanReceiverNamePlaceholder: "उदा. सरस्वती महिला ग्राम संगठन / सुनिता देवी",
    loanAmount: "ऋण राशि (₹)",
    loanAmountDesc: "यहाँ दी जाने वाली कुल ऋण राशि दर्ज करें।",
    loanAmountPlaceholder: "उदा. 50,000",
    annualInterestRate: "वार्षिक ब्याज दर",
    loanDate: "ऋण दिनांक",
    loanDateDesc: "जिस दिन ऋण राशि दी जा रही है, वह दिनांक चुनें।",
    loanPeriod: "ऋण अवधि",
    loanPeriodDesc: "यहाँ वह कुल अवधि दर्ज करें जिसके लिए ऋण दिया जा रहा है।",
    repaymentFrequency: "किस्त भुगतान अंतराल",
    repaymentFrequencyDesc: "यहाँ चुनें कि ऋणी कितने अंतराल पर किस्त का भुगतान करेगा।",
    firstInstalmentDate: "पहली किस्त की दिनांक",
    firstInstalmentDateDesc: "जिस दिन पहली किस्त का भुगतान किया जाएगा, वह दिनांक चुनें।",
    
    calculateBtn: "ऋण की गणना करें",
    downloadPdfBtn: "आधिकारिक PDF डाउनलोड करें",
    previewPdfBtn: "आधिकारिक PDF देखें",
    printBtn: "प्रिंट PDF",
    newLoanBtn: "नया ऋण",
    backToFormBtn: "जानकारी संशोधित करें",
    generatingPdf: "आधिकारिक PDF तैयार की जा रही है...",
    
    newLoanConfirmTitle: "नया ऋण शुरू करें?",
    newLoanConfirmDesc: "नया ऋण शुरू करने से पहले सुनिश्चित करें कि वर्तमान PDF डाउनलोड कर ली गई है।",
    confirmBtn: "हाँ, नया ऋण शुरू करें",
    cancelBtn: "रद्द करें",
    
    errGiverName: "कृपया ऋण देने वाले का नाम दर्ज करें।",
    errReceiverName: "कृपया ऋण लेने वाले का नाम दर्ज करें।",
    errLoanAmount: "कृपया सही ऋण राशि दर्ज करें।",
    errLoanPeriod: "कृपया सही ऋण अवधि दर्ज करें।",
    errFirstInstalmentDate: "कृपया पहली किस्त की सही दिनांक चुनें।",
    
    loanSummaryTitle: "ऋण विवरण",
    loanNumber: "ऋण संख्या",
    totalInstalments: "कुल किस्तें",
    instalmentAmount: "किस्त राशि",
    totalPrincipal: "कुल मूलधन",
    totalInterest: "कुल ब्याज",
    totalRepayment: "कुल भुगतान",
    firstInstalment: "पहली किस्त की दिनांक",
    lastInstalment: "अंतिम किस्त की दिनांक",
    
    colInstalmentNo: "किस्त संख्या",
    colDueDate: "किस्त दिनांक",
    colInstalmentAmount: "किस्त राशि",
    colInterest: "ब्याज",
    colPrincipal: "मूलधन",
    colRemainingBalance: "शेष राशि",
    
    pdfDocumentTitle: "ऋण अनुबंध एवं किस्त भुगतान अनुसूची",
    pdfDeclarationTitle: "आधिकारिक घोषणा",
    pdfDeclarationText: "मैं/हम उपर्युक्त ऋण राशि प्राप्त होने की पुष्टि करते हैं तथा इस दस्तावेज में उल्लिखित लागू ब्याज दर एवं किस्त भुगतान अनुसूची के अनुसार ऋण का पुनर्भुगतान करने के लिए सहमत हैं।",
    borrowerSignatureTitle: "ऋण प्राप्तकर्ता / ऋणी",
    lenderSignatureTitle: "ऋणदाता / ऋण प्रदाता",
    witnessSignatureTitle: "गवाह",
    signatureName: "नाम",
    signatureSign: "हस्ताक्षर",
    signatureDate: "दिनांक",
    pdfFooterGenerated: "निर्मित ऋण दस्तावेज",
    pdfFooterDocNo: "दस्तावेज संख्या",
    pdfFooterPage: (current, total) => `पृष्ठ ${current} / ${total}`,
    
    lenderOptions: {
      CLF: "संकुल स्तरीय संगठन",
      VO: "ग्राम संगठन",
      SHG: "स्वयं सहायता समूह"
    },
    borrowerOptions: {
      VO: "ग्राम संगठन",
      SHG: "स्वयं सहायता समूह",
      MEMBER: "सदस्य"
    },
    frequencyOptions: {
      monthly: "मासिक",
      quarterly: "त्रैमासिक",
      half_yearly: "छमाही",
      yearly: "वार्षिक"
    },
    periodUnitOptions: {
      months: "महीने",
      years: "वर्ष"
    }
  }
};
