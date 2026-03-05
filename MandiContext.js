import { uploadRecord } from './DropboxSync.js';

export const calculateWeights = (bags, wtPerBag, deductions) => {
    const b = parseFloat(bags) || 0;
    const w = parseFloat(wtPerBag) || 0;
    const d = parseFloat(deductions) || 0;
    
    const gross = (b * w) / 100;
    const net = (gross * 100 - d) / 100;
    return { gross, net };
};

export const getLocalRecords = () => {
    return JSON.parse(localStorage.getItem('mandi_vault') || '[]');
};

export const saveNewEntry = (truck, bags, wt, ded) => {
    const { gross, net } = calculateWeights(bags, wt, ded);
    const entry = {
        id: Date.now(),
        truckNumber: truck,
        bagCount: bags,
        wtPerBag: wt,
        deductions: ded,
        grossWeight: gross,
        netWeight: net,
        timestamp: new Date().toLocaleString()
    };
    
    const existing = getLocalRecords();
    const updated = [entry, ...existing];
    localStorage.setItem('mandi_vault', JSON.stringify(updated));
    
    uploadRecord(entry);
    return updated;
};
