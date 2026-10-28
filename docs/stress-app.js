'use strict';
const $=id=>document.getElementById(id);let report=null;
function el(tag,text){const n=document.createElement(tag);n.textContent=String(text);return n;}
function num(id){const value=$(id).value.trim();if(!/^\d+(?:\.\d+)?$/.test(value))throw Error('Enter an explicit nonnegative decimal for '+id+'.');return Number(value);}
function render(){
  const table=el('table',''),thead=el('thead',''),h=el('tr','');
  for(const text of ['Scenario','Occupancy','Annual rent','Net before debt','Net after debt','Break-even occupancy'])h.append(el('th',text));thead.append(h);table.append(thead);
  const body=el('tbody','');
  for(const r of report.rows){const row=el('tr',''),b=r.breakEven;const occupancy=b.occupancy===null?'Unreachable at this capacity':(b.occupancy*100).toFixed(2)+'%'+(b.status==='exceeds-capacity'?' · exceeds capacity':'');for(const text of [r.name,(r.occupancy*100).toFixed(0)+'%',r.effectiveAnnualRent.toFixed(2),r.netBeforeDebt.toFixed(2),r.netAfterDebt.toFixed(2),b.status==='unreachable'?'No nonnegative outcome under these assumptions':occupancy])row.append(el('td',text));if(r.netAfterDebt<0)row.className='loss';body.append(row);}table.append(body);$('table').replaceChildren(table);
  $('basis').textContent='All-in cost basis '+report.costBasis.toFixed(2)+' '+report.currency+' · annual debt service '+report.annualDebtService.toFixed(2)+' '+report.currency;
  const first=report.rows[0],widths=[0,.25,.5,.75,1],body2=el('tbody','');
  const sensitivity=NovAsiaStress.compare(report.base,report.annualDebtService,widths.map(occupancy=>({name:Math.round(occupancy*100)+'%',occupancy,rentMultiplier:first.rentMultiplier,fixedCostMultiplier:first.fixedCostMultiplier})));
  for(const r of sensitivity.rows){const row=el('tr','');row.append(el('th',r.name),el('td',r.netAfterDebt.toFixed(2)+' '+report.currency));if(r.netAfterDebt<0)row.className='loss';body2.append(row);}
  $('sensitivity').replaceChildren(body2);$('results').hidden=false;
}
$('calculate').addEventListener('click',()=>{try{
  const base={currency:$('currency').value,region:$('region').value,propertyPrice:num('propertyPrice'),acquisitionCosts:num('acquisitionCosts'),grossAnnualRent:num('grossAnnualRent'),annualCamFee:num('annualCamFee'),annualOtherCosts:num('annualOtherCosts'),managementFeeRate:num('managementFeeRate')/100,maintenanceReserveRate:num('maintenanceReserveRate')/100,taxRate:num('taxRate')/100,taxBase:$('taxBase').value};
  const scenarios=$('scenarios').value.trim().split(/\r?\n/).map(line=>{const a=line.split('|').map(x=>x.trim());if(a.length!==4||a.slice(1).some(x=>!/^\d+(?:\.\d+)?$/.test(x)))throw Error('Use name | occupancy % | rent % | fixed cost %.');return {name:a[0],occupancy:Number(a[1])/100,rentMultiplier:Number(a[2])/100,fixedCostMultiplier:Number(a[3])/100};});
  report=NovAsiaStress.compare(base,num('annualDebtService'),scenarios);render();$('status').textContent=report.rows.length+' scenarios calculated. Negative cash flow is retained.';$('status').className='notice';
}catch(e){report=null;$('results').hidden=true;$('status').textContent=e.message;$('status').className='error';}});
for(const n of document.querySelectorAll('input,select,textarea'))n.addEventListener('input',()=>{report=null;$('results').hidden=true;$('status').textContent='Inputs changed. Calculate again to refresh exports.';});
function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('csv').addEventListener('click',()=>{if(report)download(NovAsiaStress.csv(report),'rental-stress.csv','text/csv;charset=utf-8');});
$('json').addEventListener('click',()=>{if(report)download(JSON.stringify(report,null,2),'rental-stress.json','application/json');});
