// --- ITEM DATA ---
const itemData = [
    { name: "Prime 設計図/パーツ", status: "yes", icon: "🛡️", info: "セット売りが基本。完成品は渡せません。", tip: "設計図のままトレードしてください。" },
    { name: "MOD / Riven", status: "yes", icon: "🃏", info: "最大強化済みは需要が高いです。", tip: "RivenはMR制限に注意。" },
    { name: "プラチナ", status: "yes", icon: "💎", info: "基本通貨。枠やスキン購入に使えます。", tip: "初期50ptはトレード不可。" },
    { name: "レリック", status: "yes", icon: "🌰", info: "中身のレア度によって価値が変動します。", tip: "精錬済みでも渡せます。" },
    { name: "Ayatan 像", status: "yes", icon: "🏆", info: "Endoへの換金用。フル充填が推奨。", tip: "星も個別にトレード可能です。" },
    { name: "作成済フレーム", status: "no", icon: "🤖", info: "自分専用アイテムです。", tip: "作成前（設計図）なら可能です。" },
    { name: "通常フレームパーツ", status: "no", icon: "⚙️", info: "ボスドロップ品などは渡せません。", tip: "Prime版のみ可能です。" },
    { name: "一般素材", status: "no", icon: "🧱", info: "合金や胞子などはトレード不可。", tip: "自分で収集しましょう。" },
    { name: "クレジット", status: "no", icon: "🏧", info: "譲渡はできません。", tip: "手数料として消費されるのみ。" },
    { name: "初期装備", status: "no", icon: "⚔️", info: "店売り武器などは対象外。", tip: "Prime品が対象です。" }
];

// --- ITEM RENDER ---
function renderItems(status) {
    const grid = document.getElementById('item-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const filtered = itemData.filter(i => status === 'all' || i.status === status);

    filtered.forEach(item => {
        const isYes = item.status === 'yes';
        const card = document.createElement('div');
        card.className = "item-card relative group animate-fade cursor-help";
        
        card.innerHTML = `
            <div class="p-5 md:p-8 rounded-2xl border-2 transition-all h-full flex flex-col items-center justify-center ${isYes ? 'bg-slate-900 border-slate-800 hover:border-cyan-500' : 'bg-black/20 border-slate-900 opacity-40'}">
                <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">${item.icon}</div>
                <div class="text-[10px] md:text-xs font-bold text-white text-center leading-tight">${item.name}</div>
            </div>
            
            <div class="item-tooltip">
                <div class="text-[9px] text-cyan-400 font-bold uppercase mb-1">Trade Manual</div>
                <p class="text-[10px] text-white leading-relaxed mb-3">${item.info}</p>
                <div class="pt-2 border-t border-slate-700">
                    <p class="text-[8px] text-amber-500 font-bold uppercase mb-1">注意点</p>
                    <p class="text-[9px] text-slate-400 italic">${item.tip}</p>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterItems(status) {
    renderItems(status);
}

// --- CALC ---
function calcTax() {
    const select = document.getElementById('tax-select');
    const platBox = document.getElementById('plat-box');
    const total = document.getElementById('tax-total');
    if (!select || !total) return;

    let tax = parseInt(select.value);
    const isPlat = select.options[select.selectedIndex].text.includes('プラチナ');

    if(isPlat) {
        platBox.classList.remove('hidden');
        const qty = parseInt(document.getElementById('tax-qty').value) || 0;
        tax = tax * qty;
    } else {
        platBox.classList.add('hidden');
    }
    total.innerText = tax.toLocaleString();
}

// --- CHART ---
let myChart = null;
function initChart() {
    const canvas = document.getElementById('taxChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if(myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['コモンMOD', 'レアMOD', 'Prime部品', 'プラチナ(100)', 'Primed MOD'],
            datasets: [{
                data: [2000, 8000, 2000, 50000, 1000000],
                backgroundColor: ['#1e293b', '#334155', '#475569', '#06b6d4', '#eab308'],
                borderRadius: 8,
                barThickness: window.innerWidth < 768 ? 20 : 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#020617',
                    padding: 12,
                    titleFont: { family: 'Orbitron', size: 12 },
                    bodyFont: { family: 'Noto Sans JP', size: 10 },
                    callbacks: { label: (c) => `税金: ${c.parsed.y.toLocaleString()} Credits` }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#64748b',
                        callback: (v) => v >= 1000000 ? (v/1000000 + 'M') : (v/1000 + 'k')
                    }
                },
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 9 } } }
            }
        }
    });
}

// --- PAGE INIT ---
window.onload = () => {
    if (document.getElementById('item-grid')) renderItems('all');
    if (document.getElementById('tax-select')) calcTax();
    if (document.getElementById('taxChart')) initChart();
};