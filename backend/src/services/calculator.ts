const standard = {
    Pb: 0.01,
    Cd: 0.003,
    As: 0.01,
    Hg: 0.001,
    Cr: 0.05,
  };
  
  // Contamination Factor (CF)
  export const calculateCF = (Ci: number, Si: number) => {
    return Ci / Si;
  };
  
  // Heavy Metal Pollution Index (HPI)
  export const calculateHPI = (Pb: any, Cd: any, As: any, Hg: any, Cr: any) => {
    const measured = { Pb, Cd, As, Hg, Cr };
    let k = 1;
    let numerator = 0;
    let denominator = 0;
  
    for (const metal in measured) {
      const Mi = measured[metal as keyof typeof measured];
      const Si = standard[metal as keyof typeof standard];
      const Ii = 0;
  
      const Wi = k / Si;
      const Qi = ((Mi - Ii) / (Si - Ii)) * 100;
  
      numerator += Wi * Qi;
      denominator += Wi;
    }
    return numerator / denominator;
  };
  
  // Heavy Metal Evaluation Index (HEI)
  export const calculateHEI = (Pb: any, Cd: any, As: any, Hg: any, Cr: any) => {
    const measured = { Pb, Cd, As, Hg, Cr };
    let hei = 0;
  
    for (const metal in measured) {
      const Ci = measured[metal as keyof typeof measured];
      const Si = standard[metal as keyof typeof standard];
  
      hei += Ci / Si;
    }
    return hei;
  };
  
  // Pollution Load Index (PLI)
  export const calculatePLI = (Pb: any, Cd: any, As: any, Hg: any, Cr: any) => {
    const measured = { Pb, Cd, As, Hg, Cr };
    let product = 1;
    const n = Object.keys(measured).length;
  
    for (const metal in measured) {
      const Ci = measured[metal as keyof typeof measured];
      const Si = standard[metal as keyof typeof standard];
  
      product *= calculateCF(Ci, Si);
    }
    return Math.pow(product, 1 / n);
  };