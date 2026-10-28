/* Scenario extension of NovAsia SEA Yield. MIT; no market or tax defaults. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('../index.js'));else root.NovAsiaStress=factory(root.NovAsiaYield);})(typeof globalThis==='undefined'?this:globalThis,function(engine){
  'use strict';
  const round=n=>{if(!Number.isFinite(n))throw Error('Scenario exceeds supported range.');return Number(n.toFixed(2));};
  function fraction(n,name,max=1){if(typeof n!=='number'||!Number.isFinite(n)||n<0||n>max)throw Error(name+' must be an explicit number between 0 and '+max+'.');return n;}
  function breakEven(assumptions,debt,capacity){
    const fixed=assumptions.annualCamFee+assumptions.annualOtherCosts;
    const retention=1-assumptions.managementFeeRate-assumptions.maintenanceReserveRate;
    let rent;
    if(fixed===0&&debt===0)rent=0;
    else if(assumptions.taxBase==='gross-rent'){
      const margin=retention-assumptions.taxRate;
      if(margin<=0)return {status:'unreachable',annualRent:null,occupancy:null};
      rent=(fixed+debt)/margin;
    }else{
      if(retention<=0||(assumptions.taxRate===1&&debt>0))return {status:'unreachable',annualRent:null,occupancy:null};
      rent=(fixed+(debt===0?0:debt/(1-assumptions.taxRate)))/retention;
    }
    if(!Number.isFinite(rent))return {status:'unreachable',annualRent:null,occupancy:null};
    const occupancy=capacity>0?rent/capacity:rent===0?0:null;
    return {status:occupancy!==null&&occupancy<=1?'within-capacity':'exceeds-capacity',annualRent:rent,occupancy};
  }
  function compare(base,annualDebtService,scenarios){
    const validated=engine.calculateNetYield(base);
    if(typeof annualDebtService!=='number'||!Number.isFinite(annualDebtService)||annualDebtService<0||annualDebtService>Number.MAX_SAFE_INTEGER/100||Math.abs(annualDebtService*100-Math.round(annualDebtService*100))>0.0001)throw Error('Annual debt service must be an explicit nonnegative amount with at most two decimals.');
    if(!Array.isArray(scenarios)||scenarios.length<1||scenarios.length>10)throw Error('Provide 1–10 scenarios.');
    const names=new Set();
    const rows=scenarios.map(s=>{
      if(!s||typeof s.name!=='string'||!s.name.trim()||s.name.length>100||/[\x00-\x1f\x7f]/.test(s.name)||names.has(s.name.trim()))throw Error('Use unique scenario names, 1–100 printable characters.');
      names.add(s.name.trim());fraction(s.occupancy,'occupancy');fraction(s.rentMultiplier,'rentMultiplier',5);fraction(s.fixedCostMultiplier,'fixedCostMultiplier',5);
      const capacity=round(base.grossAnnualRent*s.rentMultiplier);
      const input={...base,grossAnnualRent:round(capacity*s.occupancy),annualCamFee:round(base.annualCamFee*s.fixedCostMultiplier),annualOtherCosts:round(base.annualOtherCosts*s.fixedCostMultiplier)};
      const result=engine.calculateNetYield(input);
      return {name:s.name.trim(),occupancy:s.occupancy,rentMultiplier:s.rentMultiplier,fixedCostMultiplier:s.fixedCostMultiplier,capacityAnnualRent:capacity,effectiveAnnualRent:input.grossAnnualRent,netBeforeDebt:result.metrics.annualNetIncome,netAfterDebt:round(result.metrics.annualNetIncome-annualDebtService),netYieldBeforeDebt:result.metrics.netYield,breakEven:breakEven(input,annualDebtService,capacity),result};
    });
    return {version:1,currency:validated.currency,region:validated.region,costBasis:validated.costBasis,annualDebtService,base:{...base},rows};
  }
  function csv(report){const safe=v=>/^[\s\uFEFF]*[=+\-@]/.test(String(v))&&typeof v==='string'?"'"+v:String(v);const lines=[['scenario','occupancy','annual_rent','net_before_debt','annual_debt_service','net_after_debt','currency','break_even_annual_rent','break_even_occupancy','break_even_status'],...report.rows.map(r=>[r.name,r.occupancy,r.effectiveAnnualRent,r.netBeforeDebt,report.annualDebtService,r.netAfterDebt,report.currency,r.breakEven.annualRent===null?'':r.breakEven.annualRent,r.breakEven.occupancy===null?'':r.breakEven.occupancy,r.breakEven.status])];return lines.map(row=>row.map(v=>'"'+safe(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';}
  return Object.freeze({compare,csv});
});
