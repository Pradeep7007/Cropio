module.exports = function Loans(req, res) {
  const agriculturalLoans = [
    {
      id: "loan-1",
      title: "Kisan Credit Card (KCC) Scheme",
      description: "Timely credit for cultivation expenses, post-harvest costs, and farm maintenance needs.",
      extraInfo: "Interest Rate: Subsidized 4% per annum (after 3% prompt repayment incentive) for loans up to ₹3,00,000 without collateral up to ₹1,60,000.",
      category: "Working Capital & Cultivation",
      eligibility: "Individual farmers, joint borrowers, tenant farmers, oral lessees, and SHGs.",
      maxLimit: "₹3,00,000 at 4% effective interest",
      portalUrl: "https://kcc.gov.in",
      buttons: ["Apply for KCC", "Check Loan Eligibility"]
    },
    {
      id: "loan-2",
      title: "Agriculture Infrastructure Fund (AIF)",
      description: "Medium-long term debt financing for post-harvest management infrastructure and community farming assets.",
      extraInfo: "3% per annum interest subvention up to ₹2 Crores for a maximum period of 7 years with CGTMSE credit guarantee coverage.",
      category: "Infrastructure & Cold Storage",
      eligibility: "Primary Agricultural Credit Societies (PACS), FPOs, Agri-entrepreneurs, and Startups.",
      maxLimit: "Up to ₹2 Crores with 3% interest relief",
      portalUrl: "https://agriinfra.dac.gov.in",
      buttons: ["Submit Project Proposal", "View Guidelines"]
    },
    {
      id: "loan-3",
      title: "Tractor & Farm Mechanization Term Loan",
      description: "Financing for tractors, combine harvesters, power tillers, and laser levelers.",
      extraInfo: "Repayment tenure: Up to 7-9 years with flexible seasonal repayment matched to harvest income cycles.",
      category: "Equipment & Mechanization",
      eligibility: "Farmers with minimum 2 acres of irrigated agricultural land.",
      maxLimit: "Up to 85% of equipment on-road cost",
      portalUrl: "https://sbi.co.in/agri",
      buttons: ["Calculate EMI", "Apply with Bank"]
    }
  ];

  res.status(200).json(agriculturalLoans);
};