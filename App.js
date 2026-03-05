import { getLocalRecords, saveNewEntry } from './MandiContext.js';
import { downloadAll } from './DropboxSync.js';

const root = document.getElementById('root');

function render() {
    const records = getLocalRecords();
    const totalNet = records.reduce((acc, curr) => acc + curr.netWeight, 0).toFixed(2);
    const token = localStorage.getItem('dropbox_token') || "";

    root.innerHTML = `
    <div class="min-h-screen pb-24">
        <header class="bg-emerald-700 text-white p-6 shadow-md flex justify-between items-center">
            <div>
                <h1 class="text-xl font-black tracking-tighter">MANDI MONITOR</h1>
                <p class="text-[10px] opacity-70 font-bold">KMS 2025-26</p>
            </div>
            <button id="btn-sync" class="bg-emerald-800 px-3 py-1 rounded-lg text-[10px] font-bold">SYNC CLOUD</button>
        </header>

        <div class="p-4">
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Net Weight</p>
                <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-black text-slate-800">${totalNet}</span>
                    <span class="text-slate-400 font-bold text-sm">Qtl</span>
                </div>
            </div>
        </div>

        <div class="px-4 mb-6">
            <div class="bg-slate-800 rounded-2xl p-4 text-white">
                <p class="text-[10px] text-slate-400 font-bold uppercase mb-2">Dropbox Token</p>
                <input id="input-token" type="password" value="${token}" placeholder="Paste Token Here" class="w-full bg-slate-700 rounded-xl px-4 py-2 text-xs mb-2">
                <button id="btn-save-token" class="w-full bg-emerald-500 py-2 rounded-xl text-xs font-bold">SAVE TOKEN</button>
            </div>
        </div>

        <div class="px-4">
            <div class="space-y-3">
                ${records.map(r => `
                    <div class="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                        <div>
                            <p class="font-bold text-slate-800">${r.truckNumber}</p>
                            <p class="text-[10px] text-slate-400">${r.timestamp}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-emerald-600 font-black text-lg">${r.netWeight.toFixed(2)}</p>
                            <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Net Qtl</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <button id="btn-add" class="fixed bottom-6 right-6 bg-emerald-600 w-16 h-16 rounded-2xl shadow-2xl text-white text-3xl font-bold active:scale-95 transition-transform">+</button>
    </div>
    `;

    document.getElementById('btn-save-token').onclick = () => {
        const val = document.getElementById('input-token').value;
        localStorage.setItem('dropbox_token', val);
        alert("Token Saved!");
        render();
    };

    document.getElementById('btn-sync').onclick = async () => {
        const btn = document.getElementById('btn-sync');
        btn.innerText = "SYNCING...";
        const remote = await downloadAll();
        if (remote.length > 0) {
            localStorage.setItem('mandi_vault', JSON.stringify(remote));
            render();
        }
        btn.innerText = "SYNC CLOUD";
    };

    document.getElementById('btn-add').onclick = () => {
        const truck = prompt("Truck Number:");
        if (!truck) return;
        const bags = prompt("Bags:");
        const wt = prompt("Wt per Bag:", "50.60");
        const ded = prompt("Deductions (kg):", "0");
        saveNewEntry(truck, bags, wt, ded);
        render();
    };
}
render();
